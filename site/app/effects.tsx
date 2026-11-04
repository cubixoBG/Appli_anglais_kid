"use client";
import { useEffect, useRef, useState } from "react";
import suitcase from "./suitcase.json";

// Fait apparaître les éléments [data-reveal] quand ils entrent à l'écran (classe .in).
export function RevealOnScroll() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.2 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

const HELLOS = [
  { t: "Hello Léa! Ready for your lesson?", flag: "🇬🇧" },
  { t: "¡Hola Léa! ¿Empezamos la clase?", flag: "🇪🇸" },
  { t: "Hallo Léa! Fangen wir an?", flag: "🇩🇪" },
  { t: "Ciao Léa! Cominciamo la lezione?", flag: "🇮🇹" },
];

// La bulle de l'écureuil change de langue toutes les 2,6 s.
export function HelloCycle() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % HELLOS.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <span key={i} className="hello">
      <Emoji e={HELLOS[i].flag} /> {HELLOS[i].t}
    </span>
  );
}

// La valise qui sautille : la même animation Lottie que l'écran de chargement de l'appli.
export function Suitcase({ size = 180 }: { size?: number }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // lottie-web lit `document` dès son import : on le charge seulement dans le navigateur.
    let anim: { destroy(): void } | undefined;
    let gone = false;
    import("lottie-web").then(({ default: lottie }) => {
      if (gone || !box.current) return;
      anim = lottie.loadAnimation({ container: box.current, renderer: "svg", loop: true, autoplay: true, animationData: suitcase });
    });
    return () => { gone = true; anim?.destroy(); };
  }, []);
  return <div ref={box} style={{ width: size, height: size }} aria-hidden />;
}

// Emojis animés de Google (Noto Animated Emoji, CC BY 4.0), copiés dans public/emoji/<code>.json.
// shortcut: liste fixe ; pour en ajouter un, télécharger https://fonts.gstatic.com/s/e/notoemoji/latest/<code>/lottie.json
const ANIMATED = new Set(["1f68c", "1f968", "1f355", "1f366", "1f483", "1f43f", "1f981", "1f512", "1f514", "1f393", "1f419", "1f44b", "2708", "1f389"]);
const codeOf = (e: string) => [...e].map((c) => c.codePointAt(0)!.toString(16)).filter((c) => c !== "fe0f").join("_");

// Un emoji : animé (Lottie) s'il existe dans la liste, sinon dessiné avec la police Noto Color Emoji.
// L'animation ne se charge qu'à la première apparition à l'écran et se met en pause hors de l'écran.
export function Emoji({ e }: { e: string }) {
  const box = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);
  const code = codeOf(e);
  useEffect(() => {
    const el = box.current;
    if (!el || !ANIMATED.has(code)) return;
    let anim: { play(): void; pause(): void; destroy(): void } | undefined;
    let loading = false;
    const io = new IntersectionObserver(([entry]) => {
      if (anim) return entry.isIntersecting ? anim.play() : anim.pause();
      if (!entry.isIntersecting || loading) return;
      loading = true;
      import("lottie-web").then(({ default: lottie }) => {
        if (!box.current) return;
        anim = lottie.loadAnimation({ container: el, renderer: "svg", loop: true, autoplay: true, path: `/emoji/${code}.json` });
        anim && (anim as unknown as { addEventListener(n: string, f: () => void): void }).addEventListener("DOMLoaded", () => setReady(true));
      });
    });
    io.observe(el);
    return () => { io.disconnect(); anim?.destroy(); };
  }, [code]);
  return (
    <span className="emoji" role="img" aria-label={e}>
      <span ref={box} className="emoji-anim" aria-hidden />
      {ready ? null : <span aria-hidden>{e}</span>}
    </span>
  );
}
