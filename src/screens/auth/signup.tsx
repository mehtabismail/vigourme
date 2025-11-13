import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../common/colors';
import StatusBarComponent from '../../components/statusbar';
import Header from '../../components/header';
import HeadingWithTitle from '../../components/headingWithTitle';
import Input from '../../components/Inputs';
import Button from '../../components/button';
import navigationStrings from '../../common/navigationStrings';
import GenderDropdown from '../../components/genderDropdown';
import DatePicker from 'react-native-date-picker';
import { getReadableDate } from '../../utils/DatePraser';
import { RFValue } from 'react-native-responsive-fontsize';
import { apiRequest } from '../../api/apiRequest';
import EndPoint from '../../common/apiEndpoints';
import Config from 'react-native-config';
import Toast from 'react-native-simple-toast';
import GoogleButton from '../../components/GoogleButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setToken } from '../../redux/slices/tokenSlice';
import { getFcmToken } from '../../utils/NotificationService';
import { sendFcmToFirestore } from '../../utils/fcmApi';
import { setRole } from '../../redux/slices/authSlice';
import { CommonActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FullScreenLoadingIndicator from '../../components/fullScreenLoadingIndicator';

const Signup = (props: any) => {
  const { navigation, route } = props;
  const [genderDropdownVisibility, setGenderDropdownVisibility] =
    useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userCredentails, setUserCredentials] = useState({
    name: '',
    email: '',
    gender: '',
    dob: '',
    phoneNumber: '',
    password: '',
  });
  const [googleCredentials, setGoogleCredentials] = useState({
    facebookLogin: false,
    googleLogin: true,
  });
  const [signedUpData, setSignedUpData] = useState(null);

  const [googleDetails, setGoogleDetails] = useState(null);
  const navigateToSignin = () => {
    // navigation.replace(navigationStrings.SIGN_IN);
    navigation.goBack();
  };
  const goBack = () => {
    navigation.goBack();
  };

  const handleChangeInput = (value: any, name: String) => {
    setUserCredentials(prev => ({
      ...prev,
      [`${name}`]: name == 'dob' ? value : value,
    }));
  };

  const googleSignUpProceed = async () => {
    setIsLoading(true);
    console.log('google signup proceeds');
    setUserCredentials({
      ...userCredentails,
      name: googleDetails?.user?.name,
      email: googleDetails?.user?.email,
      facebookLogin: false,
      googleLogin: true,
    });

    await signup({
      ...userCredentails,
      name: googleDetails?.user?.name,
      email: googleDetails?.user?.email,
      facebookLogin: false,
      googleLogin: true,
    });
  };
  const dispatch = useDispatch();

  const signin = async () => {
    const reqObj = {
      email: userCredentails?.email,
      password: userCredentails?.password,
    };
    try {
      const { data }: any = await apiRequest(EndPoint.SIGN_IN, 'post', reqObj);

      if (data?.success) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('userId', data.user.id);
        await AsyncStorage.setItem('doctorId', data.doctorId);
        await AsyncStorage.setItem('name', data.user.name);
        (await AsyncStorage.getItem('showOneTimeToast')) === null &&
          (await AsyncStorage.setItem('showOneTimeToast', 'true'));
        data?.user?.serialNumber &&
          (await AsyncStorage.setItem(
            'serialNumber',
            data?.user?.serialNumber,
          ));

        await AsyncStorage.setItem('userEmail', '');
        await AsyncStorage.setItem('userPassword', '');

        // add fcm token in users collection
        const fcmToken = await getFcmToken();
        fcmToken
          ? sendFcmToFirestore(
            fcmToken,
            data?.user?.isConsultant ? data.doctorId : data.user.id,
          )
          : console.log('FCM Token Error: ', fcmToken);

        dispatch(setToken(data.token));
        if (data?.user?.isConsultant) {
          console.log(data?.user, 'checking consultant');
          dispatch(setRole('consultant'));
          await AsyncStorage.setItem('role', 'consultant');
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: navigationStrings.DOCTORS_NAVIGATOR }],
            }),
          );
        } else {
          dispatch(setRole('patient'));
          await AsyncStorage.setItem('role', 'patient');
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: navigationStrings.PATIENT_NAVIGATOR }],
            }),
          );
        }
      } else {
        data.message && Toast.show(data.message.toString());
        console.log('\n\n: , ', data);
      }
    } catch (error: any) {
      Toast.show(error.toString());
    }
  };

  const signup = async (_userCredentails: any) => {
    setIsLoading(true);
    const localUserCredentails = _userCredentails?.googleLogin
      ? _userCredentails
      : userCredentails;
    const selected_gender = await AsyncStorage.getItem('gender');
    console.log('proceeding');
    try {
      let formData = {
        name: localUserCredentails.name,
        email: localUserCredentails.email,
        gender: selected_gender,
        // dob: userCredentails.dob,
        // phoneNumber: userCredentails.phoneNumber,
        googleLogin: true,
        facebookLogin: false,
      };

      const response: any = await apiRequest(
        !!localUserCredentails.googleLogin
          ? EndPoint.SOCIAL_SIGNUP
          : EndPoint.PATIENT_SIGN_UP,
        'post',
        !!localUserCredentails.googleLogin ? formData : localUserCredentails,
      );

      console.log(
        'calling funcrtion',
        {
          token: response?.data?.token,
          userId: response?.data?.userId,
          serialNumber: response?.data?.users?.serialNumber,
        },
        response,
      );
      dispatch(setToken(response?.data?.token));
      const { data, status } = response;
      await AsyncStorage.setItem('userId', data?.userId);
      console.log(status, 'checking status');
      if (status == 200) {
        setSignedUpData(data);
        console.log(route?.params, 'checking params ');
        await route?.params?.submitSurveyCallback({
          token: data?.token,
          userId: data?.userId,
          serialNumber: data?.users?.serialNumber,
        });
        successSignUpModal();
      }

      Toast.show(data.message);
    } catch (error: any) {
      console.log(error);
      Toast.show(error);
    } finally {
      setIsLoading(false);
    }
  };

  const successSignUpModal = async () => {
    Alert.alert('Thanks for Signing Up!', '', [
      {
        text: 'Sign In',
        onPress: () => {
          navigation.replace(navigationStrings.SIGN_IN);
        },
      },
    ]);
  };

  useEffect(() => {
    if (googleDetails) {
      // console.log(googleDetails, "proceeding");
      googleSignUpProceed();
    }
    return () => { };
  }, [googleDetails]);

  const UnderHeadingText = (props: any) => {
    return (
      <Text style={styles.headingText}>
        Enter your
        <Text style={{ fontWeight: 'bold' }}> email and password </Text>to sign
        up to your account.
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
      <Header backPress={goBack} showLogo />
      <ImageBackground
        resizeMode="cover"
        style={styles.containerImage}
        source={require('../../assets/images/physician--with-stethoscope.png')}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: 20 }}
        >

          <View style={styles.signupCOntainer}>

            <View style={{ zIndex: 2 }}>
              <HeadingWithTitle
                screen="signup"
                marginTop={40}
                marginBottom={20}
                title={'Sign up'}
                UnderHeadingText={<UnderHeadingText />}
              />
              <Input
                title={'Name'}
                placeholder={'e.g Dani Roy'}
                name="name"
                value={userCredentails?.name}
                onChangeText={handleChangeInput}
              />
              <Input
                title={'Email'}
                placeholder={'e.g email@email.com'}
                name="email"
                value={userCredentails.email}
                onChangeText={handleChangeInput}
              />
              {/* <Input
                dropdownVisibilityHandler={(val: boolean) => {
                  setGenderDropdownVisibility(val);
                }}
                value={userCredentails.gender}
                name={"gender"}
                title={"Gender"}
                // placeholder={'e.g male'}
                genVisibilityHandler={genderDropdownVisibility}
              />
              {genderDropdownVisibility && (
                <GenderDropdown
                  selectedGenderValue={(val: string) =>
                    handleChangeInput(val, "gender")
                  }
                  gender={userCredentails.gender}
                  visibility={(val: boolean) =>
                    setGenderDropdownVisibility(val)
                  }
                />
              )} */}

              {/* <Input
                showCalendar={(val: boolean) => {
                  setOpen(val);
                }}
                title={"DOB"}
                name="dob"
                value={userCredentails.dob}
                placeholder={"e.g 1/12/2010"}
              /> */}
              {/* Date of birth Selector */}
              {/* <DatePicker
                modal
                mode={"date"}
                open={open}
                date={date}
                maximumDate={new Date(new Date().getFullYear(), 11, 31)}
                onConfirm={(date: any) => {
                  setOpen(false);
                  if (date < new Date()) {
                    handleChangeInput(date, "dob");
                  } else {
                    Toast.show("Invalid Date of Birth");
                    handleChangeInput("", "dob");
                  }
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
              <Input
                title={"Mobile Number"}
                placeholder={"e.g 111 222 333 444"}
                name="phoneNumber"
                maxLength={13}
                value={userCredentails.phoneNumber}
                onChangeText={handleChangeInput}
              /> */}
              {!userCredentails.googleLogin && (
                <Input
                  title={'Password'}
                  placeholder={'.......'}
                  secureTextEntry={true}
                  value={userCredentails.password}
                  name="password"
                  onChangeText={handleChangeInput}
                />
              )}

              {isLoading ? <View style={{ marginVertical: 20, height: '36%', justifyContent: 'center' }}><ActivityIndicator
                color={props.colors ? props.colors : Colors.WHITE}
                size={'large'}
              /></View> :
                <View style={{ height: '36%' }}>
                  <Button
                    onPress={signup}
                    title={
                      userCredentails.googleLogin
                        ? 'Signing up with google'
                        : 'Sign Up'
                    }
                  />

                  <View style={{ marginVertical: 15, alignItems: 'center' }}>
                    <Text style={styles.text}>Or sign up via</Text>
                  </View>
                  <View>
                    <GoogleButton
                      text="Sign up"
                      setGoogleDetails={setGoogleDetails}
                    />
                  </View>
                </View>}
            </View>
            {/* <View style={{ marginVertical: 15 }}>
                  <FacebookButton text="Sign up" />
                </View> */}
          </View>

          <View style={styles.bottomView}>
            <Text style={styles.bottomText}>Already have an account?</Text>
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={navigateToSignin}
            >
              <Text style={styles.signUptext}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>)
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  containerImage: {
    flex: 1,
    justifyContent: 'center',

    height: Dimensions.get('window').height,
  },
  bottomView: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  bottomText: {
    textAlign: 'center',
    color: Colors.WHITE,
    fontSize: 17,
  },
  signupCOntainer: {
    zIndex: 1,
    paddingHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
    // paddingVertical: '10%',
    paddingBottom: '7%',
    marginVertical: '15%',
    backgroundColor:
      Platform.OS == "ios" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)",
  },
  signUptext: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 3,
  },

  headingText: {
    color: Colors.WHITE,
    fontSize: RFValue(14),
    fontWeight: '400',
    marginTop: 15,
    lineHeight: 22,
  },
});

export default Signup;
