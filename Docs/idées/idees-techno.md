# Idées de techno : appli d'anglais CM2

Contraintes de départ : appli native iOS + Android, à réaliser en une semaine, pour une enfant qui part de zéro.

---

## La stack conseillée en résumé

| Besoin | Techno |
|---|---|
| Appli iOS + Android | React Native + Expo |
| Voix de l'écureuil | Audios générés à l'avance (voix britannique) + `expo-audio` |
| Correction de prononciation | Azure AI Speech (Pronunciation Assessment) |
| Protection de la clé d'API | Petit serveur intermédiaire (fonction Supabase ou Cloudflare Worker) |
| Sauvegarde | Sur le téléphone (AsyncStorage ou `expo-sqlite`) |
| Animation de l'écureuil | Lottie ou Rive |
| Jeux à glisser-déposer | `react-native-gesture-handler` + Reanimated |

---

## 1. L'appli : React Native avec Expo

- **Un seul code** pour iOS et Android, en JavaScript/TypeScript (déjà connu en MMI).
- **Test immédiat sur un vrai téléphone** avec l'appli Expo Go, sans Mac ni Android Studio.
- **Livraison au client** : EAS Build pour générer l'appli, TestFlight pour l'iPhone.
- **Attention** : iOS demande un compte Apple Developer payant (99 $/an). À voir qui le paie, l'équipe ou le client.

---

## 2. La voix de l'écureuil (synthèse vocale)

- **Mots et phrases fixes** : générer les audios une fois à l'avance avec une voix britannique (ElevenLabs, OpenAI TTS, Azure ou Google Cloud TTS), puis mettre les fichiers MP3 dans l'appli. Aucun coût à l'usage, et ça marche hors ligne.
- **Mode lent** : rejouer l'audio moins vite avec `expo-audio`, ou générer une version lente à l'avance.
- **Texte qui change** : `expo-speech` utilise la voix du téléphone. C'est gratuit, mais la voix est plus robotique.

---

## 3. La correction de prononciation (la partie la plus risquée)

- **Azure AI Speech, « Pronunciation Assessment » (conseillé)** : il donne une note par mot et même par son, ce qui permet de dire « Écoute encore le *th* ». Il gère l'anglais britannique, et l'offre gratuite devrait suffire pour le projet.
- **Plus simple, mais moins précis** : transcrire ce que dit l'enfant (avec `expo-speech-recognition` ou Whisper) et comparer avec le mot attendu. On sait si le mot est reconnu, mais pas quel son est mal prononcé.
- **Clé d'API** : ne jamais la mettre dans l'appli. Passer par un petit serveur intermédiaire (fonction Supabase ou Cloudflare Worker) ; avec Azure, ce serveur peut simplement fournir à l'appli un jeton temporaire.

---

## 5. Le reste

- **Sauvegarde** : uniquement sur le téléphone, avec AsyncStorage ou `expo-sqlite`. Pas de compte ni de serveur de données, donc le RGPD est bien plus simple à gérer.
- **Animation de l'écureuil** : Lottie ou Rive.
- **Jeux à glisser-déposer** (valise, chef) : `react-native-gesture-handler` + Reanimated.

---

## À vérifier avant de se lancer

- **Prix et limites des offres gratuites** (Azure, outils de synthèse vocale) : pas vérifiés.
- **Azure sur la voix de l'élève, dès le premier jour** : si la reconnaissance marche mal sur une voix d'enfant, il faut changer d'approche.
- **Le compte Apple Developer** : qui le paie ?
