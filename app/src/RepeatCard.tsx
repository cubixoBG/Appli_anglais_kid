import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Word } from './data';
import { grade, Grade, hint } from './score';
import { canListen, listen, say } from './speech';
import { Button, C, s, Squirrel } from './ui';

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
    <View style={{ gap: 16 }}>
      <View style={s.card}>
        <Text style={{ fontSize: 96 }}>{word.emoji}</Text>
        <Text style={s.big}>{revealed ? word.en : '???'}</Text>
        {revealed ? <Text style={s.muted}>{word.fr}</Text> : null}
      </View>

      <View style={s.row}>
        <Button label="🔊 Écouter" onPress={() => say(word.en)} color={C.orange} style={{ flex: 1 }} />
        <Button label="🐢 Lentement" onPress={() => say(word.en, true)} color={C.orange} style={{ flex: 1 }} />
      </View>

      <Button
        big
        label={listening ? '👂 Je t’écoute…' : mic ? '🎤 À toi !' : '🗣️ J’ai répété !'}
        color={listening ? C.green : C.red}
        onPress={repeat}
        disabled={listening}
      />

      {result ? (
        <Squirrel
          en={FEEDBACK[result].en}
          fr={result === 'great' ? FEEDBACK.great.fr : `${FEEDBACK[result].fr} ${hint(word.en)}`}
        />
      ) : null}

      {canGoOn ? <Button label="Suivant ➜" color={C.blue} onPress={() => onNext(result ?? 'retry')} /> : null}
    </View>
  );
}
