import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import Colors from "../../common/colors";
import Header from "../../components/header";
import Message from "../../components/message";
import SendMessage from "../../assets/icons/send_message.svg";
import GeneratePrescription from "../../assets/icons/generate_prescription.svg";
import navigationStrings from "../../common/navigationStrings";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "../../api/apiRequest";
import EndPoint from "../../common/apiEndpoints";
import RNFetchBlob from 'react-native-blob-util';
import Toast from "react-native-simple-toast";
import useDetectKeyBoard from "../../hooks/useDetectKeyboard";
import DownloadSurveyInPDF from "../../utils/downloadSurvey";
import { getReceiverFcmToken, sendNotification } from "../../utils/fcmApi";
import downloadLatestPrescriptionPDF from "../../utils/downloadPrescription";
import { SafeAreaView } from 'react-native-safe-area-context';

const DoctorChat = (props: any) => {
  const { isKeyboardVisible, keyboardHeight } = useDetectKeyBoard();
  const { navigation, route } = props;
  const { patientId, chatId, patientSerialNumber } = route?.params;
  const [messageBody, setMessageBody] = useState<string>();
  const [messagesList, setMessagesList] = useState<any>([]);
  const [isFirstMessage, setIsFirstMessage] = useState<Boolean>(false);
  const [fcmToken, setFcmToken] = useState<String>();
  const [fromPandingSurveys, setFromPandingSurveys] = useState<Boolean>(
    route?.params?.fromPandingSurveys
  );
  const goBack = () => {
    navigation.goBack();
  };
  const navigate = (path: String, param?: any) => {
    navigation.navigate(path, {
      patientId: patientId,
      chatId: chatId,
      approveSurvey: approveSurvey,
      fromPandingSurveys: fromPandingSurveys,
    });
  };

  useEffect(() => {
    let [_isFirstMessage, _fromPandingSurveys] = [
      isFirstMessage,
      fromPandingSurveys,
    ];
    let unSubFirestore: Function, unSubUpdateUnseenMessages: Function;

    if (chatId) {
      unSubFirestore = getAllMessagesList(chatId);
    }

    // unSubUpdateUnseenMessages make the status of all messages from seen to unseen
    updateUnseenMessages().then((res) => {
      unSubUpdateUnseenMessages = res;
    });

    // get the resent message
    const unSubUpdateRecentMessage = updateRecentMessage(
      _isFirstMessage,
      _fromPandingSurveys
    );

    return () => {
      // Stop listening for updates when no longer required
      unSubFirestore();
      unSubUpdateUnseenMessages();
      unSubUpdateRecentMessage();
    };
  }, [isFirstMessage]);

  const getAllMessagesList = (chatId: any) => {
    return firestore()
      .collection("messages")
      .where("chatId", "==", chatId)
      .orderBy("time", "desc")
      .onSnapshot(
        (documentSnapshot) => {
          const documents = documentSnapshot?.docs?.map((item) => ({
            id: item.id,
            ...item.data(),
          }));
          setMessagesList(documents);
        },
        (error) => {
          console.log("documentSnapshot Error: ", error);
        }
      );
  };

  const updateUnseenMessages = async () => {
    let id = await AsyncStorage.getItem("userId");
    const unSub = firestore()
      .collection("messages")
      .where("chatId", "==", chatId)
      .where("seen", "==", false)
      .onSnapshot(
        async (documentSnapshot) => {
          const documents: any = documentSnapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }));
          if (documents.length) {
            for (let i = 0; i < documents.length; i++) {
              if (documents[i].sentBy !== id) {
                const docRef = firestore()
                  .collection("messages")
                  .doc(documents[i].id);
                docRef.set(
                  {
                    seen: true,
                  },
                  { merge: true }
                );
              }
            }
          }
        },
        (error: any) => {
          console.log(error);
        }
      );

    return unSub;
  };

  const updateRecentMessage = (
    _isFirstMessage: Boolean,
    _fromPandingSurveys: Boolean
  ) => {
    const unSub = firestore()
      .collection("chats")
      .where(firestore.FieldPath.documentId(), "==", chatId)
      .onSnapshot(async (documentSnapshot) => {
        const documents: any = documentSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        const docRef = firestore().collection("chats").doc(documents[0].id);
        if (
          (documentSnapshot.docs?.length > 0 &&
            !documentSnapshot.docs[0].data()?.seen) ||
          (_fromPandingSurveys && _isFirstMessage)
        ) {
          docRef.set(
            _fromPandingSurveys
              ? {
                updatedAt: firestore.FieldValue.serverTimestamp(),
                seen: true,
              }
              : { seen: true },
            { merge: true }
          );
          if (_fromPandingSurveys && _isFirstMessage) {
            _fromPandingSurveys = _isFirstMessage = false;
            (async () =>
              await approveSurvey().then((res) => {
                res &&
                  console.log(
                    `--First Message Successfully Send-- and api responce is: (${res})`
                  );
              }))();
          }
        }
      });

    return unSub;
  };

  const approveSurvey = async () => {
    try {
      const { data }: any = await apiRequest(
        `${EndPoint.APPROVE_SURVEY}/${patientId}`,
        "get",
        ""
      );
      if (data?.success) {
        setFromPandingSurveys(false);
        return data?.message;
      }
    } catch (error: any) {
      Toast.show(error);
    }
  };

  const sendMessage = async () => {
    let currentDateTime = firestore.FieldValue.serverTimestamp();
    const userId = await AsyncStorage.getItem("userId");
    const doctorId = await AsyncStorage.getItem("doctorId");
    fromPandingSurveys && setIsFirstMessage(true);

    if (chatId && messageBody != "") {
      const chatRef = firestore().collection("chats").doc(chatId);
      const messageRef = firestore().collection("messages").doc();
      const batch = firestore().batch();
      batch.set(
        chatRef,
        {
          patientId: patientId,
          // createdAt: currentDateTime,
          updatedAt: currentDateTime,
          recentMessage: {
            text: messageBody,
            patientId: patientId,
            doctorId: doctorId,
            time: currentDateTime,
            sentBy: userId,
            isAttachment: false,
          },
          seen: false,
        },
        { merge: true }
      );
      batch.set(messageRef, {
        chatId: chatRef.id,
        text: messageBody,
        patientId: patientId,
        doctorId: doctorId,
        time: currentDateTime,
        sentBy: userId,
        isAttachment: false,
        seen: false,
      });
      console.log("sending notification message");
      const tempMessage = messageBody;
      try {
        setMessageBody("");
        batch.commit().then(() => {
          const _sendNotification = (_fcmToken: any) => {
            !fcmToken && _fcmToken && setFcmToken(_fcmToken);
            _fcmToken &&
              sendNotification(
                {
                  fcmToken: _fcmToken,
                  notification: {
                    body: messageBody,
                    title: "New Message",
                  },
                },
                setFcmToken
              );
          };
          console.log(fcmToken);
          // get receiver fcmToken for notification and send notification
          fcmToken
            ? _sendNotification(fcmToken)
            : getReceiverFcmToken(patientId, _sendNotification);
        });
      } catch (e: any) {
        setMessageBody(tempMessage);
        Toast.show("Error: " + e.message);
      }
    }
  };

  const downloadPatientSurvey = async () => {
    Toast.show("Downloading.....");
    try {
      const { data }: any = await apiRequest(
        `${EndPoint.DOWNLOAD_PATIENT_SURVEY}/${patientId}`,
        "get",
        ""
      );
      if (data) {
        DownloadSurveyInPDF(patientSerialNumber, data?.file, Toast, Platform);
      }
    } catch (error: any) {
      Toast.show(error);
    }
  };

  const downloadLatestPrescription = async () => {
    const userId = patientId;
    Toast.show("Downloading.....");
    try {
      const { data }: any = await apiRequest(
        `${EndPoint.DOWNLOAD_PRESCRIPTION}/${userId}`,
        "get",
        ""
      );
      if (data) {
        const fileNameIndex = messagesList.findIndex(
          (msg: any) => msg?.isAttachment
        );
        const pdfFileName = messagesList[fileNameIndex]?.text;
        console.log("\n\npdfFileName", pdfFileName);
        await downloadLatestPrescriptionPDF(
          data.file,
          pdfFileName,
          Platform,
          RNFetchBlob,
          Toast
        );
      }
    } catch (error: any) {
      Toast.show(error);
    }
  };

  return (
    <SafeAreaView style={styles.container} >
      <View style={{
        flex: 1,
        marginBottom: !isKeyboardVisible ? 0 : Platform.OS === "android" ? keyboardHeight + 24 : 0,
      }}>
        <Header
          filledLogo
          backPress={goBack}
          title={patientSerialNumber}
          shadow
        />

        <View style={styles.downloadSurveyReport}>
          <Text style={styles.downloadTextDesc}>
            Click on Download button to view patient questionnaire.
          </Text>
          <TouchableOpacity onPress={downloadPatientSurvey}>
            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.downloadSurveyReport}>
          <Text style={styles.downloadTextDesc}>
            Click on Download button to view prescription.
          </Text>
          <TouchableOpacity onPress={downloadLatestPrescription}>
            <Text style={styles.downloadText}>View</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }}>
          {/* Scrollable messages */}
          <View style={{ paddingHorizontal: 20, flex: 1 }}>
            <FlatList
              style={styles.flatList}
              showsVerticalScrollIndicator={false}
              data={messagesList}
              key={"_"}
              inverted={true}
              renderItem={({ item }: any) => {
                return (
                  <Message
                    isAttachment={item.isAttachment}
                    time={item.time}
                    sentBy={item.sentBy}
                    messageValue={item.text}
                    messageId={item.id}
                    seen={item.seen}
                    patientSerialNumber={patientSerialNumber}
                  />
                );
              }}
            />
          </View>

          {/* Fixed bottom input bar */}
          <View style={[styles.mainBottomView]}>
            <TouchableOpacity
              onPress={() => navigate(navigationStrings.PRESCRIPTION)}
            >
              <GeneratePrescription />
            </TouchableOpacity>
            <View style={styles.typeAndSendMessageContainer}>
              <TextInput
                placeholder='Type a Message'
                multiline={true}
                placeholderTextColor={Colors.MESSAGE_TIME}
                style={styles.inputStyle}
                onChangeText={(text: any) => setMessageBody(text)}
                value={messageBody}
              />
              <TouchableOpacity
                onPress={sendMessage}
                style={[styles.sendMessageButton]}
              >
                <SendMessage />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  flatList: {},
  typeSendMessageContainer: {
    position: "absolute",
    backgroundColor: Colors.INCOMING_MESSAGE_BG,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  inputStyle: {
    width: "85%",
    borderRadius: 30,
    color: Colors.BLACK,
  },
  sendMessageButton: {
    position: "absolute",
    right: 15,
  },
  downloadSurveyReport: {
    width: "100%",
    backgroundColor: Colors.DOWNLOAD_SURVEY_CONTAINER,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 24,
    alignItems: "center",
  },
  downloadTextDesc: {
    color: Colors.DARK_TEXT_COLOR,
    fontSize: 10,
    fontWeight: "500",
  },
  downloadText: {
    color: Colors.DARK_TEXT_COLOR,
    fontSize: 10,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
  mainBottomView: {
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  typeAndSendMessageContainer: {
    backgroundColor: Colors.INCOMING_MESSAGE_BG,
    width: "82%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
    borderRadius: 30,
    paddingVertical: Platform.OS == "ios" ? 15 : 0,
  },
});

export default DoctorChat;
