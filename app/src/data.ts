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
