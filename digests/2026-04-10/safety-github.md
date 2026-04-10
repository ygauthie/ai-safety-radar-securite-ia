# GitHub Activity (2026-04-10)

## Key Discussions

### Agent Safety and Verification

A critical safety discussion is emerging in Anthropic's cookbook around [output verification before agent actions](https://github.com/anthropics/claude-cookbooks/issues/518). The issue highlights a gap in the new Managed Agents architecture - while human-in-the-loop approval gates exist, there's no cookbook example for automated verification gates to check agent output before execution. This represents an important practical safety consideration as autonomous agents become more capable.

Anthropic is also addressing [prompt injection defenses](https://github.com/anthropics/claude-cookbooks/pull/456) with a comprehensive cookbook covering input validation, pattern-based detection, and LLM harmlessness screening for RAG systems and tool-using agents - a crucial safety layer as these systems become more widely deployed.

### Model Reliability and Evaluation Issues

Several concerning reliability issues have emerged across different model families:

- Google's Gemma 4 26B shows [systematic misanalysis of crash dumps](https://github.com/google-deepmind/gemma/issues/621), consistently misidentifying benign environment warnings as crash root causes in WinDbg output
- A Samsung A55 deployment of Gemma [produces endless repetitive output](https://github.com/google-deepmind/gemma/issues/614) ("over" repeatedly) regardless of prompt input
- OpenAI's mathematical reasoning capabilities show [significant hallucination issues](https://github.com/openai/openai-cookbook/pull/2599), prompting new toolkits for deterministic computation routing

### Evaluation Framework Improvements

The LM Evaluation Harness is addressing several technical issues that could affect safety evaluations:

- [Fixed incorrect median aggregation](https://github.com/EleutherAI/lm-evaluation-harness/pull/3668) that was returning wrong values for unsorted inputs
- [Corrected GPQA preprocessing](https://github.com/EleutherAI/lm-evaluation-harness/pull/3691) that was corrupting chemical nomenclature and mathematical expressions through overly aggressive bracket-stripping
- [Fixed MMLU Pro few-shot contamination](https://github.com/EleutherAI/lm-evaluation-harness/pull/3693) where reasoning was leaking into user prompts under chat templates

## Emerging Tools

### Agent Development Frameworks

Anthropic's cookbook has introduced several new agent patterns:

- [Self-improving agents with structured reflection](https://github.com/anthropics/claude-cookbooks/pull/469) - implementing a four-phase improvement cycle (execute, evaluate, reflect, improve)
- [Multi-agent pipelines with state handoffs](https://github.com/anthropics/claude-cookbooks/pull/517) - demonstrating planner → worker → reviewer architectures with state machines and auto-retry
- [Native Python MCP client integration](https://github.com/anthropics/claude-cookbooks/pull/499) for connecting Claude to Model Context Protocol servers

### Safety-Focused Evaluation Tools

New evaluation capabilities include:

- [Instruction dilution evaluation notebook](https://github.com/anthropics/claude-cookbooks/pull/454) demonstrating how reasoning frameworks can collapse from ~100% accuracy to 0-30% in complex production prompts
- [Mathematical hallucination elimination toolkit](https://github.com/openai/openai-cookbook/pull/2599) using SymPy for deterministic computation
- [Native Tensor Parallelism support](https://github.com/EleutherAI/lm-evaluation-harness/pull/3692) for HuggingFace backend, enabling more efficient large-scale safety evaluations

### Interpretability Infrastructure

TransformerLens is rapidly expanding model architecture support with new adapters for [Qwen 3.5](https://github.com/TransformerLensOrg/TransformerLens/pull/1244), [CodeGen](https://github.com/TransformerLensOrg/TransformerLens/pull/1242), [Falcon](https://github.com/TransformerLensOrg/TransformerLens/pull/1241), and [DeepSeek v3](https://github.com/TransformerLensOrg/TransformerLens/pull/1240). They've also introduced an [architecture relevancy testing system](https://github.com/TransformerLensOrg/TransformerLens/pull/1243) to prioritize which model architectures should receive interpretability tooling support based on downloads, model counts, and complexity metrics.