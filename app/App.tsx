import { Lexend_400Regular, Lexend_600SemiBold, Lexend_800ExtraBold, useFonts } from '@expo-google-fonts/lexend';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { currentStep, wordsFor } from './src/data';
import { profile } from './src/lang';
import { loadProfile, loadStickers, Profile, saveProfile, saveStickers } from './src/passport';
import { scheduleDailyReminder } from './src/reminder';
import { Activity, Home, Learn, Memory, Parrot, Passport, StickerWon } from './src/screens';
import { Loading, Welcome } from './src/welcome';

type Page = 'home' | Activity | 'sticker' | 'passport' | 'profile';

// shortcut: navigation par simple état, suffisante pour 7 écrans ; passer à Expo Router si l'appli grossit.
export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [done, setDone] = useState<Set<Activity>>(new Set());
  const [stickers, setStickers] = useState(0);
  // Étape choisie sur la ligne pour réviser ; null = l'étape en cours du voyage.
  const [chosen, setChosen] = useState<number | null>(null);
  // undefined = pas encore lu sur le téléphone ; null = premier lancement (on demande prénom et langue).
  const [me, setMe] = useState<Profile | null | undefined>(undefined);
  // L'animation de chargement reste au moins 2 s, sinon elle clignote à peine.
  const [minDelay, setMinDelay] = useState(false);
  const [fontsLoaded, fontError] = useFonts({ Lexend_400Regular, Lexend_600SemiBold, Lexend_800ExtraBold });

  // Applique un profil : langue des jeux, passeport de cette langue, rappel au prénom. Repart d'une séance neuve.
  function applyProfile(p: Profile | null) {
    if (!p) return setMe(null);
    Object.assign(profile, p);
    // Rappel quotidien (heure dans reminder.ts) ; sans permission, l'appli marche quand même.
    scheduleDailyReminder(p.name).catch((e) => console.warn('Rappel non programmé :', e));
    loadStickers(p.lang).then((n) => {
      setStickers(n);
      setDone(new Set());
      setChosen(null);
      setMe(p);
      setPage('home');
    });
  }

  useEffect(() => {
    loadProfile().then(applyProfile);
    const t = setTimeout(() => setMinDelay(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (page === 'home') return false;
      setPage('home');
      return true;
    });
    return () => sub.remove();
  }, [page]);

  function finish(a: Activity) {
    // Révision d'une étape passée : on s'entraîne, mais ça ne valide rien (ni billet, ni autocollant).
    if (chosen !== null) {
      setPage('home');
      return;
    }
    const next = new Set(done).add(a);
    if (next.size === 3) {
      // Séance complète : un autocollant, puis une nouvelle séance commence.
      const count = stickers + 1;
      setStickers(count);
      saveStickers(profile.lang, count);
      setDone(new Set());
      setPage('sticker');
    } else {
      setDone(next);
      setPage('home');
    }
  }

  const home = () => setPage('home');
  // Si la police ne charge pas, on affiche quand même l'appli avec la police système.
  if ((!fontsLoaded && !fontError) || !minDelay || me === undefined) return <Loading />;
  if (me === null || page === 'profile') {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Welcome initial={me} onBack={me ? home : undefined}
          onDone={(p) => { saveProfile(p); applyProfile(p); }} />
      </SafeAreaProvider>
    );
  }

  // Les jeux piochent dans les mots de l'étape en cours du voyage, dans la langue choisie.
  const step = chosen ?? currentStep(stickers);
  const words = wordsFor(step, me.lang);
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {page === 'home' && <Home done={done} stickers={stickers} step={step} onProfile={() => setPage('profile')}
        onSelectStep={(i) => setChosen(i === currentStep(stickers) ? null : i)} onOpen={setPage} onPassport={() => setPage('passport')} />}
      {page === 'learn' && <Learn words={words} onFinish={() => finish('learn')} onBack={home} />}
      {page === 'memory' && <Memory words={words} onFinish={() => finish('memory')} onBack={home} />}
      {page === 'parrot' && <Parrot words={words} onFinish={() => finish('parrot')} onBack={home} />}
      {page === 'sticker' && <StickerWon count={stickers} onContinue={() => setPage('passport')} />}
      {page === 'passport' && <Passport count={stickers} onBack={home} />}
    </SafeAreaProvider>
  );
}
