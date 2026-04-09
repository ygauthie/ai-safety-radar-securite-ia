import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { createProvider } from "./providers/index.js";
import type { LlmProvider } from "./providers/types.js";

let provider: LlmProvider | null = null;

// Simple concurrency limiter
const MAX_CONCURRENT = 3;
let running = 0;
const queue: Array<() => void> = [];

function acquireSlot(): Promise<void> {
  if (running < MAX_CONCURRENT) {
    running++;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    queue.push(() => {
      running++;
      resolve();
    });
  });
}

function releaseSlot(): void {
  running--;
  const next = queue.shift();
  if (next) next();
}

export async function generateReport(
  prompt: string,
  maxTokens = 4096,
  retries = 3
): Promise<string> {
  if (!provider) provider = createProvider();

  await acquireSlot();
  try {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await provider.summarize(prompt, maxTokens);
      } catch (e) {
        console.error(`LLM attempt ${attempt}/${retries} failed:`, e);
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
        }
      }
    }
    return "*Report generation failed after retries.*";
  } finally {
    releaseSlot();
  }
}

export function saveReport(date: string, filename: string, content: string): string {
  const dir = join(process.cwd(), "digests");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  // Flat structure: digests/YYYY-MM-DD-safety-source.md
  const name = filename.replace(/^safety-/, `${date}-safety-`);
  const path = join(dir, name);
  writeFileSync(path, content, "utf-8");
  console.log(`Saved: ${path}`);
  return path;
}
