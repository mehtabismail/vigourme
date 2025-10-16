import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigations/auth';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

const App = () => {
  // const navigation = useNavigation();
  async function onDisplayNotification(props: any) {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: props?.notification?.title,
      body: props?.notification?.body,
      android: {
        channelId,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
    // navigationRef.navigate('Profile')
  }

  useEffect(() => {
    // requestUserPermission()
    // notificationListener()

    messaging().onNotificationOpenedApp(async (remoteMessage: any) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      if (remoteMessage?.data?.type == 'chat-message') {
        // navigation.navigate("Messages" as any);
      } else {
        // navigation.navigate("Notification");
      }
      // navigation.navigate('Notifications')

      if (
        // remoteMessage?.data?.type == 'chat-message' ||
        remoteMessage?.data?.type == 'complete-trip' ||
        remoteMessage?.data?.type == 'trip-rating'
      ) {
        console.log('no red line');
      } else {
        // dispatch(incommingNotifications(true));
      }

      if (remoteMessage?.data?.type == 'trip-rating') {
        const data = JSON.parse(remoteMessage?.data?.payload as any);
        // userDetail(data?.user_id);
      }

      if (remoteMessage?.data?.type == 'account-verification') {
        console.log('account verification if started ========>');
        // getAllVehicles("vehicles");
        const data = JSON.parse(remoteMessage?.data?.payload);
      }
      console.log('message received in foreground   app test ', remoteMessage);

      // onDisplayNotification(remoteMessage)
      // dispatch(emptyNotificationList([]) as any);
      // getNotifications("notifications");

      const data = JSON.parse(remoteMessage?.data?.payload as any);

      if (remoteMessage?.data?.type == 'start-trip') {
        // let rideData = {
        //   status: 'inprogress',
        //   start_time: new Date(),
        // }
        // updateRide({
        //   data: rideData,
        //   id: data?.ride?._id,
        // })
        // dispatch(
        //   inprogressTrips({
        //     ...data?.trip,
        //     active: 'rider',
        //     start_time: new Date(),
        //     checking: 'helloooooooo',
        //   }),
        // )
        // navigateAndSimpleReset("Dashboard");
      }
      if (remoteMessage?.data?.type == 'complete-trip') {
        // dispatch(showRating(true));
      }
    });

    // Foreground message
    messaging().onMessage(async remoteMessage => {
      console.log('====================================');
      console.log('message received in foreground');
      console.log('====================================');

      onDisplayNotification(remoteMessage);
      // dispatch(emptyNotificationList([]) as any);
      // getNotifications("notifications");
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          // dispatch(incommingNotifications(true))

          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          if (remoteMessage?.data?.type == 'chat-message') {
            // navigation.navigate("Messages" as any);
          } else {
            // navigation.navigate("Notification");
          }
          if (
            // remoteMessage?.data?.type == 'chat-message' ||
            remoteMessage?.data?.type == 'complete-trip' ||
            remoteMessage?.data?.type == 'trip-rating'
          ) {
            console.log('no red line');
          } else {
            // dispatch(incommingNotifications(true));
          }

          if (remoteMessage?.data?.type == 'trip-rating') {
            const data = JSON.parse(remoteMessage?.data?.payload as any);
            // userDetail(data?.user_id);
          }

          if (remoteMessage?.data?.type == 'account-verification') {
            console.log('account verification if started ========>');
            // getAllVehicles("vehicles");
            const data = JSON.parse(remoteMessage?.data?.payload);
          }
          console.log(
            'message received in foreground new test 1',
            remoteMessage,
          );
          onDisplayNotification(remoteMessage);
          // dispatch(emptyNotificationList([]) as any);
          // getNotifications("notifications");

          const data = JSON.parse(remoteMessage?.data?.payload as any);

          if (remoteMessage?.data?.type == 'start-trip') {
            // let rideData = {
            //   status: 'inprogress',
            //   start_time: new Date(),
            // }
            // updateRide({
            //   data: rideData,
            //   id: data?.ride?._id,
            // })
            // dispatch(
            //   inprogressTrips({
            //     ...data?.trip,
            //     active: 'rider',
            //     start_time: new Date(),
            //     checking: 'helloooooooo',
            //   }),
            // )
            // navigateAndSimpleReset("Dashboard");
          }
          if (remoteMessage?.data?.type == 'complete-trip') {
            // dispatch(showRating(true));
          }
        }
        // setLoading(false);
      });

    // ...
    // notifee.onBackgroundEvent(async ({ type, detail }) => {
    //   if (type === EventType.PRESS) {
    //     global.toNotifications = true;
    //     console.log("notifee background");
    //   }
    // });

    // notifee.onForegroundEvent(({ type, detail }) => {
    //   switch (type) {
    //     case EventType.DISMISSED:
    //       console.log("User dismissed notification", detail.notification);
    //       break;
    //     case EventType.PRESS:
    //       forgroundLinking(detail);
    //       break;
    //   }
    // });
  }, []);

  const forgroundLinking = (detail: any) => {
    if (detail?.notification?.title == 'New Message') {
      console.log('Messages');
    } else {
      console.log('Messages');
    }
  };

  const AppNavigator = () => {
    return <AuthNavigator />;
  };
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
