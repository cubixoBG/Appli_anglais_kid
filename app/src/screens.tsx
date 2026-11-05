import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, useWindowDimensions, View } from 'react-native';
import { currentStep, pick, SESSIONS_PER_STEP, STEPS, Word } from './data';
import { profile, T } from './lang';
import { Emoji } from './Emoji';
import { RepeatCard } from './RepeatCard';
import { testNotification } from './reminder';
import { say } from './speech';
import { Button, C, Card, F, s, Screen, Squirrel, Stamp, Text, useScale } from './ui';

export type Activity = 'learn' | 'memory' | 'parrot';

// Le titre de chaque jeu est dans la langue apprise (T().activities, même ordre).
const ACTIVITIES: { id: Activity; icon: string; sub: string }[] = [
  { id: 'learn', icon: '🎧', sub: 'Écouter et répéter' },
  { id: 'memory', icon: '🃏', sub: 'Trouve les paires' },
  { id: 'parrot', icon: '🦜', sub: 'Répète ce que tu entends' },
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
            <View style={{ width: 46, alignItems: 'center' }}><Emoji e={icon} size={32} /></View>
            <View style={{ alignSelf: 'stretch', borderLeftWidth: 2.5, borderStyle: 'dashed', borderColor: C.line, marginHorizontal: 12 }} />
            <View style={{ flex: 1, paddingVertical: 2 }}>
              <Text style={{ fontFamily: F.bold, fontSize: 17, color: C.ink }}>{label}</Text>
              <Text style={{ fontFamily: F.regular, fontSize: 14, color: C.soft }}>{sub}</Text>
            </View>
            <Text style={{ fontFamily: F.bold, fontSize: 24, color: C.ink }}>→</Text>
          </View>
          {done ? <Stamp label="FAIT ✓" style={{ right: 32, top: 10 }} /> : null}
        </Card>
      )}
    </Pressable>
  );
}

// Le voyage façon plan du métro de Londres : une ligne, une station par étape.
// Stations passées en marine, station actuelle en rouge avec sa progression, les suivantes verrouillées.
// Toucher une station débloquée choisit le thème des jeux (pour réviser une étape passée).
function TubeMap({ stickers, selected, onSelect }: {
  stickers: number; selected: number; onSelect: (step: number) => void;
}) {
  const current = currentStep(stickers);
  const progress = Math.min(stickers - current * SESSIONS_PER_STEP, SESSIONS_PER_STEP);
  return (
    <Card>
      <View style={{ alignSelf: 'stretch' }}>
        <Text style={[s.label, { marginBottom: 4 }]}>Ligne du voyage</Text>
        {current > 0 ? (
          <Text style={[s.muted, { textAlign: 'left', fontSize: 14, marginBottom: 8 }]}>
            Touche une étape passée pour la réviser.
          </Text>
        ) : null}
        {STEPS.map((step, i) => {
          const here = i === current;
          const passed = i < current;
          const chosen = i === selected;
          return (
            <Pressable key={step.name} disabled={i > current} onPress={() => onSelect(i)}
              accessibilityRole="button" accessibilityState={{ selected: chosen, disabled: i > current }}
              accessibilityLabel={`${step.name}${i > current ? ', verrouillée' : chosen ? ', choisie' : ''}`}
              style={{
                flexDirection: 'row', alignItems: 'center', height: 34, marginHorizontal: -8, paddingHorizontal: 8,
                borderRadius: 12, backgroundColor: chosen && current > 0 ? C.paper : 'transparent',
              }}>
              <View style={{ width: 32, alignItems: 'center', alignSelf: 'stretch', justifyContent: 'center' }}>
                <View style={{
                  position: 'absolute', width: 8, backgroundColor: passed ? C.ink : here ? C.red : C.line,
                  top: i === 0 ? 17 : 0, bottom: i === STEPS.length - 1 ? 17 : 0,
                }} />
                <View style={{
                  width: here ? 24 : 16, height: here ? 24 : 16, borderRadius: 12,
                  backgroundColor: passed ? C.ink : C.card,
                  borderWidth: here ? 5 : 3, borderColor: here || passed ? C.ink : C.line,
                }} />
              </View>
              <Text style={{
                marginLeft: 12, flex: 1, fontSize: here || chosen ? 16 : 15,
                fontFamily: here || chosen ? F.bold : F.regular, color: here || passed ? C.ink : C.soft,
              }}>
                {step.name}
              </Text>
              {chosen && passed ? (
                <View style={{ backgroundColor: C.ink, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, flexShrink: 0 }}>
                  <Text style={{ color: C.card, fontFamily: F.semi, fontSize: 13 }}>Je révise</Text>
                </View>
              ) : here ? (
                <View style={{ backgroundColor: C.red, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, flexShrink: 0 }}>
                  <Text style={{ color: C.card, fontFamily: F.semi, fontSize: 13 }}>
                    Tu es ici · {progress}/{SESSIONS_PER_STEP}
                  </Text>
                </View>
              ) : passed ? (
                <Text style={{ fontSize: 16, color: C.ink, fontFamily: F.bold }}>✓</Text>
              ) : (
                <Emoji e="🔒" size={14} opacity={0.5} />
              )}
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

export function Home({ done, stickers, step, onSelectStep, onOpen, onPassport, onProfile }: {
  done: Set<Activity>; stickers: number; step: number; onSelectStep: (step: number) => void;
  onOpen: (a: Activity) => void; onPassport: () => void; onProfile: () => void;
}) {
  // Une étape avant celle du voyage = révision : les billets de la séance du jour ne bougent pas.
  const revising = step < currentStep(stickers);
  const hello = T().hello(profile.name);
  useEffect(() => {
    say(hello);
  }, [hello]);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
        <Text numberOfLines={1} style={[s.label, { fontSize: 11, letterSpacing: 1.2, flexShrink: 1, marginRight: 8 }]}>Mon carnet de voyage</Text>
        <Pressable onPress={onProfile} accessibilityRole="button" accessibilityLabel={`Langue : ${T().label}. Changer de langue ou de prénom`}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 2, borderColor: C.ink, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: C.card }}>
          <Emoji e={T().flag} size={20} />
          <Text style={{ fontFamily: F.semi, fontSize: 14, color: C.ink }}>Changer</Text>
        </Pressable>
      </View>
      <Squirrel t={hello} fr={`Coucou ${profile.name} ! On commence ta séance ?`} />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', columnGap: 12, marginTop: 4 }}>
        <Text style={{ fontFamily: F.bold, fontSize: 21, color: C.ink }}>{revising ? 'Révision' : 'Séance du jour'}</Text>
        {revising ? null : <Text style={{ fontFamily: F.semi, fontSize: 16, color: C.red }}>{done.size}/3 billets</Text>}
      </View>
      <Text style={[s.muted, { textAlign: 'left', marginTop: -10, fontSize: 15 }]}>
        {revising
          ? `${STEPS[step].name} · pour t’entraîner, ça ne compte pas pour la séance du jour.`
          : `${STEPS[step].name} · fais les 3 pour gagner un autocollant !`}
      </Text>
      {ACTIVITIES.map((a, i) => (
        <Ticket key={a.id} {...a} label={T().activities[i]} done={!revising && done.has(a.id)} onPress={() => onOpen(a.id)} />
      ))}

      <TubeMap stickers={stickers} selected={step} onSelect={onSelectStep} />
      <Button icon="🛂" label="Mon passeport" variant="red" onPress={onPassport} />
      {/* shortcut: bouton de diagnostic des notifications, à retirer une fois validées */}
      <Button icon="🔔" label="Tester la notification" variant="outline"
        onPress={() => testNotification().then((m) => Alert.alert('Notifications', m), (e) => Alert.alert('Erreur', String(e)))} />
    </Screen>
  );
}

type GameProps = { words: Word[]; onFinish: () => void; onBack: () => void };

export function Learn({ words: stepWords, onFinish, onBack }: GameProps) {
  const words = useMemo(() => pick(stepWords, 6), [stepWords]);
  const [i, setI] = useState(0);
  return (
    <Screen fill onBack={onBack} title={`Écouter et répéter · ${i + 1}/${words.length}`}>
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
    if (finished) say(T().parrot);
  }, [finished]);

  if (finished) {
    return (
      <Screen onBack={onBack} title="Le perroquet">
        <Squirrel t={T().parrot} fr="Quel super perroquet !" />
        <Card tilt={2}>
          <Emoji e="🦜" size={64} />
          <Text style={{ fontSize: 36, letterSpacing: 6 }}>
            {words.map((_, n) => (n < Math.max(1, stars) ? '★' : '☆')).join('')}
          </Text>
          <Text style={s.muted}>{Math.max(1, stars)} étoile{stars > 1 ? 's' : ''} sur {words.length}</Text>
        </Card>
        <Button big label="Terminer  ✓" variant="red" onPress={onFinish} />
      </Screen>
    );
  }
  return (
    <Screen fill onBack={onBack} title={`Le perroquet · ${i + 1}/${words.length}`}>
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
      { key: `${w.t}-i`, word: w, kind: 'image' as const },
      { key: `${w.t}-s`, word: w, kind: 'sound' as const },
    ]);
    return pick(all, all.length);
  }, [stepWords]);
  const [open, setOpen] = useState<number[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const busy = useRef(false);
  const won = found.size === cards.length / 2;
  // Les 4 rangées de cartes tiennent dans la hauteur de l'écran : on déduit l'en-tête, la bulle,
  // les marges et les 3 espaces entre rangées.
  const { height } = useWindowDimensions();
  const cardH = Math.max(72, Math.min(160, (height - 270) / 4));

  useEffect(() => {
    if (won) say(T().foundAll);
  }, [won]);

  function flip(i: number) {
    const c = cards[i];
    if (busy.current || open.includes(i) || found.has(c.word.t)) return;
    say(c.word.t);
    const next = [...open, i];
    setOpen(next);
    if (next.length < 2) return;
    const [a, b] = next.map((n) => cards[n]);
    if (a.word.t === b.word.t) {
      setFound(new Set(found).add(a.word.t));
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
        <Button label="Bravo ! Terminer  ✓" variant="red" onPress={onFinish} />
      ) : (
        <Squirrel compact t={T().pairs} fr="Trouve les paires : une image et son mot !" />
      )}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 }}>
        {cards.map((c, i) => {
          const done = found.has(c.word.t);
          const shown = done || open.includes(i);
          return (
            <Pressable key={c.key} onPress={() => flip(i)} accessibilityRole="button"
              accessibilityLabel={shown ? c.word.t : 'Carte cachée'} style={{ width: '47%', height: cardH }}>
              <View style={[s.shadow, { borderRadius: 20 }]} />
              <View style={{
                flex: 1, borderRadius: 20, borderWidth: 2.5, borderColor: C.ink, alignItems: 'center', justifyContent: 'center',
                backgroundColor: shown ? C.card : C.ink, gap: 2,
              }}>
                {shown ? (
                  <>
                    <Emoji e={c.kind === 'image' ? c.word.emoji : '🔊'} size={cardH * 0.36} />
                    {done || c.kind === 'sound' ? (
                      <Text style={{ fontFamily: F.bold, fontSize: cardH < 120 ? 14 : 17, color: C.ink, textAlign: 'center' }}>{c.word.t}</Text>
                    ) : null}
                  </>
                ) : (
                  // Dos de carte : cadre intérieur crème, comme un timbre
                  <View style={{
                    position: 'absolute', top: 8, left: 8, right: 8, bottom: 8, borderRadius: 12,
                    borderWidth: 2, borderStyle: 'dashed', borderColor: C.paper, alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Emoji e="🐿️" size={cardH * 0.28} />
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
  const k = useScale();
  const disc = Math.round(190 * k);
  const sticker = T().stickers[(count - 1) % T().stickers.length];
  // Cet autocollant fait-il avancer la ligne du voyage ?
  const step = currentStep(count);
  const unlocked = step > currentStep(count - 1) ? STEPS[step].name : null;
  useEffect(() => {
    say(unlocked ? `${T().sticker} ${T().newStep}` : T().sticker);
  }, [unlocked]);
  return (
    <Screen>
      <Squirrel t={T().sticker} fr={`Génial ${profile.name} ! Tu as gagné un autocollant !`} />
      {unlocked ? (
        <Card bg={C.ink} tilt={1}>
          <Text style={[s.label, { color: C.paper }]}>Nouvelle étape débloquée</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Emoji e="🚉" size={22} />
            <Text style={{ fontFamily: F.bold, fontSize: 22, color: C.paper, textAlign: 'center', flexShrink: 1 }}>{unlocked}</Text>
          </View>
        </Card>
      ) : null}
      <View style={{ alignItems: 'center', marginVertical: 8 }}>
        <View style={{ transform: [{ rotate: '-6deg' }] }}>
          <View style={[s.shadow, { borderRadius: disc }]} />
          <View style={{
            width: disc, height: disc, borderRadius: disc / 2, backgroundColor: C.card, borderWidth: 3, borderColor: C.ink,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Emoji e={sticker.emoji} size={disc * 0.52} />
          </View>
          <Stamp label="NEW!" style={{ top: 4, right: -8 }} />
        </View>
      </View>
      <Text style={s.big}>{sticker.name}</Text>
      <Button big icon="🛂" label="Le coller dans mon passeport" variant="red" onPress={onContinue} />
    </Screen>
  );
}

export function Passport({ count, onBack }: { count: number; onBack: () => void }) {
  return (
    <Screen onBack={onBack}>
      {/* Couverture du passeport */}
      <Card bg={C.ink}>
        <Emoji e={T().cover} size={34} />
        <Text style={{ fontFamily: F.bold, fontSize: 22, color: C.paper, letterSpacing: 4 }}>{T().passport}</Text>
        <Text style={{ fontFamily: F.regular, fontSize: 12, color: C.paper, opacity: 0.8, letterSpacing: 2, textAlign: 'center' }}>
          {`${profile.name} · MON VOYAGE EN ${T().country}`.toUpperCase()}
        </Text>
      </Card>

      <Text style={s.text}>
        {count === 0
          ? 'Termine ta première séance pour gagner un autocollant !'
          : `${Math.min(count, T().stickers.length)} autocollant${count > 1 ? 's' : ''} sur ${T().stickers.length}`}
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14 }}>
        {T().stickers.map((st, i) => {
          const got = i < count;
          return (
            <View key={st.name} accessibilityLabel={got ? st.name : 'Autocollant à gagner'}
              style={{ width: '23%', alignItems: 'center', gap: 4 }}>
              <View style={{
                width: '100%', aspectRatio: 1, borderRadius: 999, alignItems: 'center', justifyContent: 'center',
                borderWidth: got ? 3 : 2.5, borderStyle: got ? 'solid' : 'dashed', borderColor: got ? C.ink : C.line,
                backgroundColor: got ? C.card : 'transparent', transform: [{ rotate: `${got ? TILTS[i] : 0}deg` }],
              }}>
                {got ? <Emoji e={st.emoji} size={34} /> : <Text style={{ fontSize: 30, opacity: 0.2 }}>?</Text>}
              </View>
              <Text numberOfLines={2} style={{ fontFamily: F.regular, fontSize: 11, color: got ? C.ink : C.soft, textAlign: 'center' }}>
                {got ? st.name : '…'}
              </Text>
            </View>
          );
        })}
      </View>
      {count >= T().stickers.length ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Emoji e="🎉" size={32} />
          <Text style={s.big}>Passeport complet !</Text>
        </View>
      ) : null}
    </Screen>
  );
}
