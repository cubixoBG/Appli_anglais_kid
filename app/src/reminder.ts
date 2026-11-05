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
