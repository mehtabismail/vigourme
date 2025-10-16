import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
// import notifee from '@notifee/react-native';

// register App With FCM
async function registerAppWithFCM() {
  await messaging().registerDeviceForRemoteMessages();
}

// check and get notification permission
export async function requestUserPermission() {
  registerAppWithFCM();
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
    if (messaging().isDeviceRegisteredForRemoteMessages) {
      getFcmToken();
    }
  }
}

// get FCM token after get notification permission
export const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem("fcm_token");
  console.log("Old Fcm token:", fcmToken);
  if (!fcmToken) {
    try {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log("the new generated token: ", fcmToken);
        await AsyncStorage.setItem("fcm_token", fcmToken);
      }
    } catch (error) {
      console.log("while getting fcm token: ", error);
    }
  }
  return fcmToken;
};

// get foreground notification and navigate to the specific screen
export const notificationListener = async () => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open
  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log(
      "Notification caused app to open from background state:",
      remoteMessage
    );
    // navigationRef.navigate('Notifications')
  });

  // foreground notification message
  // messaging().onMessage(async remoteMessage => {
  //   // onDisplayNotification(remoteMessage);
  //   console.log('message received in foreground', remoteMessage);
  // });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from quit state:",
          remoteMessage.notification
        );
        // navigationRef.navigate('Notifications')
        // notifee.incrementBadgeCount()
        //   setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
      }
      // setLoading(false);
    });
};

// show notification at foreground state
// async function onDisplayNotification(props:any) {
//   // Request permissions (required for iOS)
//   await notifee.requestPermission();

//   // Create a channel (required for Android)
//   const channelId = await notifee.createChannel({
//     id: 'default',
//     name: 'Default Channel',
//   });

//   // Display a notification
//   await notifee.displayNotification({
//     title: props?.notification?.title,
//     body: props?.notification?.body,
//     android: {
//       channelId,
//       // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
//       // pressAction is needed if you want the notification to open the app when pressed
//       pressAction: {
//         id: 'default',
//       },
//     },
//   });
//   // navigationRef.navigate('Profile')
// }

// Badge icon
// const incrementBadge = () => {
//   notifee
//     .incrementBadgeCount()
//     .then(() => notifee.getBadgeCount())
//     .then(count => console.log('Badge count incremented by 1 to: ', count))
// }

// const decrementBadge = () => {
//   notifee
//     .decrementBadgeCount()
//     .then(() => notifee.getBadgeCount())
//     .then(count => console.log('Badge count decremented by 1 to: ', count))
// }
