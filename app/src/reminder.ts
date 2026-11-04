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

// Rappel local chaque jour : aucun serveur, aucune donnée ne quitte le téléphone.
export async function scheduleDailyReminder(hour = 11, minute = 45) {
  // La permission est demandée une fois ; le système retient la réponse.
  const { granted } = await Notifications.requestPermissionsAsync();
  if (!granted) return;

  // Android exige un canal de notifications.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('rappel', {
      name: 'Rappel de séance',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  // On remplace l'ancien rappel pour ne pas en empiler un à chaque lancement.
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🐿️ Your English lesson is waiting!',
      body: 'Ta séance du jour t’attend, 10 minutes pour gagner un autocollant !',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: 'rappel',
    },
  });
}
