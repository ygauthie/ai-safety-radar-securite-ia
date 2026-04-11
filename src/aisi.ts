import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { loadConfig } from "./config.js";
import { daysAgo, formatDate } from "./date.js";

export interface AisiItem {
  institute: string;
  title: string;
  url: string;
  excerpt: string;
}

interface AisiState {
  [institute: string]: string[];
}

const STATE_FILE = join(process.cwd(), "digests", "aisi-state.json");

function loadState(): AisiState {
  if (existsSync(STATE_FILE)) {
    return JSON.parse(readFileSync(STATE_FILE, "utf-8"));
  }
  return {};
}

function saveState(state: AisiState): void {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export async function fetchAisi(): Promise<AisiItem[]> {
  const config = loadConfig();
  const cutoff = formatDate(daysAgo(1));
  const state = loadState();
  const items: AisiItem[] = [];

  for (const site of config.aisi_websites) {
    try {
      const knownUrls = new Set(state[site.name] || []);
      const foundUrls: string[] = [];

      // Try RSS feed first if available — has dates, most reliable
      if (site.rss) {
        const rssItems = await fetchRss(site.rss, site.name, site.keywords, cutoff);
        for (const item of rssItems) {
          if (!knownUrls.has(item.url)) {
            items.push(item);
          }
          foundUrls.push(item.url);
        }
      }

      // Scrape page for links, but only return NEW ones not seen before
      const pageUrls = await scrapePageLinks(site.url, site.name);
      for (const item of pageUrls) {
        if (!knownUrls.has(item.url)) {
          items.push(item);
        }
        foundUrls.push(item.url);
      }

      // Update state with all URLs we've ever seen
      state[site.name] = [...new Set([...Array.from(knownUrls), ...foundUrls])];
    } catch (e) {
      console.error(`[aisi] Error fetching ${site.name}:`, e);
    }
  }

  saveState(state);

  // Deduplicate by URL
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

async function fetchRss(
  rssUrl: string,
  institute: string,
  keywords: string[] | undefined,
  cutoff: string
): Promise<AisiItem[]> {
  const items: AisiItem[] = [];
  try {
    const res = await fetch(rssUrl, {
      headers: { "User-Agent": "AI-Safety-Daily-Brief/1.0" },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const itemBlocks = xml.split(/<item[\s>]/);
    for (const block of itemBlocks.slice(1, 21)) {
      const title = block.match(/<title[^>]*>(.*?)<\/title>/s)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/, "$1").trim() || "";
      const link = block.match(/<link[^>]*>(.*?)<\/link>/s)?.[1]?.trim() || "";
      const desc = block.match(/<description[^>]*>(.*?)<\/description>/s)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/, "$1").replace(/<[^>]+>/g, "").trim() || "";
      const pubDate = block.match(/<pubDate[^>]*>(.*?)<\/pubDate>/s)?.[1]?.trim();

      if (!title || !link) continue;

      // Strict date filter — only include items from the last 2 days
      if (pubDate) {
        const d = new Date(pubDate);
        if (!isNaN(d.getTime()) && formatDate(d) < cutoff) continue;
      }

      // Keyword filter if specified
      if (keywords && keywords.length > 0) {
        const text = `${title} ${desc}`.toLowerCase();
        if (!keywords.some((kw) => text.includes(kw.toLowerCase()))) continue;
      }

      items.push({ institute, title, url: link, excerpt: desc.slice(0, 500) });
    }
  } catch (e) {
    console.error(`[aisi] RSS error for ${institute}:`, e);
  }
  return items;
}

async function scrapePageLinks(url: string, institute: string): Promise<AisiItem[]> {
  const items: AisiItem[] = [];
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "AI-Safety-Daily-Brief/1.0" },
    });
    if (!res.ok) return [];
    const html = await res.text();

    const linkPattern = /<a\s[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gs;
    const baseUrl = new URL(url);
    const seen = new Set<string>();

    for (const match of html.matchAll(linkPattern)) {
      let href = match[1];
      const text = match[2].replace(/<[^>]+>/g, "").trim();

      if (!text || text.length < 15 || text.length > 300) continue;

      // Resolve relative URLs
      if (href.startsWith("/")) href = `${baseUrl.origin}${href}`;
      if (!href.startsWith("http")) continue;
      if (seen.has(href)) continue;
      seen.add(href);

      // Only include links that look like news/blog/publication content
      const lowerHref = href.toLowerCase();
      const newsPatterns = ["/news", "/blog", "/post", "/research", "/publication", "/update", "/press", "/announce", "/report"];
      if (!newsPatterns.some((p) => lowerHref.includes(p))) continue;

      items.push({ institute, title: text, url: href, excerpt: "" });
    }
  } catch (e) {
    console.error(`[aisi] Scrape error for ${institute}:`, e);
  }
  return items.slice(0, 10);
}
