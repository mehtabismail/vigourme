import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  BackHandler,
  Platform,
} from "react-native";
import Colors from "../../common/colors";
import Header from "../../components/header";
import HeadingWithTitle from "../../components/headingWithTitle";
import StatusBarComponent from "../../components/statusbar";
import Button from "../../components/button";
import navigationStrings from "../../common/navigationStrings";
import ChangePasswordImage from "../../assets/icons/changePassword.svg";
import { RFValue } from "react-native-responsive-fontsize";
import { apiRequest } from "../../api/apiRequest";
import EndPoint from "../../common/apiEndpoints";
import Toast from "react-native-simple-toast";
import { SafeAreaView } from 'react-native-safe-area-context';

const ChangePassword = (props: any) => {
  const { navigation } = props;
  const goBack = () => {
    navigation.goBack();
  };

  const [inputValues, setInputValues] = useState({
    password: "",
    newPassword: "",
  });

  const UnderHeadingText = (props: any) => {
    return <Text style={styles.headingText}>Choose a new password.</Text>;
  };

  const handleChangeInput = (value: String, name: String) => {
    setInputValues((prev) => ({
      ...prev,
      [`${name}`]: value,
    }));
  };

  const updatePassword = async () => {
    try {
      const { data }: any = await apiRequest(
        EndPoint.UPDATE_PASSWORD,
        "put",
        inputValues
      );
      Toast.show(data.message);
      setInputValues({
        password: "",
        newPassword: "",
      });
    } catch (error: any) {
      console.log(error, "error");
      Toast.show(error.toString());
    }
  };

  useEffect(() => {
    // this useEffect handles android's hardware backpress
    const backAction: any = () => {
      goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent colorWhite />
      <Header title="Change password" backPress={goBack} filledLogo />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 20 }}
      >
        <View style={{ marginTop: "20%", alignSelf: "center" }}>
          <ChangePasswordImage />
        </View>
        <HeadingWithTitle
          marginTop={50}
          marginBottom={40}
          title={"Change Password"}
          UnderHeadingText={<UnderHeadingText />}
          appScreen
        />
        <Text style={styles.titleText}>Old Password</Text>
        <TouchableOpacity>
          <TextInput
            placeholder="********"
            placeholderTextColor={Colors.MESSAGE_TIME}
            secureTextEntry={true}
            style={styles.inputDesign}
            onChangeText={(text) => handleChangeInput(text, "password")}
            value={inputValues.password}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.titleText,
            {
              marginTop: 13,
            },
          ]}
        >
          New Password
        </Text>
        <TouchableOpacity>
          <TextInput
            placeholder="********"
            placeholderTextColor={Colors.MESSAGE_TIME}
            secureTextEntry={true}
            style={styles.inputDesign}
            onChangeText={(text) => handleChangeInput(text, "newPassword")}
            value={inputValues.newPassword}
          />
        </TouchableOpacity>

        <Button title={"Submit"} onPress={updatePassword} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  forgotPasswordRemPasswordMainContainer: {
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 7,
  },
  innerForgotPassContainer: {
    flexDirection: "row",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.DARK_TEXT_COLOR,
  },
  bottomView: {
    position: "absolute",
    bottom: 35,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  bottomText: {
    textAlign: "center",
    color: Colors.LIGHT_TEXT_COLOR,
    fontSize: 17,
  },
  signUptext: {
    color: Colors.PRIMARY,
    fontSize: 14,
    fontWeight: "500",
  },
  headingText: {
    color: Colors.GREYTEXT,
    fontSize: RFValue(14),
    fontWeight: "400",
    marginTop: 15,
    lineHeight: 22,
  },
  inputDesign: {
    borderWidth: 1,
    borderRadius: 6,
    marginVertical: 10,
    borderColor: Colors.INPUT_BORDER,
    color: Colors.BLACK,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS == "ios" ? 15 : 10,
  },
  titleText: {
    color: Colors.DARK,
    fontWeight: "600",
    fontSize: RFValue(14),
    marginBottom: 3,
  },
});

export default ChangePassword;
