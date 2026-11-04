// Lancer avec : npm test
import assert from 'node:assert/strict';
import { currentStep, LANG_CODES, STEPS, wordsFor } from './data.ts';
import { LANGS } from './lang.ts';

assert.equal(currentStep(0), 0);
assert.equal(currentStep(2), 0);
assert.equal(currentStep(3), 1); // 3 séances : l'aéroport se débloque
assert.equal(currentStep(5), 1);
assert.equal(currentStep(99), 1); // l'étape 3 n'a pas encore de mots : on reste à l'aéroport

for (const lang of LANG_CODES) {
  // Dans une étape, les mots doivent être uniques (le Memory s'en sert comme clé) et non vides
  STEPS.forEach((st, i) => {
    const ws = wordsFor(i, lang).map((w) => w.t);
    assert.ok(ws.every(Boolean), `${st.name} (${lang}) : mot manquant`);
    assert.equal(new Set(ws).size, ws.length, `${st.name} (${lang}) : doublon`);
  });
  assert.equal(LANGS[lang].stickers.length, 12, `${lang} : 12 autocollants`);
  assert.equal(new Set(LANGS[lang].stickers.map((s) => s.name)).size, 12, `${lang} : autocollants uniques`);
  assert.equal(LANGS[lang].numbers?.length ?? 12, 12, `${lang} : nombres de 1 à 12`);
}

console.log('data.ts : tous les tests passent');
