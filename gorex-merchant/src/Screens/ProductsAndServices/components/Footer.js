import React from "react";
import { Text, StyleSheet, TouchableOpacity, Image } from "react-native";

import { useTranslation } from "react-i18next";

import Colors from "../../../Constants/Colors";
import FontSize from "../../../Constants/FontSize";
import { ArrowArabic, Next } from "../../../assets";
import {hp, wp} from "../../../utils/responsiveSizes";
import FontFamily from "../../../Constants/FontFamily";

const Footer = ({title, onPress, disabled, buttonStyle, rightTitle=''}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  let buttonBackgroundColor = Colors.DARKERGREEN;
  if(buttonStyle){
    buttonBackgroundColor = buttonStyle.backgroundColor;
  }
  if (disabled){
    buttonBackgroundColor = Colors.GREY;
  }

  return (
      <TouchableOpacity disabled={disabled} onPress={onPress}
                        style={[styles.container, buttonStyle, {backgroundColor: buttonBackgroundColor}]}>

        <Text  style={[styles.title]}>{title}</Text>
        {rightTitle.length>0? <Text  style={[styles.title]}>{rightTitle}</Text> : <Image style={styles.icon} source={isRTL ? ArrowArabic : Next}/>
        }

      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingTop: hp(17),
    paddingBottom: hp(48),
    paddingHorizontal: wp(20),
  },
  title: {
    ...FontSize.rfs22,
    ...FontFamily.medium,
    color: Colors.WHITE,
  },
  icon: {
    width: hp(12),
    height: hp(18),
    resizeMode:'contain',
  },
});

export default Footer;
