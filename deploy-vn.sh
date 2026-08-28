#!/bin/bash
# Vietnam market -> https://vn.dd-demo-sg-llm.com/
# Thin wrapper; all logic lives in deploy-market.sh. See that file for options.
exec env MARKET=vn "$(dirname "$0")/deploy-market.sh" "$@"
