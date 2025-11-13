import { BlurView } from "@react-native-community/blur";
import React from "react";
import { StyleSheet, Platform } from "react-native";

const BlurViewCommon = (chield:any) => {
  return (
    <BlurView
      // blurAmount={10}
      blurType="light"
      style={styles.container}
      blurRadius={20}
    >
      {chield}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:
      Platform.OS == "ios" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)",
  },
});

export default BlurViewCommon;
