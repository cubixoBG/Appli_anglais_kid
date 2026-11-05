---
name: maj-apk-site
description: Mise à jour de l'APK proposé au téléchargement sur le site (site/apk) et de la version « actuelle » de la page des versions. À utiliser dès que l'utilisateur a remplacé ou ajouté un APK et demande de mettre le site à jour (« j'ai modif l'apk », « nouvel apk », « mets l'apk sur le site », « mets à jour le site avec le nouvel apk », /maj-apk-site).
---

# Mettre à jour l'APK du site

Le bouton « Télécharger » du site envoie le fichier le plus récent de `site/apk` (voir `site/app/telecharger/route.ts`).
La page `site/app/versions/page.tsx` liste les versions dans `VERSIONS` : une seule a `status: "current"` (tampon « ACTUELLE » + bouton de téléchargement), les suivantes pas encore sorties ont `status: "next"` (« BIENTÔT »), les autres n'ont pas de `status`.

## La règle

**Avant de mettre le site en ligne, demande toujours à l'utilisateur quelle version mettre en « actuelle »**, avec `AskUserQuestion`. Ne la devine pas, même si l'APK semble contenir une version précise.

## Comment faire

1. Regarde l'APK déposé : `ls -la site/apk`. Lis sa version pour la proposer en premier :
   `unzip -p site/apk/<fichier>.apk AndroidManifest.xml | tr -d '\0' | grep -aoE "1\.[0-9]+\.[0-9]+" | sort -u`
2. Lis les versions de `VERSIONS` dans `site/app/versions/page.tsx`.
3. Demande avec `AskUserQuestion` : « Quelle version mettre en actuelle sur le site ? ». Une option par version de la liste (hors prototypes) ; mets en premier, avec « (Recommended) », celle lue dans l'APK. Précise dans la question la version trouvée dans l'APK.
4. Applique la réponse dans `VERSIONS` :
   - la version choisie : `status: "current"`, et une vraie date à la place de « Bientôt » ;
   - les versions plus récentes : `status: "next"` ;
   - les versions plus anciennes : pas de `status`.
5. Vérifie : `cd site && npx tsc --noEmit`.
6. Mets en ligne sur Hostinger (`langues.morgan-bonne.fr`) en n'envoyant que l'essentiel :
   - copie `app public apk package.json package-lock.json next.config.ts tsconfig.json next-env.d.ts` dans un dossier temporaire **dans le projet** (`deploy-langues/`, les dossiers système sont refusés) ;
   - `hosting_deploy` avec `type: nodejs`, `appType: next`, `nodeVersion: 22`, `packageManager: npm`, `buildScript: build` ;
   - supprime `deploy-langues/`, attends la fin du build (`hosting_get-deployment`) sans relancer un autre déploiement pendant ce temps ;
   - vérifie en ligne : `/telecharger` renvoie la bonne taille d'APK, et `/versions` affiche « ACTUELLE » sur la bonne version.
7. Ne commite pas sans que l'utilisateur le demande (voir le skill `workflow-git`).
