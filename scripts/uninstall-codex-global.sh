#!/bin/zsh
set -euo pipefail

CODEX_HOME=${CODEX_HOME:-$HOME/.codex}
AGENTS_FILE="$CODEX_HOME/AGENTS.md"
START_MARKER="<!-- canlah-default:start -->"
END_MARKER="<!-- canlah-default:end -->"

if [[ -f "$AGENTS_FILE" ]]; then
  python3 - "$AGENTS_FILE" "$START_MARKER" "$END_MARKER" <<'PY'
from pathlib import Path
import re
import sys

agents_path = Path(sys.argv[1]).expanduser()
start = sys.argv[2]
end = sys.argv[3]

content = agents_path.read_text()
pattern = re.compile(r"\n*" + re.escape(start) + r".*?" + re.escape(end) + r"\n*", re.S)
updated = pattern.sub("\n\n", content).strip() + "\n"
agents_path.write_text(updated)
PY
fi

if [[ -d "$HOME/.agents/skills/canlah" ]]; then
  rm -rf "$HOME/.agents/skills/canlah"
fi

echo "Removed canlah default voice block and global Codex skill copy."
