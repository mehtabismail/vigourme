import { BlurView } from "@react-native-community/blur";
import React from "react";
import { StyleSheet, Platform } from "react-native";

const BlurViewCommon = () => {
  return (
    <BlurView
      // blurAmount={10}
      blurType="light"
      style={styles.absolute}
      blurRadius={20}
    />
  );
};

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
    top: 0,
    borderRadius: 10,
    overflow: "hidden",
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor:
      Platform.OS == "ios" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)",
    // opacity: 0.5,
  },
});

export default BlurViewCommon;
