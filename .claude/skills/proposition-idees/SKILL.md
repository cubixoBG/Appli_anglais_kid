---
name: proposition-idees
description: Propose des idées sur un sujet du projet, les fait débattre par des sous-agents IA qui les notent, puis écrit un fichier structuré dans Docs/idées/ avec les idées triées par score de satisfaction. Quand l'utilisateur valide une idée, l'ajoute aux ADR dans Docs/ADR/. À utiliser quand l'utilisateur demande des idées, des propositions ou des pistes (« propose-moi des idées pour… », « t'as des idées de… », /proposition-idees), ou quand il valide une idée (« je valide l'idée X », « on garde X »).
---

# Proposer des idées débattues

Le résultat est un fichier Markdown dans `Docs/idées/`, avec les idées triées selon la note donnée par un panel de sous-agents. Le coût en tokens doit rester faible : modèles légers, prompts courts, un seul appel par agent et par tour.

## Étape 1 : préparer (agent principal, sans sous-agent)

1. Lis `Docs/context.md`, les ADR de `Docs/ADR/` (décisions déjà prises, à ne pas contredire) et les fichiers de `Docs/idées/` liés au sujet.
2. Écris un **résumé du contexte en 10 lignes maximum**. C'est ce résumé qu'on donne aux sous-agents, jamais les fichiers entiers.
3. Génère **8 à 12 idées** sur le sujet demandé. Une ligne par idée : un nom court et le principe. Numérote-les (I1, I2…).
4. Choisis **3 ou 4 personas** adaptés au sujet. Pour ce projet, par défaut :
   - **L'enfant** (10 ans, débutante) : est-ce que c'est amusant et compréhensible ?
   - **Le parent / client** : est-ce que c'est utile pour le voyage, sûr et rassurant ?
   - **La développeuse** : est-ce que c'est faisable dans le délai, avec la stack prévue ?
   - **Le pédagogue** : est-ce qu'elle va vraiment apprendre l'anglais ?

## Étape 2 : premier tour de notes (en parallèle)

Lance **un sous-agent par persona, tous dans le même message**, avec `model: "haiku"`. Chaque agent note **toutes les idées en un seul appel**, sans faire un appel par idée.

Prompt type (à compléter) :

```
Tu es <persona> : <ce qui compte pour toi>.
Contexte du projet : <résumé en 10 lignes>
Sujet : <sujet>
Idées :
I1. <nom> : <principe>
...
Note chaque idée de 1 à 5 de ton point de vue, avec une raison de 15 mots maximum.
Ne lis aucun fichier et n'utilise aucun outil.
Réponds UNIQUEMENT avec un tableau : | Idée | Note | Raison |
```

## Étape 3 : débat sur les idées contestées

- Une idée est **contestée** quand l'écart entre sa meilleure et sa moins bonne note est d'au moins 2 points.
- S'il n'y a aucune idée contestée, passe à l'étape 4.
- Sinon, lance **un seul** sous-agent `model: "sonnet"` qui arbitre. Donne-lui uniquement les idées contestées, avec les notes et les raisons de chaque persona. Il fait débattre les personas en 2 ou 3 répliques par idée, puis donne une note finale sur 5 pour chaque persona, ainsi qu'une variante de l'idée qui mettrait tout le monde d'accord (s'il en voit une). Réponse limitée à environ 150 mots par idée.

## Étape 4 : synthèse et fichier (agent principal)

- **Score de satisfaction** = moyenne des notes finales, ramenée en % (moyenne / 5 × 100).
- Classe les idées : **≥ 75 %** → À garder · **50 à 74 %** → À discuter · **< 50 %** → À écarter.
- Écris `Docs/idées/idees-<sujet-court>.md` avec la structure ci-dessous. Si le fichier existe déjà, demande avant de l'écraser.

```markdown
# Idées : <sujet>

<1 phrase : le sujet et le panel utilisé>

## Classement

| # | Idée | Satisfaction | Verdict |
|---|---|---|---|
(trié du meilleur au moins bon score)

## À garder
### <Idée> (<score> %)
<principe en 1 ou 2 phrases>
| Persona | Note | Avis |
|---|---|---|
(si l'idée a été débattue : « Débat : » + résumé en 2 lignes et variante proposée)

## À discuter
(même format)

## À écarter
(même format, plus court : nom, score, raison principale)

## Le panel
<les personas et ce que chacun jugeait>
```

## Étape 5 : quand l'utilisateur valide une idée

L'utilisateur valide une idée en le disant (« je valide l'idée X », « on garde X »). Ne crée jamais d'ADR sans cette validation explicite.

1. Crée `Docs/ADR/NNNN-<titre-court>.md` : `NNNN` est le numéro suivant celui du dernier ADR (en commençant à `0001`), et le titre est en minuscules, avec des tirets et sans accents.
2. Remplis-le avec la structure ci-dessous, à partir du fichier d'idées (notes, avis du panel, débat) :

```markdown
# NNNN. <Titre de la décision>

- **Date** : <AAAA-MM-JJ>
- **Statut** : Acceptée
- **Source** : [<fichier d'idées>](../idées/<fichier>.md) (satisfaction : <score> %)

## Contexte
<le problème ou le besoin, en 2 à 4 phrases>

## Décision
<ce qu'on fait, en reprenant la variante issue du débat si l'utilisateur l'a validée>

## Conséquences
- **Positives** : <d'après les avis favorables du panel>
- **Négatives / risques** : <d'après les réserves du panel>

## Alternatives écartées
- <les autres idées du même sujet qui répondaient au même besoin, avec leur score>
```

3. Si la nouvelle décision remplace un ADR existant, passe le statut de l'ancien à « Remplacée par NNNN » au lieu de le supprimer.
4. Dans le fichier d'idées, ajoute « ✅ Validée → ADR NNNN » à côté de l'idée, dans le classement.

## Règles

- Passe toujours `model` à chaque appel Agent : `haiku` pour les personas, `sonnet` pour l'arbitre. N'utilise jamais `opus` ni `fable` pour ce skill.
- Les sous-agents ne lisent pas de fichiers : tout passe par le résumé du contexte.
- Dans ta réponse finale, ne recopie pas le fichier : donne le lien, les 3 meilleures idées avec leur score, et les points de désaccord importants.
