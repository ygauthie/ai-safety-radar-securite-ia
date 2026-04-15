import OpenAI from "openai";
import type { LlmProvider } from "./types.js";

export class OpenRouterProvider implements LlmProvider {
  private client: OpenAI;
  private model: string;

  constructor() {
    this.client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "https://github.com/ygauthie/ai-safety-radar-securite-ia",
        "X-Title": "AI Safety Daily Brief",
      },
    });
    this.model = process.env.LLM_MODEL || "anthropic/claude-sonnet-4";
  }

  async summarize(prompt: string, maxTokens = 4096): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0]?.message?.content || "";
  }
}
