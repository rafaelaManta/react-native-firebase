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
  //const {allowedVersions} = useBootraping()
  //const isUserLoggedIn = useIsUserLoggedIn()
  //const isUserUnauth = useIsEmailOfUnauth()
  //isEmailOfUnauth(store.getState()?.profileReducer.profile.email)
  //const didTheAppHasInitialScreen= useInitialModules()
  //store.getState()?.otherReducer?.authorityDetails?.initial_module
  const isUserLoggedIn = true



  useEffect(() => {
    //check if the app needs update
    //else setError and return

    //set up the app language

    if (isUserLoggedIn) {
      const unsubscribeFcmOnMessage = fcmOnMessage()
      //getBadgeNumber
      //setBadgeNumber to the redux store

      //background event
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
        //navigate to screen
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
            //navigate to screen
          }
        });

      //run the code for the module initial screen from api


      return unsubscribeFcmOnMessage

    } else {
      //run the code for bbbApp
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
