// Notation tolérante : la reconnaissance vocale est moins fiable avec une voix d'enfant.
export type Grade = 'great' | 'almost' | 'retry';

const NUMBERS: Record<string, string> = {
  '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five', '6': 'six',
  '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten', '11': 'eleven', '12': 'twelve',
};

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’']m\b/g, ' am')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => NUMBERS[w] ?? w);
}

function similarity(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return 1 - d[a.length][b.length] / Math.max(a.length, b.length, 1);
}

// Pour chaque mot attendu, on garde le mot entendu le plus proche. Les mots en trop sont ignorés
// (« My name is Lucie » compte pour « My name is »).
export function scoreOne(expected: string, heard: string): number {
  const exp = words(expected);
  const got = words(heard);
  if (!exp.length || !got.length) return 0;
  return exp.reduce((sum, w) => sum + Math.max(...got.map((g) => similarity(w, g))), 0) / exp.length;
}

export function grade(expected: string, alternatives: string[]): Grade {
  const best = Math.max(0, ...alternatives.map((h) => scoreOne(expected, h)));
  return best >= 0.85 ? 'great' : best >= 0.5 ? 'almost' : 'retry';
}

// Un conseil sur un son difficile pour un francophone, si le mot en contient un.
export function hint(expected: string): string {
  const e = expected.toLowerCase();
  if (e.includes('th')) return 'Écoute bien le « th » : la langue entre les dents !';
  if (/\bh/.test(e)) return 'Écoute bien le « h » : on souffle comme sur une vitre !';
  return 'Écoute encore et répète doucement.';
}
