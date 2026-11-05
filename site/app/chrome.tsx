import Image from "next/image";
import Link from "next/link";
import { Emoji } from "./effects";

// Barre du haut et pied de page, communs à l'accueil et à la page des versions.
export function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="brand">
        <Image src="/logo.svg" alt="" width={40} height={40} className="brand-logo" unoptimized /> Mon voyage
      </Link>
      <div className="nav-links">
        <Link href="/versions" className="nav-link">Versions</Link>
        <Link href="/#telecharger" className="btn btn-small btn-red">Télécharger</Link>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <Emoji e="🐿️" /> Développé par <strong>BONNE Morgan</strong> · Projet scolaire, BUT MMI, IUT du Puy-en-Velay ·{" "}
      <Link href="/versions">Suivi des versions</Link>
      <br />
      <small>
        Emojis animés : Noto Emoji de Google (licence CC BY 4.0) et Fluent Emoji Animated de Microsoft (licence MIT)
      </small>
    </footer>
  );
}
