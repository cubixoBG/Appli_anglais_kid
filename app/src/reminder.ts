import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Affiche aussi la notification si l'appli est ouverte
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Android exige un canal de notifications.
async function ensureChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('rappel', {
      name: 'Rappel de séance',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

// shortcut: outil de diagnostic temporaire (bouton sur l'accueil), à retirer une fois les notifications validées.
// Envoie une notification dans 10 s et renvoie un état lisible : permission, nombre de rappels programmés.
export async function testNotification(): Promise<string> {
  const perm = await Notifications.requestPermissionsAsync();
  if (!perm.granted) return `Permission refusée (${perm.status}). Active les notifications dans les réglages Android.`;
  await ensureChannel();
  await Notifications.scheduleNotificationAsync({
    content: { title: '🔔 Test', body: 'Les notifications marchent !' },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 10, channelId: 'rappel' },
  });
  const all = await Notifications.getAllScheduledNotificationsAsync();
  return `Permission OK. Une notification arrive dans 10 s (ferme l'appli pour la voir).\n${all.length} notification(s) programmée(s) sur le téléphone.`;
}

// Rappel local chaque jour : aucun serveur, aucune donnée ne quitte le téléphone.
export async function scheduleDailyReminder(name: string, hour = 15, minute = 45) {
  // La permission est demandée une fois ; le système retient la réponse.
  const { granted } = await Notifications.requestPermissionsAsync();
  if (!granted) {
    console.warn('Rappel : permission des notifications refusée');
    return;
  }

  await ensureChannel();

  // On remplace l'ancien rappel pour ne pas en empiler un à chaque lancement.
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `🐿️ ${name}, ta séance t’attend !`,
      body: '10 minutes pour gagner un nouvel autocollant !',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: 'rappel',
    },
  });
}
