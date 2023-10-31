
import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import FontFamily from "../../Constants/FontFamily";
import { hp, wp } from "../../utils/responsiveSizes";

const CouponButton = ({ disabled, title, onPress, backgroundColor, style }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={{...styles.container, backgroundColor: disabled ? Colors.LIGHT_GREY : backgroundColor ? backgroundColor : Colors.LIGHT_GREEN,}}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(38),
    borderRadius: hp(19),
    paddingHorizontal: wp(22),

    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.LIGHT_GREEN,
  },
  title: {
    ...FontSize.rfs14,
    ...FontFamily.medium,
    color: Colors.DARKERGREEN,
    textTransform: "uppercase",
  },
});

export default CouponButton;
