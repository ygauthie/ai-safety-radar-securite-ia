import "dotenv/config";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { translateReport, saveReport } from "./report.js";

async function main() {
  const digestsDir = join(process.cwd(), "digests");
  const dateDirs = readdirSync(digestsDir)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort();

  const toTranslate: Array<{ date: string; filename: string; content: string }> = [];

  for (const date of dateDirs) {
    const dateDir = join(digestsDir, date);
    const files = readdirSync(dateDir).filter((f) => f.endsWith(".md") && !f.endsWith(".fr.md"));
    for (const file of files) {
      const frFile = file.replace(".md", ".fr.md");
      if (!existsSync(join(dateDir, frFile))) {
        const content = readFileSync(join(dateDir, file), "utf-8");
        toTranslate.push({ date, filename: frFile, content });
      }
    }
  }

  if (toTranslate.length === 0) {
    console.log("All digests already have French translations.");
    return;
  }

  console.log(`Translating ${toTranslate.length} files to French...`);

  // Translate in batches of 3 (respect concurrency limit)
  const BATCH = 3;
  for (let i = 0; i < toTranslate.length; i += BATCH) {
    const batch = toTranslate.slice(i, i + BATCH);
    await Promise.all(
      batch.map(async ({ date, filename, content }) => {
        console.log(`  Translating ${date}/${filename}...`);
        const translated = await translateReport(content);
        saveReport(date, filename, translated);
      })
    );
  }

  console.log("Done!");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
