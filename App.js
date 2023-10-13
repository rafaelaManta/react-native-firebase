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
import notifee, { EventType } from '@notifee/react-native';


import {
  useFcm,
  useBadgeNumber,
  onDisplayNotification,
  handleNotifications
} from './services/FcmNotifications';


const App = () => {
  const fcmToken = useFcm()
  const badgeNumber = useBadgeNumber()

  console.log({ badgeNumber })

  useEffect(() => {

    // foreground event
    const unsubscribeFcmOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      onDisplayNotification(remoteMessage?.notification)
    });

    //background event
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      handleNotifications(remoteMessage.notification)
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
          handleNotifications(remoteMessage.notification)

        }
      });

    return unsubscribeFcmOnMessage

  }, [])


  useEffect(() => {
    // foreground event
    const unsubscribeNotifee = notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        await notifee.cancelNotification(detail.notification.id);
        handleNotifications(detail.notification)
      }
    })
    return () => {
      unsubscribeNotifee()
    }
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
