import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Colors from "../common/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import firestore from "@react-native-firebase/firestore";

const Message = (props: any) => {
  const {
    messageValue,
    sentBy,
    time,
    isAttachment,
    messageId,
    seen,
    patientSerialNumber,
  } = props;
  const [userId, setUserId] = useState<any>();
  const [messageTime, setMessageTime] = useState();
  const getCurrentUserId = async () => {
    const userIdVal = await AsyncStorage.getItem("userId");
    setUserId(userIdVal);
  };
  useEffect(() => {
    getCurrentUserId();
    if (time?.seconds) {
      convertDateToReadeable();
    }
  }, [time?.seconds]);
  const convertDateToReadeable = () => {
    // firebase timestamp
    const date = new Date(time?.seconds * 1000);
    const result: any = moment(date).format("MMM Do YY hh:mm a");
    setMessageTime(result);
  };

  return (
    <View
      style={[
        styles.container,
        {
          alignItems: userId && userId == sentBy ? "flex-end" : "flex-start",
        },
      ]}
    >
      <View
        style={[
          styles.messageContainer,
          {
            backgroundColor:
              userId && userId == sentBy
                ? Colors.BUTTON_BG
                : Colors.INCOMING_MESSAGE_BG,
            borderBottomRightRadius: userId && userId == sentBy ? 0 : 25,
            borderBottomLeftRadius: userId && userId == sentBy ? 25 : 0,
          },
        ]}
      >
        {isAttachment ? (
          <View style={styles.attachementContainer}>
            <Image
              style={styles.pdf}
              source={require("../assets/icons/pdf.png")}
            />
            <Text
              style={[
                styles.messageText,
                {
                  color:
                    userId && userId == sentBy
                      ? Colors.WHITE
                      : Colors.MESSAGE_TIME,
                  paddingHorizontal: 5,
                },
              ]}
            >
              {messageValue}
            </Text>
          </View>
        ) : (
          <Text
            style={[
              styles.messageText,
              {
                color:
                  userId && userId == sentBy
                    ? Colors.WHITE
                    : Colors.MESSAGE_TIME,
              },
            ]}
          >
            {messageValue}
          </Text>
        )}
      </View>
      <Text style={styles.timeText}>{messageTime ? messageTime : "..."}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    backgroundColor: Colors.BUTTON_BG,
    paddingVertical: 15,
    width: "50%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 20,
  },
  messageText: {
    paddingHorizontal: 20,
  },
  container: {
    alignItems: "flex-end",
    marginTop: 15,
  },
  timeText: {
    marginTop: 5,
    color: Colors.MESSAGE_TIME,
  },
  pdf: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    marginLeft: 20,
  },
  attachementContainer: {
    flexDirection: "row",
    paddingRight: 40,
  },
});

export default Message;
