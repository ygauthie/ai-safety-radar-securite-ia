import "dotenv/config";
import { today } from "./date.js";
import { fetchArxiv } from "./arxiv.js";
import { fetchRssFeeds } from "./rss.js";
import { fetchGithub } from "./github.js";
import { fetchHackerNews } from "./hn.js";
import { fetchWebsites } from "./web.js";
import { fetchAisi } from "./aisi.js";
import { fetchJournals } from "./journals.js";
import {
  arxivPrompt,
  githubPrompt,
  rssPrompt,
  hnPrompt,
  aisiPrompt,
  journalPrompt,
  dailyRollupPrompt,
} from "./prompts.js";
import { generateReport, translateReport, saveReport } from "./report.js";
import { loadConfig } from "./config.js";

async function main() {
  const date = today();
  const config = loadConfig();
  console.log(`\n=== AI Safety Daily Brief - ${date} ===\n`);

  // Phase 1: Fetch all data in parallel
  console.log("Fetching data from all sources...");
  const [arxivData, rssData, githubData, hnData, webData, aisiData, journalData] = await Promise.all([
    fetchArxiv().catch((e) => {
      console.error("ArXiv fetch failed:", e);
      return [];
    }),
    fetchRssFeeds().catch((e) => {
      console.error("RSS fetch failed:", e);
      return [];
    }),
    fetchGithub().catch((e) => {
      console.error("GitHub fetch failed:", e);
      return [];
    }),
    fetchHackerNews().catch((e) => {
      console.error("HN fetch failed:", e);
      return [];
    }),
    fetchWebsites().catch((e) => {
      console.error("Web fetch failed:", e);
      return [];
    }),
    fetchAisi().catch((e) => {
      console.error("AISI fetch failed:", e);
      return [];
    }),
    fetchJournals().catch((e) => {
      console.error("Journals fetch failed:", e);
      return [];
    }),
  ]);

  // Merge org website articles into RSS/blog posts
  const combinedRssData = [...rssData, ...webData];

  console.log(
    `Fetched: ${arxivData.length} papers, ${combinedRssData.length} articles (incl. ${webData.length} org updates), ` +
      `${githubData.length} GitHub items, ${hnData.length} HN stories, ` +
      `${aisiData.length} AISI items, ${journalData.length} journal articles`
  );

  // Phase 2: Generate English reports
  console.log("\nGenerating English reports...");
  const sections: string[] = [];

  const reports = await Promise.all([
    arxivData.length > 0
      ? generateReport(arxivPrompt(JSON.stringify(arxivData, null, 2), date))
      : Promise.resolve(""),
    combinedRssData.length > 0
      ? generateReport(rssPrompt(JSON.stringify(combinedRssData, null, 2), date))
      : Promise.resolve(""),
    githubData.length > 0
      ? generateReport(githubPrompt(JSON.stringify(githubData, null, 2), date))
      : Promise.resolve(""),
    hnData.length > 0
      ? generateReport(hnPrompt(JSON.stringify(hnData, null, 2), date))
      : Promise.resolve(""),
    aisiData.length > 0
      ? generateReport(aisiPrompt(JSON.stringify(aisiData, null, 2), date))
      : Promise.resolve(""),
    journalData.length > 0
      ? generateReport(journalPrompt(JSON.stringify(journalData, null, 2), date))
      : Promise.resolve(""),
  ]);

  const [arxivReport, rssReport, githubReport, hnReport, aisiReport, journalReport] = reports;

  // Collect English files for translation
  const enFiles: Array<{ filename: string; content: string }> = [];

  if (arxivReport) {
    const content = `# ArXiv - AI Safety Papers (${date})\n\n${arxivReport}`;
    saveReport(date, "safety-arxiv.md", content);
    enFiles.push({ filename: "safety-arxiv.md", content });
    sections.push(`## ArXiv Papers [Tier 2]\n\n${arxivReport}`);
  }
  if (rssReport) {
    const content = `# Blog Posts & Articles (${date})\n\n${rssReport}`;
    saveReport(date, "safety-rss.md", content);
    enFiles.push({ filename: "safety-rss.md", content });
    sections.push(`## Blog Posts & Articles [Tier 2]\n\n${rssReport}`);
  }
  if (githubReport) {
    const content = `# GitHub Activity (${date})\n\n${githubReport}`;
    saveReport(date, "safety-github.md", content);
    enFiles.push({ filename: "safety-github.md", content });
    sections.push(`## GitHub Activity [Tier 3]\n\n${githubReport}`);
  }
  if (hnReport) {
    const content = `# Hacker News Discussions (${date})\n\n${hnReport}`;
    saveReport(date, "safety-hn.md", content);
    enFiles.push({ filename: "safety-hn.md", content });
    sections.push(`## Hacker News [Tier 3]\n\n${hnReport}`);
  }
  if (aisiReport) {
    const content = `# AI Safety Institutes (${date})\n\n${aisiReport}`;
    saveReport(date, "safety-aisi.md", content);
    enFiles.push({ filename: "safety-aisi.md", content });
    sections.push(`## AI Safety Institutes [Tier 1]\n\n${aisiReport}`);
  }
  if (journalReport) {
    const content = `# Journal Articles (${date})\n\n${journalReport}`;
    saveReport(date, "safety-journals.md", content);
    enFiles.push({ filename: "safety-journals.md", content });
    sections.push(`## Journal Articles [Tier 1]\n\n${journalReport}`);
  }

  // Phase 3: Generate daily rollup
  if (sections.length > 0) {
    console.log("Generating daily executive summary...");
    const rollup = await generateReport(
      dailyRollupPrompt(sections.join("\n\n---\n\n"), date),
      6144
    );
    const dailyContent = `# Daily Brief (${date})\n\n${rollup}`;
    saveReport(date, "safety-daily.md", dailyContent);
    enFiles.push({ filename: "safety-daily.md", content: dailyContent });
  } else {
    console.log("No data fetched - skipping report generation.");
  }

  // Phase 4: Translate to French if enabled
  if (config.languages.includes("fr") && enFiles.length > 0) {
    console.log("\nTranslating reports to French...");
    await Promise.all(
      enFiles.map(async ({ filename, content }) => {
        const translated = await translateReport(content);
        const frFilename = filename.replace(".md", ".fr.md");
        saveReport(date, frFilename, translated);
      })
    );
  }

  console.log("\nDone!");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
