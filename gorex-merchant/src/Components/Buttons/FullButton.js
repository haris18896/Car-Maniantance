//import liraries
import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import { hp, wp } from "../../utils/responsiveSizes";
import Utilities from "../../utils/UtilityMethods";

// create a component
const FullButton = ({ title, onPress, disabled, type, style }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{
        ...(disabled
          ? styles.disabled
          : type === "cancel"
          ? styles.cancelContainer
          : styles.container),
        ...style,
      }}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Colors.DARKERGREEN,
    borderRadius: hp(100),
    height: Utilities.wp(13),
    justifyContent: "center",
    width: wp(330),
    alignSelf: "center",
  },

  cancelContainer: {
    alignItems: "center",
    backgroundColor: Colors.LIGHT_RED,
    borderRadius: hp(100),
    height: hp(56),
    justifyContent: "center",
    width: wp(330),
    alignSelf: "center",
  },
  title: {
    color: Colors.WHITE,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs18,
  },
  disabled: {
    alignItems: "center",
    backgroundColor: Colors.GREY,
    borderRadius: hp(100),
    height: hp(56),
    justifyContent: "center",
    width: wp(330),
    alignSelf: "center",
  },
});

//make this component available to the app
export default FullButton;
