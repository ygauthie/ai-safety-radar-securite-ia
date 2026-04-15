# Communauté et outils (2026-04-15)

## Discussions clés

**Crise des deepfakes dans les écoles** — [Wired rapporte](https://www.wired.com/story/deepfake-nudify-schools-global-crisis/) que les images de nudité non consensuelles générées par IA d'étudiants se propagent rapidement dans les écoles du monde entier, avec des outils limités pour les victimes et des cadres juridiques flous. Cela souligne le besoin urgent de mesures de protection techniques et de gouvernance autour des applications d'IA nuisibles.

**Bug de répétition de tokens de Gemma 4** — Plusieurs rapports décrivent des [boucles déterministes](https://github.com/google-deepmind/gemma/issues/610) où les modèles Gemma 4 (à la fois 31B Dense et 26B MoE) se bloquent en répétant des phrases comme "Wait, I found it. The 14." durant la génération de longs textes. Cela démontre comment même les modèles avancés peuvent présenter des modes de défaillance catastrophiques qui compromettent la fiabilité.

**Améliorations du diagnostic LM Evaluation Harness** — Une [nouvelle PR](https://github.com/EleutherAI/lm-evaluation-harness/pull/3709) ajoute des colonnes de transparence pour le suivi "answer-not-found" et "invalid-filter" dans les tâches génératives, aidant les utilisateurs à comprendre pourquoi les scores d'évaluation diffèrent des résultats publiés. Cela comble une lacune critique dans le débogage d'évaluation et la reproductibilité.

## Versions GitHub et outils notables

**Cortex-Persist v0.1.0** — [Version initiale](https://github.com/borjamoskv/Cortex-Persist) d'un framework de sécurité IA comprenant des moteurs de vérification déterministes, des protocoles de gouvernance, et des modules expérimentaux pour la gestion d'état d'agent et la persistance de mémoire. Cela fournit aux chercheurs des outils pour construire des systèmes d'IA plus contrôlables.

**SINT Protocol v0.2.5** — [Dernière version](https://github.com/sint-ai/sint-protocol/releases/tag/v0.2.5) incluant `sint-scan`, un outil CLI sans dépendance pour scanner les serveurs MCP et détecter les outils risqués en utilisant les niveaux d'approbation SINT (T0–T3) et la détection de violations OWASP ASI05. Cela permet une évaluation rapide de la sécurité des configurations d'outils d'agent.

**NAAb v1.0.0** — [Première version stable](https://github.com/b-macker/NAAb/releases/tag/v1.0.0) d'un langage de programmation polyglotte avec gouvernance intégrée qui peut exécuter Python, JavaScript, Rust, C++, Go, et 7 autres langages à l'intérieur de fichiers `.naab` avec application de règles de sécurité et de qualité à l'exécution. Cela représente une approche innovante des environnements de développement multi-langages sécurisés.

**Language-Model-SAEs v2.0.0b29** — [Version bêta](https://github.com/OpenMOSS/Language-Model-SAEs/releases/tag/v2.0.0b29) corrige la fonctionnalité de traçage QK et le déploiement de documentation, poursuivant le développement d'outils d'autoencodeurs parses pour la recherche en interprétabilité mécaniste. Cela soutient les efforts pour comprendre et contrôler les représentations internes des modèles.