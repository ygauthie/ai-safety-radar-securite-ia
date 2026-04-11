# Activité GitHub (2026-04-10)

## Discussions Clés

### Sécurité des Agents et Vérification

Une discussion critique sur la sécurité émerge dans le cookbook d'Anthropic autour de la [vérification des sorties avant les actions d'agent](https://github.com/anthropics/claude-cookbooks/issues/518). Le problème souligne une lacune dans la nouvelle architecture Managed Agents - bien que des verrous d'approbation humaine existent, il n'y a pas d'exemple de cookbook pour des verrous de vérification automatisés qui vérifient la sortie de l'agent avant l'exécution. Ceci représente une considération de sécurité pratique importante alors que les agents autonomes deviennent plus capables.

Anthropic s'attaque également aux [défenses contre l'injection de prompts](https://github.com/anthropics/claude-cookbooks/pull/456) avec un cookbook complet couvrant la validation d'entrée, la détection basée sur des motifs, et le filtrage d'innocuité par LLM pour les systèmes RAG et les agents utilisant des outils - une couche de sécurité cruciale alors que ces systèmes sont déployés plus largement.

### Problèmes de Fiabilité des Modèles et d'Évaluation

Plusieurs problèmes de fiabilité préoccupants sont apparus dans différentes familles de modèles :

- Le Gemma 4 26B de Google montre une [analyse systématiquement erronée des dumps de crash](https://github.com/google-deepmind/gemma/issues/621), identifiant constamment de manière incorrecte des avertissements d'environnement bénins comme causes racines de crash dans la sortie WinDbg
- Un déploiement Samsung A55 de Gemma [produit une sortie répétitive sans fin](https://github.com/google-deepmind/gemma/issues/614) ("over" de manière répétée) indépendamment de l'entrée du prompt
- Les capacités de raisonnement mathématique d'OpenAI montrent des [problèmes significatifs d'hallucination](https://github.com/openai/openai-cookbook/pull/2599), incitant à de nouveaux kits d'outils pour le routage de calcul déterministe

### Améliorations du Framework d'Évaluation

Le LM Evaluation Harness s'attaque à plusieurs problèmes techniques qui pourraient affecter les évaluations de sécurité :

- [Correction de l'agrégation médiane incorrecte](https://github.com/EleutherAI/lm-evaluation-harness/pull/3668) qui retournait de mauvaises valeurs pour les entrées non triées
- [Correction du préprocessing GPQA](https://github.com/EleutherAI/lm-evaluation-harness/pull/3691) qui corrompait la nomenclature chimique et les expressions mathématiques par un retrait trop agressif des crochets
- [Correction de la contamination few-shot MMLU Pro](https://github.com/EleutherAI/lm-evaluation-harness/pull/3693) où le raisonnement s'infiltrait dans les prompts utilisateur sous les modèles de chat

## Outils Émergents

### Frameworks de Développement d'Agents

Le cookbook d'Anthropic a introduit plusieurs nouveaux motifs d'agents :

- [Agents auto-améliorants avec réflexion structurée](https://github.com/anthropics/claude-cookbooks/pull/469) - implémentant un cycle d'amélioration en quatre phases (exécuter, évaluer, réfléchir, améliorer)
- [Pipelines multi-agents avec transferts d'état](https://github.com/anthropics/claude-cookbooks/pull/517) - démontrant des architectures planificateur → travailleur → réviseur avec machines d'état et auto-retry
- [Intégration native du client Python MCP](https://github.com/anthropics/claude-cookbooks/pull/499) pour connecter Claude aux serveurs Model Context Protocol

### Outils d'Évaluation Axés Sécurité

Les nouvelles capacités d'évaluation incluent :

- [Notebook d'évaluation de dilution d'instructions](https://github.com/anthropics/claude-cookbooks/pull/454) démontrant comment les frameworks de raisonnement peuvent s'effondrer de ~100% de précision à 0-30% dans des prompts de production complexes
- [Kit d'outils d'élimination d'hallucination mathématique](https://github.com/openai/openai-cookbook/pull/2599) utilisant SymPy pour un calcul déterministe
- [Support natif du Tensor Parallelism](https://github.com/EleutherAI/lm-evaluation-harness/pull/3692) pour le backend HuggingFace, permettant des évaluations de sécurité à grande échelle plus efficaces

### Infrastructure d'Interprétabilité

TransformerLens étend rapidement le support d'architectures de modèles avec de nouveaux adaptateurs pour [Qwen 3.5](https://github.com/TransformerLensOrg/TransformerLens/pull/1244), [CodeGen](https://github.com/TransformerLensOrg/TransformerLens/pull/1242), [Falcon](https://github.com/TransformerLensOrg/TransformerLens/pull/1241), et [DeepSeek v3](https://github.com/TransformerLensOrg/TransformerLens/pull/1240). Ils ont également introduit un [système de test de pertinence d'architecture](https://github.com/TransformerLensOrg/TransformerLens/pull/1243) pour prioriser quelles architectures de modèles devraient recevoir un support d'outillage d'interprétabilité basé sur les téléchargements, le nombre de modèles, et les métriques de complexité.