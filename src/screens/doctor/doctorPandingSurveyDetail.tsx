import { SafeAreaView, FlatList, StyleSheet, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../common/colors";
import ChatListItem from "../../components/chatListItem";
import Header from "../../components/header";
import StatusBarComponent from "../../components/statusbar";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DashboardButton from "../../components/dashboardButton";
import User from "../../assets/icons/user-bg-green.svg";
import Message from "../../assets/icons/message-bg-green.svg";
import navigationStrings from "../../common/navigationStrings";
import PandingSurveysListItem from "../../components/pandingSurveysListItem";

const DoctorPandingSurveyDetail = (props: any) => {
  const {navigation } = props;
  const itemDetail = props?.route?.params?.itemDetail;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent colorWhite />
      <Header
        showLogo={true}
        shadow
        backPress={()=> navigation.pop()}
        filledLogo
      />

      <View style={styles.bodyContainer}>
          <PandingSurveysListItem 
            navigation={navigation}
            chatItem={itemDetail}
            navigationPath={navigationStrings.DOCTOR_PENDING_SURVEY_DETAIL}
            descriptionDetail={true}
          />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  bodyContainer:{
    flex: 1,
    margin:5,
    paddingTop:20,
    alignItems: "center"
  },
});

export default DoctorPandingSurveyDetail