import { createReadStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { connection } from "next/server";

// Le bouton « Télécharger » envoie le fichier déposé dans site/apk, lu à chaque clic :
// remplacer l'APK dans ce dossier suffit, sans toucher au code ni relancer le site.
// S'il y a plusieurs fichiers, c'est le plus récent qui part.
const DIR = path.join(process.cwd(), "apk");

export async function GET() {
  await connection(); // toujours à la demande, jamais figé au build
  const files = await Promise.all(
    (await readdir(DIR).catch(() => [] as string[])).map(async (name) => ({ name, info: await stat(path.join(DIR, name)) })),
  );
  const latest = files.filter((f) => f.info.isFile()).sort((a, b) => b.info.mtimeMs - a.info.mtimeMs)[0];
  if (!latest) return new Response("Aucun APK disponible pour le moment.", { status: 404 });

  const stream = Readable.toWeb(createReadStream(path.join(DIR, latest.name))) as ReadableStream;
  return new Response(stream, {
    headers: {
      "Content-Type": "application/vnd.android.package-archive",
      "Content-Length": String(latest.info.size),
      "Content-Disposition": 'attachment; filename="mon-voyage.apk"',
      "Cache-Control": "no-store",
    },
  });
}
