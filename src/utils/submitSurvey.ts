

import AsyncStorage from '@react-native-async-storage/async-storage';
import EndPoint from '../common/apiEndpoints';
import Toast from 'react-native-simple-toast';
import firestore from '@react-native-firebase/firestore';
import { getReceiverFcmToken, sendNotification } from './fcmApi';
import { apiRequestSubmit } from '../api/apiRequestSubmit';

const registerChatsCollection = async ({ message, serialNumber }: any) => {
  // const registerChatsCollection = async () => {
  // const userId = await AsyncStorage.getItem("userId");
  const userId = await AsyncStorage.getItem('userId');
  // let currentDateTime = new Date();
  let currentDateTime = firestore.FieldValue.serverTimestamp();
  const doctorId = await AsyncStorage.getItem('doctorId');
  const chatRef = firestore().collection('chats').doc();
  const messageRef = firestore().collection('messages').doc();
  const name = await AsyncStorage.getItem('name');
  const batch = firestore().batch();

  console.log(
    {
      isPending: true,
      patientId: userId,
      doctorId: doctorId,
      createdAt: currentDateTime,
      updatedAt: currentDateTime,
      recentMessage: {
        text: null,
        patientId: userId,
        doctorId: doctorId,
        time: currentDateTime,
        sentBy: userId,
        name: name,
        isAttachment: false,
        patientSerialNumber: serialNumber,
      },
      seen: false,
    },
    'question card data',
  );

  batch.set(chatRef, {
    isPending: true,
    patientId: userId,
    doctorId: doctorId,
    createdAt: currentDateTime,
    updatedAt: currentDateTime,
    recentMessage: {
      text: null,
      patientId: userId,
      doctorId: doctorId,
      time: currentDateTime,
      sentBy: userId,
      name: name,
      isAttachment: false,
      patientSerialNumber: serialNumber,
    },
    seen: false,
  });
  // batch.set(messageRef, {
  //   chatId: chatRef.id,
  //   text: "Hi Doctor,I have filled and submitted my questionnaire. Kindly prescribe me the medication.",
  //   patientId: userId,
  //   doctorId: doctorId,
  //   time: currentDateTime,
  //   sentBy: userId,
  //   isAttachment: false,
  //   seen: false,
  //   patientSerialNumber: serialNumber
  // });
  try {
    batch.commit().then(() => {
      const _sendNotification = (_fcmToken: any) => {
        _fcmToken &&
          sendNotification(
            {
              fcmToken: _fcmToken,
              notification: {
                body: `A new questionnaire is submitted ${serialNumber ? 'by ' + serialNumber : ''
                  }`,
                title: 'New Questionnaire',
              },
            },
            () => { },
          );
      };
      // get receiver fcmToken for notification and send notification
      getReceiverFcmToken(doctorId, _sendNotification);
    });
    // navigate(navigationStrings.CHAT);
    if (message) {
      // Toast.show(message);
      // console.log("resetting appp");
      // RNRestart.restart();
    }
  } catch (error) {
    console.log(error, 'error in batch commiting');
  }
};
const submitSurveyCallback = async ({ token, userId, serialNumber, answers }: any) => {
  console.log('calling callback function submitSurveyCallback');
  // const userId = await AsyncStorage.getItem("userId");
  let message = '';
  try {
    console.log(
      'started calling submit survey function with userId ',
      userId,
    );
    const res: any = await apiRequestSubmit(EndPoint.SUBMIT_SURVEY, 'post', {
      questionsAnswers: answers,
      userId: userId,
    });

    console.log(res, 'success response of question submit');
    message = res?.data?.message;
    registerChatsCollection({
      message: message,
      serialNumber: serialNumber,
    });
    return res?.data;
  } catch (error: any) {
    console.log('errorr in catch ...', error);
    const userId = await AsyncStorage.getItem('userId');
    const userRes = await firestore()
      .collection('users')
      .doc(userId?.toString())
      .get();

    const chatRes = await firestore()
      .collection('chats')
      .where('patientId', '==', userId)
      .limit(1)
      .get();
    if (userRes?.data()?.submittedSurvey && chatRes?.docs[0] === undefined) {
      registerChatsCollection({
        message: message,
        serialNumber: serialNumber,
      });
    } else {
      const errMsg = error?.message || String(error);
      Toast.show(errMsg, Toast.LONG);
    }
    return null;
  }
};

export { submitSurveyCallback };