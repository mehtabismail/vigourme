import React, { type PropsWithChildren, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Colors from "../common/colors";
import DownArrow from "../assets/icons/down_arrow.svg";
import Calendar from "../assets/icons/calendar.svg";
import ShowPassword from "../assets/icons/show_password.svg";
import { getReadableDate } from "../utils/DatePraser";
import CalendarWhite from "../assets/icons/calendar_white.svg";
import DownArrowWhite from "../assets/icons/down_arrow_white.svg";
import ShowPasswordWhite from "../assets/icons/show_password_white.svg";
import EyeOpen from "../assets/icons/eye_open.svg";

const Input = (props: any) => {
  const {
    title,
    secureTextEntry,
    placeholder,
    dropdownVisibilityHandler,
    showCalendar,
    onChangeText,
    name,
    handleFocusInput,
    handleUnfocusInput,
    value,
    error,
    handleChangeInput,
    rememberMe,
  } = props;
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const [focused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  useEffect(() => {
    rememberMe ? setIsFocused(true) : setIsFocused(false);
  }, [rememberMe]);

  const inputFocused = () => {
    setIsFocused(true);
  };

  const inputBlured = () => {
    if (value) {
      setIsFocused(true);
    } else {
      setIsFocused(false);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={title == "Gender" || title == "DOB" ? false : true}
        style={styles.inputCon}
        onPress={() => {
          if (title == "Gender") {
            setDropdownVisibility(!dropdownVisibility);
            dropdownVisibilityHandler(!dropdownVisibility);
          } else if (title == "DOB") {
            showCalendar(true);
          }
        }}
      >
        <Text
          style={{
            ...styles.text,
            top:
              focused || (name == "gender" && value) || (name == "dob" && value)
                ? 0
                : 16,
          }}
        >
          {title}
        </Text>
        <TextInput
          // placeholder={placeholder}
          editable={title == "Gender" || title == "DOB" ? false : true}
          // onFocus={handleFocusInput}
          // onBlur={handleUnfocusInput}
          style={[
            styles.input,
            {
              height: title == "Description" ? 150 : 50,
              textAlignVertical: title == "Description" ? "top" : "auto",
              color: Colors.WHITE,
            },
          ]}
          onFocus={inputFocused}
          onBlur={inputBlured}
          multiline={title == "Description" ? true : false}
          value={name !== "dob" ? value : getReadableDate(value)}
          onChangeText={(e) => onChangeText(e, name)}
          keyboardType={title == "Mobile Number" ? "number-pad" : "default"}
          // value={value}
          // onChangeText={(text) => handleChangeInput(text, name)}
          secureTextEntry={secureTextEntry && showPassword}
        />
        {title == "Gender" && (
          <View style={{ marginRight: -10 }}>
            <DownArrowWhite />
          </View>
        )}
        {title == "DOB" && <CalendarWhite />}
        {title == "Password" ? (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <ShowPasswordWhite />
            ) : (
              <EyeOpen height={20} width={20} />
            )}
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
      {/* {error && <Text style={styles.errorText}>This is the error</Text>} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "center",
    marginHorizontal: 7,
    marginTop: 3,
  },
  inputCon: {
    width: "100%",
    borderRadius: 6,
    backgroundColor: "rgba(215,215,215,0.3)",
    display: "flex",
    borderWidth: 1,
    marginVertical: 12,
    borderColor: Colors.INPUT_BORDER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 12,
    paddingRight: 35,
  },
  input: {
    paddingVertical: 0,
    marginVertical: 0,
    width: "100%",
  },
  text: {
    color: Colors.WHITE,
    fontWeight: "400",
    position: "absolute",
    left: 15,
    fontSize: 12,
  },
  errorText: {
    color: Colors.ERROR_COLOR,
    marginTop: -5,
  },
});

export default Input;
