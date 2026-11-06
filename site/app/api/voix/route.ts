// Relais voix : la clé Okto reste sur le serveur (variable d'environnement OKTO_VOICE_KEY sur Hostinger).
// L'appli reçoit seulement une adresse WebSocket Okto à usage unique, valable 60 s (mode « say » = texte → voix).
const LIMIT = 30; // connexions par IP et par heure ; l'appli en ouvre une par session, et Okto plafonne la clé à 30 min/jour
const hits = new Map<string, number[]>(); // shortcut: compteur en mémoire, remis à zéro au redémarrage du serveur ; passer à une base si l'appli grossit

export async function POST(req: Request) {
  const key = process.env.OKTO_VOICE_KEY;
  if (!key) return Response.json({ error: "Voix non configurée" }, { status: 503 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "inconnue";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  if (recent.length >= LIMIT) return Response.json({ error: "Trop de demandes" }, { status: 429 });
  hits.set(ip, [...recent, now]);

  const res = await fetch("https://voice.okto.it/v1/stream", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "say", voice: "Kore" }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.url) return Response.json({ error: "Voix indisponible" }, { status: 502 });
  return Response.json({ url: data.url }, { headers: { "Cache-Control": "no-store" } });
}
