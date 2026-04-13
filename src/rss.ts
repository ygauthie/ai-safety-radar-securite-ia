import { loadConfig } from "./config.js";
import { daysAgo } from "./date.js";
import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

export interface RssItem {
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

async function fetchFeedXml(url: string, name: string): Promise<string | null> {
  // Check curl-based cache first (populated by CI pre-step)
  const cached = findCachedFeed(name);
  if (cached) {
    console.log(`  ${name}: using cached feed`);
    return cached;
  }

  // Fall back to direct fetch
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      "Accept": "application/rss+xml, application/xml, text/xml, */*",
    },
  });
  if (res.ok) return res.text();

  console.error(`RSS fetch failed for ${name}: ${res.status}`);
  return null;
}

export async function fetchRssFeeds(): Promise<RssItem[]> {
  const config = loadConfig();
  const since = daysAgo(2);
  const allItems: RssItem[] = [];

  for (const feed of config.rss_feeds) {
    try {
      const xml = await fetchFeedXml(feed.url, feed.name);
      if (!xml) continue;
      const items = parseRssXml(xml, feed.name, since).slice(0, 3);
      console.log(`  ${feed.name}: ${items.length} items`);
      allItems.push(...items);
    } catch (e) {
      console.error(`RSS error for ${feed.name}:`, e);
    }
  }

  return allItems;
}

function parseRssXml(xml: string, source: string, since: Date): RssItem[] {
  const items: RssItem[] = [];

  // Handle both <item> (RSS 2.0) and <entry> (Atom)
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

    if (title && link) {
      items.push({ source, title, link, description, pubDate });
    }
  }

  return items;
}
