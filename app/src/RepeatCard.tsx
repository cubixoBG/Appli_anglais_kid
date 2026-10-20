import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Word } from './data';
import { grade, Grade, hint } from './score';
import { canListen, listen, say } from './speech';
import { Button, C, Card, F, s, Squirrel } from './ui';

const FEEDBACK: Record<Grade, { en: string; fr: string }> = {
  great: { en: 'Well done!', fr: 'Bravo, c’est super !' },
  almost: { en: 'Almost!', fr: 'Presque !' },
  retry: { en: 'One more time?', fr: 'Encore une fois ?' },
};

// Écouter → répéter → retour. Jamais bloquant : après 2 essais, on peut toujours passer au suivant.
export function RepeatCard({ word, showText, onNext }: { word: Word; showText: boolean; onNext: (g: Grade) => void }) {
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<Grade | null>(null);
  const [tries, setTries] = useState(0);
  const mic = canListen();

  useEffect(() => {
    setResult(null);
    setTries(0);
    say(word.en);
  }, [word]);

  async function repeat() {
    let g: Grade = 'great';
    if (mic) {
      setListening(true);
      g = grade(word.en, await listen(word.en));
      setListening(false);
    }
    setResult(g);
    setTries((t) => t + 1);
    say(FEEDBACK[g].en);
  }

  const revealed = showText || result !== null;
  const canGoOn = result === 'great' || tries >= 2;

  return (
    <View style={{ gap: 20 }}>
      <Card tilt={-1.5} style={{ marginHorizontal: 8 }}>
        <View style={{ width: 132, height: 132, borderRadius: 66, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 80 }}>{word.emoji}</Text>
        </View>
        <Text style={[s.big, { marginTop: 8 }]}>{revealed ? word.en : '? ? ?'}</Text>
        <View style={{ alignSelf: 'stretch', borderTopWidth: 2, borderStyle: 'dashed', borderColor: C.line, marginVertical: 4 }} />
        <Text style={s.muted}>{revealed ? word.fr : 'Écoute bien…'}</Text>
      </Card>

      <View style={s.row}>
        <Button label="🔊  Écouter" onPress={() => say(word.en)} variant="outline" style={{ flex: 1 }} />
        <Button label="🐢  Lentement" onPress={() => say(word.en, true)} variant="outline" style={{ flex: 1 }} />
      </View>

      {/* Gros bouton micro rond : l'anneau rouge montre que l'écureuil écoute. */}
      <View style={{ alignItems: 'center', gap: 10 }}>
        <Pressable onPress={repeat} disabled={listening} accessibilityRole="button"
          accessibilityLabel={mic ? 'Parler' : 'J’ai répété'}
          style={{ padding: 8, borderRadius: 90, borderWidth: 4, borderColor: listening ? C.red : 'transparent' }}>
          {({ pressed }) => (
            <View>
              <View style={{ position: 'absolute', top: 6, left: 6, width: 136, height: 136, borderRadius: 68, backgroundColor: C.ink }} />
              <View style={{
                width: 136, height: 136, borderRadius: 68, backgroundColor: listening ? C.ink : C.red,
                borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center',
                transform: pressed ? [{ translateX: 5 }, { translateY: 5 }] : [],
              }}>
                <Text style={{ fontSize: 56 }}>{listening ? '👂' : mic ? '🎤' : '🗣️'}</Text>
              </View>
            </View>
          )}
        </Pressable>
        <Text style={{ fontFamily: F.semi, fontSize: 18, color: listening ? C.red : C.ink }}>
          {listening ? 'Je t’écoute…' : mic ? 'À toi de le dire !' : 'Appuie quand tu as répété'}
        </Text>
      </View>

      {result ? (
        <Squirrel
          en={FEEDBACK[result].en}
          fr={result === 'great' ? FEEDBACK.great.fr : `${FEEDBACK[result].fr} ${hint(word.en)}`}
        />
      ) : null}

      {canGoOn ? <Button label="Suivant  →" variant="ink" onPress={() => onNext(result ?? 'retry')} /> : null}
    </View>
  );
}
