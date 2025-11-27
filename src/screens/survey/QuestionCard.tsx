import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import SingleOption from '../../components/singleOption';
import QuestionBtn from '../../components/questionButton';
import Colors from '../../common/colors';
import navigationStrings from '../../common/navigationStrings';
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { useDispatch } from 'react-redux';
import useGetReduxState from '../../customhooks/useGetReduxState';
import {
  incrementCurrentIndex,
  setQuestionLength,
} from '../../redux/slices/currentQuestionSlice';
import { setFinalAnswer } from '../../redux/slices/surveyAnswerSlice';
import SuccessDialogue from '../../components/successDialogue';
import { submitSurveyCallback } from '../../utils/submitSurvey';

const QuestionCard = (props: any) => {
  const dispatch = useDispatch();
  const states: any = useGetReduxState();
  let finalAnswer = states.surveyAnswerSlice.finalAnswer;
  const {
    navigation,
    questions,
    setQuestions,
    allQuestions,
    moveBack,
    closeSurvey,
    backStep,
    setBackStep,
  } = props;
  const currIndex = states.currentQuestionSlice.currentIndex;
  const questionLength = states.currentQuestionSlice.questionsLength;
  const [selectedOption, setSelectedOption] = useState<any>({});
  const [descriptiveAnswer, setDescriptiveAnswer] = useState<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [skipLastQuestion, setSkipLastQuestion] = useState(false);
  const [previousLength, setPreviousLength] = useState<any>();
  const [bypassFirstQuestion, setBypassFirstQuestion] = useState(true);

  const nextQuestionnaire =
    questions && questions[currIndex]?.nextQuestionnaire;
  console.log({ nextQuestionnaire });
  const isMultiAnswer = questions && questions[currIndex]?.isMultiSelect;
  const isSkipAble = questions && questions[currIndex]?.skip;
  const currentQuestion =
    questions && currIndex >= 0 && questions[currIndex].question;
  const currentQuestionForSurvey =
    currentQuestion && currentQuestion.replace('((', '').replace('))', '');

  const isOptionSelected = (value: Object) => {
    return Object.keys(value).length > 0;
  };

  const moveToNext = (value: any) => {
    if (questions) {
      dispatch(incrementCurrentIndex(value));
    }
    setDescriptiveAnswer('');
    setSelectedOption({});
  };

  const getValuesSelected = async () => {
    // console.log("bypassing first question");
    const selectedQuestionaireData: any = await AsyncStorage.getItem(
      'selectedQuestionaireData',
    );
    const data = await JSON.parse(selectedQuestionaireData);
    let gender = await AsyncStorage.getItem('gender');
    let _questions = [...questions];
    if (_questions && !!bypassFirstQuestion) {
      setBypassFirstQuestion(false);
      console.log('calling functions now');
      prepareAnswer(
        'What are you looking to treat?',
        {
          [data.index]: data?.text,
        } as any,
        null,
        gender == 'male'
          ? {
            '0': 'maleErectileDysfunctionQuestions',
            '1': 'malePrematureEjaculationQuestions',
            '2': 'maleOtherIssues',
          }
          : {
            '0': 'lowLobido',
            '1': 'vaginalDryness',
            '2': 'orgasmIssues',
            '3': 'vaginismus',
            '4': 'femaleOtherIssues',
          },
      );
    }
  };

  useEffect(() => {
    !!bypassFirstQuestion && getValuesSelected();
  }, [questions]);

  const prepareAnswer = (
    ques: string,
    ans: string,
    id: any,
    nextQuestionnaire: any,
  ) => {
    console.log(
      ques,
      ans,
      id,
      nextQuestionnaire,
      'checking next button details',
    );
    let _questions = [...questions];
    if (nextQuestionnaire) {
      console.log(_questions, 'found Questions');
      try {
        setPreviousLength(allQuestions?.common?.questions?.length);
        _questions = [
          ...allQuestions?.common?.questions,
          ...allQuestions[nextQuestionnaire[Object.keys(ans)[0]]]?.questions,
        ];
        dispatch(setQuestionLength(_questions?.length));
        setQuestions(_questions);
      } catch (e) {
        console.log('nextQuestionnaire Error: ', e);
        Toast.show('Error in next questionnaire', Toast.LONG);
      }
    }

    const expectedAnswer =
      isSkipAble?.onSelected && Array.isArray(isSkipAble?.onSelected)
        ? isSkipAble?.onSelected
        : _questions[currIndex].answers &&
        _questions[currIndex].answers[isSkipAble?.onSelected];
    const isNextTo =
      (!Array.isArray(expectedAnswer) &&
        expectedAnswer === Object.values(ans)[0]) ||
      (Array.isArray(expectedAnswer) &&
        expectedAnswer.reduce((accumulator, currentValue, index) => {
          return (
            accumulator ||
            _questions[currIndex].answers[currentValue] ===
            Object.values(ans)[0]
          );
        }, _questions[currIndex].answers[expectedAnswer[0]] === Object.values(ans)[0]));

    let nextIndex = previousLength
      ? previousLength + isSkipAble?.next
      : isSkipAble?.next;
    nextIndex -= currIndex + 1;
    let nextTo = isNextTo && isSkipAble?.next ? nextIndex + 1 : 1;
    dispatch(
      setFinalAnswer([
        ...finalAnswer,
        {
          priority: currIndex,
          question: ques,
          answer: descriptiveAnswer
            ? descriptiveAnswer
            : isMultiAnswer
              ? Object.values(ans)
              : Object.values(ans)[0],
        },
      ]),
    );

    // for skip the last question
    if (isSkipAble?.next && nextTo + currIndex >= questionLength) {
      setSkipLastQuestion(true);
      nextTo = 1;
    }

    setBackStep([...backStep, nextTo]);
    moveToNext(nextTo);
  };

  const submitSurvey = async () => {
    dispatch(
      setFinalAnswer([
        ...finalAnswer,
        {
          priority: currIndex,
          question: currentQuestionForSurvey,
          answer: descriptiveAnswer
            ? descriptiveAnswer
            : isMultiAnswer
              ? Object.values(selectedOption)
              : Object.values(selectedOption)[0],
        },
      ]),
    );
    Alert.alert(
      'Thanks for completing the survey!',
      'Sign up to get personalized advice and support from our experts. Your info stays private and confidential.',
      [
        {
          text: 'Sign Up',
          onPress: () => {
            navigation.replace(navigationStrings.SIGN_UP, {
              submitSurveyCallback: submitSurveyCallback,
            });
          },
        },
      ],
    );
  };

  const GoBack = () => {
    return (
      <QuestionBtn
        onPress={() => {
          skipLastQuestion && setSkipLastQuestion(false);
          moveBack();
        }}
        title="Back"
      />
    );
  };

  const CurrentQuestion = () => {
    return (
      <View>
        {currentQuestion && (
          <Text style={styles.quesText}>
            {currentQuestion.includes('((')
              ? currentQuestion.slice(0, currentQuestion.indexOf('(('))
              : currentQuestion}
          </Text>
        )}
        {currentQuestion && currentQuestion.includes('((') && (
          <Text style={[styles.quesText, styles.quesTextSmall]}>
            {currentQuestion.slice(currentQuestion.indexOf('((') + 2, -2)}
          </Text>
        )}
      </View>
    );
  };

  const callPrepareAnswer = () => {
    prepareAnswer(
      currentQuestionForSurvey,
      selectedOption,
      questions[currIndex].id,
      nextQuestionnaire,
    );
  };

  // useEffect(() => {
  //   console.log(object)
  //   currIndex && callPrepareAnswer();
  // }, [currIndex]);

  return (
    <View style={styles.container}>
      <SuccessDialogue
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        close={() => {
          closeSurvey();
          navigation.dispatch(StackActions.popToTop());
          navigation.replace(navigationStrings.HOME);
        }}
        text={
          'Your questionnaire has been submitted successfully. The doctor would get back to you within 24 hours.'
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {skipLastQuestion ? (
          <Text
            style={[styles.quesText, { textAlign: 'center', marginBottom: 20 }]}
          >
            Submit your answers
          </Text>
        ) : (
          <>
            <CurrentQuestion />
            <View style={styles.options}>
              {questions && questions[currIndex]?.answers ? (
                questions[currIndex]?.answers?.map((item: any, index: any) => {
                  return (
                    <SingleOption
                      onPress={() => {
                        if (selectedOption[`${index}`] === undefined) {
                          isMultiAnswer
                            ? setSelectedOption({
                              ...selectedOption,
                              [index]: item,
                            })
                            : setSelectedOption({ [index]: item });
                        } else {
                          isMultiAnswer &&
                            setSelectedOption((item: any) => {
                              const copy = { ...item };
                              delete copy[index];
                              return copy;
                            });
                        }
                      }}
                      selected={selectedOption}
                      index={index}
                      title={item}
                      multiOption={isMultiAnswer}
                    />
                  );
                })
              ) : (
                <TextInput
                  style={styles.descriptiveAnswerInput}
                  multiline={true}
                  placeholder={'Type your answer here'}
                  placeholderTextColor={Colors.MESSAGE_TIME}
                  onChangeText={(text: any) => setDescriptiveAnswer(text)}
                  value={descriptiveAnswer}
                />
              )}
            </View>
          </>
        )}

        {!nextQuestionnaire && questions && currIndex == questionLength - 1 ? (
          <View style={styles.btnContainer} /*style={{ alignSelf: "center" }}*/>
            <GoBack />

            <QuestionBtn
              onPress={submitSurvey}
              title="Submit"
              active={
                isOptionSelected(selectedOption) ||
                descriptiveAnswer ||
                skipLastQuestion
              }
              disabled={
                (!isOptionSelected(selectedOption) &&
                  !descriptiveAnswer &&
                  !skipLastQuestion)
              }
            />
          </View>
        ) : (
          <View style={styles.btnContainer}>
            <GoBack />
            <QuestionBtn
              onPress={() => callPrepareAnswer()}
              title="next"
              active={isOptionSelected(selectedOption) || descriptiveAnswer}
              disabled={!isOptionSelected(selectedOption) && !descriptiveAnswer}
            />
          </View>
        )}
      </ScrollView>
      {/* <TouchableOpacity onPress={registerChatsCollection}>
        <Text>Create collection</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default QuestionCard;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    paddingHorizontal: widthPercentageToDP(4),
    paddingVertical: heightPercentageToDP(2),
    width: '100%',
    borderColor: Colors.QUESTION_CONTAINER_BORDER,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: heightPercentageToDP(1),
    marginBottom: heightPercentageToDP(10),
  },
  quesText: {
    width: '100%',
    fontWeight: '700',
    fontSize: RFValue(20),
    color: Colors.DARK_TEXT_COLOR,
    lineHeight: 30,
  },
  quesTextSmall: {
    marginTop: 10,
    fontWeight: '400',
    fontSize: RFValue(12),
    lineHeight: 20,
    textAlign: 'center',
  },
  options: {
    paddingTop: heightPercentageToDP(2),
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: heightPercentageToDP(2),
  },
  descriptiveAnswerInput: {
    borderWidth: 1,
    borderRadius: 6,
    marginVertical: 10,
    borderColor: Colors.INPUT_BORDER,
    color: Colors.BLACK,
    paddingHorizontal: 10,
    paddingTop: Platform.OS == 'ios' ? 10 : 6,
    paddingBottom: Platform.OS == 'ios' ? 10 : 10,
    fontSize: 15,
  },
});
