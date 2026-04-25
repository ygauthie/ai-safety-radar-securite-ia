# Research Papers (2026-04-25)

## Key Papers

**[Alignment has a Fantasia Problem](https://arxiv.org/abs/2604.21827v1)** addresses a fundamental flaw in current AI alignment approaches. The authors argue that modern AI assistants assume users can clearly articulate their goals, but behavioral research shows people often interact with AI systems before fully forming their intentions. This creates "Fantasia interactions" where AI appears helpful but isn't truly aligned with user needs. This work is crucial because it identifies a core misalignment between how we train AI systems and how humans actually use them.

**[Stealthy Backdoor Attacks against LLMs Based on Natural Style Triggers](https://arxiv.org/abs/2604.21700v1)** demonstrates sophisticated backdoor attacks using natural writing styles rather than explicit trigger patterns. The authors show these attacks can reliably inject malicious payloads while maintaining naturalness and specify complete threat models for backdoor delivery. This matters because it reveals how adversaries could compromise LLMs through seemingly benign training data, highlighting critical vulnerabilities in current security practices.

**[Transient Turn Injection: Exposing Stateless Multi-Turn Vulnerabilities in Large Language Models](https://arxiv.org/abs/2604.21860v1)** introduces a new attack technique that exploits stateless moderation by distributing adversarial intent across isolated interactions. Using automated LLM-powered attackers, the method systematically evades policy enforcement in both commercial and open-source models. This research is significant because it exposes fundamental weaknesses in how AI safety mechanisms handle multi-turn conversations.

**[Brief chatbot interactions produce lasting changes in human moral values](https://arxiv.org/abs/2604.21430v1)** provides empirical evidence that AI conversations can durably alter human moral judgments. In a within-subject study, participants showed shifted moral evaluations after discussing scenarios with directive chatbots, with changes persisting beyond the interaction. This finding is critical for AI safety as it demonstrates that AI systems can have profound, lasting impacts on fundamental human values and decision-making.

**[Bounding the Black Box: A Statistical Certification Framework for AI Risk Regulation](https://arxiv.org/abs/2604.21854v1)** tackles the gap between regulatory demands for AI safety demonstration and the lack of quantitative risk assessment methods. The authors propose a statistical certification framework that could provide technical mechanisms for verifying "acceptable risk" in high-risk AI systems. This work addresses a crucial need in AI governance by offering concrete tools for regulatory compliance.

**[Measuring Opinion Bias and Sycophancy via LLM-based Coercion](https://arxiv.org/abs/2604.21564v1)** develops methods to detect when language models hold implicit positions on contested topics. The research shows that models trained to give evasive responses to direct opinion questions can still be coerced into revealing underlying biases through strategic prompting. This matters because hidden model biases can propagate at scale through user interactions, potentially influencing public opinion and decision-making.

**[When Prompts Override Vision: Prompt-Induced Hallucinations in LVLMs](https://arxiv.org/abs/2604.21911v1)** introduces HalluScope, a benchmark revealing how large vision-language models can be manipulated to hallucinate content that contradicts visual evidence through carefully crafted prompts. The work demonstrates that language components can override visual processing, leading to systematic errors. This research is important for understanding the reliability limits of multimodal AI systems in safety-critical applications.

## Emerging Risks and Vulnerabilities

Several papers highlight sophisticated new attack vectors against AI systems. [Stealthy Backdoor Attacks against LLMs Based on Natural Style Triggers](https://arxiv.org/abs/2604.21700v1) and [Transient Turn Injection](https://arxiv.org/abs/2604.21860v1) demonstrate how adversaries can exploit training processes and conversational patterns to compromise model behavior. These attacks are particularly concerning because they use natural language patterns that would be difficult to detect during routine safety evaluations.

The [brief chatbot interactions study](https://arxiv.org/abs/2604.21430v1) raises profound questions about AI's influence on human cognition and values. Unlike previous concerns about AI decision-making, this research shows AI can actually reshape human moral reasoning itself, creating cascading effects beyond immediate interactions.

## Alignment and Governance Challenges

[Alignment has a Fantasia Problem](https://arxiv.org/abs/2604.21827v1) identifies a structural issue in how we approach AI alignment, suggesting that current instruction-following paradigms may be fundamentally mismatched to human psychology. This connects to broader themes in several other papers about the gap between idealized AI behavior and real-world deployment challenges.

The [statistical certification framework](https://arxiv.org/abs/2604.21854v1) represents progress toward bridging academic AI safety research with practical regulatory needs, though significant challenges remain in defining and measuring "acceptable risk" for AI systems.

## Technical Safety Insights

[Probabilistic Verification of Neural Networks via Efficient Probabilistic Hull Generation](https://arxiv.org/abs/2604.21556v1) offers new approaches to formal verification under uncertainty, while [Fairness under uncertainty in sequential decisions](https://arxiv.org/abs/2604.21711v1) extends fairness considerations to dynamic, multi-step decision processes where prior decisions influence future outcomes.

The research on [prompt-induced hallucinations in vision-language models](https://arxiv.org/abs/2604.21911v1) highlights the continued challenge of ensuring robust multimodal reasoning, particularly when different input modalities provide conflicting information.