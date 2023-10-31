//import liraries
import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import { hp, wp } from "../../utils/responsiveSizes";

// create a component
const MediumButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Colors.GREEN,
    borderRadius: hp(100),
    height: hp(56),
    justifyContent: "center",
    width: wp(231),
    alignSelf: "center",
  },
  title: {
    textTransform: "uppercase",
    fontFamily: Fonts.SFProDisplaySemiBold,
    textAlign: "left",
    ...FontSize.rfs20,
  },
});

//make this component available to the app
export default MediumButton;
