import { Image } from 'expo-image';
import LottieView from 'lottie-react-native';
import { Text } from 'react-native';
import { ANIMATED, FLUENT } from './emojiAnims';

// « 🐿️ » → « 1f43f » : le nom des fichiers Noto (sans le sélecteur de variante FE0F).
export const emojiCode = (e: string) =>
  [...e].map((c) => c.codePointAt(0)!.toString(16)).filter((c) => c !== 'fe0f').join('_');

// Un emoji animé : Lottie de Google (assets/emoji) en priorité, sinon WebP animé de Microsoft
// (assets/emoji-fluent), sinon l'emoji du téléphone.
// size = la taille de police qu'aurait l'emoji en texte.
export function Emoji({ e, size, opacity = 1 }: { e: string; size: number; opacity?: number }) {
  const box = { width: size * 1.2, height: size * 1.2, opacity };
  const code = emojiCode(e);
  const anim = ANIMATED[code];
  if (!anim) {
    const fluent = FLUENT[code];
    if (fluent) return <Image source={fluent} autoplay contentFit="contain" style={box} />;
    return <Text style={{ fontSize: size, opacity }}>{e}</Text>;
  }
  return <LottieView source={anim} autoPlay loop style={box} />;
}
