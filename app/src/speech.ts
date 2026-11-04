import * as Speech from 'expo-speech';
import type { ExpoSpeechRecognitionModuleType } from 'expo-speech-recognition/build/ExpoSpeechRecognitionModule.types';
import { T } from './lang';

// shortcut: voix du téléphone (expo-speech), plus robotique ; passer aux audios générés à l'avance pour la vraie voix de l'écureuil.
// La voix suit la langue choisie ; `voice` sert à faire parler une autre langue (écran de choix).
export function say(text: string, slow = false, voice = T().voice): Promise<void> {
  Speech.stop();
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
