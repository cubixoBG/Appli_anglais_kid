// Lancer avec : npm test
import assert from 'node:assert/strict';
import { grade } from './score.ts';

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

console.log('score.ts : tous les tests passent');
