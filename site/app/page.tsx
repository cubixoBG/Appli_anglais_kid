import Image from "next/image";
import { Emoji, HelloCycle, RevealOnScroll, Suitcase } from "./effects";

// Envoie l'APK déposé dans site/apk (voir app/telecharger/route.ts).
const DOWNLOAD_URL = "/telecharger";

const LANGS = [
  { flag: "🇬🇧", name: "Anglais", hi: "Hello!", sticker: "🚌" },
  { flag: "🇪🇸", name: "Espagnol", hi: "¡Hola!", sticker: "💃" },
  { flag: "🇩🇪", name: "Allemand", hi: "Hallo!", sticker: "🥨" },
  { flag: "🇮🇹", name: "Italien", hi: "Ciao!", sticker: "🍕" },
];

const GAMES = [
  { icon: "🎧", title: "Écouter et répéter", text: "L'écureuil dit le mot, l'enfant le répète au micro et reçoit un retour tout de suite." },
  { icon: "🃏", title: "Memory sonore", text: "Retrouver les paires : une image et le mot qu'on entend. On joue avec les oreilles." },
  { icon: "🦜", title: "Le perroquet", text: "Seulement l'image et le son : il faut écouter, puis répéter pour gagner des étoiles." },
];

const STEPS = ["Présentations", "Aéroport", "Famille", "À table", "Journée", "Sortir", "Jouer", "Urgences", "Culture"];
const STICKERS = ["🚌", "🥨", "🍕", "🥘", "☎️", "🏰", "🍦", "💃", "🕰️", "🎄", "🛵", "☀️"];
const TILTS = [-4, 3, -2, 5, -5, 2, 4, -3, 1, -4, 3, -1];

export default function Home() {
  return (
    <>
      <RevealOnScroll />
      <nav className="nav">
        <a href="#" className="brand">
          <span className="brand-avatar"><Emoji e="🐿️" /></span> Mon voyage
        </a>
        <a href="#telecharger" className="btn btn-small btn-red">
          Télécharger
        </a>
      </nav>

      <main>
        {/* En-tête : promesse + téléphone */}
        <header className="hero wrap">
          <div className="hero-text">
            <p className="label">Carnet de voyage</p>
            <h1>
              Parle la langue <span className="underline">avant</span> de faire ta valise.
            </h1>
            <p className="lead">
              Une appli pour apprendre à <strong>parler</strong> anglais, espagnol, allemand ou italien avant un séjour
              dans une famille à l&apos;étranger. Un écureuil dit les mots, l&apos;enfant les répète, et il corrige la
              prononciation, toujours avec bienveillance.
            </p>
            <div className="row">
              <a href="#telecharger" className="btn btn-red">
                <Emoji e="📲" /> Télécharger pour Android
              </a>
              <a href="#jeux" className="btn btn-outline">
                Voir les jeux →
              </a>
            </div>
            <p className="small">10 minutes par jour · sans compte · gratuit</p>
          </div>

          <div className="phone-zone">
            <span className="float f1"><Emoji e="🚌" /></span>
            <span className="float f2"><Emoji e="🥨" /></span>
            <span className="float f3"><Emoji e="🍕" /></span>
            <span className="float f4"><Emoji e="🍦" /></span>
            <div className="phone">
              <div className="phone-screen">
                <p className="label tiny">Mon carnet de voyage</p>
                <div className="squirrel">
                  <span className="avatar"><Emoji e="🐿️" /></span>
                  <div className="bubble">
                    <HelloCycle />
                    <span className="bubble-fr">Coucou Léa ! On commence ta séance ?</span>
                  </div>
                </div>
                <p className="session">
                  Séance du jour <span>2/3 billets</span>
                </p>
                {GAMES.map((g, i) => (
                  <div key={g.title} className="ticket mini">
                    <span className="ticket-icon"><Emoji e={g.icon} /></span>
                    <span className="ticket-sep" />
                    <span className="ticket-title">{g.title}</span>
                    {i < 2 ? <span className="stamp">FAIT ✓</span> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Bandeau qui défile */}
        <div className="marquee" aria-hidden>
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k}>
                Hello ✦ ¡Hola! ✦ Hallo ✦ Ciao ✦ Thank you ✦ Gracias ✦ Danke ✦ Grazie ✦ Goodbye ✦ Adiós ✦ Tschüss ✦ Arrivederci ✦{" "}
              </span>
            ))}
          </div>
        </div>

        {/* Les langues */}
        <section className="wrap section">
          <p className="label" data-reveal>
            4 destinations
          </p>
          <h2 data-reveal>Choisis ta langue, l&apos;écureuil s&apos;adapte.</h2>
          <p className="lead" data-reveal>
            Au premier lancement, l&apos;enfant tape son prénom et choisit sa destination. La voix, les mots, les
            autocollants et le passeport changent avec la langue.
          </p>
          <div className="grid4">
            {LANGS.map((l, i) => (
              <div key={l.name} className="card lang" data-reveal style={{ transitionDelay: `${i * 90}ms`, ["--tilt" as string]: `${TILTS[i]}deg` }}>
                <span className="lang-flag"><Emoji e={l.flag} /></span>
                <strong>{l.name}</strong>
                <span className="muted">{l.hi}</span>
                <span className="lang-sticker"><Emoji e={l.sticker} /></span>
              </div>
            ))}
          </div>
        </section>

        {/* Les jeux */}
        <section id="jeux" className="wrap section">
          <p className="label" data-reveal>
            La séance du jour
          </p>
          <h2 data-reveal>3 billets, 1 autocollant.</h2>
          <p className="lead" data-reveal>
            Chaque séance, ce sont trois petits jeux. Une fois les trois billets tamponnés, l&apos;enfant gagne un
            autocollant pour son passeport.
          </p>
          <div className="stack">
            {GAMES.map((g, i) => (
              <div key={g.title} className="ticket" data-reveal style={{ transitionDelay: `${i * 120}ms` }}>
                <span className="ticket-icon big"><Emoji e={g.icon} /></span>
                <span className="ticket-sep" />
                <div>
                  <strong className="ticket-title">{g.title}</strong>
                  <p className="muted left">{g.text}</p>
                </div>
                <span className="stamp stamp-anim">FAIT ✓</span>
              </div>
            ))}
          </div>
        </section>

        {/* La ligne du voyage */}
        <section className="wrap section">
          <p className="label" data-reveal>
            La ligne du voyage
          </p>
          <h2 data-reveal>Une station toutes les 3 séances.</h2>
          <p className="lead" data-reveal>
            Comme un plan de métro : chaque étape débloque un nouveau thème du séjour. On peut toujours revenir en
            arrière pour réviser.
          </p>
          <div className="card tube" data-reveal>
            <div className="tube-line">
              <div className="tube-fill" />
              {STEPS.map((s, i) => (
                <div key={s} className={`station ${i < 2 ? "passed" : i === 2 ? "here" : ""}`} style={{ ["--i" as string]: i }}>
                  <span className="dot">{i < 2 ? "✓" : ""}</span>
                  <span className="station-name">{s}</span>
                  {i === 2 ? <span className="here-tag">Tu es ici</span> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Le passeport */}
        <section className="wrap section split">
          <div>
            <p className="label" data-reveal>
              Le passeport
            </p>
            <h2 data-reveal>12 autocollants à collectionner.</h2>
            <p className="lead" data-reveal>
              Le bus rouge, le bretzel, la gondole, la paella… Chaque destination a son passeport et ses autocollants.
              De quoi donner envie de revenir le lendemain.
            </p>
          </div>
          <div className="card passport" data-reveal>
            <div className="passport-cover">
              <span><Emoji e="🦁" /></span>
              <strong>PASSPORT</strong>
              <small>LÉA · MON VOYAGE EN ANGLETERRE</small>
            </div>
            <div className="stickers">
              {STICKERS.map((s, i) => (
                // Seul le premier autocollant est visible : les autres restent une surprise.
                <span key={i} className={`sticker ${i < 8 ? "got" : ""} ${i > 0 && i < 8 ? "secret" : ""}`} style={{ ["--tilt" as string]: `${TILTS[i]}deg`, ["--d" as string]: `${i * 80}ms` }}>
                  {i < 8 ? <Emoji e={s} /> : "?"}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Confiance parents */}
        <section className="wrap section">
          <p className="label" data-reveal>
            Pour les parents
          </p>
          <h2 data-reveal>Rien ne quitte le téléphone.</h2>
          <div className="grid3">
            {[
              ["🔒", "Pas de compte", "Seuls le prénom, la langue et les autocollants sont gardés, sur l'appareil."],
              ["🎤", "Voix jamais enregistrée", "Le micro sert à comparer la prononciation, puis le son est oublié."],
              ["🔔", "Un rappel par jour", "Une notification locale, sans serveur, pour garder le rythme."],
            ].map(([icon, title, text], i) => (
              <div key={title} className="card trust" data-reveal style={{ transitionDelay: `${i * 100}ms` }}>
                <span className="trust-icon"><Emoji e={icon} /></span>
                <strong>{title}</strong>
                <p className="muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Téléchargement */}
        <section id="telecharger" className="wrap section">
          <div className="card download" data-reveal>
            <Suitcase />
            <h2>Prêt·e pour le départ ?</h2>
            <p className="lead light">Télécharge l&apos;appli sur ton téléphone Android et fais ta première séance.</p>
            <a href={DOWNLOAD_URL} className="btn btn-red btn-big">
              <Emoji e="📲" /> Télécharger l&apos;APK
            </a>
            <ol className="steps">
              <li>Depuis ton téléphone Android, appuie sur le bouton : l&apos;APK se télécharge.</li>
              <li>Ouvre le fichier téléchargé et autorise l&apos;installation si Android le demande.</li>
              <li>Ouvre l&apos;appli, écris ton prénom et choisis ta langue.</li>
            </ol>
            <p className="small light">Version iPhone : bientôt.</p>
          </div>
        </section>
        {/* Les coulisses : le développeur, l'école, l'hébergeur */}
        <section id="createur" className="wrap section">
          <p className="label" data-reveal>
            Les coulisses
          </p>
          <h2 data-reveal>Une appli imaginée et codée par un étudiant.</h2>
          <div className="credits">
            <div className="card dev" data-reveal>
              <Image src="/morgan.png" alt="Photo de BONNE Morgan" width={220} height={220} className="dev-avatar" />
              <span className="dev-tag">Développeur de l&apos;appli</span>
              <strong className="dev-name">BONNE Morgan</strong>
              <p className="muted">
                De l&apos;idée au code : design, jeux, voix de l&apos;écureuil, reconnaissance de la prononciation et
                version en 4 langues.
              </p>
              <div className="chips">
                {["React Native", "Expo", "TypeScript", "Lottie", "Next.js"].map((c) => (
                  <span key={c} className="chip">
                    {c}
                  </span>
                ))}
              </div>
              <span className="stamp dev-stamp">MADE BY MORGAN</span>
            </div>
            <div className="credit-side">
              <div className="card credit" data-reveal style={{ transitionDelay: "100ms" }}>
                <span className="logo-tile mmi" style={{ ["--tilt" as string]: "-4deg" }}>
                  <Image src="/logos/mmi.png" alt="Logo MMI Le Puy-en-Velay" width={180} height={180} />
                </span>
                <div>
                  <strong>Un projet scolaire</strong>
                  <p className="muted left">Créée pendant un projet du BUT MMI à l&apos;IUT du Puy-en-Velay.</p>
                </div>
              </div>
              <div className="card credit" data-reveal style={{ transitionDelay: "200ms" }}>
                <span className="logo-tile" style={{ ["--tilt" as string]: "3deg" }}>
                  <Image src="/logos/oktopod.png" alt="Logo Oktopod" width={180} height={180} />
                </span>
                <div>
                  <strong>Bientôt hébergée grâce à Oktopod</strong>
                  <p className="muted left">L&apos;appli sera prochainement hébergée grâce à Oktopod.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <Emoji e="🐿️" /> Développé par <strong>BONNE Morgan</strong> · Projet scolaire, BUT MMI, IUT du Puy-en-Velay
        <br />
        <small>Emojis animés : Noto Emoji de Google, licence CC BY 4.0</small>
      </footer>
    </>
  );
}
