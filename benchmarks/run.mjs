import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { countTokens } from "gpt-tokenizer";

const benchmarkPath = path.join(import.meta.dirname, "prompts.json");
const prompts = JSON.parse(fs.readFileSync(benchmarkPath, "utf8"));

function tokens(text) {
  return countTokens(text);
}

function summarize(level) {
  let total = 0;
  for (const prompt of prompts) {
    total += tokens(prompt[level]);
  }
  return total / prompts.length;
}

function buildRows() {
  return prompts.map((prompt) => {
    const baseline = tokens(prompt.baseline);
    const canlah = tokens(prompt.canlah);
    return {
      id: prompt.id,
      baseline,
      canlah,
      saved: Math.round(((baseline - canlah) / baseline) * 100)
    };
  });
}

function printTable() {
  const rows = buildRows();

  console.log("id | baseline | canlah | saved");
  console.log("---|---:|---:|---:");
  for (const row of rows) {
    console.log(`${row.id} | ${row.baseline} | ${row.canlah} | ${row.saved}%`);
  }

  const baselineAvg = summarize("baseline");
  const canlahAvg = summarize("canlah");
  const avgSaved = Math.round(((baselineAvg - canlahAvg) / baselineAvg) * 100);

  console.log("");
  console.log(`Average baseline tokens: ${baselineAvg.toFixed(1)}`);
  console.log(`Average canlah tokens: ${canlahAvg.toFixed(1)}`);
  console.log(`Average saved: ${avgSaved}%`);
  console.log("");
  console.log("Note: counts use gpt-tokenizer (o200k_base), not chars/4 proxy.");
}

function check() {
  const rows = buildRows();
  for (const row of rows) {
    if (!(row.canlah < row.baseline)) {
      throw new Error(`${row.id}: canlah must be shorter than baseline`);
    }
  }

  const baselineAvg = summarize("baseline");
  const canlahAvg = summarize("canlah");
  const avgSaved = (baselineAvg - canlahAvg) / baselineAvg;

  if (!(canlahAvg < baselineAvg)) {
    throw new Error("Average brevity ordering failed");
  }

  if (avgSaved < 0.4) {
    throw new Error(
      `Average savings too low for canlah's compressed-first bar: ${(avgSaved * 100).toFixed(1)}%`
    );
  }

  printTable();
}

if (process.argv.includes("--check")) {
  check();
} else {
  printTable();
}
