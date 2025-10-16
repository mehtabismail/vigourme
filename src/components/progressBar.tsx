import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Colors from "../common/colors";

const progressBar = (props: any) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          ...styles.filled,
          width: props.progress && props.progress,
        }}
      />
    </View>
  );
};

export default progressBar;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: heightPercentageToDP(0.8),
    backgroundColor: "#EBEBEB",
    borderRadius: 30,
    overflow: "hidden",
    marginVertical: heightPercentageToDP(2.5),
  },
  filled: {
    backgroundColor: Colors.BUTTON_BG2,
    height: "100%",
  },
});
