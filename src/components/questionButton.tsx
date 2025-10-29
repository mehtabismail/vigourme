import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import LoadingIndicator from "./loadingIndicator";
import Colors from "../common/colors";

const questionButton = (props: any) => {
  const { title, active, onPress, loading, disabled } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={active ? styles.containerActive : styles.container}
    >
      {loading ? (
        <LoadingIndicator />
      ) : (
        <Text style={active ? styles.textActive : styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default questionButton;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#9093A3",
    paddingHorizontal: "8%",
    borderRadius: 8,
    paddingVertical: "2%",
    justifyContent: "center",
    width: widthPercentageToDP(28),
    alignItems: "center",
    height: heightPercentageToDP(5.5),
  },
  containerActive: {
    paddingHorizontal: "8%",
    backgroundColor: Colors.BUTTON_BG2,
    borderRadius: 8,
    paddingVertical: "2%",
    width: widthPercentageToDP(28),
    alignItems: "center",
    justifyContent: "center",
    height: heightPercentageToDP(5.5),
  },

  textActive: {
    fontSize: RFValue(14),
    color: "white",
    textTransform: "capitalize",
  },
  text: {
    fontSize: RFValue(14),
    color: "#9093A3",
    textTransform: "capitalize",
  },
});
