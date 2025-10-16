import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Colors from "../common/colors";
import ProfileImg from "./profileImg";
import moment from "moment";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatListItem = (props: any) => {
  const { navigation, chatItem, navigationPath, pendingList } = props;
  const [messageTime, setMessageTime] = useState<any>();
  const [userId, setUserId] = useState<any>();
  const navigate = (path: string, param: string, id: string) => {
    navigation.navigate(path, {
      patientSerialNumber: param,
      chatId: id,
      patientId: chatItem.patientId,
    });
  };

  const convertDateToReadeable = async () => {
    const currentUserId = await AsyncStorage.getItem("userId");
    setUserId(currentUserId);
    // firebase timestamp
    const date = new Date(chatItem?.updatedAt?.seconds * 1000);
    const time = moment(date).format("HH:mm");
    setMessageTime(time);
  };

  useEffect(() => {
    if (chatItem?.updatedAt?.seconds) {
      convertDateToReadeable();
    }
  }, [chatItem?.updatedAt?.seconds]);

  return (
    <>
      <TouchableOpacity
        onPress={() =>
          navigate(
            navigationPath,
            chatItem?.recentMessage?.patientSerialNumber,
            chatItem.id
          )
        }
      >
        <View style={styles.container}>
          <ProfileImg width={65} height={65} />
          <View style={styles.nameMessageContainer}>
            <Text
              style={[
                styles.nameText,
                {
                  fontWeight:
                    userId &&
                    userId !== chatItem?.recentMessage?.sentBy &&
                    !chatItem.seen
                      ? "bold"
                      : "500",
                  color:
                    userId &&
                    userId !== chatItem?.recentMessage?.sentBy &&
                    !chatItem.seen
                      ? Colors.BLACK
                      : Colors.MESSAGE_TIME,
                },
              ]}
            >
              {chatItem?.recentMessage?.patientSerialNumber}
            </Text>
            {chatItem?.recentMessage?.isAttachment ? (
              <View style={styles.attachmentContainer}>
                <Image
                  style={styles.fileIcon}
                  source={require("../assets/icons/file.png")}
                />
                <Text style={[styles.messageOutliner, { marginBottom: 4.5 }]}>
                  {" " + chatItem?.recentMessage?.text}
                </Text>
              </View>
            ) : (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.messageOutliner,
                  {
                    fontWeight:
                      userId &&
                      userId !== chatItem?.recentMessage?.sentBy &&
                      !chatItem.seen
                        ? "bold"
                        : "400",
                    color:
                      userId &&
                      userId !== chatItem?.recentMessage?.sentBy &&
                      !chatItem.seen
                        ? Colors.BLACK
                        : Colors.MESSAGE_OUTLINER,
                  },
                ]}
              >
                {chatItem?.recentMessage?.text}
              </Text>
            )}
          </View>
          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.time,
                {
                  fontWeight:
                    userId &&
                    userId !== chatItem?.recentMessage?.sentBy &&
                    !chatItem.seen
                      ? "bold"
                      : "400",
                  color:
                    userId &&
                    userId !== chatItem?.recentMessage?.sentBy &&
                    !chatItem.seen
                      ? Colors.BLACK
                      : Colors.MESSAGE_TIME,
                },
              ]}
            >
              {messageTime}
            </Text>
            {userId &&
              userId !== chatItem?.recentMessage?.sentBy &&
              !chatItem.seen && <View style={styles.unseenView} />}
          </View>
        </View>
        <View style={styles.bottomLine} />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  nameText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.MESSAGE_TIME,
    marginTop: 10,
  },
  messageOutliner: {
    fontSize: 16,
    fontWeight: "400",
    color: Colors.MESSAGE_OUTLINER,
    marginTop: 5,
  },
  nameMessageContainer: {
    width: "60%",
  },
  time: {
    color: Colors.MESSAGE_TIME,
    fontSize: 14,
    fontWeight: "400",
    marginTop: 10,
  },
  bottomLine: {
    height: 1,
    backgroundColor: Colors.BOTTOM_LINE_CHAT_LIST_ITEM,
    width: "100%",
    marginTop: 20,
  },
  fileIcon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  attachmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    justifyContent: "space-between",
    width: "70%",
  },
  unseenView: {
    height: 10,
    width: 10,
    borderRadius: 30,
    backgroundColor: "red",
    marginTop: 15,
  },
});

export default ChatListItem;
