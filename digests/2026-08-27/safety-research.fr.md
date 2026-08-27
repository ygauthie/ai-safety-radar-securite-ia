# Documents de recherche (2026-08-27)

## Documents clés

### Cadres de sécurité et de sûreté de l'IA

**[LMSM: LLM Security Framework Inspired by Linux Security Modules](https://arxiv.org/abs/2608.25697v1)** présente une architecture de sécurité unifiée pour les LLM basée sur les principes des modules de sécurité Linux. Le cadre découple les signaux de sécurité de l'application des politiques, permettant d'intégrer systématiquement les méthodes d'interprétabilité dans les systèmes de sûreté de production. Ce travail comble l'écart critique entre la recherche en sécurité de l'IA et l'infrastructure de sécurité déployable.

**[A Self-Evolving Multi-Agent Framework Defense against LLM Jailbreak Attacks](https://arxiv.org/abs/2608.26008v1)** introduit un système de défense dynamique où plusieurs agents spécialisés collaborent pour détecter et contrer les tentatives de jailbreak en temps réel. Contrairement aux défenses statiques, ce cadre accumule l'expérience défensive et s'adapte aux nouvelles stratégies d'attaque par auto-évolution. Ceci représente une avancée significative vers des systèmes de sécurité d'IA adaptatifs qui peuvent suivre le rythme des méthodes d'attaque évolutives.

**[SkillShield: Prompt-Space Security Skills for LLM Coding Agents](https://arxiv.org/abs/2608.25817v1)** s'attaque aux risques de sécurité dans les agents de génération de code par des défenses au niveau des prompts système qui synthétisent les compétences de sécurité directement dans le processus de raisonnement du modèle. Cette approche traite la vulnérabilité des agents de codage qui opèrent avec des privilèges de développeur et pourraient traduire des requêtes malveillantes en code nuisible ou malware.

### Fiabilité et alignement de l'IA

**[From Passive Response to Proactive Correction: Enhancing LLM Robustness Against Input Fact Perturbations](https://arxiv.org/abs/2608.25894v1)** introduit DEDUCE, un cadre qui transforme les LLM de répondeurs passifs en correcteurs d'erreurs proactifs face à des prémisses trompeuses. Le travail traite une vulnérabilité critique où les LLM produisent des réponses confiantes mais incorrectes à des entrées factuellement défaillantes. Ceci est essentiel pour le déploiement dans des environnements à enjeux élevés où la qualité des entrées ne peut être garantie.

**[When Pruning Meets Interpretability: Preserving Sparse Autoencoder Robustness in LLMs](https://arxiv.org/abs/2608.25941v1)** étudie systématiquement comment la compression de modèle affecte les outils d'interprétabilité, révélant que l'élagage par magnitude peut déformer le comportement des autoencodeurs parses en ignorant la géométrie des activations. La recherche fournit à la fois une analyse théorique par l'énergie de perturbation et des solutions pratiques pour maintenir l'interprétabilité dans les modèles compressés.

**[Reflection Steering: Disentangling Reflection from Reasoning in Activation Space for Token-Efficient Inference](https://arxiv.org/abs/2608.25542v1)** traite le problème d'efficacité de tokens dans les modèles de raisonnement qui produisent des tokens de réflexion inutiles. En démêlant la réflexion du raisonnement central dans l'espace d'activation, cette approche sans entraînement optimise le compromis précision-efficacité sans nécessiter d'entraînement de modèle supplémentaire.

### Gouvernance et évaluation des risques

**[Non-Great-Power Conflict and AI Risk](https://arxiv.org/abs/2608.25839v1)** remet en question la focalisation du domaine sur les conflits entre grandes puissances en évaluant systématiquement les risques d'IA dans les conflits non-grandes puissances, incluant les guerres civiles, conflits par procuration et implication d'acteurs non-étatiques. Ce travail comble un écart critique dans la recherche en gouvernance de l'IA en examinant comment les systèmes d'IA pourraient contribuer ou être affectés par divers scénarios de conflit au-delà des confrontations entre superpuissances.

**[AI Slop and Hallucinations in Vulnerability Assessment: A Survey on Reasoning Failures and Trustworthy Mitigation](https://arxiv.org/abs/2608.25667v1)** documente la prolifération de "AI slop" dans les applications de cybersécurité—vulnérabilités hallucinées et correctifs incorrects qui créent une charge cognitive similaire aux attaques par déni de service. L'article fournit des preuves empiriques de comment la désinformation générée par l'IA dans les contextes de sécurité pose des risques systémiques aux systèmes de triage humain.

### Capacités avancées d'IA et contrôle

**[Using profiles of cognitive capability to assess AI suitability for workplace tasks](https://arxiv.org/abs/2608.25623v1)** introduit un cadre pour associer les capacités d'IA à des tâches spécifiques par le profilage de capacité cognitive, traitant la question critique de déploiement de où l'IA devrait et ne devrait pas être utilisée. Ceci fournit une alternative systématique aux benchmarks agrégés qui échouent souvent à prédire les performances du monde réel sur des tâches spécifiques.

**[Repair or Resample? Rethinking Failure Debugging in LLM Multi-Agent Systems](https://arxiv.org/abs/2608.25920v1)** questionne si les méthodes de débogage existantes pour les systèmes multi-agents basés sur LLM réparent réellement les échecs de manière causale ou réussissent simplement par hasard. La recherche traite les goulots d'étranglement de fiabilité dans le déploiement de systèmes multi-agents pour des tâches complexes à horizon long où le diagnostic d'échec et la réparation authentique sont critiques.