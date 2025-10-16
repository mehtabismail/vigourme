import React, { type PropsWithChildren } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import Colors from '../common/colors';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

const HeadingWithTitle = (props: any) => {
  const {
    surveyIntroCard,
    marginTop,
    marginBottom,
    title,
    fontSize,
    screen,
    UnderHeadingText,
    children,
    appScreen,
  } = props;

  return (
    <View
      style={[
        styles.container,
        {
          marginTop: marginTop ? marginTop : 0,
          marginBottom: marginBottom ? marginBottom : 0,
        },
      ]}
    >
      <Text
        style={{
          ...styles.headingText,
          alignSelf: surveyIntroCard ? 'center' : 'flex-start',
          fontSize: fontSize ? RFValue(fontSize) : RFValue(18),
          color: appScreen ? Colors.DARK_TEXT_COLOR : Colors.WHITE,
        }}
      >
        {title ? title : 'Sign in'}
      </Text>
      {/* {screen == 'signup' ? ( */}
      {UnderHeadingText}
      {/* <Text
          style={{
            ...styles.titleText,
            textAlign: 'justify',
            // textAlign: surveyIntroCard ? 'center' : 'auto',
          }}
        >
          Enter your <Text style={{ fontWeight: 'bold' }}>Infromation</Text> to
          signup to your account`
        </Text>
      ) : (
        <Text
          style={{
            ...styles.titleText,
            textAlign: 'justify',
            // textAlign: surveyIntroCard ? 'center' : 'auto',
          }}
        >
          Enter your
          <Text style={styles.nestedText}> email and password </Text>
          information to sign in to your account.
        </Text>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
  },
  headingText: {
    fontWeight: '700',
    lineHeight: 35,
  },
  nestedText: {
    fontWeight: 'bold',
  },
});

export default HeadingWithTitle;
