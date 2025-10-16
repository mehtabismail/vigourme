import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import StartConvo from "../../assets/icons/start_convo.svg";
import Colors from "../../common/colors";
import ForwardArrow from "../../assets/icons/forward_arrow.svg";
import navigationStrings from "../../common/navigationStrings";
import useGetReduxState from "../../customhooks/useGetReduxState";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StartConversationCard = (props: any) => {
  const states: any = useGetReduxState();
  const {
    navigation,
    unseenMessageExists,
    foundUnseenMessages,
    navigationPath,
    text,
    gender,
    showContent,
  } = props;
  const [userId, setUserId] = useState<any>();
  const [loginToken, setLoginToken] = useState(null);

  const navigate = async () => {
    navigation.navigate(navigationPath);
  };
  const getUserId = async () => {
    const userId = await AsyncStorage.getItem("userId");
    const token: any = await AsyncStorage.getItem("token");
    setLoginToken(token);
    setUserId(userId);
  };
  useEffect(() => {
    getUserId();
  }, []);

  const TextWithBullet = ({ data }: any) => {
    const { text, key } = data;
    return (
      <TouchableOpacity
        onPress={() => {
          AsyncStorage.setItem(
            "selectedQuestionaireData",
            JSON.stringify(data)
          );
          navigation.navigate(navigationStrings.SURVEY_INTRO);
        }}
        style={{
          alignItems: "center",
          paddingVertical: 20,
          backgroundColor: Colors.THEMECOLOR,
          justifyContent: "center",
          marginBottom: 10,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            fontSize: RFValue(14),
            color: Colors.BLACK,
            fontWeight: "600",
            marginLeft: 5,
            marginTop: -3,
            textAlign: "center",
          }}
        >
          {text}
        </Text>
      </TouchableOpacity>
    );
  };
  return !showContent ? (
    <TouchableOpacity onPress={navigate} style={styles.container}>
      <StartConvo />
      <Text
        style={[
          styles.startConvoText,
          {
            marginLeft: unseenMessageExists ? -20 : -40,
          },
        ]}
      >
        {text}
      </Text>
      {unseenMessageExists &&
        foundUnseenMessages &&
        foundUnseenMessages[0].sentBy !== userId && (
          <View style={styles.unseenView} />
        )}
      <ForwardArrow />
    </TouchableOpacity>
  ) : (
    <View style={{ marginTop: 25 }}>
      <Text
        style={{
          fontSize: RFValue(14),
          color: Colors.BLACK,
          fontWeight: "600",
        }}
      >
        Your Health, Simplified.
      </Text>
      <Text
        style={{
          fontSize: RFValue(12),
          color: Colors.BLACK,
          fontWeight: "600",
          marginTop: 5,
        }}
      >
        Get personalized sexual health treatments, tailored for you. Start with
        a quick, confidential online quiz.
      </Text>
      <View style={{ marginTop: 15 }}>
        {gender == "male" ? (
          <>
            <TextWithBullet
              data={{
                text: "Erectile dysfunction",
                index: "0",
                key: "maleErectileDysfunctionQuestions",
              }}
            />
            <TextWithBullet
              data={{
                text: "Premature ejaculation",
                index: "1",
                key: "malePrematureEjaculationQuestions",
              }}
            />
            <TextWithBullet
              data={{
                text: "Other issues",
                index: "2",
                key: "maleOtherIssues",
              }}
            />
          </>
        ) : (
          <>
            <TextWithBullet
              data={{
                text: "Low Libido – Low sex drive",
                key: "lowLobido",
                index: "0",
              }}
            />
            <TextWithBullet
              data={{
                text: "Orgasm Issues",
                key: "vaginalDryness",
                index: "1",
              }}
            />
            <TextWithBullet
              data={{
                text: "Vaginal Dryness",
                key: "orgasmIssues",
                index: "2",
              }}
            />
            <TextWithBullet
              data={{
                text: "Vaginismus – Painful Intercourse or Penetration ",
                key: "vaginismus",
                index: "3",
              }}
            />
            <TextWithBullet
              data={{
                text: "Other Sexual Problem",
                key: "femaleOtherIssues",
                index: "4",
              }}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: "5%",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    paddingVertical: "5%",
    paddingHorizontal: "6%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
  },
  startConvoText: {
    fontSize: RFValue(16),
    fontWeight: "700",
    color: Colors.DARK_TEXT_COLOR,

    width: "50%",
    lineHeight: 25,
  },
  unseenView: {
    height: 10,
    width: 10,
    borderRadius: 30,
    backgroundColor: "red",
  },
});

export default StartConversationCard;
