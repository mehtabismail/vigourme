import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../common/colors";
import Tick from "../assets/icons/tick_white.svg";

const GenderDropdown = (props: any) => {
  const { selectedGenderValue, visibility, gender, prescription } = props;
  const [selectedGender, setSelectedGender] = useState(gender);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: prescription
            ? Colors.WHITE
            : Colors.GENDER_DROPDOWN_BG,
          borderColor: prescription ? Colors.MESSAGE_TIME : Colors.INPUT_BORDER,
          marginTop: prescription ? 0 : -5,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          setSelectedGender("Male");
          selectedGenderValue("Male");
          visibility(false);
        }}
        style={styles.item}
      >
        <Text
          style={[
            styles.text,
            {
              fontWeight: selectedGender == "Male" ? "bold" : "400",
              color: prescription ? Colors.BLACK : Colors.WHITE,
            },
          ]}
        >
          Male
        </Text>
        {selectedGender == "male" && (
          <View style={{ marginTop: 10 }}>
            <Tick />
          </View>
        )}
      </TouchableOpacity>
      <View
        style={[
          styles.separator,
          {
            backgroundColor: prescription ? Colors.BLACK : Colors.WHITE,
          },
        ]}
      />
      <TouchableOpacity
        onPress={() => {
          setSelectedGender("Female");
          selectedGenderValue("Female");
          visibility(false);
        }}
        style={styles.item}
      >
        <Text
          style={[
            styles.text,
            {
              fontWeight: selectedGender == "Female" ? "bold" : "400",
              paddingTop: 10,
              color: prescription ? Colors.BLACK : Colors.WHITE,
            },
          ]}
        >
          Female
        </Text>
        {selectedGender == "female" && (
          <View style={{ marginTop: 13 }}>
            <Tick />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 10,
    borderWidth: 0.5,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    // fontWeight: '600',
  },
  separator: {
    width: "100%",
    height: 0.7,
    alignSelf: "center",
    marginTop: 13,
  },
});

export default GenderDropdown;
