import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");

function read(filePath) {
  return fs.readFileSync(path.join(repoRoot, filePath), "utf8");
}

function readJson(filePath) {
  return JSON.parse(read(filePath));
}

test("required packaging files exist", () => {
  const required = [
    ".agents/plugins/marketplace.json",
    ".claude-plugin/marketplace.json",
    ".claude-plugin/plugin.json",
    "plugins/canlah/.codex-plugin/plugin.json",
    "plugins/canlah/skills/canlah/SKILL.md",
    "skills/canlah/SKILL.md",
    "canlah/SKILL.md",
    "grounding/style-guide.md",
    "grounding/lexicon.yml",
    "README.md",
    "package.json",
    "scripts/verify.sh"
  ];

  for (const file of required) {
    assert.equal(fs.existsSync(path.join(repoRoot, file)), true, file);
  }
});

test("codex plugin manifest exposes local skills", () => {
  const manifest = readJson("plugins/canlah/.codex-plugin/plugin.json");
  assert.equal(manifest.name, "canlah");
  assert.equal(manifest.skills, "./skills/");
  assert.equal(manifest.license, "MIT");
  assert.match(manifest.interface.defaultPrompt[0], /canlah lite/i);
});

test("claude marketplace and plugin metadata are aligned", () => {
  const marketplace = readJson(".claude-plugin/marketplace.json");
  const plugin = readJson(".claude-plugin/plugin.json");

  assert.equal(marketplace.name, "canlah");
  assert.equal(plugin.name, "canlah");
  assert.equal(marketplace.plugins[0].name, "canlah");
});

test("skill files mention the three levels and safety fallback", () => {
  for (const file of [
    "canlah/SKILL.md",
    "skills/canlah/SKILL.md",
    "plugins/canlah/skills/canlah/SKILL.md"
  ]) {
    const content = read(file);
    assert.match(content, /lite/i);
    assert.match(content, /full/i);
    assert.match(content, /ultra/i);
    assert.match(content, /standard English/i);
  }
});

test("readme leads with relatable singaporean value prop", () => {
  const content = read("README.md");
  assert.match(content, /sounds Singaporean/i);
  assert.match(content, /Less fluff, fewer tokens/i);
  assert.match(content, /When Not To Use/i);
  assert.match(content, /Grounding Policy/i);
});

