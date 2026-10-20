export type Word = { en: string; fr: string; emoji: string };

// Étape 1 du voyage : « Les présentations »
export const PRESENTATIONS: Word[] = [
  { en: 'Hello', fr: 'Bonjour', emoji: '👋' },
  { en: 'Goodbye', fr: 'Au revoir', emoji: '🙋' },
  { en: 'Yes', fr: 'Oui', emoji: '👍' },
  { en: 'No', fr: 'Non', emoji: '👎' },
  { en: 'Please', fr: "S'il te plaît", emoji: '🙏' },
  { en: 'Thank you', fr: 'Merci', emoji: '💐' },
  { en: 'My name is', fr: "Je m'appelle", emoji: '📛' },
  { en: 'I am ten years old', fr: "J'ai dix ans", emoji: '🎂' },
  { en: 'I am from France', fr: 'Je viens de France', emoji: '🇫🇷' },
  { en: 'Nice to meet you', fr: 'Enchantée', emoji: '🤝' },
  { en: 'How are you?', fr: 'Comment ça va ?', emoji: '❓' },
  { en: 'I am fine', fr: 'Je vais bien', emoji: '😊' },
  { en: 'Mum', fr: 'Maman', emoji: '👩' },
  { en: 'Dad', fr: 'Papa', emoji: '👨' },
  { en: 'Brother', fr: 'Frère', emoji: '👦' },
  { en: 'Sister', fr: 'Sœur', emoji: '👧' },
  { en: 'Family', fr: 'Famille', emoji: '👨‍👩‍👧' },
  { en: 'Friend', fr: 'Ami / amie', emoji: '🧑‍🤝‍🧑' },
  { en: 'Dog', fr: 'Chien', emoji: '🐶' },
  { en: 'Cat', fr: 'Chat', emoji: '🐱' },
];

// Étape 2 du voyage : « L'aéroport et le trajet »
export const AIRPORT: Word[] = [
  { en: 'Excuse me', fr: 'Excusez-moi', emoji: '🙋‍♀️' },
  { en: 'Good morning', fr: 'Bonjour (le matin)', emoji: '🌅' },
  { en: 'Thank you very much', fr: 'Merci beaucoup', emoji: '💖' },
  { en: 'Sorry', fr: 'Pardon', emoji: '😔' },
  { en: 'Can you help me?', fr: 'Pouvez-vous m’aider ?', emoji: '🆘' },
  { en: 'Where is the toilet?', fr: 'Où sont les toilettes ?', emoji: '🚻' },
  { en: 'I don’t understand', fr: 'Je ne comprends pas', emoji: '🤷' },
  { en: 'Can you repeat, please?', fr: 'Pouvez-vous répéter ?', emoji: '🔁' },
  { en: 'Yes, please', fr: 'Oui, s’il vous plaît', emoji: '✅' },
  { en: 'No, thank you', fr: 'Non, merci', emoji: '🙅' },
  { en: 'The airport', fr: 'L’aéroport', emoji: '🛫' },
  { en: 'The plane', fr: 'L’avion', emoji: '✈️' },
  { en: 'My passport', fr: 'Mon passeport', emoji: '🛂' },
  { en: 'My suitcase', fr: 'Ma valise', emoji: '🧳' },
  { en: 'The ticket', fr: 'Le billet', emoji: '🎫' },
  { en: 'The train', fr: 'Le train', emoji: '🚆' },
  { en: 'The bus', fr: 'Le bus', emoji: '🚌' },
  { en: 'Left', fr: 'À gauche', emoji: '⬅️' },
  { en: 'Right', fr: 'À droite', emoji: '➡️' },
  { en: 'Straight on', fr: 'Tout droit', emoji: '⬆️' },
];

// Les 9 étapes du voyage. Une étape sans mots n'est pas encore jouable.
export const STEPS: { name: string; words: Word[] }[] = [
  { name: 'Les présentations', words: PRESENTATIONS },
  { name: 'L’aéroport', words: AIRPORT },
  { name: 'La famille', words: [] },
  { name: 'À table', words: [] },
  { name: 'La journée', words: [] },
  { name: 'Sortir', words: [] },
  { name: 'Jouer', words: [] },
  { name: 'Les urgences', words: [] },
  { name: 'La culture', words: [] },
];

export const SESSIONS_PER_STEP = 3;

// L'étape en cours : 3 séances terminées (3 autocollants) débloquent la suivante,
// sans jamais aller sur une étape qui n'a pas encore de contenu.
export function currentStep(stickers: number): number {
  const playable = STEPS.findIndex((st) => st.words.length === 0);
  const last = (playable === -1 ? STEPS.length : playable) - 1;
  return Math.min(Math.floor(stickers / SESSIONS_PER_STEP), last);
}

// Les autocollants du passeport, gagnés dans cet ordre
export const STICKERS = [
  { emoji: '🚌', name: 'Le bus rouge' },
  { emoji: '☎️', name: 'La cabine téléphonique' },
  { emoji: '🕰️', name: 'Big Ben' },
  { emoji: '💂', name: 'Le garde royal' },
  { emoji: '☕', name: 'Le thé' },
  { emoji: '🎡', name: 'La grande roue' },
  { emoji: '🏰', name: 'Le château' },
  { emoji: '☂️', name: 'Le parapluie' },
  { emoji: '🚇', name: 'Le métro' },
  { emoji: '👑', name: 'La couronne' },
  { emoji: '🦁', name: 'Le lion' },
  { emoji: '🐟', name: 'Le fish and chips' },
];

export function pick<T>(list: T[], n: number): T[] {
  return [...list].sort(() => Math.random() - 0.5).slice(0, n);
}
