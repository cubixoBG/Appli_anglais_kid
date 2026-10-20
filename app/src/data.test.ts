// Lancer avec : npm test
import assert from 'node:assert/strict';
import { currentStep, STEPS } from './data.ts';

assert.equal(currentStep(0), 0);
assert.equal(currentStep(2), 0);
assert.equal(currentStep(3), 1); // 3 séances : l'aéroport se débloque
assert.equal(currentStep(5), 1);
assert.equal(currentStep(99), 1); // l'étape 3 n'a pas encore de mots : on reste à l'aéroport

// Dans une étape, les mots doivent être uniques (le Memory s'en sert comme clé)
for (const st of STEPS) assert.equal(new Set(st.words.map((w) => w.en)).size, st.words.length, st.name);

console.log('data.ts : tous les tests passent');
