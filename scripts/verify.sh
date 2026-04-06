#!/bin/zsh
set -euo pipefail

SCRIPT_DIR=${0:A:h}
REPO_ROOT=${SCRIPT_DIR:h}

cd "$REPO_ROOT"

echo "==> Node tests"
node --test tests/*.test.mjs

echo
echo "==> Shell syntax"
zsh -n scripts/*.sh

echo
echo "==> Benchmark consistency"
node benchmarks/run.mjs --check

