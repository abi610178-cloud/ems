import PushNotification, { Importance } from 'react-native-push-notification';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.configure();
    this.createDefaultChannels();
  }

  configure = () => {
    PushNotification.configure({
      onRegister: (token) => {
        console.log('FCM Token:', token);
      },

      onNotification: (notification) => {
        console.log('Notification:', notification);
      },

      onAction: (notification) => {
        console.log('Notification action:', notification.action);
      },

      onRegistrationError: (err) => {
        console.error('Registration error:', err.message, err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  };

  createDefaultChannels = () => {
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id',
        channelName: 'Default Channel',
        channelDescription: 'A default channel for notifications',
        playSound: true,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );

    PushNotification.createChannel(
      {
        channelId: 'task-channel-id',
        channelName: 'Task Notifications',
        channelDescription: 'Notifications for task assignments and updates',
        playSound: true,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created) => console.log(`Task channel created: '${created}'`)
    );
  };

  showNotification = (title: string, message: string, data?: any) => {
    PushNotification.localNotification({
      channelId: 'default-channel-id',
      title: title,
      message: message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      vibrate: true,
      vibration: 300,
      userInfo: data,
    });
  };

  showTaskNotification = (title: string, message: string, taskId: string) => {
    PushNotification.localNotification({
      channelId: 'task-channel-id',
      title: title,
      message: message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      vibrate: true,
      vibration: 300,
      userInfo: { taskId },
      actions: ['View', 'Dismiss'],
    });
  };

  scheduleNotification = (title: string, message: string, date: Date) => {
    PushNotification.localNotificationSchedule({
      channelId: 'default-channel-id',
      title: title,
      message: message,
      date: date,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      vibrate: true,
    });
  };

  cancelAllNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PushNotification.requestPermissions(['alert', 'badge', 'sound']);
      return granted;
    }
    return true;
  };
}

export default new NotificationService();
