//import liraries
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Image, Text } from "react-native";
import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import { hp, wp } from "../../utils/responsiveSizes";
import LinearGradient from "react-native-linear-gradient";

// create a component
const LinearGradientComp = ({ children, style }) => {
  return (
    <LinearGradient
      colors={[Colors.DARK_BLACK, Colors.BOTTOM_COLOR]}
      style={{ flex: 1, ...style }}
    >
      {children}
    </LinearGradient>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    // backgroundColor: Colors.BLUE,
    flex: 1,
    justifyContent: "space-around",
  },

  fristrow: {
    width: "100%",
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  onlymargin: {
    margin: 5,
  },

  logo: {
    marginTop: hp(100),
    resizeMode: "contain",
    width: wp(234),
  },
});

//make this component available to the app
export default LinearGradientComp;
