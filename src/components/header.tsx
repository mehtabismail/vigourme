import React, { type PropsWithChildren } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import BackArrow from "../assets/icons/back_arrow.svg";
import Colors from "../common/colors";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import PowerIcon from "../assets/icons/power_icon.svg";
import { Image } from "react-native-svg";
import AppLogo from "../assets/icons/appLogo.svg";
import AppLogoFilled from "../assets/icons/appLogoFilled.svg";
import BackArrowDark from "../assets/icons/backArrowDark.svg";
import LogoutFunction from "../utils/logout";

const Header = (props: any) => {
  const {
    backPress,
    shadow,
    hideBackArrow,
    showPowerIcon,
    showLogo,
    filledLogo,
    navigation,
  } = props;
  return (
    <>
      <View
        style={{
          backgroundColor: filledLogo ? Colors.WHITE : Colors.THEMECOLOR,
          ...styles.container,
        }}
      >
        {!hideBackArrow ? (
          <TouchableOpacity
            style={{
              paddingVertical: 6.5,
              paddingRight: 7.5,
            }}
            onPress={backPress}
          >
            {filledLogo ? <BackArrowDark /> : <BackArrow />}
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {showLogo ? (
          filledLogo ? (
            <AppLogoFilled />
          ) : (
            <AppLogo />
          )
        ) : (
          <Text
            style={{
              ...styles.centerText,
              fontSize: props.questions ? RFValue(14) : RFValue(16),
              fontWeight: props.questions ? "600" : "700",
            }}
          >
            {props.title ? props.title : "Logo"}
          </Text>
        )}
        {showPowerIcon ? (
          <TouchableOpacity onPress={() => LogoutFunction(navigation)}>
            <PowerIcon />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
      {true && (
        <View
          style={[styles.shadow, { height: Platform.OS == "ios" ? 2 : 0.3 }]}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: heightPercentageToDP(2),
    paddingHorizontal: widthPercentageToDP(6),
  },
  centerText: {
    color: Colors.DARK_TEXT_COLOR,
    fontWeight: "700",
    fontSize: 24,
  },
  shadow: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    width: "100%",
    marginTop:1,
  },
});

export default Header;
