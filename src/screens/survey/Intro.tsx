import { View, SafeAreaView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import SurveyIntroCard from "./surveyIntroCard";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import navigationStrings from "../../common/navigationStrings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

export default function Intro(props: any) {
  const { navigation } = props;
  const [docName, setDocName] = useState<string>();
  const [info, setInfo] = useState<Boolean>(true);
  const goBack = () => {
    !info ? setInfo(true) : navigation.goBack();
  };
  const getDoctorName = async () => {
    const docId: any = await AsyncStorage.getItem("doctorId");
    firestore()
      .collection("users")
      .where(firestore.FieldPath.documentId(), "==", docId)
      .onSnapshot(async (documentSnapshot) => {
        const documents: any = documentSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        if (documents.length) {
          setDocName(documents[0].name);
        }
      });
  };
  useEffect(() => {
    getDoctorName();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Header
        backPress={goBack}
        // title={docName && `Dr. ${docName}`}
        title={` `}
        shadow={true}
        filledLogo
      />
      <View style={[styles.innerContainer, !info && { marginTop: hp("15%") }]}>
        <View>
          <SurveyIntroCard
            info={info}
            setInfo={setInfo}
            navigation={navigation}
            navigationPath={navigationStrings.QUESTIONS}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    marginTop: hp("8%"),
  },
});
