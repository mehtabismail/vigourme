import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import Colors from "../../common/colors";
import Header from "../../components/header";
import HeadingWithTitle from "../../components/headingWithTitle";
import Input from "../../components/Inputs";
import StatusBarComponent from "../../components/statusbar";
import Button from "../../components/button";
import navigationStrings from "../../common/navigationStrings";
import CheckBox from "@react-native-community/checkbox";
import Config from "react-native-config";
import useDetectKeyBoard from "../../hooks/useDetectKeyboard";
import BlurViewCommon from "../../components/BlurViewCommon";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RFValue } from "react-native-responsive-fontsize";

// Redux state
import { setRole } from "../../redux/slices/authSlice";
import { setToken } from "../../redux/slices/tokenSlice";
import { useDispatch } from "react-redux";

// Types declared
import { UserCred } from "../../types/types.interfaces";

// Api function import
import { apiRequest } from "../../api/apiRequest";
import EndPoint from "../../common/apiEndpoints";
import Gradient from "../../components/Gradient";
import { CommonActions } from "@react-navigation/native";
import { getFcmToken } from "../../utils/NotificationService";
import { sendFcmToFirestore } from "../../utils/fcmApi";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import GoogleButton from "../../components/GoogleButton";
import { LoginButton, AccessToken } from "react-native-fbsdk-next";
import FacebookButton from "../../components/FacebookButton";

const Signin = (props: any) => {
  const { isKeyboardVisible } = useDetectKeyBoard();
  const dispatch = useDispatch();
  const { navigation } = props;
  const [userCredentails, setUserCredentials] = useState<UserCred>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<UserCred>({
    email: "Email",
    password: "Password",
  });
  const [toggleCheckbox, setToggleCheckbox] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [blurView, setBlurView] = useState(true);

  const navigate = (path: String) => {
    navigation.navigate(path);
  };
  const handleChangeInput = (value: String, name: String) => {
    setUserCredentials((prev) => ({
      ...prev,
      [`${name}`]: value,
    }));
  };

  useEffect(() => {
    (async () => {
      const email = await AsyncStorage.getItem("userEmail");
      const password = await AsyncStorage.getItem("userPassword");
      if (
        !(email === "" || email === null) &&
        !(password === "" || password === null)
      ) {
        setUserCredentials((prev) => ({
          ...prev,
          ["email"]: email,
          ["password"]: password,
        }));
        setToggleCheckbox(true);
        setRememberMe(true);
      }
    })();
  }, []);

  const signin = async () => {
    // let res = {};
    // res = validateEmptyFields(userCredentails, error);
    // Here "any" needs to removed and proper type should be there . . .
    try {
      const { data }: any = await apiRequest(
        EndPoint.SIGN_IN,
        "post",
        userCredentails
      );

      if (data?.success) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("userId", data.user.id);
        await AsyncStorage.setItem("doctorId", data.doctorId);
        await AsyncStorage.setItem("name", data.user.name);
        (await AsyncStorage.getItem("showOneTimeToast")) === null &&
          (await AsyncStorage.setItem("showOneTimeToast", "true"));
        data?.user?.serialNumber &&
          (await AsyncStorage.setItem(
            "serialNumber",
            data?.user?.serialNumber
          ));
        if (toggleCheckbox) {
          await AsyncStorage.setItem("userEmail", userCredentails.email);
          await AsyncStorage.setItem("userPassword", userCredentails.password);
        } else {
          await AsyncStorage.setItem("userEmail", "");
          await AsyncStorage.setItem("userPassword", "");
        }

        // add fcm token in users collection
        const fcmToken = await getFcmToken();
        fcmToken
          ? sendFcmToFirestore(
              fcmToken,
              data?.user?.isConsultant ? data.doctorId : data.user.id
            )
          : console.log("FCM Token Error: ", fcmToken);

        setBlurView(false);
        dispatch(setToken(data.token));
        if (data?.user?.isConsultant) {
          dispatch(setRole("consultant"));
          await AsyncStorage.setItem("role", "consultant");
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: navigationStrings.DOCTORS_NAVIGATOR }],
            })
          );
        } else {
          dispatch(setRole("patient"));
          await AsyncStorage.setItem("role", "patient");
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: navigationStrings.PATIENT_NAVIGATOR }],
            })
          );
        }
      } else {
        data.message && Toast.show(data.message.toString());
        console.log("\n\n: , ", data);
      }
    } catch (error: any) {
      Toast.show(error.toString());
    }
  };

  const UnderHeadingText = (props: any) => {
    return (
      <Text style={styles.headingText}>
        Enter your
        <Text style={{ fontWeight: "bold" }}> email and password </Text>to sign
        in to your account.
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
      <Header hideBackArrow showLogo />
      <ImageBackground
        resizeMode='cover'
        style={styles.containerImage}
        source={require("../../assets/images/physician--with-stethoscope.png")}
      >
        {/* <Gradient /> */}
        <KeyboardAvoidingView
          style={{
            flex: 1,
          }}
        >
          {/* <Gradient> */}
          <ScrollView
            style={{
              paddingHorizontal: 20,
              flex: 1,
              // backgroundColor: "rgba(59, 148, 238, 0.3)",
              // opacity: 0.5,
            }}
          >
            <View style={styles.signinCOntainer}>
              {blurView ? <BlurViewCommon /> : <></>}

              <View style={{ zIndex: 2 }}>
                <HeadingWithTitle
                  marginTop={10}
                  marginBottom={18}
                  heading={"Sign in"}
                  UnderHeadingText={<UnderHeadingText />}
                  // content={`asdasd ${(<Text>asdasd </Text>)}asdasd`}
                />
                <Input
                  title={"Email"}
                  name='email'
                  value={userCredentails.email}
                  placeholder={"e.g email@email.com"}
                  onChangeText={handleChangeInput}
                  rememberMe={rememberMe}
                />
                <Input
                  title={"Password"}
                  name='password'
                  value={userCredentails.password}
                  placeholder={"......."}
                  secureTextEntry={true}
                  onChangeText={handleChangeInput}
                  rememberMe={rememberMe}
                />
                <Button onPress={() => signin()} />
                <View style={styles.forgotPasswordRemPasswordMainContainer}>
                  <TouchableOpacity
                    onPress={() => navigate(navigationStrings.FORGOT_PASSWORD)}
                  >
                    <Text style={styles.text}>Forgot Password?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.innerForgotPassContainer}
                    onPress={() => setToggleCheckbox(!toggleCheckbox)}
                  >
                    <CheckBox
                      disabled={false}
                      value={toggleCheckbox}
                      boxType={"square"}
                      style={{ height: 20 }}
                      lineWidth={2}
                      tintColors={{
                        true: Colors.THEMECOLOR,
                        false: Colors.WHITE,
                      }}
                      onValueChange={(newValue) => setToggleCheckbox(newValue)}
                    />
                    <Text style={styles.text}>Remember</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ marginVertical: 15, alignItems: "center" }}>
                  <Text style={styles.text}>Or sign in via</Text>
                </View>
                <View>
                  <GoogleButton text='Sign in' setBlurView={setBlurView} />
                </View>
                {/* <View style={{ marginVertical: 15 }}>
                  <FacebookButton text="Sign in" />
                </View> */}
              </View>
            </View>
          </ScrollView>
          {/* {!isKeyboardVisible ? (
            <View style={styles.bottomView}>
              <Text style={styles.bottomText}>Don't have an account?</Text>
              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={() => navigate(navigationStrings.SIGN_UP)}
              >
                <Text style={styles.signUptext}>Sign up</Text>
              </TouchableOpacity>
            </View>
          ) : null} */}
          {/* </Gradient> */}
        </KeyboardAvoidingView>
        {/* </Gradient> */}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  containerImage: {
    flex: 1,
    justifyContent: "center",
    height: Dimensions.get("window").height,
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
    color: Colors.WHITE,
  },
  bottomView: {
    // marginTop: '30%',
    position: "absolute",
    bottom: Platform.OS == "ios" ? 10 : 20,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  bottomText: {
    textAlign: "center",
    color: Colors.WHITE,
    fontSize: 17,
  },
  signUptext: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 3,
  },
  signinCOntainer: {
    zIndex: 1,
    paddingHorizontal: 20,
    borderRadius: 10,
    overflow: "hidden",
    paddingVertical: "5%",
    marginTop: "20%",
  },
  headingText: {
    color: Colors.WHITE,
    fontSize: RFValue(14),
    fontWeight: "400",
    marginTop: 15,
    lineHeight: 22,
  },
});

export default Signin;
