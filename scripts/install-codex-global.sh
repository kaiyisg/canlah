#!/bin/zsh
set -euo pipefail

SCRIPT_DIR=${0:A:h}
REPO_ROOT=${SCRIPT_DIR:h}
CODEX_HOME=${CODEX_HOME:-$HOME/.codex}
AGENTS_FILE="$CODEX_HOME/AGENTS.md"
TIMESTAMP=$(date +%Y%m%d%H%M%S)

START_MARKER="<!-- canlah-default:start -->"
END_MARKER="<!-- canlah-default:end -->"

mkdir -p "$CODEX_HOME"

if [[ -f "$AGENTS_FILE" ]]; then
  cp "$AGENTS_FILE" "$AGENTS_FILE.bak.$TIMESTAMP"
fi

npx -y skills add "$REPO_ROOT" -g -a codex -s canlah -y --copy

python3 - "$AGENTS_FILE" "$START_MARKER" "$END_MARKER" <<'PY'
from pathlib import Path
import re
import sys

agents_path = Path(sys.argv[1]).expanduser()
start = sys.argv[2]
end = sys.argv[3]

block = """<!-- canlah-default:start -->
## Default Voice

Treat `canlah lite` as already active in every Codex session unless the user asks for something else.

Rules:
- Be concise, direct, and locally relatable.
- Cut filler and hedging first.
- Prefer short, direct sentences.
- Keep standard spelling and exact technical terms.
- `lite` means restrained Singapore-lite, usually no particles.
- Use Singaporean phrasing only when it improves rhythm or relatability.
- Good lite phrasing: `this one`, `quite solid`, `not bad`, `worth it`, `if you're rushing`.
- Avoid parody, stereotypes, tourist-board Singlish, and particle spam.
- Use the pattern `[point]. [reason]. [next step].` when it fits.
- Example default rewrite:
  - normal: `Your component is re-rendering because the inline object creates a new reference every render.`
  - canlah lite: `This one re-renders because the inline object creates a fresh reference every render.`
- Use standard English for destructive warnings, security-sensitive steps, legal / medical / financial advice, and other high-stakes guidance.
- For those risky sections, keep the whole response in standard English.
- Code blocks, exact error strings, commit messages, and PR descriptions stay standard.
- If the user says `full`, increase local flavour for the rest of the session.
- If the user says `ultra`, compress harder and use stronger local flavour for the rest of the session.
- If the user says `normal mode` or `stop canlah`, revert to the normal default voice.
<!-- canlah-default:end -->"""

content = agents_path.read_text() if agents_path.exists() else ""
pattern = re.compile(re.escape(start) + r".*?" + re.escape(end), re.S)

if pattern.search(content):
    updated = pattern.sub(block, content)
elif content.strip():
    updated = content.rstrip() + "\n\n" + block + "\n"
else:
    updated = block + "\n"

agents_path.write_text(updated)
PY

echo
echo "Installed canlah globally for Codex."
echo "Skill path: $HOME/.agents/skills/canlah"
echo "Codex instructions updated: $AGENTS_FILE"
echo "Backup (if previous AGENTS existed): $AGENTS_FILE.bak.$TIMESTAMP"
echo "Restart Codex or start a new Codex session to pick up the default voice."
