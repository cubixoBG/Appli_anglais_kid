import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Word } from './data';
import { Emoji } from './Emoji';
import { T } from './lang';
import { grade, Grade, hint } from './score';
import { canListen, listen, say } from './speech';
import { Button, C, Card, F, s, Squirrel, Text, useScale } from './ui';

// Le retour de l'écureuil : dans la langue apprise, avec le sous-titre en français.
const FEEDBACK_FR: Record<Grade, string> = { great: 'Bravo, c’est super !', almost: 'Presque !', retry: 'Encore une fois ?' };

// Écouter → répéter → retour. Jamais bloquant : après 2 essais, on peut toujours passer au suivant.
export function RepeatCard({ word, showText, onNext }: { word: Word; showText: boolean; onNext: (g: Grade) => void }) {
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<Grade | null>(null);
  const [tries, setTries] = useState(0);
  const mic = canListen();

  useEffect(() => {
    setResult(null);
    setTries(0);
    say(word.t);
  }, [word]);

  async function repeat() {
    let g: Grade = 'great';
    if (mic) {
      setListening(true);
      g = grade(word.t, await listen(word.t), T().numbers);
      setListening(false);
    }
    setResult(g);
    setTries((t) => t + 1);
    say(T()[g]);
  }

  const revealed = showText || result !== null;
  const canGoOn = result === 'great' || tries >= 2;
  const k = useScale();
  const micSize = Math.round(112 * k);

  // Tout tient sur un écran : la carte du mot en haut, les commandes au milieu, la réponse et « Suivant » en bas.
  return (
    <View style={{ flex: 1, gap: 12, justifyContent: 'space-between' }}>
      <Card tilt={-1.5} style={{ marginHorizontal: 8 }}>
        <View style={{
          width: 120 * k, height: 120 * k, borderRadius: 60 * k, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center',
        }}>
          <Emoji e={word.emoji} size={72 * k} />
        </View>
        <Text style={[s.big, { fontSize: 28 * k, marginTop: 4 }]}>{revealed ? word.t : '? ? ?'}</Text>
        <View style={{ alignSelf: 'stretch', borderTopWidth: 2, borderStyle: 'dashed', borderColor: C.line, marginVertical: 2 }} />
        <Text style={s.muted}>{revealed ? word.fr : 'Écoute bien…'}</Text>
      </Card>

      {/* Écouter et Lentement, en ronds de part et d'autre du gros micro : une seule rangée. */}
      <View style={{ alignItems: 'center', gap: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18 * k }}>
          <RoundButton icon="🔊" label="Écouter" size={64 * k} onPress={() => say(word.t)} />
          {/* Gros bouton micro rond : l'anneau rouge montre que l'écureuil écoute. */}
          <Pressable onPress={repeat} disabled={listening} accessibilityRole="button"
            accessibilityLabel={mic ? 'Parler' : 'J’ai répété'}
            style={{ padding: 6, borderRadius: micSize, borderWidth: 4, borderColor: listening ? C.red : 'transparent' }}>
            {({ pressed }) => (
              <View>
                <View style={{ position: 'absolute', top: 5, left: 5, width: micSize, height: micSize, borderRadius: micSize / 2, backgroundColor: C.ink }} />
                <View style={{
                  width: micSize, height: micSize, borderRadius: micSize / 2, backgroundColor: listening ? C.ink : C.red,
                  borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center',
                  transform: pressed ? [{ translateX: 4 }, { translateY: 4 }] : [],
                }}>
                  <Emoji e={listening ? '👂' : mic ? '🎤' : '🗣️'} size={micSize * 0.42} />
                </View>
              </View>
            )}
          </Pressable>
          <RoundButton icon="🐢" label="Lentement" size={64 * k} onPress={() => say(word.t, true)} />
        </View>
        <Text style={{ fontFamily: F.semi, fontSize: 17, color: listening ? C.red : C.ink }}>
          {listening ? 'Je t’écoute…' : mic ? 'À toi de le dire !' : 'Appuie quand tu as répété'}
        </Text>
      </View>

      {/* La réponse de l'écureuil et « Suivant » ; la place est gardée pour que rien ne saute. */}
      <View style={{ gap: 10, minHeight: 64 }}>
        {result ? (
          <Squirrel compact
            t={T()[result]}
            fr={result === 'great' ? FEEDBACK_FR.great : `${FEEDBACK_FR[result]} ${hint(word.t, T().hints)}`}
          />
        ) : null}
        {canGoOn ? <Button label="Suivant  →" variant="ink" onPress={() => onNext(result ?? 'retry')} /> : null}
      </View>
    </View>
  );
}

// Petit bouton rond avec son nom dessous (Écouter, Lentement).
function RoundButton({ icon, label, size, onPress }: { icon: string; label: string; size: number; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={{ alignItems: 'center', gap: 4 }}>
      {({ pressed }) => (
        <>
          <View>
            <View style={{ position: 'absolute', top: 4, left: 4, width: size, height: size, borderRadius: size / 2, backgroundColor: C.ink }} />
            <View style={{
              width: size, height: size, borderRadius: size / 2, backgroundColor: C.card, borderWidth: 2.5, borderColor: C.ink,
              alignItems: 'center', justifyContent: 'center', transform: pressed ? [{ translateX: 3 }, { translateY: 3 }] : [],
            }}>
              <Emoji e={icon} size={size * 0.45} />
            </View>
          </View>
          <Text style={{ fontFamily: F.semi, fontSize: 13, color: C.ink }}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}
