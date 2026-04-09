import "dotenv/config";
import { today } from "./date.js";
import { fetchArxiv } from "./arxiv.js";
import { fetchRssFeeds } from "./rss.js";
import { fetchGithub } from "./github.js";
import { fetchHackerNews } from "./hn.js";
import { fetchWebsites } from "./web.js";
import { fetchAisi } from "./aisi.js";
import {
  arxivPrompt,
  githubPrompt,
  rssPrompt,
  webPrompt,
  hnPrompt,
  aisiPrompt,
  dailyRollupPrompt,
} from "./prompts.js";
import { generateReport, saveReport } from "./report.js";
import type { Lang } from "./i18n.js";
import { loadConfig } from "./config.js";

async function main() {
  const date = today();
  const config = loadConfig();
  console.log(`\n=== AI Safety Radar - ${date} ===\n`);

  // Phase 1: Fetch all data in parallel
  console.log("Fetching data from all sources...");
  const [arxivData, rssData, githubData, hnData, webData, aisiData] = await Promise.all([
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
  ]);

  console.log(
    `Fetched: ${arxivData.length} papers, ${rssData.length} articles, ` +
      `${githubData.length} GitHub items, ${hnData.length} HN stories, ${webData.length} web articles, ${aisiData.length} AISI items`
  );

  // Phase 2: Generate reports for each language
  for (const lang of config.languages as Lang[]) {
    console.log(`\nGenerating ${lang.toUpperCase()} reports...`);
    const suffix = lang === "en" ? "" : `-${lang}`;
    const sections: string[] = [];

    // Generate section reports in parallel
    const reports = await Promise.all([
      arxivData.length > 0
        ? generateReport(arxivPrompt(JSON.stringify(arxivData, null, 2), date, lang))
        : Promise.resolve(""),
      rssData.length > 0
        ? generateReport(rssPrompt(JSON.stringify(rssData, null, 2), date, lang))
        : Promise.resolve(""),
      githubData.length > 0
        ? generateReport(githubPrompt(JSON.stringify(githubData, null, 2), date, lang))
        : Promise.resolve(""),
      hnData.length > 0
        ? generateReport(hnPrompt(JSON.stringify(hnData, null, 2), date, lang))
        : Promise.resolve(""),
      webData.length > 0
        ? generateReport(webPrompt(JSON.stringify(webData, null, 2), date, lang))
        : Promise.resolve(""),
      aisiData.length > 0
        ? generateReport(aisiPrompt(JSON.stringify(aisiData, null, 2), date, lang))
        : Promise.resolve(""),
    ]);

    const [arxivReport, rssReport, githubReport, hnReport, webReport, aisiReport] = reports;

    // Save individual reports
    if (arxivReport) {
      saveReport(date, `safety-arxiv${suffix}.md`, `# ArXiv - AI Safety Papers (${date})\n\n${arxivReport}`);
      sections.push(`## ArXiv Papers\n\n${arxivReport}`);
    }
    if (rssReport) {
      saveReport(date, `safety-rss${suffix}.md`, `# Blog Posts & Articles (${date})\n\n${rssReport}`);
      sections.push(`## Blog Posts & Articles\n\n${rssReport}`);
    }
    if (githubReport) {
      saveReport(date, `safety-github${suffix}.md`, `# GitHub Activity (${date})\n\n${githubReport}`);
      sections.push(`## GitHub Activity\n\n${githubReport}`);
    }
    if (hnReport) {
      saveReport(date, `safety-hn${suffix}.md`, `# Hacker News Discussions (${date})\n\n${hnReport}`);
      sections.push(`## Hacker News\n\n${hnReport}`);
    }
    if (webReport) {
      saveReport(date, `safety-web${suffix}.md`, `# Organization Updates (${date})\n\n${webReport}`);
      sections.push(`## Organization Updates\n\n${webReport}`);
    }
    if (aisiReport) {
      saveReport(date, `safety-aisi${suffix}.md`, `# AI Safety Institutes (${date})\n\n${aisiReport}`);
      sections.push(`## AI Safety Institutes\n\n${aisiReport}`);
    }

    // Phase 3: Generate daily rollup
    if (sections.length > 0) {
      console.log("Generating daily executive summary...");
      const rollup = await generateReport(
        dailyRollupPrompt(sections.join("\n\n---\n\n"), date, lang),
        6144
      );
      saveReport(
        date,
        `safety-daily${suffix}.md`,
        `# AI Safety Daily Digest - ${date}\n\n${rollup}`
      );
    } else {
      console.log("No data fetched - skipping report generation.");
    }
  }

  console.log("\nDone!");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
