import * as Notifications from 'expo-notifications';

export async function scheduleDailyNotification(hour: number, minute: number, body: string) {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Notificatie-permissie is niet verleend!');
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Herinnering',
      body,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
      channelId: 'default',
    },
  });
}
