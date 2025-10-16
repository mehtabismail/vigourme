import { StackActions } from "@react-navigation/native";
import navigationStrings from "../common/navigationStrings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "../redux/store";
import { setRole } from "../redux/slices/authSlice";
import {
  setCurrentQuestion,
  setQuestionLength,
} from "../redux/slices/currentQuestionSlice";
import { setToken } from "../redux/slices/tokenSlice";
import { setNavigation } from "../redux/slices/navigationSlice";
import messaging from "@react-native-firebase/messaging";
import { sendFcmToFirestore } from "./fcmApi";
export default async function LogoutFunction(props?: any) {
  store.dispatch(setRole(""));
  store.dispatch(setCurrentQuestion(0));
  store.dispatch(setQuestionLength(0));
  store.dispatch(setToken(null));
  
  const role = await AsyncStorage.getItem("role");
  const userId =
  role === "patient"
  ? await AsyncStorage.getItem("userId")
  : await AsyncStorage.getItem("doctorId");
  sendFcmToFirestore("", userId);
  messaging().deleteToken();
  
  const email = await AsyncStorage.getItem("userEmail");
  const password = await AsyncStorage.getItem("userPassword");
  await AsyncStorage.clear();
  await AsyncStorage.setItem("userEmail", email ? email : "");
  await AsyncStorage.setItem("userPassword", password ? password : "");
  
  const navigation: any = props?.navigation
  ? props?.navigation
  : store.getState().navigationSlice.navigation;
  navigation?.dispatch(StackActions.replace(navigationStrings.SIGN_IN));
  // store.dispatch(setNavigation(null));
}
