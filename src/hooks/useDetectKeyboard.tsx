import { StyleSheet, Text, Keyboard } from "react-native";
import React, { useEffect, useState } from "react";

const useDetectKeyBoard = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState<any>();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardVisible(true); // or some other action
        setKeyboardHeight(event.endCoordinates.height - 20);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return { isKeyboardVisible, keyboardHeight };
};

export default useDetectKeyBoard;

const styles = StyleSheet.create({});
