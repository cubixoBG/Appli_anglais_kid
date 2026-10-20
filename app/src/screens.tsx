import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { currentStep, pick, SESSIONS_PER_STEP, STEPS, STICKERS, Word } from './data';
import { RepeatCard } from './RepeatCard';
import { say } from './speech';
import { Button, C, Card, F, s, Screen, Squirrel, Stamp, Text } from './ui';

export type Activity = 'learn' | 'memory' | 'parrot';

const ACTIVITIES: { id: Activity; icon: string; label: string; sub: string }[] = [
  { id: 'learn', icon: '🎧', label: 'Listen and repeat', sub: 'Écouter et répéter' },
  { id: 'memory', icon: '🃏', label: 'Find the pairs', sub: 'Trouve les paires' },
  { id: 'parrot', icon: '🦜', label: 'The parrot', sub: 'Répète ce que tu entends' },
];

// Petites inclinaisons fixes pour l'effet « collé à la main »
const TILTS = [-4, 3, -2, 5, -5, 2, 4, -3, 1, -4, 3, -1];

// Un billet de la séance : talon avec l'icône, pointillés, puis le nom. Tamponné quand c'est fait.
function Ticket({ icon, label, sub, done, onPress }: {
  icon: string; label: string; sub: string; done: boolean; onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${label}${done ? ', fait' : ''}`}>
      {({ pressed }) => (
        <Card style={{ opacity: pressed ? 0.85 : 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', marginVertical: -6 }}>
            <Text style={{ fontSize: 40, width: 56, textAlign: 'center' }}>{icon}</Text>
            <View style={{ alignSelf: 'stretch', borderLeftWidth: 2.5, borderStyle: 'dashed', borderColor: C.line, marginHorizontal: 16 }} />
            <View style={{ flex: 1, paddingVertical: 4 }}>
              <Text style={{ fontFamily: F.bold, fontSize: 18, color: C.ink }}>{label}</Text>
              <Text style={{ fontFamily: F.regular, fontSize: 15, color: C.soft }}>{sub}</Text>
            </View>
            <Text style={{ fontFamily: F.bold, fontSize: 24, color: C.ink }}>→</Text>
          </View>
          {done ? <Stamp label="FAIT ✓" style={{ right: 36, top: 14 }} /> : null}
        </Card>
      )}
    </Pressable>
  );
}

// Le voyage façon plan du métro de Londres : une ligne, une station par étape.
// Stations passées en marine, station actuelle en rouge avec sa progression, les suivantes verrouillées.
function TubeMap({ stickers }: { stickers: number }) {
  const current = currentStep(stickers);
  const progress = Math.min(stickers - current * SESSIONS_PER_STEP, SESSIONS_PER_STEP);
  return (
    <Card>
      <View style={{ alignSelf: 'stretch' }}>
        <Text style={[s.label, { marginBottom: 8 }]}>Ligne du voyage</Text>
        {STEPS.map((step, i) => {
          const here = i === current;
          const passed = i < current;
          return (
            <View key={step.name} style={{ flexDirection: 'row', alignItems: 'center', height: 40 }}>
              <View style={{ width: 32, alignItems: 'center', alignSelf: 'stretch', justifyContent: 'center' }}>
                <View style={{
                  position: 'absolute', width: 8, backgroundColor: passed ? C.ink : here ? C.red : C.line,
                  top: i === 0 ? 20 : 0, bottom: i === STEPS.length - 1 ? 20 : 0,
                }} />
                <View style={{
                  width: here ? 24 : 16, height: here ? 24 : 16, borderRadius: 12,
                  backgroundColor: passed ? C.ink : C.card,
                  borderWidth: here ? 5 : 3, borderColor: here || passed ? C.ink : C.line,
                }} />
              </View>
              <Text style={{
                marginLeft: 12, flex: 1, fontSize: here ? 17 : 16,
                fontFamily: here ? F.bold : F.regular, color: here || passed ? C.ink : C.soft,
              }}>
                {step.name}
              </Text>
              {here ? (
                <View style={{ backgroundColor: C.red, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, flexShrink: 0 }}>
                  <Text style={{ color: C.card, fontFamily: F.semi, fontSize: 13 }}>
                    Tu es ici · {progress}/{SESSIONS_PER_STEP}
                  </Text>
                </View>
              ) : passed ? (
                <Text style={{ fontSize: 16, color: C.ink, fontFamily: F.bold }}>✓</Text>
              ) : (
                <Text style={{ fontSize: 14, opacity: 0.5 }}>🔒</Text>
              )}
            </View>
          );
        })}
      </View>
    </Card>
  );
}

export function Home({ done, stickers, onOpen, onPassport }: {
  done: Set<Activity>; stickers: number; onOpen: (a: Activity) => void; onPassport: () => void;
}) {
  useEffect(() => {
    say('Hello! Are you ready for your English lesson?');
  }, []);

  return (
    <Screen>
      <Text style={[s.label, { marginTop: 8 }]}>Mon carnet de voyage</Text>
      <Squirrel big en="Hello! Ready for your lesson?" fr="Coucou ! Prête pour ta séance ?" />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', columnGap: 12, marginTop: 8 }}>
        <Text style={{ fontFamily: F.bold, fontSize: 22, color: C.ink }}>Séance du jour</Text>
        <Text style={{ fontFamily: F.semi, fontSize: 16, color: C.red }}>{done.size}/3 billets</Text>
      </View>
      <Text style={[s.muted, { textAlign: 'left', marginTop: -12 }]}>Fais les 3 pour gagner un autocollant !</Text>
      {ACTIVITIES.map((a) => (
        <Ticket key={a.id} {...a} done={done.has(a.id)} onPress={() => onOpen(a.id)} />
      ))}

      <TubeMap stickers={stickers} />
      <Button label="🛂  Mon passeport" variant="red" onPress={onPassport} />
    </Screen>
  );
}

type GameProps = { words: Word[]; onFinish: () => void; onBack: () => void };

export function Learn({ words: stepWords, onFinish, onBack }: GameProps) {
  const words = useMemo(() => pick(stepWords, 6), [stepWords]);
  const [i, setI] = useState(0);
  return (
    <Screen onBack={onBack} title={`Écouter et répéter · ${i + 1}/${words.length}`}>
      <RepeatCard word={words[i]} showText onNext={() => (i + 1 < words.length ? setI(i + 1) : onFinish())} />
    </Screen>
  );
}

// Le perroquet : on n'affiche que l'image, l'enfant répète ce qu'il entend.
export function Parrot({ words: stepWords, onFinish, onBack }: GameProps) {
  const words = useMemo(() => pick(stepWords, 5), [stepWords]);
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
        <Card tilt={2}>
          <Text style={{ fontSize: 72 }}>🦜</Text>
          <Text style={{ fontSize: 40, letterSpacing: 6 }}>
            {words.map((_, n) => (n < Math.max(1, stars) ? '★' : '☆')).join('')}
          </Text>
          <Text style={s.muted}>{Math.max(1, stars)} étoile{stars > 1 ? 's' : ''} sur {words.length}</Text>
        </Card>
        <Button big label="Terminer  ✓" variant="red" onPress={onFinish} />
      </Screen>
    );
  }
  return (
    <Screen onBack={onBack} title={`Le perroquet · ${i + 1}/${words.length}`}>
      <RepeatCard word={words[i]} showText={false} onNext={(g) => {
        if (g === 'great') setStars((n) => n + 1);
        setI(i + 1);
      }} />
    </Screen>
  );
}

type MemoryCard = { key: string; word: Word; kind: 'image' | 'sound' };

// Memory sonore : associer l'image et le mot entendu.
export function Memory({ words: stepWords, onFinish, onBack }: GameProps) {
  const cards = useMemo<MemoryCard[]>(() => {
    const words = pick(stepWords, 4);
    const all = words.flatMap((w) => [
      { key: `${w.en}-i`, word: w, kind: 'image' as const },
      { key: `${w.en}-s`, word: w, kind: 'sound' as const },
    ]);
    return pick(all, all.length);
  }, [stepWords]);
  const [open, setOpen] = useState<number[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const busy = useRef(false);
  const won = found.size === cards.length / 2;
  // Les 4 rangées de cartes tiennent dans la hauteur de l'écran (en-tête, bulle et marges déduites).
  const { height } = useWindowDimensions();
  const cardH = Math.max(84, Math.min(170, (height - 330) / 4));

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
    <Screen onBack={onBack} title="Memory sonore">
      {won ? (
        <Button big label="Bravo ! Terminer  ✓" variant="red" onPress={onFinish} />
      ) : (
        <Squirrel en="Find the pairs!" fr="Trouve les paires : une image et son mot !" />
      )}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14 }}>
        {cards.map((c, i) => {
          const done = found.has(c.word.en);
          const shown = done || open.includes(i);
          return (
            <Pressable key={c.key} onPress={() => flip(i)} accessibilityRole="button"
              accessibilityLabel={shown ? c.word.en : 'Carte cachée'} style={{ width: '47%', height: cardH }}>
              <View style={[s.shadow, { borderRadius: 20 }]} />
              <View style={{
                flex: 1, borderRadius: 20, borderWidth: 2.5, borderColor: C.ink, alignItems: 'center', justifyContent: 'center',
                backgroundColor: shown ? C.card : C.ink, gap: 2,
              }}>
                {shown ? (
                  <>
                    <Text style={{ fontSize: cardH * 0.36 }}>{c.kind === 'image' ? c.word.emoji : '🔊'}</Text>
                    {done || c.kind === 'sound' ? (
                      <Text style={{ fontFamily: F.bold, fontSize: cardH < 120 ? 14 : 17, color: C.ink, textAlign: 'center' }}>{c.word.en}</Text>
                    ) : null}
                  </>
                ) : (
                  // Dos de carte : cadre intérieur crème, comme un timbre
                  <View style={{
                    position: 'absolute', top: 8, left: 8, right: 8, bottom: 8, borderRadius: 12,
                    borderWidth: 2, borderStyle: 'dashed', borderColor: C.paper, alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: cardH * 0.28 }}>🐿️</Text>
                  </View>
                )}
                {done ? <Stamp label="✓" style={{ top: 8, right: 8 }} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

export function StickerWon({ count, onContinue }: { count: number; onContinue: () => void }) {
  const sticker = STICKERS[(count - 1) % STICKERS.length];
  // Cet autocollant fait-il avancer la ligne du voyage ?
  const step = currentStep(count);
  const unlocked = step > currentStep(count - 1) ? STEPS[step].name : null;
  useEffect(() => {
    say(unlocked ? 'Amazing! You won a sticker! And a new step of your trip!' : 'Amazing! You won a sticker!');
  }, [unlocked]);
  return (
    <Screen>
      <Squirrel big en="Amazing! You won a sticker!" fr="Génial ! Tu as gagné un autocollant !" />
      {unlocked ? (
        <Card bg={C.ink} tilt={1}>
          <Text style={[s.label, { color: C.paper }]}>Nouvelle étape débloquée</Text>
          <Text style={{ fontFamily: F.bold, fontSize: 26, color: C.paper, textAlign: 'center' }}>🚉  {unlocked}</Text>
        </Card>
      ) : null}
      <View style={{ alignItems: 'center', marginVertical: 16 }}>
        <View style={{ transform: [{ rotate: '-6deg' }] }}>
          <View style={[s.shadow, { borderRadius: 120 }]} />
          <View style={{
            width: 220, height: 220, borderRadius: 110, backgroundColor: C.card, borderWidth: 3, borderColor: C.ink,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 120 }}>{sticker.emoji}</Text>
          </View>
          <Stamp label="NEW!" style={{ top: 4, right: -8 }} />
        </View>
      </View>
      <Text style={s.big}>{sticker.name}</Text>
      <Button big label="🛂  Le coller dans mon passeport" variant="red" onPress={onContinue} />
    </Screen>
  );
}

export function Passport({ count, onBack }: { count: number; onBack: () => void }) {
  return (
    <Screen onBack={onBack}>
      {/* Couverture du passeport */}
      <Card bg={C.ink}>
        <Text style={{ fontSize: 44 }}>🦁</Text>
        <Text style={{ fontFamily: F.bold, fontSize: 26, color: C.paper, letterSpacing: 4 }}>PASSPORT</Text>
        <Text style={{ fontFamily: F.regular, fontSize: 14, color: C.paper, opacity: 0.8, letterSpacing: 2 }}>
          MON VOYAGE EN ANGLETERRE
        </Text>
      </Card>

      <Text style={s.text}>
        {count === 0
          ? 'Termine ta première séance pour gagner un autocollant !'
          : `${Math.min(count, STICKERS.length)} autocollant${count > 1 ? 's' : ''} sur ${STICKERS.length}`}
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 20 }}>
        {STICKERS.map((st, i) => {
          const got = i < count;
          return (
            <View key={st.name} accessibilityLabel={got ? st.name : 'Autocollant à gagner'}
              style={{ width: '30%', alignItems: 'center', gap: 6 }}>
              <View style={{
                width: '100%', aspectRatio: 1, borderRadius: 999, alignItems: 'center', justifyContent: 'center',
                borderWidth: got ? 3 : 2.5, borderStyle: got ? 'solid' : 'dashed', borderColor: got ? C.ink : C.line,
                backgroundColor: got ? C.card : 'transparent', transform: [{ rotate: `${got ? TILTS[i] : 0}deg` }],
              }}>
                <Text style={{ fontSize: 44, opacity: got ? 1 : 0.2 }}>{got ? st.emoji : '?'}</Text>
              </View>
              <Text numberOfLines={2} style={{ fontFamily: F.regular, fontSize: 12, color: got ? C.ink : C.soft, textAlign: 'center' }}>
                {got ? st.name : '…'}
              </Text>
            </View>
          );
        })}
      </View>
      {count >= STICKERS.length ? <Text style={s.big}>🎉 Passeport complet !</Text> : null}
    </Screen>
  );
}
