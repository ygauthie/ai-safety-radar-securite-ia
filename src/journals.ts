import { loadConfig } from "./config.js";
import { daysAgo } from "./date.js";

export interface JournalArticle {
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

async function fetchJournalFeedXml(url: string, name: string): Promise<string | null> {
  const res = await fetch(url, { headers: HEADERS });
  if (res.ok) return res.text();

  if (res.status === 403 || res.status === 401) {
    console.log(`  ${name}: direct fetch blocked (${res.status}), trying proxy...`);
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const proxyRes = await fetch(proxyUrl);
    if (proxyRes.ok) return proxyRes.text();
    console.error(`Journal proxy also failed for ${name}: ${proxyRes.status}`);
    return null;
  }

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
