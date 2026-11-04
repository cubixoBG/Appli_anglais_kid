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

export async function scheduleDailyReminder(hour = 9, minute = 6) {
  // 1. Demander la permission (une seule fois, le système retient la réponse)
  const { granted } = await Notifications.requestPermissionsAsync();
  if (!granted) return;

  // 2. Android : un « canal » de notifications est obligatoire
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('rappel', {
      name: 'Rappel de séance',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  // 3. Remplacer l'ancien rappel pour ne pas en empiler plusieurs
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
