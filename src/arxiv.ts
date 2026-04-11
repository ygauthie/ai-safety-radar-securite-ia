import { loadConfig } from "./config.js";
import { daysAgo } from "./date.js";

export interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  categories: string[];
  published: string;
  link: string;
}

export async function fetchArxiv(): Promise<ArxivPaper[]> {
  const config = loadConfig();
  const since = daysAgo(1);

  const allPapers: ArxivPaper[] = [];

  // Search by safety keywords across AI categories
  for (const keyword of config.arxiv.keywords.slice(0, 8)) {
    const catQuery = config.arxiv.categories.map((c) => `cat:${c}`).join("+OR+");
    const searchQuery = `(${catQuery})+AND+all:${encodeURIComponent(keyword)}`;
    const url = `http://export.arxiv.org/api/query?search_query=${searchQuery}&start=0&max_results=20&sortBy=submittedDate&sortOrder=descending`;

    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const xml = await res.text();
      const papers = parseArxivXml(xml, since);
      allPapers.push(...papers);

      // Be polite to ArXiv API
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      console.error(`ArXiv fetch error for "${keyword}":`, e);
    }
  }

  // Deduplicate by ID
  const seen = new Set<string>();
  return allPapers.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

function parseArxivXml(xml: string, since: Date): ArxivPaper[] {
  const papers: ArxivPaper[] = [];
  const entries = xml.split("<entry>").slice(1);

  for (const entry of entries) {
    const get = (tag: string) => {
      const m = entry.match(new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, "s"));
      return m ? m[1].trim() : "";
    };

    const published = get("published");
    if (new Date(published) < since) continue;

    const id = get("id").replace("http://arxiv.org/abs/", "");
    const title = get("title").replace(/\s+/g, " ");
    const summary = get("summary").replace(/\s+/g, " ").slice(0, 500);

    const authors: string[] = [];
    const authorMatches = entry.matchAll(/<author>\s*<name>(.*?)<\/name>/gs);
    for (const m of authorMatches) authors.push(m[1].trim());

    const categories: string[] = [];
    const catMatches = entry.matchAll(/category[^>]*term="([^"]+)"/g);
    for (const m of catMatches) categories.push(m[1]);

    const linkMatch = entry.match(/link[^>]*href="(https:\/\/arxiv\.org\/abs\/[^"]+)"/);
    const link = linkMatch ? linkMatch[1] : `https://arxiv.org/abs/${id}`;

    papers.push({ id, title, summary, authors, categories, published, link });
  }
  return papers;
}
