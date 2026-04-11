import { loadConfig } from "./config.js";
import { daysAgo } from "./date.js";

export interface HnStory {
  title: string;
  url: string;
  points: number;
  numComments: number;
  hnUrl: string;
  createdAt: string;
}

export async function fetchHackerNews(): Promise<HnStory[]> {
  const config = loadConfig();
  const since = Math.floor(daysAgo(1).getTime() / 1000);
  const allStories: HnStory[] = [];

  const fetches = config.hn_keywords.map(async (keyword) => {
    const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(keyword)}&tags=story&numericFilters=created_at_i>${since}&hitsPerPage=20`;
    try {
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = (await res.json()) as {
        hits: Array<{
          objectID: string;
          title: string;
          url: string;
          points: number;
          num_comments: number;
          created_at: string;
        }>;
      };
      return data.hits.map((h) => ({
        title: h.title,
        url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
        points: h.points || 0,
        numComments: h.num_comments || 0,
        hnUrl: `https://news.ycombinator.com/item?id=${h.objectID}`,
        createdAt: h.created_at,
      }));
    } catch (e) {
      console.error(`HN fetch error for "${keyword}":`, e);
      return [];
    }
  });

  const results = await Promise.all(fetches);
  for (const stories of results) allStories.push(...stories);

  // Deduplicate by URL and sort by points
  const seen = new Set<string>();
  return allStories
    .filter((s) => {
      const key = s.url || s.hnUrl;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.points - a.points)
    .slice(0, 30);
}
