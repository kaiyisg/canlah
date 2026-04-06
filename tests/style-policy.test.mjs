import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const prompts = JSON.parse(fs.readFileSync(path.join(repoRoot, "benchmarks", "prompts.json"), "utf8"));
const lexicon = fs.readFileSync(path.join(repoRoot, "grounding", "lexicon.yml"), "utf8");
const styleGuide = fs.readFileSync(path.join(repoRoot, "grounding", "style-guide.md"), "utf8");

function countParticles(text) {
  const matches = text.match(/\b(lah|leh|lor|sia|hor|anot)\b/gi);
  return matches ? matches.length : 0;
}

test("lite examples stay restrained", () => {
  for (const prompt of prompts) {
    assert.ok(countParticles(prompt.lite) <= 1, `${prompt.id}: lite is too particle-heavy`);
  }
});

test("full and ultra examples stay understandable", () => {
  for (const prompt of prompts) {
    assert.ok(prompt.full.length > 0, `${prompt.id}: missing full example`);
    assert.ok(prompt.ultra.length > 0, `${prompt.id}: missing ultra example`);
    assert.ok(prompt.ultra.length <= prompt.full.length, `${prompt.id}: ultra should be shortest`);
  }
});

test("style guide documents source hierarchy and prohibitions", () => {
  assert.match(styleGuide, /Primary grounding/i);
  assert.match(styleGuide, /Do not ship third-party corpus text/i);
  assert.match(styleGuide, /academic and descriptive/i);
});

test("lexicon entries carry notes and source links", () => {
  const entries = lexicon.split(/\n(?=- term: )/).filter(Boolean);
  assert.ok(entries.length >= 10, "expected at least 10 lexicon entries");

  for (const entry of entries) {
    assert.match(entry, /gloss:/);
    assert.match(entry, /register:/);
    assert.match(entry, /allowed_levels:/);
    assert.match(entry, /notes:/);
    assert.match(entry, /source_links:/);
  }
});

test("guardrail examples avoid colloquial particles in risky contexts", () => {
  const riskyExamples = [
    "Warning: This will permanently delete all rows in the users table and cannot be undone.",
    "Please review the legal wording with counsel before sending this externally.",
    "Do not rotate the production secret until you have confirmed the rollback path."
  ];

  for (const example of riskyExamples) {
    assert.equal(countParticles(example), 0);
  }
});
