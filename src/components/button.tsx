import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../common/colors";
import useGetReduxState from "../customhooks/useGetReduxState";

import { RFValue } from "react-native-responsive-fontsize";
import LoadingIndicator from "./loadingIndicator";

const Button = (props: any) => {
  const Loading: any = useGetReduxState();
  const { title, onPress, marginTop, marginBottom, loading } = props;

  return (
    <TouchableOpacity
      disabled={
        loading !== undefined ? loading : Loading.loadingSlice.isLoading
      }
      onPress={onPress}
      style={[
        styles.btnContainer,
        {
          marginTop: marginTop ? marginTop : 20,
          marginBottom: marginBottom ? marginBottom : 20,
        },
      ]}
    >
      {(loading !== undefined ? loading : Loading.loadingSlice.isLoading) ? (
        <LoadingIndicator />
      ) : (
        <Text style={styles.btnTxt}>{title ? title : "Sign in"}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    width: "100%",
    paddingVertical: "4%",
    marginHorizontal: "2%",
    borderRadius: 8,
    // marginTop: 20,
    // elevation: 4,
    backgroundColor: Colors.BUTTON_BG2,
    // marginBottom: 20,
    alignSelf: "center",
    overflow: "hidden",
  },
  btnTxt: {
    fontSize: RFValue(16),
    color: Colors.WHITE,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Button;
