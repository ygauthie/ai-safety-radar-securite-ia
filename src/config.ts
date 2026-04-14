import { readFileSync } from "fs";
import yaml from "js-yaml";
import { join } from "path";

export type Tier = 1 | 2 | 3;

export interface RssFeed {
  name: string;
  url: string;
  tier?: Tier;
}

export interface Website {
  name: string;
  sitemap: string;
  include_patterns: string[];
  tier?: Tier;
}

export interface AisiWebsite {
  name: string;
  url: string;
  urls?: string[];
  rss?: string;
  keywords?: string[];
  tier?: Tier;
}

export interface Config {
  github_topics: string[];
  github_repos: string[];
  github_tier?: Tier;
  journal_feeds: RssFeed[];
  arxiv: {
    tier?: Tier;
    categories: string[];
    keywords: string[];
  };
  rss_feeds: RssFeed[];
  websites: Website[];
  aisi_websites: AisiWebsite[];
  hn_keywords: {
    tier?: Tier;
    keywords: string[];
  };
  languages: string[];
}

let _config: Config | null = null;

export function loadConfig(): Config {
  if (_config) return _config;
  const raw = readFileSync(join(process.cwd(), "config.yml"), "utf-8");
  _config = yaml.load(raw) as Config;
  return _config;
}
