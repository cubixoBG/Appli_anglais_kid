import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { say } from './speech';

// Couleurs vives mais contrastées (texte foncé sur fonds clairs)
export const C = {
  bg: '#FFF7E8',
  ink: '#2B1B0E',
  soft: '#6B5A4A',
  red: '#C8102E',
  blue: '#012169',
  orange: '#E07A1F',
  green: '#1E7B3A',
  card: '#FFFFFF',
  line: '#E9D9C0',
};

export function Screen({ children, onBack, title }: { children: ReactNode; onBack?: () => void; title?: string }) {
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        {onBack ? (
          <Pressable onPress={onBack} style={s.back} accessibilityRole="button" accessibilityLabel="Retour">
            <Text style={s.backText}>⬅</Text>
          </Pressable>
        ) : null}
        {title ? <Text style={s.title}>{title}</Text> : null}
      </View>
      <ScrollView contentContainerStyle={s.content}>{children}</ScrollView>
    </SafeAreaView>
  );
}

// L'écureuil parle en anglais, avec le sous-titre en français.
export function Squirrel({ en, fr, big }: { en: string; fr: string; big?: boolean }) {
  return (
    <Pressable onPress={() => say(en)} style={s.squirrel} accessibilityLabel={`${en}. ${fr}`}>
      <Text style={{ fontSize: big ? 96 : 64 }}>🐿️</Text>
      <View style={s.bubble}>
        <Text style={s.bubbleEn}>{en}</Text>
        <Text style={s.bubbleFr}>{fr}</Text>
      </View>
    </Pressable>
  );
}

export function Button({
  label, onPress, color = C.blue, big, style, disabled,
}: { label: string; onPress: () => void; color?: string; big?: boolean; style?: ViewStyle; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        s.button, big && s.buttonBig, { backgroundColor: color, opacity: disabled ? 0.4 : pressed ? 0.8 : 1 }, style,
      ]}
    >
      <Text style={[s.buttonText, big && { fontSize: 28 }]}>{label}</Text>
    </Pressable>
  );
}

export const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, minHeight: 56 },
  back: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 28, color: C.ink },
  title: { fontSize: 24, fontWeight: '800', color: C.ink, marginLeft: 12, flexShrink: 1 },
  content: { padding: 16, gap: 16, alignItems: 'stretch', width: '100%', maxWidth: 640, alignSelf: 'center' },
  squirrel: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bubble: { flex: 1, backgroundColor: C.card, borderRadius: 24, padding: 16, borderWidth: 3, borderColor: C.line },
  bubbleEn: { fontSize: 24, fontWeight: '800', color: C.ink },
  bubbleFr: { fontSize: 18, color: C.soft, marginTop: 4 },
  button: { borderRadius: 20, paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', minHeight: 64 },
  buttonBig: { paddingVertical: 24, minHeight: 96, borderRadius: 32 },
  buttonText: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  card: { backgroundColor: C.card, borderRadius: 24, padding: 20, borderWidth: 3, borderColor: C.line, alignItems: 'center', gap: 8 },
  row: { flexDirection: 'row', gap: 12 },
  big: { fontSize: 32, fontWeight: '800', color: C.ink, textAlign: 'center' },
  text: { fontSize: 20, color: C.ink, textAlign: 'center' },
  muted: { fontSize: 18, color: C.soft, textAlign: 'center' },
});
