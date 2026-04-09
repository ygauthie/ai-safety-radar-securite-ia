import "dotenv/config";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { today, daysAgo, formatDate } from "./date.js";
import { weeklyRollupPrompt } from "./prompts.js";
import { generateReport, saveReport } from "./report.js";
import { loadConfig } from "./config.js";
import type { Lang } from "./i18n.js";

async function main() {
  const date = today();
  const config = loadConfig();
  const startDate = formatDate(daysAgo(7));
  const dateRange = `${startDate} to ${date}`;

  console.log(`\n=== AI Safety Radar - Weekly Digest (${dateRange}) ===\n`);

  for (const lang of config.languages as Lang[]) {
    const suffix = lang === "en" ? "" : `-${lang}`;
    const dailies: string[] = [];

    // Collect daily digests from the past week
    for (let i = 7; i >= 0; i--) {
      const d = formatDate(daysAgo(i));
      const path = join(process.cwd(), "digests", `${d}-safety-daily${suffix}.md`);
      if (existsSync(path)) {
        dailies.push(readFileSync(path, "utf-8"));
      }
    }

    if (dailies.length === 0) {
      console.log(`No daily digests found for ${lang} - skipping.`);
      continue;
    }

    console.log(`Found ${dailies.length} daily digests for ${lang}, generating weekly summary...`);
    const weekly = await generateReport(
      weeklyRollupPrompt(dailies.join("\n\n---\n\n"), dateRange, lang),
      8192
    );

    saveReport(
      date,
      `safety-weekly${suffix}.md`,
      `# AI Safety Weekly Digest (${dateRange})\n\n${weekly}`
    );
  }

  console.log("Weekly digest complete!");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
