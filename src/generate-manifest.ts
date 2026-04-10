import { readdirSync, readFileSync, existsSync, writeFileSync } from "fs";
import { join } from "path";

interface ManifestEntry {
  date: string;
  files: string[];
}

function main() {
  const digestsDir = join(process.cwd(), "digests");
  if (!existsSync(digestsDir)) {
    console.log("No digests directory found.");
    return;
  }

  // Nested structure: digests/YYYY-MM-DD/safety-source.md
  const entries: ManifestEntry[] = [];
  const dateDirs = readdirSync(digestsDir).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));

  for (const date of dateDirs) {
    const dateDir = join(digestsDir, date);
    const files = readdirSync(dateDir).filter((f) => f.endsWith(".md"));
    if (files.length > 0) {
      entries.push({ date, files: files.sort() });
    }
  }

  entries.sort((a, b) => b.date.localeCompare(a.date));

  // Write manifest.json — store files as date/filename for URL construction
  const manifest = {
    generated: new Date().toISOString(),
    entries: entries.map((e) => ({
      date: e.date,
      files: e.files.map((f) => `${e.date}/${f}`),
    })),
  };
  writeFileSync(join(process.cwd(), "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Manifest: ${entries.length} dates, written to manifest.json`);

  // Write RSS feed — latest 15 reports across all types
  const labelMap: Record<string, string> = {
    "safety-daily": "AI Safety Brief",
    "safety-weekly": "Weekly Summary",
    "safety-arxiv": "ArXiv Papers",
    "safety-github": "GitHub Activity",
    "safety-rss": "Blog Posts",
    "safety-web": "Org Updates",
    "safety-aisi": "AI Safety Institutes",
    "safety-hn": "Hacker News",
  };

  function fileLabel(filename: string): string {
    for (const [key, label] of Object.entries(labelMap)) {
      if (filename.includes(key)) return label;
    }
    return filename.replace(".md", "");
  }

  // Flatten all files across all dates, newest date first
  const allItems: { date: string; file: string }[] = [];
  for (const e of entries) {
    // Sort within each date: weekly first, daily second, rest alphabetical
    const sorted = [...e.files].sort((a, b) => {
      const priority: Record<string, number> = { weekly: 0, daily: 1 };
      const pa = Object.entries(priority).find(([k]) => a.includes(k))?.[1] ?? 99;
      const pb = Object.entries(priority).find(([k]) => b.includes(k))?.[1] ?? 99;
      if (pa !== pb) return pa - pb;
      return a.localeCompare(b);
    });
    for (const file of sorted) {
      allItems.push({ date: e.date, file });
    }
  }

  const feedItems = allItems.slice(0, 15).map(({ date, file }) => {
    const label = fileLabel(file);
    let description = `${label} for ${date}`;
    const filePath = join(digestsDir, date, file);
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, "utf-8");
      const plain = content
        .replace(/^#[^\n]*\n/, "")
        .slice(0, 2000)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      description = plain;
    }
    return `    <item>
      <title>AI Safety Daily Brief: ${label} — ${date}</title>
      <link>https://ygauthie.github.io/ai-safety-daily-brief/#${date}/${file}</link>
      <guid>https://ygauthie.github.io/ai-safety-daily-brief/#${date}/${file}</guid>
      <pubDate>${new Date(date).toUTCString()}</pubDate>
      <description>${description}</description>
    </item>`;
  });

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>AI Safety Daily Brief</title>
    <link>https://ygauthie.github.io/ai-safety-daily-brief/</link>
    <description>Daily AI safety research, policy, and development digest</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${feedItems.join("\n")}
  </channel>
</rss>`;

  writeFileSync(join(process.cwd(), "feed.xml"), feed);
  console.log("RSS feed written to feed.xml");
}

main();
