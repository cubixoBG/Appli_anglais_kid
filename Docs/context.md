# Contexte : appli d'anglais CM2

## Le projet

- **Utilisatrice** : une élève de CM2 (10-11 ans), qui part de zéro en anglais.
- **Objectif** : la préparer à un séjour dans une famille en Angleterre l'année prochaine.
- **Principe** : une IA vocale qui montre l'exemple et corrige la prononciation.
- **Cadre** : projet IUT pour un vrai client, à réaliser en une semaine.
- **Support** : appli native pour tablette et téléphone, sur iOS et Android.

---

## Le fil rouge : « Mon voyage en Angleterre »

L'appli suit le voyage, étape par étape. Chaque étape est une partie de l'Angleterre à débloquer pour la progression.

1. **Les présentations** : dire son nom, son âge, d'où on vient, sa famille, ses animaux
2. **L'aéroport et le trajet** : dire bonjour, merci, demander de l'aide
3. **Arriver dans la famille** : la maison, sa chambre, les règles de la maison
4. **À table** : la nourriture, dire ce qu'on aime / n'aime pas, « Can I have… ? », « I'm full »
5. **La journée** : se lever, se laver, s'habiller, l'heure
6. **Sortir** : les magasins, l'argent (livres, pence), le parc, les directions
7. **Jouer avec les enfants** : les jeux, le sport, les loisirs
8. **Les urgences** : « I don't feel well », « I'm lost », « Can I call my mum? »
9. **La culture** : le thé, les fêtes, les différences avec la France

---

## Le compagnon IA

- **Un écureuil roux** qui parle, encourage et corrige.
- **Écouter → répéter → retour** : l'écureuil dit le mot, l'élève le répète, puis il donne un retour simple (« Presque ! Écoute encore le *th* »).
- **Mode lent** : rejouer un mot ou une phrase au ralenti, syllabe par syllabe.
- **Retours toujours positifs** : jamais de « faux » sec ; on dit « Encore une fois ? » et on valorise les progrès.
- **Mini-conversations jouées** : l'IA peut aussi jouer la mère d'accueil (« Hello! Are you hungry? ») et l'élève répond à l'oral. Les scénarios sont fermés et courts au début, plus libres ensuite.
- **Accent britannique** par défaut.

---

## Les jeux

| Jeu | Principe | Compétence |
|---|---|---|
| **Memory sonore** | Retourner des cartes : associer l'image et le mot entendu | Vocabulaire, écoute |
| **Le perroquet** | Répéter le mieux possible une série de mots | Prononciation |
| **Simon says** | « Simon says touch your nose » : mimer ou cliquer la bonne image | Compréhension orale |
| **Le chef anglais** | Préparer un repas en glissant les bons ingrédients demandés | Vocabulaire de la nourriture |
| **Valise à faire** | Mettre dans la valise ce que l'IA demande (« a toothbrush, two T-shirts ») | Objets, nombres |
| **Cherche dans la maison** | Dans une maison dessinée, trouver « the kitchen », « under the bed » | Pièces, prépositions |
| **Chanson karaoké** | Chansons simples avec les paroles surlignées | Rythme, mémorisation |
| **Défi du jour** | Une phrase utile à apprendre et à dire au début de chaque séance | Régularité |

---

## La motivation

- **Séance courte** : 10 minutes par défaut (durée réglable par les parents).
- **Un autocollant par séance** : à la fin de la séance, l'enfant gagne un autocollant à collectionner (bus rouge, cabine téléphonique, Big Ben…).
- **Le passeport** : chaque autocollant gagné va dans le passeport, qui se remplit page après page.

---

## Le design

- Boutons et icônes plus gros que d'habitude, peu de texte par écran
- **Consignes lues à voix haute** en anglais, avec sous-titres
- Une seule action principale par écran
- Couleurs vives mais contrastées (lisibilité, accessibilité)
- Police lisible, adaptée à l'apprentissage de la lecture (ex. Andika, Lexend)
- Gros bouton micro pour parler, avec un retour visuel quand l'IA écoute

---

## L'espace parents

- **Tableau de suivi simple** : temps passé, étapes faites, mots qui posent problème
- **Liste « phrases de survie »** imprimable pour le séjour
- **Réglages** : durée de la séance quotidienne (5, 10, 15 ou 20 minutes)

---

## Points d'attention

- **Données d'une mineure** : la voix d'une enfant est une donnée personnelle (RGPD). Pas de compte avec des données réelles, pas de stockage des enregistrements, ou alors avec l'accord des parents et une suppression facile.
- **IA encadrée** : les conversations libres doivent rester dans un cadre sûr (sujets limités, filtrage, pas de lien externe).
- **Reconnaissance vocale des voix d'enfants** : souvent moins fiable qu'avec des adultes. À tester tôt, et prévoir une notation tolérante.
- **Coût de l'IA vocale** : la synthèse et la reconnaissance vocales via une API coûtent à l'usage. Pour le vocabulaire fixe, on peut générer les audios une seule fois à l'avance.

---

## Première version (MVP)

1. L'écureuil compagnon et l'étape **« Les présentations »**
2. Écouter / répéter, avec retour de prononciation sur une vingtaine de mots et de phrases
3. Deux jeux : **Memory sonore** et **Le perroquet**
4. La séance qui donne un autocollant à coller dans le passeport

Ensuite, on ajoute les étapes du voyage une par une.
