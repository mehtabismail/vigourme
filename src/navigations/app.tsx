import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import navigationStrings from "../common/navigationStrings";

// Screens to register in app
import SurveyIntro from "../screens/survey/Intro";
import Questions from "../screens/survey/Questions";
import Chat from "../screens/patient/chat";
import Home from "../screens/patient/home";

// Screens for doctor's flow
import DoctorChatList from "../screens/doctor/doctorChatList";
import Prescription from "../screens/doctor/prescription";

const Stack = createNativeStackNavigator();

const PatientNavigator = (props: any) => {
  return (
    <Stack.Navigator initialRouteName={navigationStrings.HOME}>
      <Stack.Screen
        name={navigationStrings.SURVEY_INTRO}
        component={SurveyIntro}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.QUESTIONS}
        component={Questions}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.CHAT}
        component={Chat}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.DOCTOR_CHAT_LIST}
        component={DoctorChatList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PRESCRIPTION}
        component={Prescription}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.HOME}
        component={Home}
        options={{ headerShown: false }}
        initialParams={{ showContent: props?.route?.params?.showContent }}
      />
    </Stack.Navigator>
  );
};

export default PatientNavigator;
