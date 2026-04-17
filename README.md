# AI Safety Radar

**A daily automated digest of AI safety research, policy, and developments.**

Runs every morning at approximately 5 AM ET via GitHub Actions, pulls from ten sources, summarizes with Claude, and publishes to GitHub Pages as a clean, searchable static site with an RSS feed.  Also generates a **weekly rollup**, cross-source synthesis of the past week, every Monday. Adapted from [agents-radar](https://github.com/duanyytop/agents-radar).

Live site: [ygauthie.github.io/ai-safety-radar-securite-ia](https://ygauthie.github.io/ai-safety-radar-securite-ia)

---

## What it monitors

| Source | What it tracks |
|---|---|
| **AI Safety Institutes** | Updates from US AISI, UK AISI, Canada CAISI, Japan J-AISI, Singapore AISI, EU AI Office, Korea AISI |
| **ArXiv** | Papers tagged cs.AI, cs.CL, cs.LG, cs.CY matching safety keywords |
| **Scientific Journals** | Peer-reviewed articles from Nature, Science, PNAS, Nature Machine Intelligence, JAIR, and others — keyword-filtered for AI safety relevance |
| **Org Websites** | New publications from Anthropic, OpenAI, DeepMind (sitemap crawling) |
| **RSS Feeds** | Alignment Forum, LessWrong, 15+ AI safety newsletters and Substacks |
| **Hacker News** | Top discussions matching safety keywords |
| **GitHub** | Releases and activity from tracked repos + dynamic discovery via AI safety topics |
| **Actually Relevant** | AI safety-filtered stories from actuallyrelevant.news (keyword-filtered) |
| **Google News** | Last 24h news matching `"AI safety"` |

### Keywords

The same keyword list is used for three sources: **ArXiv** (paper search), **Hacker News** (story search), and **Scientific Journals** (title + abstract filtering). All 31 keywords:

`activation steering` · `adversarial robustness` · `AI ethics` · `AI evaluation` · `AI governance` · `AI guardrails` · `AI oversight` · `AI regulation` · `AI safety` · `AI Safety Institute` · `AI Security Institute` · `alignment` · `CAISI` · `collusion risk` · `constitutional AI` · `content provenance` · `deception` · `deepfake detection` · `existential risk` · `hallucination` · `honesty evaluation` · `interpretability` · `jailbreak` · `mechanistic interpretability` · `multilingual AI safety` · `red teaming` · `responsible AI` · `RLHF` · `scalable oversight` · `synthetic content detection` · `value alignment`

GitHub uses a fixed list of repos plus dynamic discovery via GitHub topics (`ai-safety`, `llm-alignment`, `llm-safety`, `ai-alignment`). RSS feeds and org websites are not keyword-filtered — all content is passed to Claude.

---

## Architecture

```
GitHub Actions (cron 5 AM ET)
    │
    ├── Fetch sources in parallel
    │     ├── ArXiv API
    │     ├── Scientific journal RSS feeds (keyword-filtered)
    │     ├── RSS/Atom feeds (blogs, forums, Google News)
    │     ├── GitHub REST API + topic discovery
    │     ├── HN Algolia API
    │     ├── Website sitemaps
    │     ├── AISI websites + RSS
    │     └── Actually Relevant API (keyword-filtered)
    │
    ├── Summarize with Claude (OpenRouter) — 3 sections in parallel
    │     ├── Research Papers (ArXiv + journals)
    │     ├── Blogs & News (RSS + org websites + AISIs + Actually Relevant + Google News)
    │     ├── Community & Tools (HN + GitHub)
    │     └── Daily executive summary (rollup with dedup context from last 2 days)
    │
    ├── Save to digests/YYYY-MM-DD/safety-{section}.md
    ├── Translate to French (if languages includes "fr")
    ├── Regenerate manifest.json + feed.xml
    └── Commit and push → GitHub Pages serves index.html
```

### Project structure

```
src/
  index.ts              # Main daily pipeline entry point
  weekly.ts             # Weekly rollup entry point
  arxiv.ts              # ArXiv paper fetcher
  journals.ts           # Scientific journal RSS fetcher (keyword-filtered)
  rss.ts                # RSS/Atom feed fetcher (blogs, forums)
  github.ts             # GitHub activity fetcher + topic discovery
  hn.ts                 # Hacker News fetcher
  web.ts                # Org website sitemap crawler
  aisi.ts               # AI Safety Institute fetcher
  actuallyrelevant.ts   # Actually Relevant news fetcher (keyword-filtered)
  prompts.ts            # LLM prompt templates
  report.ts             # LLM calling + concurrency limiter + file saving
  generate-manifest.ts  # manifest.json + feed.xml generator
  config.ts             # Config loader
  date.ts               # Date utilities
  i18n.ts               # Internationalisation (en + fr)
  providers/            # LLM provider abstraction (OpenRouter default)
config.yml              # All data source configuration
index.html              # Single-page frontend (no build step)
digests/                # Generated markdown files, committed by CI
  YYYY-MM-DD/
    safety-daily.md     # Executive summary (rollup)
    safety-weekly.md    # Mondays only
    safety-research.md  # ArXiv + peer-reviewed journals
    safety-analysis.md  # RSS blogs + org websites + AISIs
    safety-community.md # Hacker News + GitHub
```

---

## Setup

### 1. Fork and configure

Fork this repo, then add one repository secret:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
|---|---|
| `OPENROUTER_API_KEY` | Your [OpenRouter](https://openrouter.ai) API key |

### 2. Enable GitHub Pages

**Settings → Pages → Source: Deploy from a branch → Branch: main / root**

### 3. Trigger the first run

**Actions → Daily Digest → Run workflow**

The site will be live at `https://<your-username>.github.io/ai-safety-radar-securite-ia` after the first successful run.

### 4. Run locally (optional)

```bash
cp .env.example .env        # add your OPENROUTER_API_KEY
pnpm install
pnpm start                  # run daily digest
pnpm weekly                 # run weekly rollup
pnpm manifest               # regenerate manifest.json and feed.xml
pnpm typecheck              # TypeScript type check
```

---

## Configuration

All sources are configured in `config.yml`:

- **`github_topics`** — GitHub topics for dynamic repo discovery (top 20 most recently active per topic)
- **`github_repos`** — fixed list of `owner/repo` to always track
- **`arxiv.keywords`** — keywords used for ArXiv search and journal filtering
- **`journal_feeds`** — name + URL pairs for peer-reviewed journal RSS feeds (Tier 1)
- **`rss_feeds`** — name + URL + tier for blog/newsletter RSS feeds (Tier 1–3, includes Google News)
- **`websites`** — sitemap URL + URL patterns for org website crawling (Tier 1–2)
- **`aisi_websites`** — national AI Safety Institute URLs, optional RSS feeds, and optional additional URLs (Tier 1)
- **`hn_keywords`** — keywords + `min_points` threshold (default 20) for HN story filtering
- **`languages`** — `[en]` by default; add `fr` to enable French digests

Sources are annotated with a credibility tier used by the LLM when prioritizing content:
- **Tier 1**: Government AISIs, peer-reviewed journals, established think tanks (RAND, Georgetown CSET, Ada Lovelace Institute)
- **Tier 2**: AI lab blogs (Anthropic, OpenAI, DeepMind), safety research orgs (METR, ARC, MIRI, Apollo, Epoch), preprints / non-peer-reviewed papers, expert newsletters
- **Tier 3**: Hacker News, GitHub activity, Google News, Actually Relevant

---

## Languages

English by default. Add `fr` to the `languages` list in `config.yml` to generate parallel French digests. English reports are generated first, then translated by Claude.

---

## Schedule

| Workflow | When |
|---|---|
| Daily Brief | Every day at approximately 5:00 AM ET (09:00 UTC) - Github Actions can be queued or delayed|
| Weekly Rollup | Every Monday at approximately 5:30 AM ET (09:30 UTC) |

---
