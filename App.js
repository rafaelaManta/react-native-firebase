/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';


import { useFcm, fcmOnMessage, } from './services/FcmNotifications';


const App = () => {
  const fcmToken = useFcm()


  useEffect(() => {
    const unsubscribeFcmOnMessage = fcmOnMessage()

    //background event
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );

    });

    //quite event
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });

    return unsubscribeFcmOnMessage;

  }, [])

  return (
    <SafeAreaView>
      <StatusBar />
      <View style={{ padding: 20 }}>
        <Text>{`Firebase Token:`}</Text>
        <TextInput
          readOnly
          multiline
          value={fcmToken}
          numberOfLines={4}
        />
      </View>
    </SafeAreaView>
  );
};



export default App;
