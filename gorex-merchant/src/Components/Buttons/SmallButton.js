//import liraries
import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import { hp, wp } from "../../utils/responsiveSizes";
import Utilities from "../../utils/UtilityMethods";

// create a component
const SmallButton = ({ title, onPress, backgroundColor, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.container,
        backgroundColor: backgroundColor ? backgroundColor : Colors.LIGHT_GREEN,
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
    backgroundColor: Colors.LIGHT_GREEN,
    borderRadius: hp(100),
    alignSelf: "center",
    justifyContent: "center",
    width: Utilities.wp(38),
    height: Utilities.hp(6),
    marginBottom: Utilities.hp(4),
  },
  containerApply: {
    alignItems: "center",
    backgroundColor: Colors.DARKERGREEN,
    borderRadius: hp(100),
    alignSelf: "center",
    justifyContent: "center",
    width: Utilities.wp(38),
    height: Utilities.hp(6),
    marginBottom: Utilities.hp(4),
  },
  title: {
    textTransform: "uppercase",
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    color: Colors.WHITE,
    ...FontSize.rfs16,
  },
});

//make this component available to the app
export default SmallButton;
