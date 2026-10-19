---
name: workflow-git
description: Règles de branches Git du projet : rien ne va sur main sans accord explicite, tout passe par dev. À utiliser avant tout commit, merge, push, rebase, création de branche ou pull request (« commit ça », « push », « merge la branche », « mets en ligne », /workflow-git).
---

# Workflow Git : main ← dev ← branches

## Les branches

- **`main`** : la version stable. Elle ne reçoit que les étapes importantes du projet : une démo, l'appli finie, une grosse mise à jour.
- **`dev`** : la branche d'intégration. Toutes les branches de travail y sont fusionnées.
- **Les branches de travail** : une par tâche, créées depuis `dev` (ex. `feature/memory-sonore`, `fix/micro-ios`, `docs/readme`).

## Les règles

1. **Jamais de commit, de push ni de merge sur `main` sans l'accord explicite de l'utilisateur, demandé à l'avance pour cette opération précise.** Un accord donné plus tôt pour autre chose ne compte pas.
2. Si la branche courante est `main`, ne commite pas dessus : crée une branche de travail depuis `dev`, ou demande à l'utilisateur.
3. Une branche de travail se fusionne **uniquement dans `dev`**, jamais directement dans `main`.
4. `dev` se fusionne dans `main` seulement pour une étape importante, et seulement si l'utilisateur l'a demandé ou validé.
5. Pas de `push --force` sur `main` ni sur `dev`.

## Comment faire

**Commencer une tâche**
```bash
git switch dev && git pull
git switch -c feature/<nom-court>
```

**Terminer une tâche** (fusion dans `dev`)
```bash
git switch dev && git pull
git merge --no-ff feature/<nom-court>
git push
```

**Publier une étape importante** (après l'accord de l'utilisateur)
1. Demande : « On passe `dev` sur `main` pour <la raison : démo, version finie…> ? »
2. Une fois l'accord donné :
```bash
git switch main && git pull
git merge --no-ff dev -m "Release: <raison>"
git push
git switch dev
```

## Avant chaque opération Git

Vérifie la branche courante avec `git branch --show-current`. Si l'opération touche `main` et que l'utilisateur ne l'a pas validée, arrête-toi et demande.
