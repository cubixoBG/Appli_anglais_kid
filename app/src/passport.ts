import AsyncStorage from '@react-native-async-storage/async-storage';

// Seule donnée gardée sur l'appareil : le nombre d'autocollants gagnés. Pas de compte, rien sur un serveur.
const KEY = 'passport.stickers';

export async function loadStickers(): Promise<number> {
  try {
    return Number(await AsyncStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
}

export async function saveStickers(count: number): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, String(count));
  } catch {
    // Le passeport reste à jour à l'écran ; il sera réenregistré au prochain autocollant.
  }
}
