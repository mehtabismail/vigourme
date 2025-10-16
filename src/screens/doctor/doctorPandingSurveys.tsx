import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, StyleSheet, View, Text } from "react-native";
import Colors from "../../common/colors";
import PandingSurveysListItem from "../../components/pandingSurveysListItem";
import Header from "../../components/header";
import StatusBarComponent from "../../components/statusbar";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import navigationStrings from "../../common/navigationStrings";
import LoadingIndicator from "../../components/loadingIndicator";

const DoctorPandingSurveys = (props: any) => {
  const [chatList, setChatList] = useState([]);
  const [empityTextMessage, setEmpityTextMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getChatList = () => {
    setIsLoading(true);
    const unsub = firestore()
      .collection("chats")
      .where("isPending", "==", true)
      .orderBy("updatedAt", "desc")
      .onSnapshot(
        (documentSnapshot) => {
          const documents: any = documentSnapshot?.docs
            // .filter((item) => item?.data()?.isPending == true)
            .map((item) => ({
              id: item.id,
              ...item.data(),
            }));
          setChatList(documents);
          setIsLoading(false);
        },
        (error) => {
          console.log(error);
          setIsLoading(false);
        }
      );

    if (chatList.length == 0) {
      setEmpityTextMessage("No pending questionnaires are available.");
    }
    return unsub;
  };

  useEffect(() => {
    const unsubscribe = getChatList();
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent colorWhite />
      <Header
        navigation={props}
        showLogo={true}
        shadow
        showPowerIcon={false}
        backPress={() => props.navigation.pop()}
        filledLogo
      />
      {isLoading ? (
        <View style={styles.noChatMsgView}>
          <LoadingIndicator size={"large"} colors={Colors.GRAY_GARK} />
        </View>
      ) : chatList.length == 0 ? (
        <View style={styles.noChatMsgView}>
          <Text
            style={{
              color: Colors.GRAY_GARK,
              padding: 30,
              fontSize: 16,
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {empityTextMessage}
          </Text>
        </View>
      ) : (
        <View style={styles.flatListView}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={chatList.map((item: any, index) => {
              return { ...item, index };
            })}
            renderItem={({ item }) => {
              // console.log(
              //   !item?.recentMessage?.patientSerialNumber && item?.patientId
              // );
              return (
                <PandingSurveysListItem
                  chatItem={item}
                  navigationPath={
                    navigationStrings.DOCTOR_PENDING_SURVEY_DETAIL
                  }
                  {...props}
                />
              );
            }}
          />
        </View>
      )}
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
  noChatMsgView: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default DoctorPandingSurveys;
