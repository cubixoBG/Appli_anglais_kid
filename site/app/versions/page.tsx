import type { Metadata } from "next";
import { Footer, Nav } from "../chrome";
import { Emoji, RevealOnScroll } from "../effects";

export const metadata: Metadata = {
  title: "Suivi des versions — Mon voyage",
  description: "Toutes les versions de l'appli Mon voyage : ce qui a changé, et quand.",
};

// Le journal des versions, de la plus récente à la plus ancienne. Ajouter une entrée en haut à chaque nouvel APK.
// status : "next" = prochaine version (pas encore téléchargeable), "current" = l'APK proposé au téléchargement.
const VERSIONS: { version: string; date: string; emoji: string; title: string; status?: "next" | "current"; changes: string[] }[] = [
  {
    version: "1.1.0",
    date: "Bientôt",
    emoji: "🎉",
    title: "Quatre langues et des emojis qui bougent",
    status: "next",
    changes: [
      "Au lancement, l'enfant écrit son prénom et choisit sa langue : anglais, espagnol, allemand ou italien",
      "Chaque langue a sa voix, ses mots, ses autocollants et son passeport",
      "L'écureuil appelle l'enfant par son prénom, jusque dans le rappel du jour",
      "Écran de chargement animé : la valise qui sautille",
      "Tous les emojis bougent : animations de Google et de Microsoft, drapeaux qui flottent au vent",
    ],
  },
  {
    version: "1.0.0",
    date: "4 novembre 2026",
    emoji: "✈️",
    title: "Le grand départ",
    status: "current",
    changes: [
      "Premier APK à installer sur Android, en anglais",
      "Deux étapes du voyage : Les présentations et L'aéroport, avec 20 mots chacune",
      "Trois jeux : Écouter et répéter, Memory sonore et Le perroquet",
      "Un rappel par jour pour ne pas oublier sa séance",
      "L'appli se met à jour toute seule, sans réinstaller",
    ],
  },
  {
    version: "Prototype",
    date: "20 octobre 2026",
    emoji: "🚌",
    title: "Le carnet de voyage",
    changes: [
      "Nouveau design « carnet de voyage » : papier crème, encre marine, billets et tampons",
      "La ligne du voyage avance : 3 séances débloquent l'étape de l'aéroport",
      "On peut revenir sur une étape passée pour réviser, sans gagner d'autocollant",
      "Le Memory tient sur un seul écran et les textes ne sont plus coupés sur Android",
    ],
  },
  {
    version: "Prototype",
    date: "19 octobre 2026",
    emoji: "👋",
    title: "Premiers pas",
    changes: [
      "L'étape « Les présentations » et ses 20 mots",
      "Trois jeux : Écouter et répéter, Memory sonore et Le perroquet",
      "Correction de la prononciation, tolérante avec les voix d'enfants",
      "Un autocollant par séance, à coller dans le passeport",
    ],
  },
];

export default function Versions() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <main className="wrap section">
        <p className="label">Journal de bord</p>
        <h1 className="versions-title">Suivi des versions</h1>
        <p className="lead">
          Chaque étape de l&apos;appli, comme les stations d&apos;une ligne de métro : de la toute première version à
          celle que tu peux télécharger aujourd&apos;hui.
        </p>

        <ol className="timeline">
          {VERSIONS.map((v, i) => (
            <li key={v.date + v.title} className={`version ${v.status ?? ""}`} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="version-dot" aria-hidden />
              <article className="card version-card">
                <div className="version-head">
                  <span className="version-emoji"><Emoji e={v.emoji} /></span>
                  <div>
                    <span className="version-tag">{v.version === "Prototype" ? "Prototype" : `Version ${v.version}`}</span>
                    <h2 className="version-name">{v.title}</h2>
                    <p className="small">{v.date}</p>
                  </div>
                </div>
                <ul className="version-changes">
                  {v.changes.map((c) => <li key={c}>{c}</li>)}
                </ul>
                {v.status === "next" ? <span className="stamp version-stamp">BIENTÔT</span> : null}
                {v.status === "current" ? (
                  <>
                    <span className="stamp version-stamp">ACTUELLE</span>
                    <a href="/telecharger" className="btn btn-red">
                      <Emoji e="📲" /> Télécharger la version {v.version}
                    </a>
                  </>
                ) : null}
              </article>
            </li>
          ))}
        </ol>
      </main>
      <Footer />
    </>
  );
}
