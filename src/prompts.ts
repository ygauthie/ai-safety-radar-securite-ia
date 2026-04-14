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

1. **Key Papers**: Highlight the 5-10 most significant papers. Lead with peer-reviewed articles when available — they take precedence over preprints on the same topic. Each summary should be 2-3 sentences and conclude with what this means for AI safety practitioners building safer systems or policymakers crafting regulation.
2. **Trends**: Identify emerging themes or research directions across both preprints and published work.

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

Produce a unified analysis & policy digest in ${lang === "fr" ? "French" : "English"}:

1. **Top Stories**: The 3-5 most important articles or publications from labs, research orgs, and expert commentators. Each summary should end with what this means for practitioners deploying AI systems or policymakers shaping governance.
2. **Policy & Governance**: Any AISI updates, regulatory developments, or think tank publications. For each, note concrete implications — what practitioners may need to comply with, prepare for, or adopt. If no policy updates exist today, omit this subsection.
3. **Key Arguments**: Notable positions or arguments made, and what they imply for the field.

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

1. **Key Discussions**: The top 3-5 most discussed stories on Hacker News or important GitHub issues/PRs. Summarize the discussion and why it matters.
2. **Notable GitHub Releases & Tools**: New versions or significant releases from GitHub repositories. For each, note what it enables practitioners to do that they couldn't before. Include new tools or frameworks, stating who should use them and for what.
3. **Community Sentiment**: General tone and notable perspectives across HN and GitHub.

Format as clean Markdown with links.

DATA:
${data}`;
}

export function translationPrompt(content: string): string {
  return `You are a professional translator specializing in AI safety, technology policy, and research. Translate the following Markdown document from English to French.

Rules:
- Preserve all Markdown formatting exactly (headings, bold, links, bullet points, code spans, etc.)
- Keep all URLs and hyperlinks unchanged
- Translate headings and titles fully, including document titles like "Daily Brief" → "Bulletin quotidien" and "AI Safety Weekly Digest" → "Résumé hebdomadaire sur la sécurité de l'IA"
- Keep technical terms in English when they are widely used as-is in French AI safety discourse (e.g. "alignment", "red teaming", "benchmarks", "fine-tuning", "RLHF")
- Translate naturally and fluently — do not translate word for word
- Do not add any commentary, preamble, or explanation — output only the translated Markdown

CONTENT:
${content}`;
}

export function dailyRollupPrompt(sections: string, date: string, lang: Lang = "en"): string {
  return `${SYSTEM_ROLE}

Today is ${date}. Below are the individual section digests for today. Create a unified daily executive summary in ${lang === "fr" ? "French" : "English"}.

Each source section below is tagged with a credibility tier. When selecting Top Developments and Risk Watch items, weight by tier:

- **Tier 1 (Institutional/Peer-reviewed)**: Government AISIs, peer-reviewed journals (Nature, Science, PNAS), established think tanks (RAND, Georgetown CSET), International AI Safety Report. Highest credibility — prioritize these.
- **Tier 2 (Established Research & Expert Analysis)**: AI lab blogs (Anthropic, OpenAI, DeepMind), safety research orgs (METR, ARC, MIRI, Apollo, Epoch), expert newsletters (Import AI, AI Snake Oil, Interconnects, Zvi, etc.), Alignment Forum, ArXiv preprints. High credibility — a highly consequential Tier 2 finding can outrank a minor Tier 1 item.
- **Tier 3 (Community & General Discussion)**: LessWrong, Hacker News, GitHub activity. Lower credibility — only surface if exceptionally significant.

Structure:
1. **Top 3 Developments**: The most important things that happened today in AI safety. Each item must include at least one inline markdown link to the original source, and state why it matters — what should practitioners building AI systems or policymakers crafting regulation take away from this?
2. **Section Summaries**: A 1-2 sentence summary of each section, written as separate paragraphs (one per section). Bold the section name at the start of each paragraph (e.g. **Research Papers:**). Every specific paper, article, post, tool, or organization mentioned must be hyperlinked to its original URL using inline markdown links.
3. **Risk Watch**: Any developments that signal increased or decreased AI risk. Use exactly two subheadings: **Increased Risks** and **Decreased Risks**. No other subheadings. For each item, state the concrete risk or mitigation and who is affected. Every claim or development cited must link to its source.

Keep it concise - this is an executive summary. Format as clean Markdown. Do not omit links to save space — links are essential.

SECTIONS:
${sections}`;
}

export function weeklyRollupPrompt(dailies: string, dateRange: string, lang: Lang = "en"): string {
  return `${SYSTEM_ROLE}

This covers the week of ${dateRange}. Below are the daily digests from the past week. Create a comprehensive weekly summary in ${lang === "fr" ? "French" : "English"}.

Structure:
1. **Week in Review**: 3-5 paragraph overview of the most important developments and what they mean for the field.
2. **Key Papers**: The most significant research papers of the week, with implications for practitioners and policymakers.
3. **Industry Moves**: Notable actions by AI companies related to safety. What should other organizations learn or anticipate?
4. **Policy & Governance**: Regulatory or governance developments. What do organizations need to prepare for or comply with?
5. **Community Highlights**: Important discussions or community developments.
6. **Looking Ahead**: What to watch for next week, and what practitioners and policymakers should be preparing for.

Format as clean Markdown.  Do not omit links to save space — links are essential.

DAILY DIGESTS:
${dailies}`;
}
