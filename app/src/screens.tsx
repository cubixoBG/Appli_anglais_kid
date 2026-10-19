import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { pick, PRESENTATIONS, STICKERS, Word } from './data';
import { RepeatCard } from './RepeatCard';
import { say } from './speech';
import { Button, C, s, Screen, Squirrel } from './ui';

export type Activity = 'learn' | 'memory' | 'parrot';

const STEPS = [
  '👋 Les présentations', '✈️ L’aéroport', '🏠 La famille', '🍽️ À table', '⏰ La journée',
  '🛍️ Sortir', '⚽ Jouer', '🆘 Les urgences', '☕ La culture',
];

const ACTIVITIES: { id: Activity; label: string; color: string }[] = [
  { id: 'learn', label: '🎧 Écouter et répéter', color: C.red },
  { id: 'memory', label: '🃏 Memory sonore', color: C.blue },
  { id: 'parrot', label: '🦜 Le perroquet', color: C.green },
];

export function Home({ done, onOpen, onPassport }: {
  done: Set<Activity>; onOpen: (a: Activity) => void; onPassport: () => void;
}) {
  useEffect(() => {
    say('Hello! Are you ready for your English lesson?');
  }, []);

  return (
    <Screen>
      <Squirrel big en="Hello! Ready for your lesson?" fr="Coucou ! Prête pour ta séance ?" />

      <View style={s.card}>
        <Text style={s.muted}>Mon voyage en Angleterre</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {STEPS.map((step, i) => (
            <View key={step} style={{
              paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16,
              backgroundColor: i === 0 ? C.orange : C.line,
            }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: i === 0 ? '#FFFFFF' : C.soft }}>
                {i === 0 ? step : `🔒 ${i + 1}`}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={s.text}>Ma séance du jour : fais les 3 activités pour gagner un autocollant !</Text>
      {ACTIVITIES.map((a) => (
        <Button key={a.id} big color={a.color} onPress={() => onOpen(a.id)}
          label={`${done.has(a.id) ? '✅ ' : ''}${a.label}`} />
      ))}
      <Button label="🛂 Mon passeport" color={C.orange} onPress={onPassport} />
    </Screen>
  );
}

export function Learn({ onFinish, onBack }: { onFinish: () => void; onBack: () => void }) {
  const words = useMemo(() => pick(PRESENTATIONS, 6), []);
  const [i, setI] = useState(0);
  return (
    <Screen onBack={onBack} title={`Écouter et répéter · ${i + 1}/${words.length}`}>
      <RepeatCard word={words[i]} showText onNext={() => (i + 1 < words.length ? setI(i + 1) : onFinish())} />
    </Screen>
  );
}

// Le perroquet : on n'affiche que l'image, l'enfant répète ce qu'il entend.
export function Parrot({ onFinish, onBack }: { onFinish: () => void; onBack: () => void }) {
  const words = useMemo(() => pick(PRESENTATIONS, 5), []);
  const [i, setI] = useState(0);
  const [stars, setStars] = useState(0);
  const finished = i >= words.length;

  useEffect(() => {
    if (finished) say('Fantastic parrot!');
  }, [finished]);

  if (finished) {
    return (
      <Screen onBack={onBack} title="Le perroquet">
        <Squirrel big en="Fantastic parrot!" fr="Quel super perroquet !" />
        <Text style={{ fontSize: 56, textAlign: 'center' }}>{'⭐'.repeat(Math.max(1, stars))}</Text>
        <Button big label="Terminer ✅" color={C.green} onPress={onFinish} />
      </Screen>
    );
  }
  return (
    <Screen onBack={onBack} title={`🦜 Le perroquet · ${i + 1}/${words.length}`}>
      <RepeatCard word={words[i]} showText={false} onNext={(g) => {
        if (g === 'great') setStars((n) => n + 1);
        setI(i + 1);
      }} />
    </Screen>
  );
}

type Card = { key: string; word: Word; kind: 'image' | 'sound' };

// Memory sonore : associer l'image et le mot entendu.
export function Memory({ onFinish, onBack }: { onFinish: () => void; onBack: () => void }) {
  const cards = useMemo<Card[]>(() => {
    const words = pick(PRESENTATIONS, 4);
    const all = words.flatMap((w) => [
      { key: `${w.en}-i`, word: w, kind: 'image' as const },
      { key: `${w.en}-s`, word: w, kind: 'sound' as const },
    ]);
    return pick(all, all.length);
  }, []);
  const [open, setOpen] = useState<number[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const busy = useRef(false);
  const won = found.size === cards.length / 2;

  useEffect(() => {
    if (won) say('Well done! You found them all!');
  }, [won]);

  function flip(i: number) {
    const c = cards[i];
    if (busy.current || open.includes(i) || found.has(c.word.en)) return;
    say(c.word.en);
    const next = [...open, i];
    setOpen(next);
    if (next.length < 2) return;
    const [a, b] = next.map((n) => cards[n]);
    if (a.word.en === b.word.en) {
      setFound(new Set(found).add(a.word.en));
      setOpen([]);
    } else {
      busy.current = true;
      setTimeout(() => {
        setOpen([]);
        busy.current = false;
      }, 1200);
    }
  }

  return (
    <Screen onBack={onBack} title="🃏 Memory sonore">
      <Squirrel en="Find the pairs!" fr="Trouve les paires : une image et son mot !" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
        {cards.map((c, i) => {
          const done = found.has(c.word.en);
          const shown = done || open.includes(i);
          return (
            <Pressable key={c.key} onPress={() => flip(i)} accessibilityRole="button"
              accessibilityLabel={shown ? c.word.en : 'Carte cachée'}
              style={{
                width: '46%', aspectRatio: 1, borderRadius: 24, alignItems: 'center', justifyContent: 'center',
                backgroundColor: done ? '#D8F0DE' : shown ? C.card : C.blue, borderWidth: 3,
                borderColor: done ? C.green : C.line,
              }}>
              {shown ? (
                <>
                  <Text style={{ fontSize: 64 }}>{c.kind === 'image' ? c.word.emoji : '🔊'}</Text>
                  {done || c.kind === 'sound' ? <Text style={[s.text, { fontWeight: '700' }]}>{c.word.en}</Text> : null}
                </>
              ) : (
                <Text style={{ fontSize: 56 }}>🐿️</Text>
              )}
            </Pressable>
          );
        })}
      </View>
      {won ? <Button big label="Bravo ! Terminer ✅" color={C.green} onPress={onFinish} /> : null}
    </Screen>
  );
}

export function StickerWon({ count, onContinue }: { count: number; onContinue: () => void }) {
  const sticker = STICKERS[(count - 1) % STICKERS.length];
  useEffect(() => {
    say('Amazing! You won a sticker!');
  }, []);
  return (
    <Screen>
      <Squirrel big en="Amazing! You won a sticker!" fr="Génial ! Tu as gagné un autocollant !" />
      <View style={s.card}>
        <Text style={{ fontSize: 140 }}>{sticker.emoji}</Text>
        <Text style={s.big}>{sticker.name}</Text>
      </View>
      <Button big label="🛂 Le coller dans mon passeport" color={C.orange} onPress={onContinue} />
    </Screen>
  );
}

export function Passport({ count, onBack }: { count: number; onBack: () => void }) {
  return (
    <Screen onBack={onBack} title="🛂 Mon passeport">
      <Text style={s.text}>
        {count === 0 ? 'Termine ta première séance pour gagner un autocollant !' : `${count} autocollant${count > 1 ? 's' : ''} gagné${count > 1 ? 's' : ''} !`}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
        {STICKERS.map((st, i) => {
          const got = i < count;
          return (
            <View key={st.name} accessibilityLabel={got ? st.name : 'Autocollant à gagner'} style={{
              width: '30%', aspectRatio: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
              backgroundColor: got ? C.card : 'transparent', borderWidth: 3, borderStyle: got ? 'solid' : 'dashed',
              borderColor: got ? C.orange : C.line,
            }}>
              <Text style={{ fontSize: 48, opacity: got ? 1 : 0.25 }}>{got ? st.emoji : '?'}</Text>
            </View>
          );
        })}
      </View>
      {count >= STICKERS.length ? <Text style={s.big}>🎉 Passeport complet !</Text> : null}
    </Screen>
  );
}
