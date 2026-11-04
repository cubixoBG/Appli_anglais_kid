// Copie le dernier APK de Docs/apk dans public/mon-voyage.apk, pour le bouton « Télécharger ».
// Docs/apk reste la seule copie dans Git (public/*.apk est ignoré).
import { copyFileSync, readdirSync, statSync } from "node:fs";

const dir = "../Docs/apk";
const latest = readdirSync(dir)
  .filter((f) => f.endsWith(".apk"))
  .sort((a, b) => statSync(`${dir}/${b}`).mtimeMs - statSync(`${dir}/${a}`).mtimeMs)[0];
if (!latest) {
  console.warn("Aucun APK dans Docs/apk : le bouton Télécharger renverra une 404.");
} else {
  copyFileSync(`${dir}/${latest}`, "public/mon-voyage.apk");
  console.log(`APK copié : ${latest} → public/mon-voyage.apk`);
}
