import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import Colors from "../common/colors";
import Tick from "../assets/icons/tick_white.svg";

const singleOption = (props: any) => {
  const { index, title, selected, onPress, multiOption } = props;
  return (
    <TouchableOpacity
      key={index}
      style={[
        styles.container,
        selected[index] == title && styles.containerSelected,
      ]}
      onPress={onPress}
    >
      <Text
        style={
          selected[index] == title ? styles.textSelected : styles.textUnselected
        }
      >
        {title}
      </Text>
      {multiOption ? (
        <View
          style={[
            styles.checkBox,
            multiOption &&
              selected[index] == title && { borderColor: Colors.WHITE },
          ]}
        >
          {selected[index] == title && <Tick />}
        </View>
      ) : (
        selected[index] && (
          <View style={styles.radioOuter}>
            <View style={styles.radioInner}></View>
          </View>
        )
      )}
    </TouchableOpacity>
  );
};

export default singleOption;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "space-between",
    marginBottom: heightPercentageToDP(1.5),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "6%",
    paddingVertical: 8,
    backgroundColor: "transparent",
    overflow: "hidden",
    borderColor: "#EDEDED",
  },
  containerSelected: {
    paddingVertical: 15,
    backgroundColor: Colors.BUTTON_BG2,
    overflow: "hidden",
    borderColor: "#00DCA6",
  },
  textSelected: {
    flex: 1,
    fontSize: RFValue(16),
    fontWeight: "700",
    color: "#FFFFFF",
  },
  textUnselected: {
    flex: 1,
    fontSize: RFValue(16),
    fontWeight: "600",
    color: "#8C8C8C",
  },
  radioOuter: {
    height: 17,
    width: 17,
    borderWidth: 1,
    borderColor: Colors.WHITE,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    height: 12,
    width: 12,
    backgroundColor: Colors.WHITE,
    borderRadius: 100,
  },
  checkBox: {
    height: 20,
    width: 20,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: "#8C8C8C",
    alignItems: "center",
    justifyContent: "center",
  },
});
