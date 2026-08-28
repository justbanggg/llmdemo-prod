#!/bin/bash
# Singapore market -> https://sg.dd-demo-sg-llm.com/
# Thin wrapper; all logic lives in deploy-market.sh. See that file for options.
exec env MARKET=sg "$(dirname "$0")/deploy-market.sh" "$@"
