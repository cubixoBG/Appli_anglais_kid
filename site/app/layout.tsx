import type { Metadata } from "next";
import { Lexend, Noto_Color_Emoji } from "next/font/google";
import "./globals.css";

const lexend = Lexend({ variable: "--font-lexend", subsets: ["latin"], weight: ["400", "600", "800"] });
// Mêmes emojis partout (les drapeaux ne s'affichent pas sous Windows sans cette police).
const emoji = Noto_Color_Emoji({ variable: "--font-emoji", weight: "400", subsets: ["emoji"] });

export const metadata: Metadata = {
  title: "Mon voyage — l'appli pour parler avant de partir",
  description:
    "Une appli pour apprendre l'anglais, l'espagnol, l'allemand ou l'italien à l'oral avant un séjour à l'étranger, avec un écureuil qui corrige la prononciation.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${lexend.variable} ${emoji.variable}`}>
      <body>{children}</body>
    </html>
  );
}
