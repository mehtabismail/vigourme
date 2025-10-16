import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import navigationStrings from "../common/navigationStrings";

// Screens for doctor's flow
import DoctorChatList from "../screens/doctor/doctorChatList";
import DoctorDashboard from "../screens/doctor/doctorDashboard";
import DoctorPandingSurveys from "../screens/doctor/doctorPandingSurveys";
import DoctorPandingSurveyDetail from "../screens/doctor/doctorPandingSurveyDetail";
import Prescription from "../screens/doctor/prescription";
import DoctorChat from "../screens/doctor/doctorChat";

const Stack = createNativeStackNavigator();

const DoctorsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={navigationStrings.DOCTOR_DASHBOARD}>
      <Stack.Screen
        name={navigationStrings.DOCTOR_DASHBOARD}
        component={DoctorDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.DOCTOR_PENDING_SURVEYS}
        component={DoctorPandingSurveys}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.DOCTOR_PENDING_SURVEY_DETAIL}
        component={DoctorPandingSurveyDetail}
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
        name={navigationStrings.DOCTOR_CHAT}
        component={DoctorChat}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default DoctorsNavigator;
