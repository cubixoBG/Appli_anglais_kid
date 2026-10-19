# Règles de travail

Utilise des sous-agents quand ils permettent de séparer le contexte ou de lancer des tâches indépendantes en parallèle. Travaille directement pour les modifications simples, les étapes séquentielles et les tâches qui exigent de garder le même contexte.

## Routage des modèles
- `fable` : architecture, stratégie ambiguë, bugs complexes et revue finale
- `opus` : implémentations complexes, développements multi-fichiers et refactorisations
- `sonnet` : modifications simples, tests, documentation, SEO technique et commits
- `haiku` : recherches rapides, inventaires et résumés
- Passe `model` à chaque appel Agent

## Délégation
- Planifie avant de déléguer
- L'agent principal garde la responsabilité du plan, des décisions finales et de l'intégration
- Lance en parallèle uniquement les tâches réellement indépendantes
- Ne délègue pas en parallèle des modifications qui touchent les mêmes fichiers ou le même système
- Consulte directement les fichiers, références et captures quand la décision en dépend
- Utilise les rapports pour résumer un travail isolé, pas pour remplacer les sources essentielles