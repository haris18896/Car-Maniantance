//import liraries
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { ArrowArabic } from "../../assets";

import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import Utilities from "../../utils/UtilityMethods";
import { hp, wp } from "../../utils/responsiveSizes";

// create a component
const BottomButton = ({ title, onPress, disabled, type, icon }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      //   style={disabled ? styles.disabled : type === 'cancel' ? styles.cancelContainer : styles.container}
      style={[
        styles.bottomButtonContainer,
        disabled
          ? styles.disabled
          : type === "cancel"
          ? styles.cancelContainer
          : styles.container,
      ]}
    >
      <View style={styles.bottomTextContainer}>
        <Text style={styles.title}>{title}</Text>

        <Image
          resizeMode="contain"
          style={styles.icon}
          source={isRTL ? ArrowArabic : icon}
        />
      </View>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  bottomButtonContainer: {
    paddingVertical: Utilities.hp(2),
  },
  container: {
    backgroundColor: Colors.DARKERGREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelContainer: {
    backgroundColor: Colors.LIGHT_RED,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    backgroundColor: Colors.GREY,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: Colors.WHITE,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs24,
    // paddingBottom: Utilities.wp(2),
  },
  bottomTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    paddingVertical: 2,
  },
  icon: {
    height: Utilities.hp(2.5),
  },
});

//make this component available to the app
export default BottomButton;
