// Lancer avec : npm test
import assert from 'node:assert/strict';
import { LANGS } from './lang.ts';
import { grade, hint } from './score.ts';

assert.equal(grade('Hello', ['hello']), 'great');
assert.equal(grade('Hello', ['Hello!']), 'great');
assert.equal(grade('Thank you', ['thank you']), 'great');
assert.equal(grade('My name is', ['my name is Lucie']), 'great');
assert.equal(grade('I am ten years old', ["I'm 10 years old"]), 'great');
assert.equal(grade('I am fine', ['I am find']), 'great');
assert.equal(grade('Brother', ['brazer']), 'almost');
assert.equal(grade('Nice to meet you', ['nice to me']), 'almost');
assert.equal(grade('Hello', ['banana']), 'retry');
assert.equal(grade('Hello', []), 'retry');
assert.equal(grade('Dog', ['cat', 'dog']), 'great'); // la meilleure alternative compte

// Autres langues : accents, ß et nombres en chiffres
assert.equal(grade("Tengo diez años", ["tengo 10 anos"], LANGS.es.numbers), "great");
assert.equal(grade("¿Cómo estás?", ["como estas"], LANGS.es.numbers), "great");
assert.equal(grade("Ich heiße", ["ich heisse"], LANGS.de.numbers), "great");
assert.equal(grade("Ho dieci anni", ["ho 10 anni"], LANGS.it.numbers), "great");
assert.equal(hint("Thank you"), "Écoute bien le « th » : la langue entre les dents !");
assert.match(hint("Ich heiße", LANGS.de.hints), /ch/);

console.log("score.ts : tous les tests passent");
