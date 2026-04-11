# Activité GitHub (2026-04-09)

## Discussions Clés

Plusieurs problèmes importants liés à la sécurité et à l'alignment ont émergé dans les dépôts principaux :

Le [problème dans anthropic-cookbook](https://github.com/anthropics/claude-cookbooks/issues/518) met en évidence un besoin critique de **portes de vérification automatisées** dans la nouvelle architecture Managed Agents. Bien qu'une approbation humaine dans la boucle existe, il n'y a pas d'exemple de cookbook montrant comment vérifier automatiquement la sortie de l'agent avant l'exécution—une considération de sécurité clé pour les systèmes autonomes.

Plusieurs pull requests se concentrent sur la **robustesse de l'évaluation**. Le [correctif du guide RAG](https://github.com/anthropics/claude-cookbooks/pull/521) corrige les faux positifs dans les fonctions d'évaluation, tandis que le [correctif de l'analyseur de résumé de HELM](https://github.com/stanford-crfm/helm/pull/4183) corrige un bug où les scores de pertinence étaient incorrectement affichés sous les métriques de cohérence. De même, le [correctif grade_completion du cookbook d'OpenAI](https://github.com/openai/openai-cookbook/pull/514) empêche les faux positifs dus à la sensibilité à la casse et aux espaces supplémentaires dans les fonctions d'évaluation.

Le [correctif LM Evaluation Harness pour MMLU Pro](https://github.com/EleutherAI/lm-evaluation-harness/pull/3693) adresse un problème significatif où le raisonnement fewshot fuyait dans les rôles utilisateurs sous les modèles de chat, compromettant potentiellement l'intégrité de l'évaluation.

## Versions Notables

Le dépôt Google DeepMind Gemma montre un développement actif sur **Gemma 4** avec une [implémentation de sampler multitour](https://github.com/google-deepmind/gemma/pull/612) et des [mises à jour du README](https://github.com/google-deepmind/gemma/pull/619) documentant la nouvelle version.

TransformerLens continue d'étendre le support d'architecture avec des adaptateurs pour [DeepSeek V3](https://github.com/TransformerLensOrg/TransformerLens/pull/1240), [Falcon](https://github.com/TransformerLensOrg/TransformerLens/pull/1241), et [CodeGen](https://github.com/TransformerLensOrg/TransformerLens/pull/1242), ainsi qu'un nouveau [système de test de pertinence d'architecture](https://github.com/TransformerLensOrg/TransformerLens/pull/1243) pour prioriser les efforts de développement.

## Outils Émergents

Plusieurs nouveaux frameworks et modèles pour les praticiens de la sécurité IA ont émergé :

Le [**cookbook d'agents auto-améliorants**](https://github.com/anthropics/claude-cookbooks/pull/469) démontre un cycle d'amélioration en quatre phases où les agents exécutent, évaluent, analysent et améliorent leurs réponses selon différentes dimensions de qualité. Cela fournit une approche structurée pour l'auto-amélioration des agents avec des considérations de sécurité.

Les nouvelles implémentations du **Model Context Protocol (MCP)** incluent à la fois un [cookbook de client MCP Python natif](https://github.com/anthropics/claude-cookbooks/pull/499) et un [guide des primitives FastMCP](https://github.com/anthropics/claude-cookbooks/pull/510), comblant les lacunes de documentation pour les développeurs souhaitant un contrôle de bas niveau sur les intégrations MCP.

Le [**système multi-agent AI Portal**](https://github.com/anthropics/claude-cookbooks/pull/515) introduit une orchestration complète pour l'automatisation autonome de navigateur avec une extension Chrome Browser Hands, fournissant des capacités d'automatisation axées sur l'accessibilité.

Pour l'évaluation, le LM Evaluation Harness a ajouté le [**support natif du Tensor Parallelism**](https://github.com/EleutherAI/lm-evaluation-harness/pull/3692) pour les backends HuggingFace et les [**tâches TyDiQA Gold Passage**](https://github.com/EleutherAI/lm-evaluation-harness/pull/3677) couvrant 11 langues avec des métriques conscientes des langues.

Le [**cookbook d'élimination des hallucinations mathématiques**](https://github.com/openai/openai-cookbook/pull/2599) démontre le routage du calcul vers SymPy via l'utilisation d'outils, fournissant une solution pratique pour un raisonnement mathématique fiable.