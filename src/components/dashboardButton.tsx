import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../common/colors";
import RightArrow from "../assets/icons/right-arrow-black.svg";

const move = (navigate: any, navigationStrings: any) => {
  navigate(navigationStrings);
};

const DashboardButton = (props: any) => {
  const { text, navigation, path, count } = props;
  return (
    <TouchableOpacity
      onPress={() => {
        move(navigation, path);
      }}
      style={styles.container}
    >
      {props.children}
      <View
        style={{ flex: 1, paddingHorizontal: 10, justifyContent: "center" }}
      >
        <Text style={styles.textHeading}>{text}</Text>
        {count > 0 && <Text style={styles.textCount}>{`(${count})`}</Text>}
      </View>
      <RightArrow />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderWidth: 2,
    borderColor: Colors.QUESTION_CONTAINER_BORDER,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  textHeading: {
    color: Colors.BLACK,
    fontSize: 18,
    fontWeight: "400",
    fontFamily: "Urbanist-Black",
  },
  textCount: {
    position: "absolute",
    right: 0,
    paddingRight: 5,
    color: "red",
    fontSize: 10,
    fontWeight: "600",
  },
});

export default DashboardButton;
