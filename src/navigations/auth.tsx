import React, { useEffect, useLayoutEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import navigationStrings from "../common/navigationStrings";

// Screens to register in auth
import Splash from "../screens/auth/splash";
import Signin from "../screens/auth/signin";
import Signup from "../screens/auth/signup";

import ChangePassword from "../screens/auth/changepassword";
import PatientNavigator from "./app";
import DoctorsNavigator from "./doctorsFlow";
import ForgotPassword from "../screens/auth/forgotpassword";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={navigationStrings.SPLASH}>
      <Stack.Screen
        name={navigationStrings.SIGN_IN}
        component={Signin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.SPLASH}
        component={Splash}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.SIGN_UP}
        component={Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.FORGOT_PASSWORD}
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.CHANGE_PASSWORD}
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PATIENT_NAVIGATOR}
        component={PatientNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.DOCTORS_NAVIGATOR}
        component={DoctorsNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
