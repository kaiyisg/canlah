import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const benchmarkPath = path.join(import.meta.dirname, "prompts.json");
const prompts = JSON.parse(fs.readFileSync(benchmarkPath, "utf8"));

function tokenProxy(text) {
  return Math.ceil(text.length / 4);
}

function summarize(level) {
  let total = 0;
  for (const prompt of prompts) {
    total += tokenProxy(prompt[level]);
  }
  return total / prompts.length;
}

function printTable() {
  const rows = prompts.map((prompt) => {
    const baseline = tokenProxy(prompt.baseline);
    const lite = tokenProxy(prompt.lite);
    const full = tokenProxy(prompt.full);
    const ultra = tokenProxy(prompt.ultra);
    return {
      id: prompt.id,
      baseline,
      lite,
      full,
      ultra,
      liteSaved: Math.round(((baseline - lite) / baseline) * 100),
      fullSaved: Math.round(((baseline - full) / baseline) * 100),
      ultraSaved: Math.round(((baseline - ultra) / baseline) * 100)
    };
  });

  console.log("id | baseline | lite | full | ultra | lite saved | full saved | ultra saved");
  console.log("---|---:|---:|---:|---:|---:|---:|---:");
  for (const row of rows) {
    console.log(
      `${row.id} | ${row.baseline} | ${row.lite} | ${row.full} | ${row.ultra} | ${row.liteSaved}% | ${row.fullSaved}% | ${row.ultraSaved}%`
    );
  }

  console.log("");
  console.log(`Average baseline proxy: ${summarize("baseline").toFixed(1)}`);
  console.log(`Average lite proxy: ${summarize("lite").toFixed(1)}`);
  console.log(`Average full proxy: ${summarize("full").toFixed(1)}`);
  console.log(`Average ultra proxy: ${summarize("ultra").toFixed(1)}`);
  console.log("");
  console.log("Note: proxy is a rough chars/4 estimate for output tokens, not provider-measured API token counts.");
}

function check() {
  for (const prompt of prompts) {
    const baseline = tokenProxy(prompt.baseline);
    const lite = tokenProxy(prompt.lite);
    const full = tokenProxy(prompt.full);
    const ultra = tokenProxy(prompt.ultra);

    if (!(lite < baseline)) {
      throw new Error(`${prompt.id}: lite must be shorter than baseline`);
    }
    if (!(full <= lite)) {
      throw new Error(`${prompt.id}: full must be shorter than or equal to lite`);
    }
    if (!(ultra <= full)) {
      throw new Error(`${prompt.id}: ultra must be shorter than or equal to full`);
    }
  }

  const baselineAvg = summarize("baseline");
  const liteAvg = summarize("lite");
  const fullAvg = summarize("full");
  const ultraAvg = summarize("ultra");

  if (!(liteAvg < baselineAvg && fullAvg <= liteAvg && ultraAvg <= fullAvg)) {
    throw new Error("Average brevity ordering failed");
  }

  printTable();
}

if (process.argv.includes("--check")) {
  check();
} else {
  printTable();
}

