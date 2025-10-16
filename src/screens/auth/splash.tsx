import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Touchable,
  Alert,
  Linking,
} from 'react-native';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import navigationStrings from '../../common/navigationStrings';
import SplashLogo from '../../assets/icons/splash_logo.svg';
import { setBaseUrl, setToken } from '../../redux/slices/tokenSlice';
import { setNavigation } from '../../redux/slices/navigationSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  notificationListener,
  requestUserPermission,
} from '../../utils/NotificationService';
import Button from '../../components/button';
import HeadingWithTitle from '../../components/headingWithTitle';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../common/colors';
import firestore from '@react-native-firebase/firestore';
import {
  commonQuestion,
  femaleCommonQuestion,
  femaleOtherIssues,
  lowLobido,
  maleCommonQuestion,
  maleErectileDysfunctionQuestions,
  maleOtherIssues,
  malePrematureEjaculationQuestions,
  orgasmIssues,
  vaginalDryness,
  vaginismus,
} from '../../../_questions';
import { addIDS, seedingQuestionaire } from '../../utils/seeder';
import VersionCheck from 'react-native-version-check';
import { apiRequest } from '../../api/apiRequest';
import EndPoint from '../../common/apiEndpoints';
import { sendNotification } from '../../utils/fcmApi';

const Splash = () => {
  const dispatch = useDispatch();
  const [showContent, setShowContent] = useState(false);

  const { BASE_URL } = useSelector((state: any) => state?.tokenSlice);

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const getBaseUrl = () => {
    firestore()
      .collection('base-url')
      .doc('backend-url')
      .onSnapshot(
        documentSnapshot => {
          if (documentSnapshot?.exists) {
            console.log(
              documentSnapshot.data(),
              'here is the backend url data',
            );
            let data: any = documentSnapshot.data();
            dispatch(setBaseUrl(data?.url));
          } else {
            console.log('Document does not exist');
          }
        },
        error => {
          console.log('documentSnapshot Error: ', error);
        },
      );
  };

  useEffect(() => {
    // get permission, FCM token and send forground notification
    requestUserPermission();
    notificationListener();
    console.log('here i am ');
    setTimeout(() => {
      getBaseUrl();
      VersionCheck.needUpdate().then(async res => {
        console.log(res, 'checkinggg');
        if (res?.isNeeded) {
          Alert.alert('You need to update latest version', '', [
            {
              text: 'Update',
              onPress: () => {
                Linking.openURL(res.storeUrl); // open store if update is needed.
              },
            },
          ]);
        } else {
          setShowContent(true);
        }
      });

      // getLoggedInDetails();
    }, 3000);
  }, []);

  const getLoggedInDetails = async () => {
    dispatch(setNavigation(navigation));
    let tokenVal = await AsyncStorage.getItem('token');
    let role = await AsyncStorage.getItem('role');
    if (!tokenVal) {
      navigation.replace(navigationStrings.SIGN_IN);
    } else {
      dispatch(setToken(tokenVal));
      if (role == 'patient') {
        navigation.replace(navigationStrings.PATIENT_NAVIGATOR);
      } else {
        navigation.replace(navigationStrings.DOCTORS_NAVIGATOR);
      }
    }
  };

  const seedData = async () => {
    sendNotification(
      {
        fcmToken:
          'fw1GgnxJSj2Gato_-vfBW6:APA91bFWamKRZteeuyFt5iXJua6C9xOVmYTkxyMGy9rhB6QrbnYKfxu92qwOVDjf1jHmSKZvCJQe0mzXtE42arssAWDWeJ3gBJZocI70HCm_dUR8ZxuKnZ8',
        notification: {
          body: 'Your doctor sent you a new prescription',
          title: 'New Prescription',
        },
      },
      () => {},
    );
    // seedingQuestionaire("common", commonQuestion);
    // seedingQuestionaire("femaleCommonQuestion", femaleCommonQuestion);
    // seedingQuestionaire("femaleOtherIssues", femaleOtherIssues);
    // seedingQuestionaire("lowLobido", lowLobido);
    // seedingQuestionaire("maleCommonQuestion", maleCommonQuestion);
    // seedingQuestionaire(
    //   "maleErectileDysfunctionQuestions",
    //   maleErectileDysfunctionQuestions
    // );
    // seedingQuestionaire("maleOtherIssues", maleOtherIssues);
    // seedingQuestionaire(
    //   "malePrematureEjaculationQuestions",
    //   malePrematureEjaculationQuestions
    // );
    // seedingQuestionaire("orgasmIssues", orgasmIssues);
    // seedingQuestionaire("vaginalDryness", vaginalDryness);
    // seedingQuestionaire("vaginismus", vaginismus);
  };

  const UnderHeadingText = (props: any) => {
    return (
      <Text style={styles.headingText}>
        Enter your
        <Text style={{ fontWeight: 'bold' }}> email and password </Text>to sign
        in to your account.
      </Text>
    );
  };

  const Content = () => {
    return (
      <View style={[{ width: '90%', alignSelf: 'center' }]}>
        <View style={{}}>
          <Text
            style={{
              fontSize: RFValue(22),
              color: Colors.BLACK,
              fontWeight: '600',
            }}
          >
            Select Your Category:
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (!!BASE_URL) {
              AsyncStorage.setItem('doctorId', '1k0vyFtOs4IG8NhVTS8M');
              AsyncStorage.setItem('gender', 'male');
              navigation.navigate(navigationStrings.PATIENT_NAVIGATOR, {
                showContent: true,
              });
            } else {
              Alert.alert(
                'Something went wrong please try again after sometime.',
              );
            }
          }}
          style={{
            marginTop: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.0,
            elevation: 7,
            borderRadius: 5,
            backgroundColor: 'white',
            padding: 10,
          }}
        >
          <View>
            <Text
              style={{ fontSize: 18, fontWeight: '600', color: Colors.BLACK }}
            >
              1. Men
            </Text>
          </View>
          <Text style={{ marginTop: 5 }}>
            Explore solutions for issues like Eryctile Dysfunction, Premature
            Ejaculation, Low Libido, and more.
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (!!BASE_URL) {
              AsyncStorage.setItem('doctorId', '1k0vyFtOs4IG8NhVTS8M');
              AsyncStorage.setItem('gender', 'female');
              navigation.navigate(navigationStrings.PATIENT_NAVIGATOR, {
                showContent: true,
              });
            } else {
              Alert.alert(
                'Something went wrong please try again after sometime',
              );
            }
          }}
          style={{
            marginTop: 15,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.0,
            elevation: 7,
            borderRadius: 5,
            backgroundColor: 'white',
            padding: 10,
          }}
        >
          <View>
            <Text
              style={{ fontSize: 18, fontWeight: '600', color: Colors.BLACK }}
            >
              2. Women
            </Text>
          </View>
          <Text style={{ marginTop: 5 }}>
            Explore solutions for issues like Low Libido, Vaginal Dyness, Orgasm
            issues and more.
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => getLoggedInDetails()}
          style={{
            marginTop: 15,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.0,
            elevation: 7,
            borderRadius: 5,
            backgroundColor: 'white',
            padding: 10,
          }}
        >
          <View>
            <Text
              style={{ fontSize: 18, fontWeight: '600', color: Colors.BLACK }}
            >
              3. View Your Previous Responses
            </Text>
          </View>
          <Text style={{ marginTop: 5 }}>
            If you have already filled out the questionaire, you can view your
            responses here.
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!showContent ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <SplashLogo />
        </View>
      ) : (
        <>
          <TouchableOpacity
            activeOpacity={1}
            disabled={true}
            onPress={() => seedData()}
            style={{
              height: '40%',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <SplashLogo />
          </TouchableOpacity>
          <View style={{ height: '60%', justifyContent: 'center' }}>
            {showContent && <Content />}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default Splash;
