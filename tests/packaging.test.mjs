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
    "scripts/verify.sh",
    "scripts/install-codex-global.sh",
    "scripts/uninstall-codex-global.sh"
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
  assert.match(manifest.interface.defaultPrompt[0], /Use canlah mode/i);
});

test("claude marketplace and plugin metadata are aligned", () => {
  const marketplace = readJson(".claude-plugin/marketplace.json");
  const plugin = readJson(".claude-plugin/plugin.json");

  assert.equal(marketplace.name, "canlah");
  assert.equal(plugin.name, "canlah");
  assert.equal(marketplace.plugins[0].name, "canlah");
  assert.deepEqual(Object.keys(marketplace).sort(), ["name", "owner", "plugins"]);
});

test("skill files describe one mode and safety fallback", () => {
  for (const file of [
    "canlah/SKILL.md",
    "skills/canlah/SKILL.md",
    "plugins/canlah/skills/canlah/SKILL.md"
  ]) {
    const content = read(file);
    assert.match(content, /One mode only/i);
    assert.match(content, /Compress first/i);
    assert.match(content, /standard English/i);
    assert.match(content, /whole response/i);
    assert.match(content, /no particles/i);
    assert.match(content, /same response/i);
  }
});

test("readme leads with relatable singaporean value prop", () => {
  const content = read("README.md");
  assert.match(content, /sounds Singaporean/i);
  assert.match(content, /Less fluff, fewer tokens/i);
  assert.match(content, /When Not To Use/i);
  assert.match(content, /Grounding Policy/i);
  assert.match(content, /npx -y skills add kaiyisg\/canlah/i);
  assert.match(content, /install-codex-global\.sh/i);
  assert.match(content, /~\/\.codex\/AGENTS\.md/i);
  assert.match(content, /will not automatically switch styles/i);
  assert.match(content, /one mode/i);
  assert.match(content, /gpt-tokenizer/i);
});
