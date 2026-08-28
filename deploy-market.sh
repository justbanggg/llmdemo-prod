#!/bin/bash
#
# Rolling redeploy for a per-market LLM demo fleet.
#
# Each market is an independent stack: its own VMs, instance group, backend
# service, managed cert, IP, and subdomain. Nothing is shared between markets,
# so deploying one cannot affect another.
#
# Markets are defined in load_market() below. Normally you invoke this through
# the per-market wrappers rather than directly:
#
#   ./deploy-vn.sh              # Vietnam  -> vn.dd-demo-sg-llm.com
#   ./deploy-sg.sh              # Singapore -> sg.dd-demo-sg-llm.com
#
# Or directly:
#   MARKET=sg ./deploy-market.sh
#
# Options (all wrappers accept these too):
#   ./deploy-sg.sh --status         # health report, deploy nothing
#   ./deploy-sg.sh llm-sg-vm2       # deploy a single VM
#   BRANCH=some/branch ./deploy-sg.sh   # deploy a different branch
#   NO_BUILD=1 ./deploy-sg.sh       # restart without rebuilding the image
#
# Deploys one VM at a time and waits for each to serve 200 before moving on, so
# the load balancer always keeps a healthy backend and the site stays up. If a
# VM fails, the rollout aborts rather than taking the rest of the fleet down
# with a bad build.

set -uo pipefail

# ------------------------------------------------------------- market registry
load_market() {
  case "${MARKET:-}" in
    vn)
      MARKET_NAME="Vietnam"
      DOMAIN="vn.dd-demo-sg-llm.com"
      ALL_VMS=(llm-vn-vm1 llm-vn-vm2)
      BACKEND_SERVICE="llm-vn-backend"
      OVERRIDE_FILE="docker-compose.vn.yml"
      APP_CONTAINER="llm-vn-app"
      DEFAULT_BRANCH="main"
      VM_PREFIX="llm-vn-"
      ;;
    sg)
      MARKET_NAME="Singapore"
      DOMAIN="sg.dd-demo-sg-llm.com"
      ALL_VMS=(llm-sg-vm1 llm-sg-vm2)
      BACKEND_SERVICE="llm-sg-backend"
      OVERRIDE_FILE="docker-compose.sg.yml"
      APP_CONTAINER="llm-sg-app"
      DEFAULT_BRANCH="market/singapore"
      VM_PREFIX="llm-sg-"
      ;;
    "")
      echo "MARKET is not set. Use ./deploy-vn.sh or ./deploy-sg.sh, or set MARKET=vn|sg." >&2
      exit 1
      ;;
    *)
      echo "Unknown MARKET '${MARKET}'. Known markets: vn, sg." >&2
      exit 1
      ;;
  esac
}

# ---------------------------------------------------------------- configuration
PROJECT="${PROJECT:-mcse-sandbox}"
ZONE="${ZONE:-us-central1-a}"
PROJECT_DIR="llmdemo-prod"
REPO_URL="https://github.com/justbanggg/llmdemo-prod.git"
HEALTH_PATH="/game"          # /menu 302-redirects here; LB probes /game
APP_PORT=5000
HEALTH_RETRIES="${HEALTH_RETRIES:-30}"   # x 10s = up to 5 min per VM
HEALTH_SLEEP=10

load_market
BRANCH="${BRANCH:-$DEFAULT_BRANCH}"
COMPOSE_FILES="-f docker-compose-backend.yml -f $OVERRIDE_FILE"

# ---------------------------------------------------------------------- helpers
RED=$'\033[0;31m'; GRN=$'\033[0;32m'; YLW=$'\033[0;33m'; BLU=$'\033[0;34m'; RST=$'\033[0m'
info()  { echo "${BLU}==>${RST} $*"; }
ok()    { echo "${GRN}  ok${RST} $*"; }
warn()  { echo "${YLW}  !!${RST} $*"; }
fail()  { echo "${RED} ERR${RST} $*" >&2; }
die()   { fail "$*"; exit 1; }

# Strip the boilerplate gcloud prints on every invocation in this environment.
gc() {
  # NOTE: a pipeline returns the LAST command's status, and `grep -v` exits 1
  # when it filters everything out. A silent-but-successful gcloud call would
  # otherwise look like a failure, so propagate gcloud's own status via
  # PIPESTATUS instead of the grep's.
  local st
  gcloud "$@" 2>&1 | grep -v -iE \
    '^WARNING:|reinstall gcloud|components reinstall|Python 3\.9|CLOUDSDK_PYTHON|compatible version of Python|compatible Python interpreter|prompt to install|will also prompt|global DNS|zonal-dns|increase the performance of the tunnel|please see https://cloud.google.com/iap|^ *\$ gcloud|^$'
  st=${PIPESTATUS[0]}
  return "$st"
}

# Run a command on a VM over the IAP tunnel. SSH from arbitrary IPs is blocked
# by firewall, so IAP (35.235.240.0/20) is the only reliable path in.
on_vm() {
  local vm="$1"; shift
  gc compute ssh "$vm" --zone="$ZONE" --project="$PROJECT" \
     --tunnel-through-iap --quiet --command="$*"
}

# Refuse to act on anything outside this market's fleet. This is what keeps a
# Singapore deploy from ever touching Vietnam, prod, or the other fleets in
# this shared project.
assert_market_vm() {
  local vm="$1"
  [[ "$vm" == ${VM_PREFIX}* ]] \
    || die "refusing to touch '$vm' — MARKET=$MARKET only manages ${VM_PREFIX}* VMs"
  local known=0 v
  for v in "${ALL_VMS[@]}"; do [[ "$v" == "$vm" ]] && known=1; done
  [[ "$known" == 1 ]] || die "'$vm' is not in this market's ALL_VMS — add it to the script first"
}

# -------------------------------------------------------------------- preflight
preflight() {
  command -v gcloud >/dev/null || die "gcloud not found in PATH"

  local acct
  acct=$(gc config get-value account | tr -d '[:space:]')
  [[ -n "$acct" && "$acct" != "None" ]] || die "no active gcloud account — run: gcloud auth login"

  # A stale token fails deep inside the deploy; catch it up front.
  gcloud auth print-access-token >/dev/null 2>&1 \
    || die "gcloud credentials expired — run: gcloud auth login $acct"

  info "$MARKET_NAME ($MARKET) / $DOMAIN"
  info "account $acct / project $PROJECT / zone $ZONE / branch $BRANCH"
}

# ----------------------------------------------------------------- health checks
vm_healthy() {
  local vm="$1" code
  code=$(on_vm "$vm" "curl -s -o /dev/null -w '%{http_code}' --max-time 5 http://localhost:${APP_PORT}${HEALTH_PATH} 2>/dev/null" \
         | tr -dc '0-9' | tail -c 3)
  [[ "$code" == "200" ]]
}

wait_for_health() {
  local vm="$1" i
  for ((i = 1; i <= HEALTH_RETRIES; i++)); do
    if vm_healthy "$vm"; then
      ok "$vm serving 200 on ${HEALTH_PATH}"
      return 0
    fi
    printf '     waiting for %s to come up (%d/%d)\r' "$vm" "$i" "$HEALTH_RETRIES"
    sleep "$HEALTH_SLEEP"
  done
  echo
  return 1
}

lb_status() {
  info "load balancer backend health"
  gc compute backend-services get-health "$BACKEND_SERVICE" \
     --global --project="$PROJECT" \
     --format="value(status.healthStatus[].instance.basename(), status.healthStatus[].healthState)" \
    | sed 's/^/     /'
}

status_report() {
  local vm
  for vm in "${ALL_VMS[@]}"; do
    echo
    info "$vm"
    on_vm "$vm" "
      echo '  commit: '\$(git -C \$HOME/$PROJECT_DIR log --oneline -1 2>/dev/null)
      echo '  branch: '\$(git -C \$HOME/$PROJECT_DIR rev-parse --abbrev-ref HEAD 2>/dev/null)
      docker ps --format '  {{.Names}} | {{.Status}}'
    " | sed 's/^/   /'
    if vm_healthy "$vm"; then ok "local ${HEALTH_PATH} → 200"; else warn "local ${HEALTH_PATH} not 200"; fi
  done
  echo
  lb_status
  echo
  info "public endpoint"
  local code
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "https://${DOMAIN}${HEALTH_PATH}" 2>/dev/null)
  if [[ "$code" == "200" ]]; then ok "https://${DOMAIN}${HEALTH_PATH} → 200"
  else warn "https://${DOMAIN}${HEALTH_PATH} → ${code:-no response} (managed cert can take ~15-60 min on first provision)"; fi
}

# ----------------------------------------------------------------------- deploy
deploy_vm() {
  local vm="$1"
  echo
  info "deploying $vm (branch $BRANCH)"

  # Clone on first use so a freshly added VM needs no manual prep.
  on_vm "$vm" "
    set -e
    if [ ! -d \"\$HOME/$PROJECT_DIR/.git\" ]; then
      git clone --branch '$BRANCH' '$REPO_URL' \"\$HOME/$PROJECT_DIR\"
    fi
  " >/dev/null || { fail "$vm: clone check failed"; return 1; }

  # .env holds the API keys and is intentionally not in git. Never overwrite it,
  # but refuse to deploy without it — the app would boot and fail every request.
  if ! on_vm "$vm" "test -s \"\$HOME/$PROJECT_DIR/.env\" && echo present" | grep -q present; then
    fail "$vm: ~/$PROJECT_DIR/.env missing or empty — copy it from a working VM before deploying"
    return 1
  fi

  local build_cmd="docker compose $COMPOSE_FILES build --pull"
  [[ -n "${NO_BUILD:-}" ]] && build_cmd="echo '  (NO_BUILD set, skipping build)'"

  on_vm "$vm" "
    set -e
    export PATH=\"\$PATH:/var/lib/google\"

    # /home is mounted noexec on COS, so the compose plugin lives in
    # /var/lib/google (exec-mounted) and is symlinked into the CLI plugin dir.
    if [ ! -x /var/lib/google/docker-compose ]; then
      sudo curl -fsSL https://github.com/docker/compose/releases/download/v2.32.4/docker-compose-linux-x86_64 \
        -o /var/lib/google/docker-compose
      sudo chmod 0755 /var/lib/google/docker-compose
    fi
    mkdir -p \"\$HOME/.docker/cli-plugins\"
    ln -sf /var/lib/google/docker-compose \"\$HOME/.docker/cli-plugins/docker-compose\"

    cd \"\$HOME/$PROJECT_DIR\"

    echo '  fetching $BRANCH'
    git fetch --quiet origin '$BRANCH'
    git checkout --quiet -B '$BRANCH' \"origin/$BRANCH\"
    git reset --hard --quiet \"origin/$BRANCH\"
    echo '  now at: '\$(git log --oneline -1)

    echo '  stopping containers'
    docker compose $COMPOSE_FILES down --remove-orphans || true

    echo '  building image'
    $build_cmd

    echo '  starting containers'
    docker compose $COMPOSE_FILES up -d

    # Reclaim space from superseded image layers. Deliberately NOT
    # 'system prune -a', which would also nuke images still in use.
    docker image prune -f >/dev/null 2>&1 || true

    docker ps --format '  {{.Names}} | {{.Status}}'
  " || { fail "$vm: deploy command failed"; return 1; }

  wait_for_health "$vm" || { fail "$vm: did not become healthy — check: docker logs $APP_CONTAINER"; return 1; }
  return 0
}

# ------------------------------------------------------------------------- main
main() {
  if [[ "${1:-}" == "--status" || "${1:-}" == "-s" ]]; then
    preflight; status_report; exit 0
  fi

  local targets=()
  if [[ $# -gt 0 ]]; then
    for vm in "$@"; do assert_market_vm "$vm"; targets+=("$vm"); done
  else
    targets=("${ALL_VMS[@]}")
  fi

  preflight
  info "rolling deploy over: ${targets[*]}"

  local failed=()
  for vm in "${targets[@]}"; do
    if ! deploy_vm "$vm"; then
      failed+=("$vm")
      fail "aborting rollout — ${#failed[@]} VM(s) failed, remaining VMs left untouched and serving"
      break
    fi
  done

  echo
  if [[ ${#failed[@]} -eq 0 ]]; then
    ok "deployed ${#targets[@]} VM(s) to $MARKET_NAME successfully"
    lb_status
    echo
    info "https://${DOMAIN}${HEALTH_PATH}"
    exit 0
  else
    fail "failed: ${failed[*]}"
    exit 1
  fi
}

main "$@"
