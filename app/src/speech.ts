import * as Speech from 'expo-speech';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { File, Paths } from 'expo-file-system';
import type { ExpoSpeechRecognitionModuleType } from 'expo-speech-recognition/build/ExpoSpeechRecognitionModule.types';
import { T } from './lang';

// Voix IA Okto (voice.okto.it). Sans clé, ou en cas d'erreur, on garde la voix du téléphone.
// shortcut: clé EXPO_PUBLIC_ lisible dans l'APK, OK pour un essai ; passer par un relais serveur avant de publier.
const OKTO_KEY = process.env.EXPO_PUBLIC_VOICE_KEY;
const OKTO_VOICE = 'Kore'; // Kore, Aoede, Charon ou Puck
let player: AudioPlayer | null = null;
let stopCurrent: (() => void) | null = null;
let turn = 0;
setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});

// Synthèse en direct (WebSocket /v1/stream?mode=say) : ~1,1 s par phrase contre 2 à 4 s pour POST /v1/say.
// La connexion reste ouverte entre deux phrases ; Okto dit les phrases une à la fois, dans l'ordre.
const RATE = 24000; // PCM 16 bits mono 24 kHz
type Job = { chunks: Uint8Array[]; resolve: (pcm: Uint8Array[]) => void; reject: (e: Error) => void };
const jobs = new Map<string, Job>();
let current: string | null = null;
let socket: Promise<WebSocket> | null = null;
let nextId = 0;

function failAll(e: Error) {
  jobs.forEach((j) => j.reject(e));
  jobs.clear();
}

function openStream(): Promise<WebSocket> {
  if (socket) return socket;
  socket = (async () => {
    const res = await fetch('https://voice.okto.it/v1/stream', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OKTO_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'say', voice: OKTO_VOICE }),
    });
    if (!res.ok) throw new Error(`Okto stream ${res.status}`);
    const { url } = await res.json();
    return new Promise<WebSocket>((resolve, reject) => {
      const ws = new WebSocket(url);
      ws.binaryType = 'arraybuffer';
      ws.onmessage = (e) => {
        if (typeof e.data !== 'string') {
          if (current) jobs.get(current)?.chunks.push(new Uint8Array(e.data));
          return;
        }
        const m = JSON.parse(e.data);
        const job = m.id ? jobs.get(m.id) : undefined;
        if (m.type === 'ready') resolve(ws);
        else if (m.type === 'audio_start') current = m.id;
        else if (m.type === 'audio_end' && job) {
          jobs.delete(m.id);
          m.cancelled ? job.reject(new Error('Okto annulé')) : job.resolve(job.chunks);
        } else if (m.type === 'error') {
          const err = new Error(`Okto stream ${m.status} ${m.message}`);
          job ? (jobs.delete(m.id), job.reject(err)) : failAll(err);
        }
      };
      ws.onerror = () => reject(new Error('Okto stream injoignable'));
      ws.onclose = () => {
        socket = null;
        failAll(new Error('Okto stream fermé'));
        reject(new Error('Okto stream fermé'));
      };
    });
  })();
  socket.catch(() => (socket = null));
  return socket;
}

async function streamSay(text: string): Promise<Uint8Array[]> {
  const ws = await openStream();
  const id = `p${++nextId}`;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      jobs.delete(id);
      reject(new Error('Okto stream trop lent'));
    }, 15000);
    jobs.set(id, {
      chunks: [],
      resolve: (c) => (clearTimeout(timer), resolve(c)),
      reject: (e) => (clearTimeout(timer), reject(e)),
    });
    ws.send(JSON.stringify({ type: 'say', text, id }));
  });
}

// Le PCM brut devient un vrai fichier WAV (en-tête de 44 octets) pour expo-audio.
function toWav(chunks: Uint8Array[]): Uint8Array {
  const size = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(44 + size);
  const v = new DataView(out.buffer);
  const tag = (o: number, s: string) => [...s].forEach((ch, i) => v.setUint8(o + i, ch.charCodeAt(0)));
  tag(0, 'RIFF'); v.setUint32(4, 36 + size, true); tag(8, 'WAVE');
  tag(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, RATE, true); v.setUint32(28, RATE * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  tag(36, 'data'); v.setUint32(40, size, true);
  let o = 44;
  for (const c of chunks) (out.set(c, o), (o += c.length));
  return out;
}

// Chaque phrase n'est générée (et payée) qu'une fois : le WAV reste en cache sur le téléphone.
const inflight = new Map<string, Promise<string>>(); // deux appuis rapides = une seule génération
function oktoFile(text: string): Promise<string> {
  let h = 5381;
  for (const c of OKTO_VOICE + text) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  const file = new File(Paths.cache, `okto-${h.toString(36)}.wav`);
  if (file.exists) return Promise.resolve(file.uri);
  const known = inflight.get(file.uri);
  if (known) return known;
  const p = (async () => {
    const wav = toWav(await streamSay(text));
    file.create();
    await file.write(wav);
    return file.uri;
  })().finally(() => inflight.delete(file.uri));
  inflight.set(file.uri, p);
  return p;
}

function stopAll() {
  Speech.stop();
  stopCurrent?.();
}

// La voix suit la langue choisie ; `voice` sert à faire parler une autre langue (écran de choix).
// « Lentement » reste sur la voix du téléphone : Okto n'a pas de réglage de vitesse.
export async function say(text: string, slow = false, voice = T().voice): Promise<void> {
  stopAll();
  const mine = ++turn;
  if (OKTO_KEY && !slow) {
    try {
      const uri = await oktoFile(text);
      if (mine !== turn) return; // un autre say() est arrivé pendant le téléchargement
      return await new Promise<void>((resolve) => {
        const p = createAudioPlayer(uri);
        player = p;
        const done = () => {
          sub.remove();
          p.remove();
          if (player === p) player = null;
          stopCurrent = null;
          resolve();
        };
        const sub = p.addListener('playbackStatusUpdate', (s) => s.didJustFinish && done());
        stopCurrent = done;
        p.play();
      });
    } catch (e) {
      console.warn(e);
    }
  }
  return speakPhone(text, slow, voice);
}

function speakPhone(text: string, slow: boolean, voice: string): Promise<void> {
  return new Promise((resolve) => {
    Speech.speak(text, {
      language: voice,
      rate: slow ? 0.45 : 0.9,
      onDone: () => resolve(),
      onStopped: () => resolve(),
      onError: () => resolve(),
    });
  });
}

// Le module natif n'existe pas dans Expo Go : on passe alors en mode « l'enfant dit qu'il a répété ».
let recognizer: ExpoSpeechRecognitionModuleType | null = null;
try {
  recognizer = require('expo-speech-recognition').ExpoSpeechRecognitionModule;
} catch {
  recognizer = null;
}

export const canListen = (): boolean => {
  try {
    return !!recognizer?.isRecognitionAvailable();
  } catch {
    return false;
  }
};

// Écoute l'enfant et renvoie les transcriptions possibles ([] si rien compris ou refus du micro).
// Rien n'est enregistré ni stocké : seul le texte reconnu est utilisé, puis oublié.
export async function listen(expected: string): Promise<string[]> {
  const r = recognizer;
  if (!r) return [];
  const perm = await r.requestPermissionsAsync();
  if (!perm.granted) return [];

  return new Promise((resolve) => {
    let heard: string[] = [];
    const subs = [
      r.addListener('result', (e) => {
        heard = e.results.map((x) => x.transcript);
      }),
      r.addListener('error', () => finish()),
      r.addListener('end', () => finish()),
    ];
    const timer = setTimeout(() => r.stop(), 6000);
    function finish() {
      clearTimeout(timer);
      subs.forEach((s) => s.remove());
      resolve(heard);
    }
    r.start({ lang: T().voice, interimResults: false, maxAlternatives: 5, contextualStrings: [expected] });
  });
}
