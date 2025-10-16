import LinearGradient from "react-native-linear-gradient";
import React from "react";

const Gradient = (props: any) => {
  return (
    <LinearGradient
      colors={["rgba(0, 220, 166, 0.3) -0.33", "rgba(59, 148, 238, 0.3) 100%"]}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // opacity: 0.2,
        flex: 1,
      }}
    >
      {props.children}
    </LinearGradient>
  );
};

export default Gradient;
