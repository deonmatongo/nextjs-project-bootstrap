import PushNotification from 'react-native-push-notification';

class NotificationService {
  constructor() {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('Notification received:', notification);
      },
      requestPermissions: true,
    });
  }

  scheduleDailyReminder(hour = 8, minute = 0) {
    PushNotification.cancelAllLocalNotifications();
    PushNotification.localNotificationSchedule({
      message: "Don't forget to complete your workout today!",
      date: new Date(Date.now() + this._getNextTriggerTime(hour, minute)),
      repeatType: 'day',
    });
  }

  _getNextTriggerTime(hour, minute) {
    const now = new Date();
    const trigger = new Date();
    trigger.setHours(hour);
    trigger.setMinutes(minute);
    trigger.setSeconds(0);
    if (trigger <= now) {
      trigger.setDate(trigger.getDate() + 1);
    }
    return trigger.getTime() - now.getTime();
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }
}

export default new NotificationService();
