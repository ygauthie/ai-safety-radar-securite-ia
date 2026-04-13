import { loadConfig } from "./config.js";
import { daysAgo } from "./date.js";

export interface RssItem {
  source: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Accept": "application/rss+xml, application/xml, text/xml, */*",
  "Accept-Language": "en-US,en;q=0.9",
};

async function fetchFeedXml(url: string, name: string): Promise<string | null> {
  // Try direct fetch first
  const res = await fetch(url, { headers: HEADERS });
  if (res.ok) return res.text();

  // If blocked, try proxy fallback
  if (res.status === 403 || res.status === 401) {
    console.log(`  ${name}: direct fetch blocked (${res.status}), trying proxy...`);
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const proxyRes = await fetch(proxyUrl);
    if (proxyRes.ok) return proxyRes.text();
    console.error(`RSS proxy also failed for ${name}: ${proxyRes.status}`);
    return null;
  }

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
