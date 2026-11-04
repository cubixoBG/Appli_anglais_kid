import type { Lang } from './data';

// Tout ce qui change d'une langue à l'autre. Les sous-titres restent en français.
type Pack = {
  label: string; flag: string; hi: string;
  country: string; // « Mon voyage en … »
  voice: string; // voix de synthèse et langue de la reconnaissance vocale
  passport: string; cover: string;
  numbers?: string[]; // 1 à 12 en toutes lettres (la reconnaissance renvoie « 10 » pour « ten ») ; anglais par défaut
  hints?: [RegExp, string][]; // sons difficiles pour un francophone ; anglais par défaut
  hello: (name: string) => string;
  activities: [learn: string, memory: string, parrot: string];
  pairs: string; foundAll: string; parrot: string; sticker: string; newStep: string;
  great: string; almost: string; retry: string;
  stickers: { emoji: string; name: string }[]; // 12, gagnés dans cet ordre
};

export const LANGS: Record<Lang, Pack> = {
  en: {
    label: 'Anglais', flag: '🇬🇧', hi: 'Hello!', country: 'Angleterre', voice: 'en-GB',
    passport: 'PASSPORT', cover: '🦁',
    hello: (n) => `Hello ${n}! Ready for your lesson?`,
    activities: ['Listen and repeat', 'Find the pairs', 'The parrot'],
    pairs: 'Find the pairs!', foundAll: 'Well done! You found them all!', parrot: 'Fantastic parrot!',
    sticker: 'Amazing! You won a sticker!', newStep: 'And a new step of your trip!',
    great: 'Well done!', almost: 'Almost!', retry: 'One more time?',
    stickers: [
      { emoji: '🚌', name: 'Le bus rouge' }, { emoji: '☎️', name: 'La cabine téléphonique' },
      { emoji: '🕰️', name: 'Big Ben' }, { emoji: '💂', name: 'Le garde royal' },
      { emoji: '☕', name: 'Le thé' }, { emoji: '🎡', name: 'La grande roue' },
      { emoji: '🏰', name: 'Le château' }, { emoji: '☂️', name: 'Le parapluie' },
      { emoji: '🚇', name: 'Le métro' }, { emoji: '👑', name: 'La couronne' },
      { emoji: '🦁', name: 'Le lion' }, { emoji: '🐟', name: 'Le fish and chips' },
    ],
  },
  es: {
    label: 'Espagnol', flag: '🇪🇸', hi: '¡Hola!', country: 'Espagne', voice: 'es-ES',
    passport: 'PASAPORTE', cover: '☀️',
    numbers: ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'],
    hints: [
      [/j|g[ei]/, 'Le « j » espagnol se dit au fond de la gorge, comme un petit raclement !'],
      [/r/, 'Le « r » espagnol roule : fais vibrer le bout de ta langue !'],
    ],
    hello: (n) => `¡Hola ${n}! ¿Empezamos la clase?`,
    activities: ['Escucha y repite', 'Encuentra las parejas', 'El loro'],
    pairs: '¡Encuentra las parejas!', foundAll: '¡Muy bien! ¡Las has encontrado todas!', parrot: '¡Qué loro tan fantástico!',
    sticker: '¡Genial! ¡Has ganado una pegatina!', newStep: '¡Y una nueva etapa de tu viaje!',
    great: '¡Muy bien!', almost: '¡Casi!', retry: '¿Otra vez?',
    stickers: [
      { emoji: '💃', name: 'Le flamenco' }, { emoji: '🥘', name: 'La paella' },
      { emoji: '⛪', name: 'La Sagrada Família' }, { emoji: '🏰', name: 'L’Alhambra' },
      { emoji: '☀️', name: 'Le soleil' }, { emoji: '🏖️', name: 'La plage' },
      { emoji: '⚽', name: 'Le football' }, { emoji: '🎸', name: 'La guitare' },
      { emoji: '🫒', name: 'L’olive' }, { emoji: '🍊', name: 'L’orange' },
      { emoji: '🎨', name: 'La peinture' }, { emoji: '🍫', name: 'Les churros' },
    ],
  },
  de: {
    label: 'Allemand', flag: '🇩🇪', hi: 'Hallo!', country: 'Allemagne', voice: 'de-DE',
    passport: 'REISEPASS', cover: '🦅',
    numbers: ['eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf'],
    hints: [
      [/ch/, 'Le « ch » allemand souffle dans la gorge, comme un chat qui fait « khhh » !'],
      [/ü/, 'Pour le « ü », dis « i » avec la bouche en rond !'],
      [/\bh/, 'Écoute bien le « h » : on souffle comme sur une vitre !'],
    ],
    hello: (n) => `Hallo ${n}! Fangen wir an?`,
    activities: ['Hören und nachsprechen', 'Finde die Paare', 'Der Papagei'],
    pairs: 'Finde die Paare!', foundAll: 'Super! Du hast alle gefunden!', parrot: 'Toller Papagei!',
    sticker: 'Wahnsinn! Du hast einen Sticker gewonnen!', newStep: 'Und eine neue Etappe deiner Reise!',
    great: 'Super gemacht!', almost: 'Fast!', retry: 'Noch einmal?',
    stickers: [
      { emoji: '🥨', name: 'Le bretzel' }, { emoji: '🏰', name: 'Le château de Neuschwanstein' },
      { emoji: '🌲', name: 'La Forêt-Noire' }, { emoji: '🕰️', name: 'Le coucou' },
      { emoji: '🧸', name: 'L’ours en peluche' }, { emoji: '🏛️', name: 'La porte de Brandebourg' },
      { emoji: '⚽', name: 'Le football' }, { emoji: '🎄', name: 'Le sapin de Noël' },
      { emoji: '🌭', name: 'La saucisse' }, { emoji: '🚆', name: 'Le train' },
      { emoji: '🎻', name: 'Le violon' }, { emoji: '🦅', name: 'L’aigle' },
    ],
  },
  it: {
    label: 'Italien', flag: '🇮🇹', hi: 'Ciao!', country: 'Italie', voice: 'it-IT',
    passport: 'PASSAPORTO', cover: '🍕',
    numbers: ['uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci', 'undici', 'dodici'],
    hints: [
      [/([bcdfglmnprstvz])\1/, 'Les doubles lettres se disent plus longtemps : « gat-to » !'],
      [/r/, 'Le « r » italien roule : fais vibrer le bout de ta langue !'],
    ],
    hello: (n) => `Ciao ${n}! Cominciamo la lezione?`,
    activities: ['Ascolta e ripeti', 'Trova le coppie', 'Il pappagallo'],
    pairs: 'Trova le coppie!', foundAll: 'Ottimo lavoro! Le hai trovate tutte!', parrot: 'Che pappagallo fantastico!',
    sticker: 'Fantastico! Hai vinto un adesivo!', newStep: 'E una nuova tappa del tuo viaggio!',
    great: 'Ottimo!', almost: 'Quasi!', retry: 'Ancora una volta?',
    stickers: [
      { emoji: '🍕', name: 'La pizza' }, { emoji: '🍝', name: 'Les pâtes' },
      { emoji: '🍦', name: 'La glace' }, { emoji: '🏟️', name: 'Le Colisée' },
      { emoji: '🛶', name: 'La gondole' }, { emoji: '🎭', name: 'Le masque de Venise' },
      { emoji: '🛵', name: 'Le scooter' }, { emoji: '🌋', name: 'Le Vésuve' },
      { emoji: '🍋', name: 'Le citron' }, { emoji: '🍅', name: 'La tomate' },
      { emoji: '⚽', name: 'Le football' }, { emoji: '🎨', name: 'La peinture' },
    ],
  },
};

// shortcut: profil en variable de module plutôt qu'un Context React ; App re-rend tout l'écran
// quand il change. Passer à un Context si un écran doit réagir seul à un changement de profil.
export const profile: { name: string; lang: Lang } = { name: '', lang: 'en' };
export const T = () => LANGS[profile.lang];
