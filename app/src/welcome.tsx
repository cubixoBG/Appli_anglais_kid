import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Lang, LANG_CODES } from './data';
import { LANGS } from './lang';
import { Profile } from './passport';
import { say } from './speech';
import { Button, C, Card, F, s, Screen, Squirrel, Text } from './ui';

// Écran de chargement : la valise qui sautille (assets/loading.json, animation Lottie).
// Les polices ne sont pas forcément chargées ici : on reste sur la police du système.
export function Loading() {
  const [dots, setDots] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d % 3) + 1), 400);
    return () => clearInterval(id);
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center', gap: 8 }}
      accessibilityLabel="Chargement">
      <Text style={{ fontSize: 56 }}>🐿️</Text>
      <LottieView source={require('../assets/loading.json')} autoPlay loop style={{ width: 200, height: 200 }} />
      <Text style={{ fontSize: 20, fontWeight: '800', color: C.ink, width: 250 }}>
        Je prépare ta valise{'.'.repeat(dots)}
      </Text>
    </View>
  );
}

// Premier lancement (ou bouton « Changer ») : le prénom et la langue du voyage.
export function Welcome({ initial, onDone, onBack }: {
  initial: Profile | null; onDone: (p: Profile) => void; onBack?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [lang, setLang] = useState<Lang | null>(initial?.lang ?? null);
  const clean = name.trim();

  return (
    <Screen onBack={onBack} title={onBack ? 'Mon profil' : undefined}>
      <Text style={[s.label, { marginTop: 8 }]}>Bienvenue à bord</Text>
      <Squirrel big fr="Coucou ! Je suis ton guide de voyage. Comment tu t’appelles ?" />
      <TextInput value={name} onChangeText={setName} placeholder="Ton prénom" placeholderTextColor={C.soft}
        maxLength={20} autoCapitalize="words" autoCorrect={false} returnKeyType="done" accessibilityLabel="Ton prénom"
        style={{
          borderWidth: 2.5, borderColor: C.ink, borderRadius: 18, backgroundColor: C.card, paddingHorizontal: 18,
          paddingVertical: 14, fontSize: 20, fontFamily: F.semi, color: C.ink,
        }} />

      <Text style={{ fontFamily: F.bold, fontSize: 22, color: C.ink }}>Quelle langue veux-tu apprendre ?</Text>
      {initial ? (
        <Text style={[s.muted, { textAlign: 'left', marginTop: -12 }]}>Chaque langue a son propre passeport.</Text>
      ) : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 18 }}>
        {LANG_CODES.map((l) => {
          const p = LANGS[l];
          const on = l === lang;
          return (
            <Pressable key={l} onPress={() => { setLang(l); say(p.hi, false, p.voice); }} style={{ width: '47%' }}
              accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={p.label}>
              <Card bg={on ? C.ink : C.card} tilt={on ? -2 : 0}>
                <Text style={{ fontSize: 40 }}>{p.flag}</Text>
                <Text style={{ fontFamily: F.bold, fontSize: 18, color: on ? C.paper : C.ink }}>{p.label}</Text>
                <Text style={{ fontFamily: F.regular, fontSize: 14, color: on ? C.paper : C.soft }}>{p.hi}</Text>
              </Card>
            </Pressable>
          );
        })}
      </View>

      <Button big variant="red" label="C’est parti !  ✈️" disabled={!clean || !lang}
        onPress={() => lang && onDone({ name: clean, lang })} />
    </Screen>
  );
}
