import React from "react";
import { ActivityIndicator } from "react-native";
import Colors from "../common/colors";
const LoadingIndicator = (props: any) => {
  const IndicatorSize = "small";
  return (
    <ActivityIndicator
      color={props.colors ? props.colors : Colors.WHITE}
      size={props.size ? props.size : IndicatorSize}
    />
  );
};

export default LoadingIndicator;
