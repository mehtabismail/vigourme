import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
} from 'react-native';
import Colors from '../../common/colors';
import Header from '../../components/header';
import HeadingWithTitle from '../../components/headingWithTitle';
import Input from '../../components/Inputs';
import StatusBarComponent from '../../components/statusbar';
import Button from '../../components/button';
import navigationStrings from '../../common/navigationStrings';
import { RFValue } from 'react-native-responsive-fontsize';
import { apiRequest } from '../../api/apiRequest';
import EndPoint from '../../common/apiEndpoints';
import Toast from 'react-native-simple-toast';
import RemoveItemFromAsyncStorage from '../../utils/removeAsyncStorageItems';
import { useDispatch } from 'react-redux';
import { setRole } from '../../redux/slices/authSlice';
import { setToken } from '../../redux/slices/tokenSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

const ForgotPassword = (props: any) => {
  const dispatch = useDispatch();
  const { navigation } = props;
  const [email, setEmail] = useState('');
  const goBack = () => {
    navigation.goBack();
  };

  const navigateToSigin = () => {
    navigation.replace(navigationStrings.SIGN_IN);
  };

  const UnderHeadingText = (props: any) => {
    return (
      <Text style={styles.headingText}>
        Please enter your <Text style={{ fontWeight: 'bold' }}>Email</Text> to
        reset your password
      </Text>
    );
  };

  const ForgotPassword = async () => {
    try {
      const { data }: any = await apiRequest(
        '/api/user/forgotPassword',
        'put',
        {
          email: email.toString(),
        },
      );
      await RemoveItemFromAsyncStorage('token');
      await RemoveItemFromAsyncStorage('role');
      dispatch(setRole(''));
      dispatch(setToken(''));
      Toast.show(data.message.toString());
      navigateToSigin();
    } catch (error: any) {
      // console.log(typeof error.response.data.message);
      Toast.show(error.toString());
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
      <Header shadow backPress={goBack} showLogo />
      <ImageBackground
        resizeMode="cover"
        style={styles.containerImage}
        source={require('../../assets/images/physician--with-stethoscope.png')}
      >
        <View style={styles.signinCOntainer}>
          <ScrollView style={{ paddingHorizontal: 10 }}>
            <HeadingWithTitle
              marginTop={'auto'}
              marginBottom={20}
              UnderHeadingText={<UnderHeadingText />}
              title={'Forgot Password'}
            />
            <Input
              title={'Email Address'}
              placeholder={'e.g email@email.com'}
              name="email"
              value={email}
              onChangeText={(value: any) => setEmail(value)}
            />

            <Button
              marginTop={35}
              marginBottom={1}
              title={'Forgot Password'}
              onPress={ForgotPassword}
            />
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
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
  forgotPasswordRemPasswordMainContainer: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 7,
  },
  innerForgotPassContainer: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.DARK_TEXT_COLOR,
  },
  bottomView: {
    position: 'absolute',
    bottom: 35,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomText: {
    textAlign: 'center',
    color: Colors.LIGHT_TEXT_COLOR,
    fontSize: 17,
  },
  signUptext: {
    color: Colors.PRIMARY,
    fontSize: 14,
    fontWeight: '500',
  },
  signinCOntainer: {
    zIndex: 1,

    paddingHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
    paddingVertical: '10%',
    marginHorizontal: 15,
    backgroundColor:
      Platform.OS == 'ios' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
  },

  headingText: {
    color: Colors.WHITE,
    fontSize: RFValue(14),
    fontWeight: '400',
    marginTop: 15,
    lineHeight: 22,
  },
});

export default ForgotPassword;
