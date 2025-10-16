import { StyleSheet, Text, View, BackHandler } from "react-native";
import React, { useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import HeadingWithTitle from "../../components/headingWithTitle";
import Button from "../../components/button";
import FillFormImage from "../../assets/icons/startSureveyImage.svg";
import InfoIcon from "../../assets/icons/info-icon.svg";
import Colors from "../../common/colors";
import { RFValue } from "react-native-responsive-fontsize";

const surveyIntroCard = (props: any) => {
  const { navigationPath, navigation, info, setInfo } = props;
  const navigate = (path: String) => {
    navigation.navigate(path);
  };
  const UnderHeadingText = (props: any) => {
    return props?.info ? (
      <Text style={styles.headingInfoText}>
        We can help you sort this out, and we'll need to know a little more
        about you. Don't worry, it's short and sweet, and your answers are
        secure and confidential between you and your doctor.
      </Text>
    ) : (
      <Text style={styles.headingText}>
        Please fill this questionnaire form to let us know about your health
        condition.
      </Text>
    );
  };
  useEffect(() => {
    // this useEffect handles android's hardware backpress
    const backAction: any = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  return (
    <View style={styles.container}>
      {info? <InfoIcon style={{ alignSelf: "center", marginBottom:-25  }} /> : <FillFormImage style={{ alignSelf: "center" }} />}
      <HeadingWithTitle
        appScreen
        surveyIntroCard={true}
        title={info ? " " : "Start Questionnaire"}
        UnderHeadingText={<UnderHeadingText info={info} />}
      />
      <Button
        onPress={() => {info ? setInfo(false): navigate(navigationPath)}}
        title={info ? "Next" : "Start Questionnaire"}
        loading={false}
      />
    </View>
  );
};

export default surveyIntroCard;

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    paddingHorizontal: wp(8),
    paddingVertical: hp(5),
    width: "90%",
    borderColor: "#EDEDED",
    borderWidth: 1,
    borderRadius: 6,
  },
  headingText: {
    color: Colors.GREYTEXT,
    fontSize: RFValue(14),
    fontWeight: "400",
    marginVertical: 20,
    textAlign: "center",
    lineHeight: 22,
  },
  headingInfoText: {
    color: Colors.GRAYTEXTDARK,
    fontSize: RFValue(16),
    fontWeight: "400",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 26,
  },
});
