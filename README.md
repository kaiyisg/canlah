# canlah

**Feels like talking to an AI that actually sounds Singaporean. Less fluff, fewer tokens.**

`canlah` is a Singapore-lite communication mode for AI assistants. It trims filler and hedging first, then adds restrained Singaporean phrasing so replies feel local and relatable without turning into parody.

Day one, it is aimed at **Singaporean devs** using Codex or Claude. The value prop is simple:

- more relatable than generic assistant English
- shorter, cleaner answers
- measurable output savings from saying the same thing with fewer words

## What It Is

- A **Codex plugin** and **Claude skill/plugin**
- A **communication mode**, not a translation model
- A **grounded style pack**, not a bundled corpus

## What It Is Not

- not "tourist Singlish"
- not a meme generator
- not a broad Singapore knowledge assistant
- not a dataset redistribution project

## Modes

| Mode | Default? | Intent |
|------|----------|--------|
| `lite` | yes | Singapore-lite. Clear, concise, locally relatable, professional enough for daily use |
| `full` | no | More colloquial Singlish. Still controlled and readable |
| `ultra` | no | Maximum compression and more obvious local flavour. Opt-in only |

## Before / After

### Technical explanation

Normal:

> Your component is re-rendering because you create a new object on every render. React sees a fresh reference each time, so the prop comparison fails. Move that object into `useMemo`.

`canlah lite`:

> This one re-renders because you create a fresh object every render. React sees a new reference each pass. Move it into `useMemo` and it should settle down.

`canlah full`:

> This one keeps re-rendering because inline object means new ref every time. Put it in `useMemo` can already.

### Everyday prompt

Normal:

> The queue at the hawker centre is very long, but the food is good enough that it is probably worth waiting.

`canlah lite`:

> Queue quite long, but the food is solid. If you're not rushing, worth waiting.

`canlah full`:

> Queue long lah, but the food really not bad. If not rushing, wait a bit also worth it.

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
- `lite` should never read like caricature or forced slang

## When Not To Use `canlah`

- formal emails or polished external writing
- legal, medical, financial, or irreversible instructions
- situations where the user explicitly wants standard or global English
- cases where local phrasing would add ambiguity instead of clarity

## Install

### Codex

From GitHub:

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

This repo ships a lightweight benchmark harness in [`benchmarks/prompts.json`](./benchmarks/prompts.json) and [`benchmarks/run.mjs`](./benchmarks/run.mjs).

It does **not** call a model API by default. Instead, it compares paired sample outputs and reports a rough output-token proxy so you can sanity-check the savings trend locally:

- baseline vs `lite`
- `lite` vs `full`
- `full` vs `ultra`

Run:

```bash
npm run benchmark
```

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
npm run verify
```

That runs:

- manifest and content tests
- guardrail tests
- benchmark consistency checks
