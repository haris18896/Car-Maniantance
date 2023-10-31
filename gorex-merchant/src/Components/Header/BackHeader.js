import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import FontFamily from "../../Constants/FontFamily";
import { hp, wp } from "../../utils/responsiveSizes";
import { AppLogo, Arrowar, Arrowen } from "../../assets";
import Divider from "../Divider";

const BackHeader = ({
  leftIcon,
  leftPress,
  title,
  rightIcon,
  rightTitle,
  RightPress,
  noDivider,
  noTitle,
  rightTextColor,
}) => {
  const navigation = useNavigation();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const getLeftIcon = () => {
    if (leftIcon) {
      return leftIcon;
    } else {
      return isRTL ? Arrowar : Arrowen;
    }
  };

  const getCenterViewForNavbar = () => {
    if (title) {
      return <Text style={styles.title}>{title}</Text>;
    } else {
      return <AppLogo height={hp(50)} width={wp(200)} />;
    }
  };

  const getRightViewForNavbar = () => {
    if (rightTitle) {
      return (
        <Text
          style={
            rightTitle === "Cancel"
              ? styles.titleCancel
              : styles.rightTitle(rightTextColor)
          }
        >
          {rightTitle}
        </Text>
      );
    } else {
      return (
        <Image style={[styles.navigationButtonIcon(true)]} source={rightIcon} />
      );
    }
  };

  return (
    <SafeAreaView style={styles.fullNavigationContainer}>
      <View
        style={{
          height:
            Platform.OS === "android"
              ? hp(53) - StatusBar.currentHeight
              : hp(7),
        }}
      />
      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={styles.leftView}
          onPress={leftPress ? leftPress : () => navigation.goBack()}
        >
          <Image
            style={styles.navigationButtonIcon(leftIcon, isRTL)}
            source={getLeftIcon()}
          />
        </TouchableOpacity>

        {!noTitle && (
          <View style={styles.centerView}>{getCenterViewForNavbar()}</View>
        )}

        <TouchableOpacity style={styles.rightView} onPress={RightPress}>
          {getRightViewForNavbar()}
        </TouchableOpacity>
      </View>
      <View style={{ height: hp(20) }} />
      {!noDivider && <Divider />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fullNavigationContainer: {
    justifyContent: "flex-end",
  },
  navigationBar: {
    flexDirection: "row",
    width: "100%",
  },
  leftView: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  centerView: {
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...FontSize.rfs20,
    ...FontFamily.bold,
    color: Colors.BLACK,
    textAlign: "center",
  },
  titleCancel: {
    color: Colors.ORANGE,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs16,
  },
  rightView: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  rightTitle: (rightTextColor) => {
    return {
      color: rightTextColor ? Colors.DARKERGREEN : Colors.BLACK,
      fontFamily: Fonts.GloryBold,
      ...FontSize.rfs18,
    };
  },
  navigationButtonIcon: (leftIcon, isRTL) => {
    return {
      width: leftIcon ? wp(24) : wp(12),
      height: leftIcon ? hp(26) : hp(18),
      resizeMode: "contain",
      scaleX: isRTL ? 1 : 1,
    };
  },
});

export default BackHeader;
