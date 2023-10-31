import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import { hp, wp } from "../../utils/responsiveSizes";
import Utilities from "../../utils/UtilityMethods";

const ButtonCustomer = ({
  title,
  onPress,
  disabled,
  type,
  style,
  width,
  height,
}) => {
  return (
    <TouchableOpacity
      // disabled={disabled}
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
      <Text
        style={{
          ...(disabled
            ? styles.disableTitle
            : type === "cancel"
            ? styles.disableTitle
            : styles.title),
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Colors.DARKERGREEN,
    borderRadius: hp(100),
    height: Utilities.wp(13),
    justifyContent: "center",
    width: Utilities.wp(40),
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
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs14,
    color: Colors.WHITE,
  },

  disabled: {
    alignItems: "center",
    backgroundColor: Colors.LIGHT_GREY,
    borderRadius: hp(100),
    height: Utilities.wp(13),
    justifyContent: "center",
    width: Utilities.wp(40),
    alignSelf: "center",
    color: Colors.LIGHT_GREY,
  },
  disableTitle: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs14,
    color: Colors.GREY_TEXT,
  },
});

export default ButtonCustomer;
