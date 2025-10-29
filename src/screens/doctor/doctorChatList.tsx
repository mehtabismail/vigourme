import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import Colors from "../../common/colors";
import ChatListItem from "../../components/chatListItem";
import Header from "../../components/header";
import StatusBarComponent from "../../components/statusbar";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import navigationStrings from "../../common/navigationStrings";
import LoadingIndicator from "../../components/loadingIndicator";
import moment from "moment";
import { SafeAreaView } from 'react-native-safe-area-context';

const DoctorChatList = (props: any) => {
  const [chatList, setChatList] = useState([]);
  const [empityTextMessage, setEmpityTextMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getChatList = () => {
    setIsLoading(true);
    const unsub = firestore()
      .collection("chats")
      .where("isPending", "==", false)
      .orderBy("updatedAt", "desc")
      .onSnapshot(
        (documentSnapshot) => {
          const documents: any = documentSnapshot?.docs
            // .filter((item) => item?.data()?.isPending == false)
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
      setEmpityTextMessage(
        "Once your conversation starts with patient, you’ll see it listed here."
      );
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
        shadow
        showPowerIcon
        backPress={() => props.navigation.goBack()}
        title={"Chat"}
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
            data={chatList}
            key={"_"}
            renderItem={({ item }) => {
              item?.recentMessage?.patientSerialNumber === null &&
                console.log(
                  moment(item?.createdAt.toDate()).format(
                    "MMMM DD, YYYY at HH:MM:SSA UTC+5"
                  ),
                  "found"
                );
              return (
                <ChatListItem
                  navigationPath={navigationStrings.DOCTOR_CHAT}
                  chatItem={item}
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

export default DoctorChatList;
