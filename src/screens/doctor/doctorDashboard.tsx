import {
  FlatList,
  StyleSheet,
  View,
  Text,
  AppState,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Colors from "../../common/colors";
import ChatListItem from "../../components/chatListItem";
import Header from "../../components/header";
import StatusBarComponent from "../../components/statusbar";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DashboardButton from "../../components/dashboardButton";
import User from "../../assets/icons/user-bg-green.svg";
import Message from "../../assets/icons/message-bg-green.svg";
import navigationStrings from "../../common/navigationStrings";
import Toast from "react-native-simple-toast";
import { SafeAreaView } from 'react-native-safe-area-context';

const DoctorDashboard = (props: any) => {
  const { navigation } = props;

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [pendingNotificationCount, setPendingNotificationCount] = useState(0);
  const [inboxNotificationCount, setInboxNotificationCount] = useState(0);

  let unSubNewSurveyNotification: any = undefined;
  const getNotifications = () => {
    unSubNewSurveyNotification = firestore()
      .collection("chats")
      .where("isPending", "==", true)
      .orderBy("updatedAt", "desc")
      .onSnapshot(
        (documentSnapshot) => {
          setPendingNotificationCount(
            documentSnapshot?.docs && documentSnapshot.docs?.length
          );
          const documents = documentSnapshot.docChanges();
          // add event listener for new data added
          if (
            documents.length > 0 &&
            documents[0].type === "added" &&
            documents[0].doc.data().seen == false
          ) {
            for (
              let i = 0;
              i < documents.length && !documents[i].doc.data().seen;
              i++
            ) {
              const docRef = firestore()
                .collection("chats")
                .doc(documents[0].doc.id);
              docRef.set({ seen: true }, { merge: true });
            }
            Toast.show("A new questionnaire is awaiting your review.");
          }
        },
        (error) => {
          console.log(error);
        }
      );
  };

  useEffect(() => {
    let subscription: any;
    if (unSubNewSurveyNotification === undefined) {
      getNotifications();
    }

    (async () => {
      subscription = AppState.addEventListener("change", (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          getNotifications();
        }

        if (
          appState.current.match(/active/) &&
          nextAppState.match(/background|inactive/)
        ) {
          unSubNewSurveyNotification();
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        // console.log('doctorDashboard - AppState', appState.current);
      });

      return () => {
        subscription.remove();
      };
    })();

    const unsubInboxChatCount = firestore()
      .collection("chats")
      .where("seen", "==", false)
      .onSnapshot(
        (documentSnapshot) => {
          setInboxNotificationCount(
            documentSnapshot?.docs && documentSnapshot.docs?.length
          );
        },
        (error) => {
          console.log(error);
        }
      );

    return () => {
      unsubInboxChatCount();
      unSubNewSurveyNotification();
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent colorWhite />
      <Header
        navigation={props}
        showLogo={true}
        showPowerIcon={true}
        shadow
        hideBackArrow
        filledLogo
      />

      <View style={styles.bodyContainer}>
        <View style={{ marginVertical: 15 }}>
          <Text style={styles.textHeading}>Welcome to Consultant Portal</Text>
          <Text style={styles.textGray}>
            From here you can view patient's questionnaires, communicate with
            patients and prescribe medicine.
          </Text>
        </View>
        <View style={{ marginVertical: 15 }}>
          <DashboardButton
            navigation={navigation.navigate}
            path={navigationStrings.DOCTOR_PENDING_SURVEYS}
            text={"Pending Questionnaires"}
            count={pendingNotificationCount}
          >
            <User />
          </DashboardButton>
          <DashboardButton
            navigation={navigation.navigate}
            path={navigationStrings.DOCTOR_CHAT_LIST}
            text={"Go to Inbox"}
            count={inboxNotificationCount}
          >
            <Message />
          </DashboardButton>
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
  flatListView: {
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  noChatMsgView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyContainer: {
    justifyContent: "center",
    padding: 25,
  },
  textHeading: {
    color: Colors.BLACK,
    fontSize: 26,
    fontWeight: "600",
    marginVertical: 5,
    fontFamily: "Urbanist-Black",
    lineHeight: 40,
  },
  textGray: {
    color: Colors.GREYTEXT,
    fontSize: 18,
    fontWeight: "300",
    marginVertical: 5,
    fontFamily: "Urbanist-bold",
    lineHeight: 25,
    fontStyle: "normal",
  },
});

export default DoctorDashboard;
