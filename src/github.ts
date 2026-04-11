import { loadConfig } from "./config.js";
import { daysAgo, formatDate } from "./date.js";

export interface GithubActivity {
  repo: string;
  type: "issue" | "pull_request" | "release";
  title: string;
  url: string;
  date: string;
  body: string;
}

const headers: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "User-Agent": "AI-Safety-Daily-Brief/1.0",
};

export async function fetchGithub(): Promise<GithubActivity[]> {
  const config = loadConfig();
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const since = formatDate(daysAgo(1));
  const allActivity: GithubActivity[] = [];

  for (const repo of config.github_repos) {
    try {
      const [issues, prs, releases] = await Promise.all([
        fetchRepoIssues(repo, since),
        fetchRepoPRs(repo, since),
        fetchRepoReleases(repo, since),
      ]);
      allActivity.push(...issues, ...prs, ...releases);
    } catch (e) {
      console.error(`GitHub error for ${repo}:`, e);
    }
    // Rate limiting courtesy
    await new Promise((r) => setTimeout(r, 200));
  }

  return allActivity;
}

async function fetchRepoIssues(repo: string, since: string): Promise<GithubActivity[]> {
  const url = `https://api.github.com/repos/${repo}/issues?since=${since}&state=all&per_page=10&sort=updated`;
  const res = await fetch(url, { headers });
  if (!res.ok) return [];
  const data = (await res.json()) as Array<Record<string, unknown>>;
  return data
    .filter((i) => !i.pull_request)
    .map((i) => ({
      repo,
      type: "issue" as const,
      title: i.title as string,
      url: i.html_url as string,
      date: i.created_at as string,
      body: ((i.body as string) || "").slice(0, 300),
    }));
}

async function fetchRepoPRs(repo: string, since: string): Promise<GithubActivity[]> {
  const url = `https://api.github.com/repos/${repo}/pulls?state=all&per_page=10&sort=updated&direction=desc`;
  const res = await fetch(url, { headers });
  if (!res.ok) return [];
  const data = (await res.json()) as Array<Record<string, unknown>>;
  return data
    .filter((p) => new Date(p.updated_at as string) >= new Date(since))
    .map((p) => ({
      repo,
      type: "pull_request" as const,
      title: p.title as string,
      url: p.html_url as string,
      date: p.created_at as string,
      body: ((p.body as string) || "").slice(0, 300),
    }));
}

async function fetchRepoReleases(repo: string, since: string): Promise<GithubActivity[]> {
  const url = `https://api.github.com/repos/${repo}/releases?per_page=5`;
  const res = await fetch(url, { headers });
  if (!res.ok) return [];
  const data = (await res.json()) as Array<Record<string, unknown>>;
  return data
    .filter((r) => new Date(r.published_at as string) >= new Date(since))
    .map((r) => ({
      repo,
      type: "release" as const,
      title: `${r.name || r.tag_name}` as string,
      url: r.html_url as string,
      date: r.published_at as string,
      body: ((r.body as string) || "").slice(0, 300),
    }));
}
