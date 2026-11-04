// Les langues proposées, dans l'ordre des colonnes de mots ci-dessous.
export const LANG_CODES = ['en', 'es', 'de', 'it'] as const;
export type Lang = (typeof LANG_CODES)[number];

// t = le mot dans la langue apprise, fr = sa traduction affichée en sous-titre.
export type Word = { t: string; fr: string; emoji: string };
type Row = [emoji: string, fr: string, en: string, es: string, de: string, it: string];

// Étape 1 du voyage : « Les présentations »
const PRESENTATIONS: Row[] = [
  ['👋', 'Bonjour', 'Hello', 'Hola', 'Hallo', 'Ciao'],
  ['🙋', 'Au revoir', 'Goodbye', 'Adiós', 'Tschüss', 'Arrivederci'],
  ['👍', 'Oui', 'Yes', 'Sí', 'Ja', 'Sì'],
  ['👎', 'Non', 'No', 'No', 'Nein', 'No'],
  ['🙏', "S'il te plaît", 'Please', 'Por favor', 'Bitte', 'Per favore'],
  ['💐', 'Merci', 'Thank you', 'Gracias', 'Danke', 'Grazie'],
  ['📛', "Je m'appelle", 'My name is', 'Me llamo', 'Ich heiße', 'Mi chiamo'],
  ['🎂', "J'ai dix ans", 'I am ten years old', 'Tengo diez años', 'Ich bin zehn Jahre alt', 'Ho dieci anni'],
  ['🇫🇷', 'Je viens de France', 'I am from France', 'Soy de Francia', 'Ich komme aus Frankreich', 'Vengo dalla Francia'],
  ['🤝', 'Enchanté(e)', 'Nice to meet you', 'Mucho gusto', 'Freut mich', 'Piacere'],
  ['❓', 'Comment ça va ?', 'How are you?', '¿Cómo estás?', 'Wie geht’s?', 'Come stai?'],
  ['😊', 'Je vais bien', 'I am fine', 'Estoy bien', 'Mir geht’s gut', 'Sto bene'],
  ['👩', 'Maman', 'Mum', 'Mamá', 'Mama', 'Mamma'],
  ['👨', 'Papa', 'Dad', 'Papá', 'Papa', 'Papà'],
  ['👦', 'Frère', 'Brother', 'Hermano', 'Bruder', 'Fratello'],
  ['👧', 'Sœur', 'Sister', 'Hermana', 'Schwester', 'Sorella'],
  ['👨‍👩‍👧', 'Famille', 'Family', 'Familia', 'Familie', 'Famiglia'],
  ['🧑‍🤝‍🧑', 'Ami / amie', 'Friend', 'Amigo', 'Freund', 'Amico'],
  ['🐶', 'Chien', 'Dog', 'Perro', 'Hund', 'Cane'],
  ['🐱', 'Chat', 'Cat', 'Gato', 'Katze', 'Gatto'],
];

// Étape 2 du voyage : « L'aéroport et le trajet »
const AIRPORT: Row[] = [
  ['🙋‍♀️', 'Excusez-moi', 'Excuse me', 'Perdone', 'Entschuldigung', 'Mi scusi'],
  ['🌅', 'Bonjour (le matin)', 'Good morning', 'Buenos días', 'Guten Morgen', 'Buongiorno'],
  ['💖', 'Merci beaucoup', 'Thank you very much', 'Muchas gracias', 'Vielen Dank', 'Grazie mille'],
  ['😔', 'Pardon', 'Sorry', 'Lo siento', 'Es tut mir leid', 'Scusa'],
  ['🆘', 'Pouvez-vous m’aider ?', 'Can you help me?', '¿Puede ayudarme?', 'Können Sie mir helfen?', 'Può aiutarmi?'],
  ['🚻', 'Où sont les toilettes ?', 'Where is the toilet?', '¿Dónde está el baño?', 'Wo ist die Toilette?', 'Dov’è il bagno?'],
  ['🤷', 'Je ne comprends pas', 'I don’t understand', 'No entiendo', 'Ich verstehe nicht', 'Non capisco'],
  ['🔁', 'Pouvez-vous répéter ?', 'Can you repeat, please?', '¿Puede repetir, por favor?', 'Können Sie das wiederholen, bitte?', 'Può ripetere, per favore?'],
  ['✅', 'Oui, s’il vous plaît', 'Yes, please', 'Sí, por favor', 'Ja, bitte', 'Sì, per favore'],
  ['🙅', 'Non, merci', 'No, thank you', 'No, gracias', 'Nein, danke', 'No, grazie'],
  ['🛫', 'L’aéroport', 'The airport', 'El aeropuerto', 'Der Flughafen', 'L’aeroporto'],
  ['✈️', 'L’avion', 'The plane', 'El avión', 'Das Flugzeug', 'L’aereo'],
  ['🛂', 'Mon passeport', 'My passport', 'Mi pasaporte', 'Mein Reisepass', 'Il mio passaporto'],
  ['🧳', 'Ma valise', 'My suitcase', 'Mi maleta', 'Mein Koffer', 'La mia valigia'],
  ['🎫', 'Le billet', 'The ticket', 'El billete', 'Die Fahrkarte', 'Il biglietto'],
  ['🚆', 'Le train', 'The train', 'El tren', 'Der Zug', 'Il treno'],
  ['🚌', 'Le bus', 'The bus', 'El autobús', 'Der Bus', 'L’autobus'],
  ['⬅️', 'À gauche', 'Left', 'A la izquierda', 'Links', 'A sinistra'],
  ['➡️', 'À droite', 'Right', 'A la derecha', 'Rechts', 'A destra'],
  ['⬆️', 'Tout droit', 'Straight on', 'Todo recto', 'Geradeaus', 'Sempre dritto'],
];

// Les 9 étapes du voyage. Une étape sans mots n'est pas encore jouable.
export const STEPS: { name: string; rows: Row[] }[] = [
  { name: 'Les présentations', rows: PRESENTATIONS },
  { name: 'L’aéroport', rows: AIRPORT },
  { name: 'La famille', rows: [] },
  { name: 'À table', rows: [] },
  { name: 'La journée', rows: [] },
  { name: 'Sortir', rows: [] },
  { name: 'Jouer', rows: [] },
  { name: 'Les urgences', rows: [] },
  { name: 'La culture', rows: [] },
];

// Les mots d'une étape dans la langue apprise.
export function wordsFor(step: number, lang: Lang): Word[] {
  const col = 2 + LANG_CODES.indexOf(lang);
  return STEPS[step].rows.map((r) => ({ emoji: r[0], fr: r[1], t: r[col] }));
}

export const SESSIONS_PER_STEP = 3;

// L'étape en cours : 3 séances terminées (3 autocollants) débloquent la suivante,
// sans jamais aller sur une étape qui n'a pas encore de contenu.
export function currentStep(stickers: number): number {
  const playable = STEPS.findIndex((st) => st.rows.length === 0);
  const last = (playable === -1 ? STEPS.length : playable) - 1;
  return Math.min(Math.floor(stickers / SESSIONS_PER_STEP), last);
}

export function pick<T>(list: T[], n: number): T[] {
  return [...list].sort(() => Math.random() - 0.5).slice(0, n);
}
