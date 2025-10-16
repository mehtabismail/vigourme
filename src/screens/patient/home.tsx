import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  BackHandler,
  AppState,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Header from "../../components/header";
import Colors from "../../common/colors";
import HeadingWithTitle from "../../components/headingWithTitle";
import StatusBarComponent from "../../components/statusbar";
import StartConversationCard from "./startConversationCard";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

import Lock from "../../assets/icons/lock.svg";
import Logout from "../../assets/icons/logout.svg";
import navigationStrings from "../../common/navigationStrings";
import StartConversationImage from "../../assets/icons/startConversationImage.svg";
import { RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoutFunction from "../../utils/logout";
import firestore from "@react-native-firebase/firestore";
import Toast from "react-native-simple-toast";
import FullScreenLoadingIndicator from "../../components/fullScreenLoadingIndicator";
import { useSelector } from "react-redux";

export default function Home(props: any) {
  const [submittedSurvey, setSubmittedSurvey] = useState(null);
  const [unseenMessage, setUnseenMessage] = useState<any>([]);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [btnText, setBtnText] = useState("");
  const [gender, setGender] = useState<any>(null);

  const { token } = useSelector((state: any) => state?.tokenSlice);

  const checkSubmittedSurvey = (patientId: any) => {
    firestore()
      .collection("users")
      .doc(patientId)
      .get()
      .then((row) => {
        setSubmittedSurvey(row?.data()?.submittedSurvey);
        setBtnText(
          row?.data()?.submittedSurvey ? "Doctor Review" : "Start Conversation"
        );
      });
  };

  const checkMessageUnseen = (patientId: any) => {
    const unsub = firestore()
      .collection("messages")
      .where("patientId", "==", patientId)
      .where("seen", "==", false)
      .limit(1)
      .onSnapshot(async (documentSnapshot) => {
        const documents: any = documentSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        setUnseenMessage(documents);
      });
    return unsub;
  };

  const checkNotification = (patientId: any) => {
    const unsub = firestore()
      .collection("notifications")
      .where("userId", "==", patientId)
      .onSnapshot(
        (documentSnapshot) => {
          if (documentSnapshot?.docs.length) {
            const documents: any = documentSnapshot?.docs[0]?.data()?.message;
            Toast.show(documents);
            const docRef = firestore()
              .collection("notifications")
              .doc(documentSnapshot?.docs[0]?.id);
            docRef.delete();
            unsub();
          }
        },
        (error) => {
          console.log("notifications error: ", error);
        }
      );
    return unsub;
  };

  useEffect(() => {
    let subscription: any;
    let unsubNotification: any;
    let unsub: any;
    AsyncStorage.getItem("userId").then((patientId) => {
      checkSubmittedSurvey(patientId);
      unsubNotification = checkNotification(patientId);
      unsub = checkMessageUnseen(patientId);
      return { unsubNotification, unsub };
    });
    AsyncStorage.getItem("gender").then((gender) => {
      setGender(gender);
    });

    (async () => {
      subscription = AppState.addEventListener("change", (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          AsyncStorage.getItem("userId").then((patientId) => {
            unsubNotification = checkNotification(patientId);
          });
        }

        if (
          appState.current.match(/active/) &&
          nextAppState.match(/background|inactive/)
        ) {
          unsubNotification();
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        // console.log('doctorDashboard - AppState', appState.current);
      });

      return () => {
        subscription.remove();
      };
    })();

    return () => {
      unsub();
      unsubNotification();
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // this useEffect handles android's hardware backpress
    const backAction: any = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const { navigation } = props;
  const navigate = (path: String) => {
    navigation.navigate(path);
  };
  const UnderHeadingText = (props: any) => {
    return (
      <Text style={styles.headingText}>
        From here you can start the conversation with doctor
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!btnText && <FullScreenLoadingIndicator />}
      <StatusBarComponent colorWhite />
      <Header
        backPress={() => navigation.goBack()}
        title='Logo'
        shadow={true}
        showLogo
        filledLogo
      />
      <ScrollView style={styles.secContainer}>
        <HeadingWithTitle
          fontSize={24}
          marginTop={"8%"}
          marginBottom={"8%"}
          title={"Welcome to Patient Portal"}
          UnderHeadingText={<UnderHeadingText />}
          appScreen
        />
        <StartConversationImage style={{ alignSelf: "center" }} />
        <View style={{ flex: 1 }}>
          <StartConversationCard
            gender={gender}
            showContent={props?.route?.params?.showContent}
            foundUnseenMessages={unseenMessage}
            unseenMessageExists={unseenMessage.length ? true : false}
            navigation={navigation}
            text={btnText}
            navigationPath={
              submittedSurvey
                ? navigationStrings.CHAT
                : navigationStrings.SURVEY_INTRO
            }
          />
        </View>
      </ScrollView>

      {token && (
        <View style={styles.bottomView}>
          <View style={styles.bottomIconsWrapper}>
            <TouchableOpacity
              onPress={() => navigate(navigationStrings.CHANGE_PASSWORD)}
              style={styles.bottomButton}
            >
              <Lock />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => LogoutFunction(props)}
              style={styles.bottomButton}
            >
              <Logout />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
  secContainer: {
    flex: 1,
    marginTop: 5,
    paddingHorizontal: 20,
    width: "100%",
  },
  bottomView: {
    borderTopWidth: 1,
    borderStartWidth: 1,
    borderTopLeftRadius: 40,
    borderEndWidth: 1,
    borderTopRightRadius: 40,
    borderColor: "#E6E6E6",
    // position: "absolute",
    // bottom: 1,
    flexDirection: "row",
    width: "100%",
    height: "10%",
    alignSelf: "center",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: heightPercentageToDP(1),
    paddingHorizontal: widthPercentageToDP(25),
  },
  bottomButton: {
    backgroundColor: Colors.WHITE,
    alignItems: "center",
  },
  bottomIconsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  headingText: {
    color: Colors.LIGHT_TEXT_COLOR,
    fontSize: RFValue(14),
    fontWeight: "400",
    marginTop: "5%",
    lineHeight: 22,
  },
});
