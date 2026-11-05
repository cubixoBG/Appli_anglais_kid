import { Image } from 'expo-image';
import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Text } from 'react-native';
import { ANIMATED, FLUENT } from './emojiAnims';

// « 🐿️ » → « 1f43f » : le nom des fichiers Noto (sans le sélecteur de variante FE0F).
export const emojiCode = (e: string) =>
  [...e].map((c) => c.codePointAt(0)!.toString(16)).filter((c) => c !== 'fe0f').join('_');

// Un emoji animé : Lottie de Google (assets/emoji) en priorité, sinon WebP animé de Microsoft
// (assets/emoji-fluent), sinon animation maison (drapeau qui flotte, sinon dandinement).
// size = la taille de police qu'aurait l'emoji en texte.
export function Emoji({ e, size, opacity = 1 }: { e: string; size: number; opacity?: number }) {
  const box = { width: size * 1.2, height: size * 1.2, opacity };
  const code = emojiCode(e);
  const anim = ANIMATED[code];
  if (anim) return <LottieView source={anim} autoPlay loop style={box} />;
  const fluent = FLUENT[code];
  if (fluent) return <Image source={fluent} autoplay contentFit="contain" style={box} />;
  return <HomeAnimated e={e} size={size} opacity={opacity} flag={code.startsWith('1f1')} />;
}

// On anime une boîte et pas le texte lui-même : sur Android (nouvelle architecture), un Animated.Text
// animé par le moteur natif peut disparaître. La boîte a une taille fixe pour ne pas couper l'emoji.
function HomeAnimated({ e, size, opacity, flag }: { e: string; size: number; opacity: number; flag: boolean }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(t, { toValue: 1, duration: flag ? 1600 : 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [t, flag]);
  const transform = flag
    ? // Drapeau : il flotte, comme au vent
      [{ perspective: 300 }, { rotateY: t.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['0deg', '-25deg', '0deg'] }) },
        { scaleY: t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.94, 1] }) }]
    : // Les autres se dandinent : petit saut à gauche, puis à droite
      [{ translateY: t.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [0, -size * 0.08, 0, -size * 0.08, 0] }) },
        { rotate: t.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: ['0deg', '-8deg', '0deg', '8deg', '0deg'] }) }];
  const box = size * 1.3;
  return (
    <Animated.View style={{ width: box, height: box, alignItems: 'center', justifyContent: 'center', opacity, transform }}>
      <Text allowFontScaling={false} style={{ fontSize: size, lineHeight: box, textAlign: 'center' }}>{e}</Text>
    </Animated.View>
  );
}
