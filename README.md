# canlah

**Serious token-saving Singapore mode for coding agents. Less fluff, fewer tokens. Funny only when it lands naturally.**

`canlah` is a compressed Singaporean communication mode for AI assistants. It cuts filler hard, keeps technical substance exact, and answers in a dry local rhythm that feels familiar to Singaporean devs and still sounds Singaporean.

This is no longer a multi-level style pack. `canlah` is **one mode**:

- compressed first
- Singaporean first
- serious first
- occasionally funny, never clowny

## What It Is

- A **Codex plugin** and **Claude skill/plugin**
- A **single compressed Singapore mode**
- A **grounded style pack**, not a bundled corpus

## What It Is Not

- not tourist-board Singlish
- not a meme generator
- not a translation dataset
- not generic global-English brevity mode

## Voice

`canlah` should sound like:

- a Singaporean engineer talking fast because the point is obvious
- dry, sharp, and compressed
- locally natural enough that Singaporeans recognise the rhythm
- readable enough for technical work

`canlah` should not sound like:

- parody skit dialogue
- particle spam
- fake accent spelling
- clown mode

## Before / After

### Technical explanation

Normal:

> Your component is re-rendering because you create a new object on every render. React sees a fresh reference each time, so the prop comparison fails. Move that object into `useMemo`.

`canlah`:

> Inline object each render = fresh ref. React sees prop changed, so memo break and child re-render. Hoist it or use `useMemo` can already.

### Bug diagnosis

Normal:

> The authentication middleware is likely failing because the expiry check only rejects tokens after the deadline instead of at the deadline. That means boundary values slip through. Tighten the comparison and add a regression test.

`canlah`:

> Expiry check reject too late, so boundary token still pass. Tighten compare and add one regression test. This one classic.

## Triggers

- `/canlah`
- `$canlah`
- "Singapore mode"
- "Singlish mode"
- "talk like a Singaporean"
- "canlah mode"

Stop with:

- "stop canlah"
- "normal mode"

## Guardrails

- Code blocks stay normal
- Exact error messages stay exact
- Commits and PR descriptions stay normal
- Destructive warnings, security-sensitive steps, and high-stakes instructions revert to clear standard English for the whole response
- Warning-first prompts should not switch back into local tone later in the same response
- Humor should be dry and occasional, not constant

## When Not To Use `canlah`

- formal emails or polished external writing
- legal, medical, financial, or irreversible instructions
- situations where the user explicitly wants standard or global English
- cases where local phrasing adds ambiguity instead of speed

## Install

### Codex

One-line global skill install:

```bash
npx -y skills add kaiyisg/canlah -g -a codex -s canlah -y --copy
```

That makes the `canlah` skill available to Codex globally.

If you also want `canlah` to be the default voice in every new Codex session, clone the repo once and run:

```bash
git clone https://github.com/kaiyisg/canlah.git
cd canlah
./scripts/install-codex-global.sh
```

That installer:

- installs the skill globally for Codex
- inserts a managed `canlah` default-voice block into `~/.codex/AGENTS.md`
- creates a timestamped backup of `~/.codex/AGENTS.md` first

Why this extra step exists: Codex will not automatically switch styles just because a skill is installed. The skill makes `canlah` available, while the managed `~/.codex/AGENTS.md` block makes it the default voice for new sessions.

Restart Codex or open a new session after running it.

Manual / alternate path:

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo kaiyisg/canlah \
  --path skills/canlah
```

Or clone the repo and install the local plugin from `plugins/canlah`.

### Claude

From GitHub:

```bash
claude plugins marketplace add kaiyisg/canlah
claude plugins install canlah@canlah -s user
```

Local development uses the metadata under `.claude-plugin/`.

## Benchmarks

This repo ships a benchmark harness in [`benchmarks/prompts.json`](./benchmarks/prompts.json) and [`benchmarks/run.mjs`](./benchmarks/run.mjs).

It uses a real tokenizer via `gpt-tokenizer` to count output tokens for the curated sample outputs in the benchmark set.

Run:

```bash
npm run benchmark
```

The harness compares:

- baseline output tokens
- `canlah` output tokens
- percent saved

`npm run verify` also enforces that every shipped `canlah` benchmark output is shorter than baseline and that the fixture set keeps at least 40% average token savings.

## Grounding Policy

Primary grounding should come from **academic and descriptive Singlish sources**, not synthetic corpora or scraped slang dumps. This repo follows a strict source hierarchy:

1. descriptive / academic sources for style rules
2. dictionary-style sources only for lexicon discovery
3. synthetic or student-project datasets only for eval and sanity checks

The repo deliberately does **not** vendor third-party corpus text with unclear or non-commercial licensing.

See:

- [`grounding/style-guide.md`](./grounding/style-guide.md)
- [`grounding/lexicon.yml`](./grounding/lexicon.yml)

## Verify

```bash
npm install
npm run verify
```

That runs:

- manifest and content tests
- guardrail tests
- benchmark consistency checks

## Uninstall

If you used the global Codex installer:

```bash
./scripts/uninstall-codex-global.sh
```
