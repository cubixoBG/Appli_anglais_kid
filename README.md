# 🐿️ Mon voyage en Angleterre

> Une appli mobile pour apprendre l'anglais à l'oral, pensée pour une élève de CM2 qui part de zéro et qui va passer un séjour dans une famille anglaise.

Un écureuil roux sert de compagnon. Il dit les mots, l'enfant les répète, et il l'aide à corriger sa prononciation, toujours avec bienveillance. Chaque étape du voyage débloque une nouvelle partie de l'Angleterre, et chaque séance rapporte un autocollant à coller dans le passeport.

**Statut** : 🚧 en conception. Projet IUT (BUT MMI, Le Puy) réalisé en une semaine pour un vrai client.

---

## ✨ Le principe

| | |
|---|---|
| 👧 **Pour qui** | Une enfant de 10-11 ans, débutante complète |
| 🎯 **Objectif** | Être à l'aise pendant un séjour dans une famille en Angleterre |
| 🗣️ **Méthode** | Écouter → répéter → recevoir un retour, avec une IA vocale (accent britannique) |
| 📱 **Support** | Appli native pour tablette et téléphone, sur iOS et Android |
| ⏱️ **Rythme** | Des séances courtes de 10 minutes (durée réglable par les parents) |

## 🗺️ Le fil rouge : le voyage

1. 👋 **Les présentations** : son nom, son âge, sa famille, ses animaux
2. ✈️ **L'aéroport et le trajet** : bonjour, merci, demander de l'aide
3. 🏠 **Arriver dans la famille** : la maison, sa chambre, les règles
4. 🍽️ **À table** : « Can I have… ? », « I'm full », ce qu'on aime ou pas
5. ⏰ **La journée** : se lever, s'habiller, l'heure
6. 🛍️ **Sortir** : les magasins, les livres et les pence, les directions
7. ⚽ **Jouer avec les enfants** : les jeux, le sport, les loisirs
8. 🆘 **Les urgences** : « I don't feel well », « I'm lost »
9. ☕ **La culture** : le thé, les fêtes, les différences avec la France

## 🎮 Les jeux

| Jeu | Ce qu'on travaille |
|---|---|
| 🃏 Memory sonore | Vocabulaire, écoute |
| 🦜 Le perroquet | Prononciation |
| 🙋 Simon says | Compréhension orale |
| 👨‍🍳 Le chef anglais | La nourriture |
| 🧳 Valise à faire | Les objets, les nombres |
| 🔍 Cherche dans la maison | Les pièces, les prépositions |
| 🎤 Chanson karaoké | Le rythme, la mémorisation |
| 📅 Défi du jour | La régularité |

## 👨‍👩‍👧 L'espace parents

- Un suivi simple : le temps passé, les étapes faites, les mots difficiles
- Une liste de « phrases de survie » à imprimer pour le séjour
- Le réglage de la durée des séances (5, 10, 15 ou 20 minutes)

## 🚀 Première version (MVP)

- [ ] L'écureuil compagnon et l'étape **Les présentations**
- [ ] Écouter et répéter, avec un retour de prononciation sur une vingtaine de mots et de phrases
- [ ] Deux jeux : **Memory sonore** et **Le perroquet**
- [ ] Un autocollant par séance, à coller dans le passeport

## 🛠️ Stack envisagée

> Ce sont des pistes, pas encore des décisions : voir [Docs/idées/idees-techno.md](Docs/idées/idees-techno.md).

| Besoin | Piste |
|---|---|
| Appli iOS + Android | React Native + Expo |
| Voix de l'écureuil | Audios générés à l'avance + `expo-audio` |
| Correction de prononciation | Azure AI Speech (Pronunciation Assessment) |
| Protection de la clé d'API | Fonction Supabase ou Cloudflare Worker |
| Sauvegarde | Sur l'appareil (AsyncStorage ou `expo-sqlite`) |
| Animations | Lottie ou Rive |

## 🔒 Points d'attention

- **Données d'une mineure (RGPD)** : pas de compte avec des données réelles, et les enregistrements de voix ne sont pas stockés.
- **IA encadrée** : les conversations restent sur des sujets limités, sans aucun lien externe.
- **Voix d'enfant** : la reconnaissance vocale est moins fiable avec les enfants. Elle est à tester tôt, avec une notation tolérante.
- **Coûts** : les audios fixes sont générés une seule fois pour limiter les appels d'API.

## 📂 Le dépôt

```
├── Docs/
│   ├── context.md        # Le cahier des charges complet
│   ├── idées/            # Les pistes et propositions
│   └── ADR/              # Les décisions d'architecture validées
├── .claude/              # La configuration de l'assistant IA
└── CLAUDE.md             # Les règles de travail avec l'assistant
```

---

<sub>Projet réalisé dans le cadre du BUT MMI à l'IUT du Puy-en-Velay.</sub>
