import { Lexend_400Regular, Lexend_600SemiBold, Lexend_800ExtraBold, useFonts } from '@expo-google-fonts/lexend';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { loadStickers, saveStickers } from './src/passport';
import { Activity, Home, Learn, Memory, Parrot, Passport, StickerWon } from './src/screens';

type Page = 'home' | Activity | 'sticker' | 'passport';

// shortcut: navigation par simple état, suffisante pour 6 écrans ; passer à Expo Router si l'appli grossit.
export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [done, setDone] = useState<Set<Activity>>(new Set());
  const [stickers, setStickers] = useState(0);
  const [fontsLoaded, fontError] = useFonts({ Lexend_400Regular, Lexend_600SemiBold, Lexend_800ExtraBold });

  useEffect(() => {
    loadStickers().then(setStickers);
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
    const next = new Set(done).add(a);
    if (next.size === 3) {
      // Séance complète : un autocollant, puis une nouvelle séance commence.
      const count = stickers + 1;
      setStickers(count);
      saveStickers(count);
      setDone(new Set());
      setPage('sticker');
    } else {
      setDone(next);
      setPage('home');
    }
  }

  const home = () => setPage('home');
  // Si la police ne charge pas, on affiche quand même l'appli avec la police système.
  if (!fontsLoaded && !fontError) return null;
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {page === 'home' && <Home done={done} onOpen={setPage} onPassport={() => setPage('passport')} />}
      {page === 'learn' && <Learn onFinish={() => finish('learn')} onBack={home} />}
      {page === 'memory' && <Memory onFinish={() => finish('memory')} onBack={home} />}
      {page === 'parrot' && <Parrot onFinish={() => finish('parrot')} onBack={home} />}
      {page === 'sticker' && <StickerWon count={stickers} onContinue={() => setPage('passport')} />}
      {page === 'passport' && <Passport count={stickers} onBack={home} />}
    </SafeAreaProvider>
  );
}
