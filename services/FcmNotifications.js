
import { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native'
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';


const requestPermission = async () => {
    try {
        if (Platform.OS === 'ios') {
            const authStatus = await messaging().requestPermission()
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL
            return enabled
        } else {
            const authStatus = await PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS');
            return authStatus === 'granted'
        }

    } catch (error) {
        console.log('Failed to request permission')
    }
}


const getFcmToken = async () => {
    try {
        await messaging().registerDeviceForRemoteMessages()
        return await messaging().getToken()
    } catch (error) {
        console.log('Failed to register device for remote messages')
    }

}

const useFcm = () => {
    const [fcmToken, setFcmToken] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                const permissionFCMIsEnabled = await requestPermission()
                if (permissionFCMIsEnabled) {
                    const token = await getFcmToken()
                    setFcmToken(token)
                }
            } catch (error) {
                console.log('Failed to return token')
            }
        })()
    }, [])
    return fcmToken
}

const useBadgeNumber = () => {
    const [badgeNumber, setBadgeNumber] = useState(0)

    useEffect(() => {
        (async () => {
            try {
                const notifeeBadge = await notifee.getBadgeCount()
                console.log({ notifeeBadge })
                setBadgeNumber(notifeeBadge)
            } catch (error) {
                console.log('Failed to return badge number')
            }
        })()
    }, [])
    return badgeNumber
}


const handleNotifications = (remoteMessage) => {
    const { title, body } = remoteMessage
    Alert.alert(title, body)
}

const onDisplayNotification = async (remoteMessage) => {
    //required for iOS
    await notifee.requestPermission()

    //required for Android
    const channelId = await notifee.createChannel({
        id: 'novoville',
        name: 'Default Channel',
        sound: 'default'
    });

    await notifee.displayNotification({
        title: remoteMessage?.title,
        body: remoteMessage?.body,
        android: {
            channelId,
            // pressAction is needed if you want 
            //the notification to open the app when pressed
            pressAction: {
                id: 'mark-as-read',
            },
        },
    });
}


export {
    useFcm,
    useBadgeNumber,
    onDisplayNotification,
    handleNotifications
}