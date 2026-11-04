import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANG_CODES, Lang } from './data';

// Données gardées sur l'appareil : le prénom, la langue et les autocollants. Pas de compte, rien sur un serveur.
export type Profile = { name: string; lang: Lang };

const PROFILE = 'profile';
// Un passeport par langue ; l'anglais garde la clé d'origine pour ne pas perdre les autocollants déjà gagnés.
const stickersKey = (lang: Lang) => (lang === 'en' ? 'passport.stickers' : `passport.stickers.${lang}`);

export async function loadProfile(): Promise<Profile | null> {
  try {
    const p = JSON.parse((await AsyncStorage.getItem(PROFILE)) ?? 'null');
    return typeof p?.name === 'string' && p.name && LANG_CODES.includes(p.lang) ? { name: p.name, lang: p.lang } : null;
  } catch {
    return null;
  }
}

export async function saveProfile(p: Profile): Promise<void> {
  try {
    await AsyncStorage.setItem(PROFILE, JSON.stringify(p));
  } catch {
    // Le profil reste valable pour cette ouverture de l'appli ; il sera redemandé au prochain lancement.
  }
}

export async function loadStickers(lang: Lang): Promise<number> {
  try {
    return Number(await AsyncStorage.getItem(stickersKey(lang))) || 0;
  } catch {
    return 0;
  }
}

export async function saveStickers(lang: Lang, count: number): Promise<void> {
  try {
    await AsyncStorage.setItem(stickersKey(lang), String(count));
  } catch {
    // Le passeport reste à jour à l'écran ; il sera réenregistré au prochain autocollant.
  }
}
