/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('\n\n\nMessage handled in the background! ----\n', remoteMessage);
});
AppRegistry.registerComponent(appName, () => App);
