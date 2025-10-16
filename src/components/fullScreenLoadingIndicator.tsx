import React from "react";
import { View, ActivityIndicator } from "react-native";
import Colors from "../common/colors";
const FullScreenLoadingIndicator = (props: any) => {
  const IndicatorSize = "large";
  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        zIndex: 10,
        backgroundColor: Colors.WHITE,
        justifyContent: "center",
      }}
    >
      <ActivityIndicator
        color={props.colors ? props.colors : Colors.GRAYTEXTDARK}
        size={props.size ? props.size : IndicatorSize}
      />
    </View>
  );
};

export default FullScreenLoadingIndicator;
