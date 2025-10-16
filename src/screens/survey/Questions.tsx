import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

import SurveyHeader from "../../components/surveyHeader";
import ProgressBar from "../../components/progressBar";
import QuestionCard from "./QuestionCard";
import { apiRequest } from "../../api/apiRequest";
import EndPoint from "../../common/apiEndpoints";
import Colors from "../../common/colors";
import useGetReduxState from "../../customhooks/useGetReduxState";
import LoadingIndicator from "../../components/loadingIndicator";
import { useDispatch } from "react-redux";
import { setFinalAnswer } from "../../redux/slices/surveyAnswerSlice";
import {
  setQuestionLength,
  decrementCurrentIndex,
  setCurrentQuestion,
} from "../../redux/slices/currentQuestionSlice";
import { removeItemFromAnswer } from "../../redux/slices/surveyAnswerSlice";
import navigationStrings from "../../common/navigationStrings";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Questions = (props: any) => {
  const states: any = useGetReduxState();
  const currIndex = states.currentQuestionSlice.currentIndex;
  const questionLength = states.currentQuestionSlice.questionsLength;
  const dispatch = useDispatch();
  const { navigation } = props;
  const [questions, setQuestions] = useState<any>();
  const [allQuestions, setAllQuestions] = useState<any>();
  const [progress, setProgress] = useState<any>();
  const [backStep, setBackStep] = useState<any>([]);

  const goBack = () => {
    navigation.goBack();
  };

  const calculateProgress = () => {
    if (currIndex == 0) {
      if (questions) {
        const result: any = (1 / questionLength) * 100;
        setProgress(result);
      }
    } else {
      const result: any = (currIndex / questionLength) * 100;
      setProgress(result);
    }
  };

  const getSurveyQuestions = async () => {
    let gender =
      (await AsyncStorage.getItem("gender")) == "male"
        ? "maleCommonQuestion"
        : "femaleCommonQuestion";

    try {
      console.log("started getting question");
      const { data }: any = await apiRequest(
        EndPoint.SURVEY_QUESTIONS,
        "get",
        ""
      );

      // console.log(data?.questions["maleCommonQuestion"]?.questions);
      // return console.log(data?.questions["maleCommonQuestion"]?.questions);
      console.log("==> ", data, "is there anything in data ");
      setAllQuestions(data?.questions);
      setQuestions(data?.questions[gender]?.questions);
      dispatch(
        setQuestionLength(data?.questions[gender]?.common?.questions?.length)
      );
    } catch (error) {
      console.log("check the error", error);
    }
  };

  const closeSurvey = (arg: any) => {
    navigation.navigate(navigationStrings.SURVEY_INTRO);
    // arg.setDescriptiveAnswer("");
    // arg.setSelectedOption("");
    dispatch(setCurrentQuestion(0));
    dispatch(setFinalAnswer([]));
  };

  const moveBack = () => {
    const backTo = backStep[backStep.length - 1];
    setBackStep([...backStep.slice(0, -1)]);

    if (currIndex >= 1) {
      if (questions) {
        dispatch(
          decrementCurrentIndex(currIndex - backTo >= 0 ? backTo : currIndex)
        );
        dispatch(removeItemFromAnswer());
      }
    } else {
      dispatch(setCurrentQuestion(0));
      goBack();
    }
  };

  useEffect(() => {
    getSurveyQuestions();
  }, []);

  useEffect(() => {
    calculateProgress();
  }, [currIndex]);

  useEffect(() => {
    // this useEffect handles android's hardware backpress
    const backAction: any = () => {
      moveBack;
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [currIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <SurveyHeader
        shadow
        closePress={closeSurvey}
        title={
          currIndex < questionLength &&
          `${currIndex == 0 ? 1 : currIndex} of ${
            questionLength ? questionLength - 1 : 0
          }`
        }
        questions={true}
        filledLogo
      />
      <View style={styles.mainContainer}>
        <ProgressBar progress={`${progress ? progress.toFixed(2) : 0}%`} />
        {states.loadingSlice.isLoading ? (
          <View style={styles.loadingView}>
            <LoadingIndicator size={"large"} colors={Colors.PRIMARY} />
          </View>
        ) : (
          <QuestionCard
            moveBack={moveBack}
            questions={questions}
            setQuestions={setQuestions}
            allQuestions={allQuestions}
            navigation={navigation}
            closeSurvey={closeSurvey}
            backStep={backStep}
            setBackStep={setBackStep}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Questions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: widthPercentageToDP(6),
    overflow: "hidden",
  },
  loadingView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50%",
  },
});
