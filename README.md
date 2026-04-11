# <img src="assets/shield.png" width="32" height="32" valign="middle"> AI Safety Daily Brief

**A daily automated digest of AI safety research, policy, and developments.**

Runs every morning at 5 AM ET via GitHub Actions, pulls from seven sources, summarizes with Claude, and publishes to GitHub Pages as a clean, searchable static site with an RSS feed.  Adapted from [agents-radar](https://github.com/duanyytop/agents-radar).

Live site: [ygauthie.github.io/ai-safety-daily-brief](https://ygauthie.github.io/ai-safety-daily-brief)

---

## What it monitors

| Source | What it tracks |
|---|---|
| **ArXiv** | Papers tagged cs.AI, cs.CL, cs.LG, cs.CY matching safety keywords |
| **RSS Feeds** | Alignment Forum, LessWrong, 10+ AI safety Substacks |
| **GitHub** | Releases and activity from key safety/alignment repos |
| **Hacker News** | Top discussions on AI safety, governance, and alignment |
| **Org Websites** | New publications from Anthropic, OpenAI, DeepMind (sitemap crawling) |
| **AI Safety Institutes** | Updates from US AISI, UK AISI, Canada CAISI, Japan J-AISI, Singapore AISI, EU AI Office, Korea AISI |
| **Weekly Rollup** | Every Monday — cross-source synthesis of the past week |

### ArXiv keywords tracked

`activation steering` · `adversarial robustness` · `AI ethics` · `AI evaluation` · `AI governance` · `AI guardrails` · `AI oversight` · `AI regulation` · `AI safety` · `AI Safety Institute` · `AI Security Institute` · `alignment` · `CAISI` · `collusion risk` · `constitutional AI` · `content provenance` · `deception` · `deepfake detection` · `existential risk` · `hallucination` · `honesty evaluation` · `interpretability` · `jailbreak` · `mechanistic interpretability` · `multilingual AI safety` · `red teaming` · `responsible AI` · `RLHF` · `scalable oversight` · `synthetic content detection` · `value alignment`

---

## Architecture

```
GitHub Actions (cron 5 AM ET)
    │
    ├── Fetch sources in parallel
    │     ├── ArXiv API
    │     ├── RSS/Atom feeds
    │     ├── GitHub REST API
    │     ├── HN Algolia API
    │     ├── Website sitemaps
    │     └── AISI websites + RSS
    │
    ├── Summarize with Claude (OpenRouter)
    │     └── Per-source digest + daily rollup
    │
    ├── Save to digests/YYYY-MM-DD/safety-{source}.md
    ├── Regenerate manifest.json + feed.xml
    └── Commit and push → GitHub Pages serves index.html
```

### Project structure

```
src/
  index.ts              # Main daily pipeline entry point
  weekly.ts             # Weekly rollup entry point
  arxiv.ts              # ArXiv paper fetcher
  rss.ts                # RSS/Atom feed fetcher
  github.ts             # GitHub activity fetcher
  hn.ts                 # Hacker News fetcher
  web.ts                # Org website sitemap crawler
  aisi.ts               # AI Safety Institute fetcher
  prompts.ts            # LLM prompt templates
  report.ts             # LLM calling + concurrency limiter + file saving
  generate-manifest.ts  # manifest.json + feed.xml generator
  config.ts             # Config loader
  date.ts               # Date utilities
  i18n.ts               # Internationalisation (en + fr prepared)
  providers/            # LLM provider abstraction (OpenRouter default)
config.yml              # All data source configuration
index.html              # Single-page frontend (no build step)
digests/                # Generated markdown files, committed by CI
  YYYY-MM-DD/
    safety-daily.md
    safety-weekly.md    # Mondays only
    safety-arxiv.md
    safety-rss.md
    safety-github.md
    safety-hn.md
    safety-web.md
    safety-aisi.md
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

The site will be live at `https://<your-username>.github.io/ai-safety-daily-brief` after the first successful run.

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

- **`github_repos`** — list of `owner/repo` to track
- **`arxiv.keywords`** — keywords to filter papers
- **`rss_feeds`** — name + URL pairs for any RSS/Atom feed
- **`websites`** — sitemap URL + URL patterns to include
- **`aisi_websites`** — national AI Safety Institute URLs and optional RSS feeds
- **`hn_keywords`** — Hacker News search terms
- **`languages`** — `[en]` by default; add `fr` to enable French digests

---

## Languages

English by default. French support is prepared via `src/i18n.ts` — add `fr` to the `languages` list in `config.yml` to generate parallel French digests.

---

## Schedule

| Workflow | When |
|---|---|
| Daily Digest | Every day at 5:00 AM ET (09:00 UTC) |
| Weekly Rollup | Every Monday at 5:30 AM ET (09:30 UTC) |

---

