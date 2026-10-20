import { ComponentProps, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text as RNText, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { say } from './speech';

// Thème « carnet de voyage » : papier crème, encre marine, un seul accent rouge (boîte aux lettres anglaise).
export const C = {
  paper: '#FBF3E4',
  card: '#FFFCF5',
  ink: '#1F2A4D',
  red: '#D2372C',
  soft: '#7C7465',
  line: '#E6D8BE',
};

export const F = {
  regular: 'Lexend_400Regular',
  semi: 'Lexend_600SemiBold',
  bold: 'Lexend_800ExtraBold',
};

// À utiliser à la place du Text de React Native.
// Sur Android, la césure « highQuality » mesure parfois le texte trop court et masque le dernier mot ;
// on plafonne aussi l'agrandissement par la taille de police du système pour garder la mise en page.
export function Text(props: ComponentProps<typeof RNText>) {
  return <RNText textBreakStrategy="simple" maxFontSizeMultiplier={1.25} {...props} />;
}

const SHADOW = 5;

// Carte à bord encré avec une ombre pleine décalée, comme du papier découpé.
export function Card({ children, style, tilt = 0, bg = C.card }: {
  children: ReactNode; style?: ViewStyle; tilt?: number; bg?: string;
}) {
  return (
    <View style={[{ transform: [{ rotate: `${tilt}deg` }] }, style]}>
      <View style={[s.shadow, { borderRadius: 22 }]} />
      <View style={[s.card, { backgroundColor: bg }]}>{children}</View>
    </View>
  );
}

export function Screen({ children, onBack, title }: { children: ReactNode; onBack?: () => void; title?: string }) {
  return (
    <SafeAreaView style={s.safe}>
      {onBack || title ? (
        <View style={s.header}>
          {onBack ? (
            <Pressable onPress={onBack} style={s.back} accessibilityRole="button" accessibilityLabel="Retour">
              <Text style={s.backText}>←</Text>
            </Pressable>
          ) : null}
          {title ? <Text style={s.title}>{title}</Text> : null}
        </View>
      ) : null}
      <ScrollView contentContainerStyle={s.content}>{children}</ScrollView>
    </SafeAreaView>
  );
}

// L'écureuil parle en anglais, avec le sous-titre en français. Toucher la bulle la relit.
export function Squirrel({ en, fr, big }: { en: string; fr: string; big?: boolean }) {
  return (
    <Pressable onPress={() => say(en)} style={s.squirrel} accessibilityRole="button" accessibilityLabel={`${en}. ${fr}`}>
      <View style={[s.avatar, big && { width: 96, height: 96, borderRadius: 48 }]}>
        <Text style={{ fontSize: big ? 56 : 40 }}>🐿️</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={s.tail} />
        <View style={s.bubble}>
          <Text style={s.bubbleEn}>{en}</Text>
          <Text style={s.bubbleFr}>{fr}</Text>
        </View>
      </View>
    </Pressable>
  );
}

type Variant = 'red' | 'ink' | 'outline';

// Le bouton s'enfonce dans son ombre quand on appuie dessus.
export function Button({ label, onPress, variant = 'ink', big, style, disabled }: {
  label: string; onPress: () => void; variant?: Variant; big?: boolean; style?: ViewStyle; disabled?: boolean;
}) {
  const bg = variant === 'red' ? C.red : variant === 'ink' ? C.ink : C.card;
  const fg = variant === 'outline' ? C.ink : C.card;
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label}
      style={[{ opacity: disabled ? 0.5 : 1 }, style]}>
      {({ pressed }) => (
        <View>
          <View style={[s.shadow, { borderRadius: big ? 28 : 18 }]} />
          <View style={[s.button, big && s.buttonBig, { backgroundColor: bg },
            pressed && { transform: [{ translateX: SHADOW - 1 }, { translateY: SHADOW - 1 }] }]}>
            <Text style={[s.buttonText, { color: fg }, big && { fontSize: 24 }]}>{label}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

// Tampon penché, comme sur un passeport.
export function Stamp({ label, style }: { label: string; style?: ViewStyle }) {
  return (
    <View style={[s.stamp, style]}>
      <Text style={s.stampText}>{label}</Text>
    </View>
  );
}

export const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.paper },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, minHeight: 64, gap: 12 },
  back: {
    width: 52, height: 52, borderRadius: 26, borderWidth: 2.5, borderColor: C.ink, backgroundColor: C.card,
    alignItems: 'center', justifyContent: 'center',
  },
  backText: { fontSize: 26, color: C.ink, fontFamily: F.bold, marginTop: -3 },
  title: { fontSize: 20, color: C.ink, fontFamily: F.bold, flexShrink: 1 },
  content: { padding: 20, paddingBottom: 48, gap: 20, width: '100%', maxWidth: 640, alignSelf: 'center' },

  shadow: { position: 'absolute', top: SHADOW, left: SHADOW, right: -SHADOW, bottom: -SHADOW, backgroundColor: C.ink },
  card: { borderRadius: 22, borderWidth: 2.5, borderColor: C.ink, padding: 20, alignItems: 'center', gap: 6 },

  squirrel: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: C.card, borderWidth: 2.5, borderColor: C.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  bubble: { backgroundColor: C.card, borderRadius: 20, borderWidth: 2.5, borderColor: C.ink, paddingVertical: 12, paddingHorizontal: 16 },
  tail: {
    position: 'absolute', left: -7, top: '50%', marginTop: -7, width: 16, height: 16, backgroundColor: C.card,
    borderLeftWidth: 2.5, borderBottomWidth: 2.5, borderColor: C.ink, transform: [{ rotate: '45deg' }], zIndex: 1,
  },
  bubbleEn: { fontSize: 19, color: C.ink, fontFamily: F.bold },
  bubbleFr: { fontSize: 16, color: C.soft, fontFamily: F.regular, marginTop: 2 },

  button: {
    borderRadius: 18, borderWidth: 2.5, borderColor: C.ink, paddingVertical: 14, paddingHorizontal: 18,
    alignItems: 'center', justifyContent: 'center', minHeight: 60,
  },
  buttonBig: { borderRadius: 28, minHeight: 88 },
  buttonText: { fontSize: 18, fontFamily: F.semi, textAlign: 'center' },

  stamp: {
    position: 'absolute', borderWidth: 3, borderColor: C.red, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 2,
    transform: [{ rotate: '-12deg' }], backgroundColor: 'rgba(255,252,245,0.85)',
  },
  stampText: { color: C.red, fontFamily: F.bold, fontSize: 16, letterSpacing: 2 },

  row: { flexDirection: 'row', gap: 14 },
  big: { fontSize: 32, color: C.ink, fontFamily: F.bold, textAlign: 'center' },
  text: { fontSize: 18, color: C.ink, fontFamily: F.regular, textAlign: 'center' },
  muted: { fontSize: 16, color: C.soft, fontFamily: F.regular, textAlign: 'center' },
  label: { fontSize: 13, color: C.soft, fontFamily: F.semi, letterSpacing: 2, textTransform: 'uppercase' },
});
