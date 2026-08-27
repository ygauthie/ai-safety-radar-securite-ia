# Research Papers (2026-08-27)

## Key Papers

### AI Safety and Security Frameworks

**[LMSM: LLM Security Framework Inspired by Linux Security Modules](https://arxiv.org/abs/2608.25697v1)** presents a unified security architecture for LLMs based on Linux Security Modules principles. The framework decouples security signals from policy enforcement, allowing interpretability methods to be systematically integrated into production safety systems. This work addresses the critical gap between AI safety research and deployable security infrastructure.

**[A Self-Evolving Multi-Agent Framework Defense against LLM Jailbreak Attacks](https://arxiv.org/abs/2608.26008v1)** introduces a dynamic defense system where multiple specialized agents collaborate to detect and counter jailbreak attempts in real-time. Unlike static defenses, this framework accumulates defensive experience and adapts to novel attack strategies through self-evolution. This represents a significant advancement toward adaptive AI safety systems that can keep pace with evolving attack methods.

**[SkillShield: Prompt-Space Security Skills for LLM Coding Agents](https://arxiv.org/abs/2608.25817v1)** tackles security risks in code generation agents through system-prompt defenses that synthesize security skills directly into the model's reasoning process. This approach addresses the vulnerability of coding agents that operate with developer privileges and could translate malicious requests into harmful code or malware.

### AI Reliability and Alignment

**[From Passive Response to Proactive Correction: Enhancing LLM Robustness Against Input Fact Perturbations](https://arxiv.org/abs/2608.25894v1)** introduces DEDUCE, a framework that transforms LLMs from passive responders into proactive error correctors when faced with misleading premises. The work addresses a critical vulnerability where LLMs produce confident but incorrect responses to factually flawed inputs. This is essential for deployment in high-stakes environments where input quality cannot be guaranteed.

**[When Pruning Meets Interpretability: Preserving Sparse Autoencoder Robustness in LLMs](https://arxiv.org/abs/2608.25941v1)** systematically studies how model compression affects interpretability tools, revealing that magnitude pruning can distort sparse autoencoder behavior by ignoring activation geometry. The research provides both theoretical analysis through perturbation energy and practical solutions for maintaining interpretability in compressed models.

**[Reflection Steering: Disentangling Reflection from Reasoning in Activation Space for Token-Efficient Inference](https://arxiv.org/abs/2608.25542v1)** addresses the token efficiency problem in reasoning models that produce unnecessary reflection tokens. By disentangling reflection from core reasoning in activation space, this training-free approach optimizes the accuracy-efficiency trade-off without requiring additional model training.

### Governance and Risk Assessment

**[Non-Great-Power Conflict and AI Risk](https://arxiv.org/abs/2608.25839v1)** challenges the field's focus on great power conflicts by systematically evaluating AI risks in non-great-power conflicts, including civil wars, proxy conflicts, and nonstate actor involvement. This work fills a critical gap in AI governance research by examining how AI systems might contribute to or be affected by diverse conflict scenarios beyond superpower confrontations.

**[AI Slop and Hallucinations in Vulnerability Assessment: A Survey on Reasoning Failures and Trustworthy Mitigation](https://arxiv.org/abs/2608.25667v1)** documents the proliferation of "AI slop" in cybersecurity applications—hallucinated vulnerabilities and incorrect patches that create cognitive burden similar to denial-of-service attacks. The paper provides empirical evidence of how AI-generated misinformation in security contexts poses systemic risks to human triage systems.

### Advanced AI Capabilities and Control

**[Using profiles of cognitive capability to assess AI suitability for workplace tasks](https://arxiv.org/abs/2608.25623v1)** introduces a framework for matching AI capabilities to specific tasks through cognitive capability profiling, addressing the critical deployment question of where AI should and shouldn't be used. This provides a systematic alternative to aggregate benchmarks that often fail to predict real-world performance on specific tasks.

**[Repair or Resample? Rethinking Failure Debugging in LLM Multi-Agent Systems](https://arxiv.org/abs/2608.25920v1)** questions whether existing debugging methods for LLM-based multi-agent systems actually repair failures causally or merely succeed through randomness. The research addresses reliability bottlenecks in deploying multi-agent systems for complex, long-horizon tasks where failure diagnosis and genuine repair are critical.