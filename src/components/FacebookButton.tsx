import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import FacebookSVG from "../assets/icons/facebook.svg";
import {
  AccessToken,
  AuthenticationToken,
  LoginButton,
  LoginManager,
  Profile,
} from "react-native-fbsdk-next";

type Props = {
  text: string;
  setError?: any;
};

const FacebookButton: FC<Props> = (props: Props) => {
  function handleFacebookLogin() {
    LoginManager.logInWithPermissions(["public_profile"]).then(
      function (result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log(
            "Login success with permissions: " +
              result.grantedPermissions.toString()
          );
        }
      },
      function (error) {
        console.log("Login fail with error: " + error);
      }
    );
  }
  // return (
  //   <View>
  //     <LoginButton
  //       onLoginFinished={(error, result) => {
  //         if (error) {
  //           console.log("login has error: " + result.error);
  //         } else if (result.isCancelled) {
  //           console.log("login is cancelled.");
  //         } else {
  //           AccessToken.getCurrentAccessToken().then((data) => {
  //             console.log(data.accessToken.toString());
  //           });
  //         }
  //       }}
  //       onLogoutFinished={() => console.log("logout.")}
  //     />
  //   </View>
  // );
  return (
    <TouchableOpacity
      onPress={() => handleFacebookLogin()}
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
        <FacebookSVG width={36} height={36} />
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
          {props?.text + " with Facebook"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FacebookButton;
