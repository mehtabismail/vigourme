import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import GmailSVG from "../assets/icons/gmail.svg";
import { RFValue } from "react-native-responsive-fontsize";
import { config } from "../common";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { apiRequest } from "../api/apiRequest";
import EndPoint from "../common/apiEndpoints";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFcmToken } from "../utils/NotificationService";
import { sendFcmToFirestore } from "../utils/fcmApi";
import { setToken } from "../redux/slices/tokenSlice";
import { setRole } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import navigationStrings from "../common/navigationStrings";
import { CommonActions } from "@react-navigation/native";

type Props = {
  text: string;
  setError?: any;
};

const GoogleButton: FC<Props> = (props: Props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const googleButtonHandler = async ({
    text,
    setGoogleDetails,
    setBlurView,
  }) => {
    try {
      GoogleSignin.configure({
        webClientId: config.WEB_CLIENT_ID,

        offlineAccess: true,
        forceCodeForRefreshToken: true,
      } as any);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await GoogleSignin.revokeAccess();
      if (userInfo) {
        if (text == "Sign in") {
          try {
            const userCredentails = {
              email: userInfo?.user?.email,
              facebookLogin: false,
              googleLogin: true,
            };
            const { data }: any = await apiRequest(
              EndPoint.SOCIAL_LOGIN,
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

              await AsyncStorage.setItem("userEmail", "");
              await AsyncStorage.setItem("userPassword", "");

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
        } else {
          setGoogleDetails(userInfo);
        }
      }
      await GoogleSignin.revokeAccess();
    } catch (error) {
      console.log("error in catch ======>", error);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => googleButtonHandler(props)}
      style={[
        {
          borderWidth: 1,
          borderColor: "grey",
          borderRadius: 10,
          height: 60,
          alignItems: "center",
          flexDirection: "row",
          backgroundColor: "white",
          justifyContent: "center",
        },
      ]}
    >
      <View style={{ marginRight: 20 }}>
        <GmailSVG width={32} height={32} />
      </View>
      <View>
        <Text
          style={[
            {
              fontSize: RFValue(16),
              color: "black",
              fontWeight: "bold",
              textAlign: "center",
            },
          ]}
        >
          {props?.text + " with Google"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default GoogleButton;
