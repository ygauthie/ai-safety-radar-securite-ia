# Research Papers (2026-08-26)

## Key Papers

### Safety and Alignment Research

[**The Invisible Editorial Layer: Formalizing Undisclosed Inference-Time Steering**](https://arxiv.org/abs/2608.24662v1) introduces a critical framework for understanding how deployed LLMs may systematically modify probability distributions before token selection, creating hidden control mechanisms between model weights and observed outputs. The paper formalizes this "invisible editorial layer" and discusses implications for transparency and attribution in real-world deployments. This matters because it reveals how inference-time interventions can create gaps between what we think models are doing and what they actually output.

[**SteerCheck: Attribution Specificity and Alignment Leakage in Activation-Steering Audits**](https://arxiv.org/abs/2608.24335v1) presents a preregistered attribution audit framework that evaluates whether activation steering effects are specific to intended concepts or leak into unrelated behaviors. Through 960 interventions on Qwen3-14B, the study reveals that common control methods have complementary limitations, with isotropic directions occupying narrow regions while sign-randomized controls often retain substantial effects. This research provides essential methodology for validating steering interventions in AI safety applications.

[**RecurSE: Bounded Recursive Self-Evaluation for LLM Rubric Judges**](https://arxiv.org/abs/2608.24231v1) develops a closed-loop system where models use their own evaluative capabilities to generate learning signals for optimization, eliminating external supervision from reward learning. The approach demonstrates how LLMs can recursively improve their judgment capabilities through self-evaluation. This represents a significant step toward autonomous self-improvement in AI systems, with important implications for both capability development and safety oversight.

### Interpretability and Mechanistic Understanding

[**Beyond Static Interpretability: Anticipating Post-SFT Mechanisms from Pre-SFT Parameters**](https://arxiv.org/abs/2608.24482v1) addresses a fundamental challenge in mechanistic interpretability: how neurons identified before supervised fine-tuning (SFT) differ from those governing behavior after SFT. The work introduces "Mechanistic Localization" to bridge this gap by predicting post-training mechanisms from pre-training parameters. This is crucial for making mechanistic interpretability practical for understanding fine-tuned models used in deployment.

[**Mechanistic Circuit Identification for Controllable Data Generation**](https://arxiv.org/abs/2608.24065v1) proposes a framework connecting training-dynamics-based data valuation with mechanistic interpretability to move beyond heuristic prompt-based data generation. The approach conceptualizes data quality along complementary dimensions and uses circuit-level insights to guide synthesis. This bridges the gap between mechanistic understanding and practical data curation for training safer AI systems.

### Security and Robustness

[**What Guides the Agent? Adjudicating Unauthorized Behavior via Localizing Behavior-Guiding Instructions**](https://arxiv.org/abs/2608.24022v1) tackles injection attacks where untrusted external data gets parsed as behavior-guiding instructions during LLM agent inference. The paper develops methods to localize where in the context unauthorized instructions emerge and influence agent decisions. This addresses a critical vulnerability in LLM agents that integrate with external resources, providing tools for detecting dynamic prompt injection attacks.

[**FraudBench: Protocol-Sensitive Benchmarking of Adversarial Robustness for Financial Risk Assessment**](https://arxiv.org/abs/2608.24551v1) argues that robustness evaluation in financial ML depends not just on model architecture but on evaluation protocols, particularly how domain constraints and attacker capabilities are modeled. The benchmark reveals that different constraint enforcement methods can lead to substantially different robustness assessments. This highlights the need for standardized, domain-aware robustness evaluation in high-stakes applications.

### Evaluation and Testing

[**A Judge Should Know What Changed: Construct Validity for LLM-as-a-Judge Evaluation**](https://arxiv.org/abs/2608.24419v1) formalizes construct validity for LLM evaluators through a two-dimensional framework measuring invariance under construct-preserving edits and sensitivity to construct-changing edits. The work shows these dimensions are independent and that scalar summaries cannot preserve their relationship. This provides essential theoretical grounding for validating automated evaluation systems increasingly used in AI safety research.

[**OmniJudge or OmniBias? Diagnosing Multimodal Judges through Balanced, Decoupled Lenses**](https://arxiv.org/abs/2608.24160v1) introduces diagnostic tools for multimodal evaluation models used as "OmniJudges" across text-to-image, text-to-video, and text-to-speech generation. The research reveals that existing benchmarks overemphasize positive examples and conflate failure modes, allowing judges to score well without recognizing failures. This work is crucial for ensuring reliable automated evaluation of generative AI systems across modalities.

### Uncertainty and Risk Assessment

[**When Do Supervised UQ Ensembles Improve LLM Hallucination Detection? A Robustness Study**](https://arxiv.org/abs/2608.24492v1) investigates the robustness of uncertainty quantification ensembles for detecting LLM hallucinations in closed-book settings. The study finds that supervised ensembles can improve detection but their effectiveness varies significantly across domains and prompt variations. This research provides practical guidance for deploying uncertainty-based hallucination detection in real-world applications where reliability is paramount.