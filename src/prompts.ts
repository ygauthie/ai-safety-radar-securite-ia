import type { Lang } from "./i18n.js";

const SYSTEM_ROLE = `You are an expert AI safety analyst. Your role is to synthesize AI safety developments into clear, insightful digests for researchers, policymakers, and practitioners. Focus on implications for AI safety, alignment, governance, and risk.

IMPORTANT formatting rules:
- Do NOT include a top-level heading (# title). The page title is provided separately.
- Start directly with ## subsections or content.
- ALWAYS hyperlink to original sources. Every paper, article, blog post, repo, or discussion you mention must include a markdown link to the original URL. Use inline links like [Title](url).`;

export function researchPrompt(data: string, date: string, lang: Lang = "en"): string {
  return `${SYSTEM_ROLE}

Today is ${date}. Below are recent AI safety research papers from two sources:
- **ArXiv preprints** [Tier 2]: Not yet peer-reviewed, but the primary venue for AI safety research.
- **Peer-reviewed journal articles** [Tier 1]: Published in Nature, Science, PNAS, Nature Machine Intelligence, and other journals. These carry higher credibility.

Produce a unified research digest in ${lang === "fr" ? "French" : "English"}:

1. **Key Papers**: Highlight the 5-10 most significant papers. Lead with peer-reviewed articles when available — they take precedence over preprints on the same topic. Each summary should be 2-3 sentences and end with one sentence explaining why it matters.

If fewer than 3 papers are available, add a brief note explaining that ArXiv does not publish new submissions on weekends (Saturday and Sunday), so coverage may be limited.

Format as clean Markdown. Include paper titles as links.

DATA:
${data}`;
}

export function analysisPolicyPrompt(data: string, date: string, lang: Lang = "en"): string {
  return `${SYSTEM_ROLE}

Today is ${date}. Below are recent articles, blog posts, and policy updates from multiple source types:
- **AI Safety Institute updates** [Tier 1]: Official government publications and policy actions. Highest priority.
- **Think tank & policy org publications** [Tier 1]: Georgetown CSET, RAND, Ada Lovelace Institute, AI Now Institute.
- **AI lab blogs & research org updates** [Tier 2]: Anthropic, OpenAI, DeepMind, Apollo Research, Epoch AI, METR, ARC, MIRI, Conjecture, IAPS, FLI.
- **Expert newsletters & community forums** [Tier 2]: Import AI, AI Snake Oil, Interconnects, Alignment Forum, and others.
- **Community forums** [Tier 3]: LessWrong.
- **General news aggregators** [Tier 3]: Actually Relevant. Broader coverage; treat as lower-signal background context.

Produce a unified blogs & news digest in ${lang === "fr" ? "French" : "English"}:

1. **Top Stories**: The 3-5 most important articles or publications from labs, research orgs, and expert commentators. Each summary should end with one sentence explaining why it matters.
2. **Policy & Governance**: Any AISI updates, regulatory developments, or think tank publications. For each, end with one sentence explaining why it matters. If no policy updates exist today, omit this subsection.

Format as clean Markdown with links to original sources.

DATA:
${data}`;
}

export function communityToolsPrompt(data: string, date: string, lang: Lang = "en"): string {
  return `${SYSTEM_ROLE}

Today is ${date}. Below are recent community discussions and open-source activity related to AI safety:
- **Hacker News discussions** [Tier 3]: Filtered for AI safety relevance, minimum 20 points.
- **GitHub activity** [Tier 3]: Releases, issues, and PRs from AI safety repositories.

Produce a unified community & tools digest in ${lang === "fr" ? "French" : "English"}:

1. **Key Discussions**: The top 3-5 most discussed stories on Hacker News or important GitHub issues/PRs. Summarize the discussion and end with one sentence explaining why it matters.
2. **Notable GitHub Releases & Tools**: New versions or significant releases from GitHub repositories. For each, note what it enables and end with one sentence explaining why it matters.

Format as clean Markdown with links.

DATA:
${data}`;
}

export function translationPrompt(content: string): string {
  return `You are a professional translator specializing in AI safety, technology policy, and research. Translate the following Markdown document from English to French.

Rules:
- Preserve all Markdown formatting exactly (headings, bold, links, bullet points, code spans, etc.)
- Keep all URLs and hyperlinks unchanged
- Translate headings and titles fully, including document titles like "Daily Digest" → "Bulletin quotidien" and "AI Safety Weekly Digest" → "Résumé hebdomadaire sur la sécurité de l'IA"
- Keep technical terms in English when they are widely used as-is in French AI safety discourse (e.g. "alignment", "red teaming", "benchmarks", "fine-tuning", "RLHF")
- Translate naturally and fluently — do not translate word for word
- Do not add any commentary, preamble, or explanation — output only the translated Markdown

CONTENT:
${content}`;
}

export function dailyRollupPrompt(sections: string, date: string, lang: Lang = "en", recentHeadlines = ""): string {
  const recentContext = recentHeadlines
    ? `\nRECENT COVERAGE (last 6 days + last weekly digest — do not repeat items already covered; if there is a meaningful update to an ongoing story, briefly note it as "ongoing" rather than treating it as new):\n${recentHeadlines}\n`
    : "";
  return `${SYSTEM_ROLE}

Today is ${date}. Below are the individual section digests for today. Create a unified daily executive summary in ${lang === "fr" ? "French" : "English"}.
${recentContext}
Each source section below is tagged with a credibility tier. When selecting Top Developments and Risk Watch items, weight by tier:

- **Tier 1 (Institutional/Peer-reviewed)**: Government AISIs, peer-reviewed journals (Nature, Science, PNAS), established think tanks (RAND, Georgetown CSET), International AI Safety Report. Highest credibility — prioritize these.
- **Tier 2 (Established Research & Expert Analysis)**: AI lab blogs (Anthropic, OpenAI, DeepMind), safety research orgs (METR, ARC, MIRI, Apollo, Epoch), expert newsletters (Import AI, AI Snake Oil, Interconnects, Zvi, etc.), Alignment Forum, ArXiv preprints. High credibility — a Tier 2 item may displace a Tier 1 item only if it represents a major capability breakthrough, significant safety incident, or landmark deployment decision.
- **Tier 3 (Community & General Discussion)**: LessWrong, Hacker News, Actually Relevant, GitHub activity. Lower credibility — only surface if exceptionally significant.

You MUST use exactly the following section headings, in this order. Do not rename, reorder, merge, or replace them with thematic headings:

## Top 3 Developments
## Section Summaries
## Risk Watch

Rules for each section:

**Top 3 Developments**: Fill these slots with the most consequential developments of the day, prioritizing Tier 1 sources (government AISIs, peer-reviewed journals, established think tanks). A Tier 2 item may displace a Tier 1 item only if it represents a major capability breakthrough, significant safety incident, or landmark deployment decision. Never use Tier 3 items. Each item must include at least one inline markdown link to the original source and end with one sentence explaining why it matters.

**Section Summaries**: A 1-2 sentence summary of each section, written as separate paragraphs (one per section). The three sections are **Research Papers**, **Blogs & News**, and **Community & Tools** — bold the section name at the start of each paragraph (e.g. **Research Papers:**). Every specific paper, article, post, tool, or organization mentioned must be hyperlinked to its original URL using inline markdown links. Use plain, neutral language — do not editorialize with adjectives like "critical," "key," "groundbreaking," or "important." Let counts and topics speak for themselves (e.g., "This section covers eight papers on..." rather than "eight critical papers...").

**Risk Watch**: Use exactly two subheadings: **Increased Risks** and **Decreased Risks**. No other subheadings. For each item, state the concrete risk or mitigation in one sentence. Every claim or development cited must link to its source.

Keep it concise - this is an executive summary. Do not omit links to save space — links are essential.

SECTIONS:
${sections}`;
}

export function weeklyRollupPrompt(dailies: string, dateRange: string, lang: Lang = "en"): string {
  return `${SYSTEM_ROLE}

This covers the week of ${dateRange}. Below are the daily digests from the past week. Create a comprehensive weekly summary in ${lang === "fr" ? "French" : "English"}.

Style rules (apply to ALL sections):
- Use plain, neutral language. Do not editorialize.
- Do not use evaluative adjectives like "critical," "key," "groundbreaking," "important," "significant," "concerning," "unprecedented," or "fundamental."
- Do not use framing phrases like "marked turning points," "several critical turning points," "represents the first…," "…largest…to date," "paradigm shift," or "watershed."
- Do not use superlatives ("first," "largest," "most," etc.) unless they appear in the linked source's own language; if so, attribute them.
- Example — bad: "The week marked several critical turning points in AI safety, with concerning revelations about fundamental gaps." Good: "This week's digests covered evaluation methodology, autonomous cyber capabilities, and US–China compute policy."

Structure:
1. **Week in Review**: 3-5 paragraphs covering the most important developments. Every paper, article, blog post, or discussion mentioned must include an inline markdown link to the original source.
2. **Key Papers**: The most significant research papers of the week. Each paper title must be a hyperlink. Each entry should be 2-3 sentences followed by one sentence explaining why the result matters — do not split implications by audience.
3. **Industry Moves**: Notable actions by AI companies related to safety. What should other organizations learn or anticipate?
4. **Policy & Governance**: Regulatory or governance developments. What do organizations need to prepare for or comply with?
5. **Community Highlights**: Important discussions or community developments.

Format as clean Markdown.  Do not omit links to save space — links are essential.

DAILY DIGESTS:
${dailies}`;
}
