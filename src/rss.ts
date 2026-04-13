import { loadConfig } from "./config.js";
import { daysAgo } from "./date.js";

export interface RssItem {
  source: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

export async function fetchRssFeeds(): Promise<RssItem[]> {
  const config = loadConfig();
  const since = daysAgo(1);
  const allItems: RssItem[] = [];

  for (const feed of config.rss_feeds) {
    try {
      const res = await fetch(feed.url, {
        headers: { "User-Agent": "AI-Safety-Daily-Brief/1.0" },
      });
      if (!res.ok) {
        console.error(`RSS fetch failed for ${feed.name}: ${res.status}`);
        continue;
      }
      const xml = await res.text();
      const items = parseRssXml(xml, feed.name, since).slice(0, 3);
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
