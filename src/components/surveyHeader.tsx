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
import Colors from "../common/colors";
import { RFValue } from "react-native-responsive-fontsize";



const SurveyHeader = (props: any) => {
  const {
    filledLogo,
    closePress
  } = props;
  return (
    <>
      <View
        style={{
          backgroundColor: filledLogo ? Colors.WHITE : Colors.THEMECOLOR,
          ...styles.container,
        }}
      >
        <View style={styles.closeBtn} >
        <TouchableOpacity
        onPress={closePress}>
          <Text style={{color:Colors.DARK_TEXT_COLOR, fontWeight:"bold"}}>Close</Text>
        </TouchableOpacity>
        </View>

          <View style={{flex:1, alignItems:"center"}}>
            <Text
              style={{
                ...styles.centerText,
                fontSize: props.questions ? RFValue(14) : RFValue(16),
                fontWeight: props.questions ? "600" : "700",
              }}
            >
              {/* {props.title ? props.title : "Logo"} */}
              {props.title}
            </Text>
          </View>
      </View>
        <View
          style={[styles.shadow, { height: Platform.OS == "ios" ? 2 : 0.3 }]}
        />
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
  },
  closeBtn:{
    position: 'absolute', 
    zIndex:1, 
    paddingRight:20, 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'flex-end'
  }
});

export default SurveyHeader;
