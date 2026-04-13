import type { Lang } from "./i18n.js";

const SYSTEM_ROLE = `You are an expert AI safety analyst. Your role is to synthesize AI safety developments into clear, insightful digests for researchers, policymakers, and practitioners. Focus on implications for AI safety, alignment, governance, and risk.

IMPORTANT formatting rules:
- Do NOT include a top-level heading (# title). The page title is provided separately.
- Start directly with ## subsections or content.
- ALWAYS hyperlink to original sources. Every paper, article, blog post, repo, or discussion you mention must include a markdown link to the original URL. Use inline links like [Title](url).`;

export function arxivPrompt(data: string, date: string, lang: Lang = "en"): string {
  return `${SYSTEM_ROLE}

Today is ${date}. Below are recent ArXiv papers related to AI safety.

Analyze these papers and produce a structured digest in ${lang === "fr" ? "French" : "English"}:

1. **Key Papers**: Highlight the 5-10 most significant papers with a 2-3 sentence summary of each, focusing on their implications for AI safety.
2. **Trends**: Identify emerging themes or research directions.

Format as clean Markdown. Include paper titles as links.

DATA:
${data}`;
}

export function githubPrompt(data: string, date: string, lang: Lang = "en"): string {
  return `${SYSTEM_ROLE}

Today is ${date}. Below is recent GitHub activity from AI safety-related repositories.

Produce a structured digest in ${lang === "fr" ? "French" : "English"}:

1. **Notable Releases**: Any new versions or significant releases.
2. **Key Discussions**: Important issues or PRs related to safety, alignment, or governance.
3. **Emerging Tools**: New tools or frameworks relevant to AI safety practitioners.

Format as clean Markdown with links.

DATA:
${data}`;
}

export function rssPrompt(data: string, date: string, lang: Lang = "en"): string {
  return `${SYSTEM_ROLE}

Today is ${date}. Below are recent blog posts, articles, and new publications from AI safety-focused sources and major AI organizations (Anthropic, OpenAI, DeepMind, Apollo Research, Epoch AI, etc.).

Produce a structured digest in ${lang === "fr" ? "French" : "English"}:

1. **Top Stories**: The 3-5 most important articles or publications with summaries.
2. **Key Arguments**: Notable positions or arguments made.
3. **Community Discussion**: Any debates or disagreements worth noting.

Format as clean Markdown with links to original articles.

DATA:
${data}`;
}

export function webPrompt(data: string, date: string, lang: Lang = "en"): string {
  return `${SYSTEM_ROLE}

Today is ${date}. Below are new publications from major AI organizations (Anthropic, OpenAI, DeepMind, etc.).

Produce a structured digest in ${lang === "fr" ? "French" : "English"}:

1. **Organization Updates**: Group by organization. Summarize each new publication.
2. **Safety Implications**: For each update, note any AI safety relevance.
3. **Cross-Organization Themes**: Any common themes across organizations.

Format as clean Markdown with links.

DATA:
${data}`;
}

export function hnPrompt(data: string, date: string, lang: Lang = "en"): string {
  return `${SYSTEM_ROLE}

Today is ${date}. Below are recent Hacker News discussions related to AI safety.

Produce a structured digest in ${lang === "fr" ? "French" : "English"}:

1. **Hot Topics**: The top 5 most discussed stories with context.
2. **Community Sentiment**: General tone and notable perspectives.
3. **Links Worth Reading**: Stories that link to particularly valuable content.

Format as clean Markdown with links.

DATA:
${data}`;
}

export function aisiPrompt(data: string, date: string, lang: Lang = "en"): string {
  return `${SYSTEM_ROLE}

Today is ${date}. Below is recent activity from national AI Safety Institutes around the world (US AISI/NIST, UK AISI, Canada CAISI, Japan J-AISI, Singapore AISI, European AI Office, Korea AISI).

Produce a structured digest in ${lang === "fr" ? "French" : "English"}:

1. **Institute Updates**: Group by institute. Summarize any new publications, announcements, guidelines, or policy actions.
2. **Cross-Institute Themes**: Common priorities or coordinated efforts across institutes.
3. **Policy Implications**: How these developments affect global AI safety governance.

Format as clean Markdown with links to original sources.

DATA:
${data}`;
}

export function journalPrompt(data: string, date: string, lang: Lang = "en"): string {
  return `${SYSTEM_ROLE}

Today is ${date}. Below are recent articles from peer-reviewed scientific and AI journals that are relevant to AI safety.

Produce a structured digest in ${lang === "fr" ? "French" : "English"}:

1. **Key Articles**: Highlight the most significant articles with a 2-3 sentence summary of each, focusing on methodology, findings, and implications for AI safety.

Format as clean Markdown with links to original articles.

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

When selecting the Top 3 Developments and Risk Watch items, not all sources carry equal weight. Apply the following principles:

- **Highest priority**: AISI Updates — official government AI Safety Institute publications and policy actions always take precedence.
- **Lowest priority**: GitHub Activity — only surface if exceptionally significant.
- **Everything in between**: Rank by a combination of source credibility and the consequentiality of the findings. A peer-reviewed result in Nature or Science carries more weight than an ArXiv preprint on the same topic, which carries more weight than a blog post. But a highly consequential finding from a credible lab's blog (e.g. Anthropic, Apollo Research, METR) may outrank a minor journal article. Prioritize developments that are both credible and impactful for AI safety.

Structure:
1. **Top 3 Developments**: The single most important things that happened today in AI safety. Each item must include at least one inline markdown link to the original source.
2. **Section Summaries**: A 1-2 sentence summary of each section. Every specific paper, article, post, tool, or organization mentioned must be hyperlinked to its original URL using inline markdown links.
3. **Risk Watch**: Any developments that signal increased or decreased AI risk. Every claim or development cited must link to its source.

Keep it concise - this is an executive summary. Format as clean Markdown. Do not omit links to save space — links are essential.

SECTIONS:
${sections}`;
}

export function weeklyRollupPrompt(dailies: string, dateRange: string, lang: Lang = "en"): string {
  return `${SYSTEM_ROLE}

This covers the week of ${dateRange}. Below are the daily digests from the past week. Create a comprehensive weekly summary in ${lang === "fr" ? "French" : "English"}.

Structure:
1. **Week in Review**: 3-5 paragraph overview of the most important developments.
2. **Key Papers**: The most significant research papers of the week.
3. **Industry Moves**: Notable actions by AI companies related to safety.
4. **Policy & Governance**: Any regulatory or governance developments.
5. **Community Highlights**: Important discussions or community developments.
6. **Looking Ahead**: What to watch for next week.

Format as clean Markdown.  Do not omit links to save space — links are essential.

DAILY DIGESTS:
${dailies}`;
}
