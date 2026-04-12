import { loadConfig } from "./config.js";
import { daysAgo } from "./date.js";

export interface JournalArticle {
  source: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

export async function fetchJournals(): Promise<JournalArticle[]> {
  const config = loadConfig();
  const since = daysAgo(1);
  const keywords = config.arxiv.keywords.map((k) => k.toLowerCase());
  const allItems: JournalArticle[] = [];

  for (const feed of config.journal_feeds) {
    try {
      const res = await fetch(feed.url, {
        headers: { "User-Agent": "AI-Safety-Radar/1.0" },
      });
      if (!res.ok) {
        console.error(`Journal RSS fetch failed for ${feed.name}: ${res.status}`);
        continue;
      }
      const xml = await res.text();
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
