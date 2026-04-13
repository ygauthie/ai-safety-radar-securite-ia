import { loadConfig } from "./config.js";
import { daysAgo } from "./date.js";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

export interface JournalArticle {
  source: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

const FEED_CACHE_DIR = join(process.cwd(), ".feed-cache");

function findCachedFeed(name: string): string | null {
  if (!existsSync(FEED_CACHE_DIR)) return null;
  const slug = name.replace(/[ ()\/]/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
  const path = join(FEED_CACHE_DIR, `${slug}.xml`);
  if (!existsSync(path)) return null;
  const content = readFileSync(path, "utf-8");
  if (content.includes("<rss") || content.includes("<feed") || content.includes("<item") || content.includes("<entry")) {
    return content;
  }
  return null;
}

async function fetchJournalFeedXml(url: string, name: string): Promise<string | null> {
  const cached = findCachedFeed(name);
  if (cached) {
    console.log(`  ${name}: using cached feed`);
    return cached;
  }

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      "Accept": "application/rss+xml, application/xml, text/xml, */*",
    },
  });
  if (res.ok) return res.text();

  console.error(`Journal RSS fetch failed for ${name}: ${res.status}`);
  return null;
}

export async function fetchJournals(): Promise<JournalArticle[]> {
  const config = loadConfig();
  const since = daysAgo(1);
  const keywords = config.arxiv.keywords.map((k) => k.toLowerCase());
  const allItems: JournalArticle[] = [];

  for (const feed of config.journal_feeds) {
    try {
      const xml = await fetchJournalFeedXml(feed.url, feed.name);
      if (!xml) continue;
      const items = parseRssXml(xml, feed.name, since, keywords);
      allItems.push(...items);
    } catch (e) {
      console.error(`Journal RSS error for ${feed.name}:`, e);
    }
  }

  return allItems;
}

function parseRssXml(
  xml: string,
  source: string,
  since: Date,
  keywords: string[]
): JournalArticle[] {
  const items: JournalArticle[] = [];

  const isAtom = xml.includes("<feed");
  const tag = isAtom ? "entry" : "item";
  const entries = xml.split(`<${tag}`).slice(1);

  for (const entry of entries) {
    const get = (tags: string[]) => {
      for (const t of tags) {
        const m = entry.match(new RegExp(`<${t}[^>]*>(.*?)</${t}>`, "s"));
        if (m) return m[1].trim();
      }
      return "";
    };

    const title = get(["title"]).replace(/<!\[CDATA\[(.*?)\]\]>/s, "$1");
    const description = get(["description", "summary", "content"])
      .replace(/<!\[CDATA\[(.*?)\]\]>/s, "$1")
      .replace(/<[^>]+>/g, "")
      .slice(0, 500);

    let link = get(["link"]);
    if (!link) {
      const hrefMatch = entry.match(/link[^>]*href="([^"]+)"/);
      if (hrefMatch) link = hrefMatch[1];
    }

    const pubDate = get(["pubDate", "published", "updated"]);
    if (pubDate && new Date(pubDate) < since) continue;

    if (!title || !link) continue;

    // Keyword filter — only include articles relevant to AI safety
    const text = `${title} ${description}`.toLowerCase();
    const isRelevant = keywords.some((kw) => text.includes(kw));
    if (!isRelevant) continue;

    items.push({ source, title, link, description, pubDate });
  }

  return items;
}
