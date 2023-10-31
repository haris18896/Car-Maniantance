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

const GoTrackHeader = ({
  leftIcon,
  leftPress,
  title,
  rightIcon,
  rightTitle,
  RightPress,
  noDivider,
  noTitle,
  bgColor,
  iconTitle,
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
    console.log("icon, ", rightIcon, "title : ", rightTitle);
    if (rightTitle && rightIcon) {
      <View style={styles.rightWrapper}>
        <Image style={[styles.navigationButtonIcon(true)]} source={rightIcon} />

        <Text
          style={
            rightTitle === "Cancel"
              ? styles.titleCancel
              : styles.rightTitle(rightTextColor)
          }
        >
          {rightTitle}
        </Text>
      </View>;
    } else if (rightTitle) {
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
    <SafeAreaView style={styles.fullNavigationContainer(bgColor)}>
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
  fullNavigationContainer: (bgColor) => {
    return {
      justifyContent: "flex-end",
      backgroundColor: bgColor ? bgColor : Colors.WHITE,
    };
  },
  navigationBar: {
    flexDirection: "row",
    maxWidth: "100%",
    marginHorizontal: wp(20),
  },
  rightWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  leftView: {
    width: "25%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  centerView: {
    width: "50%",
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
    marginLeft: wp(10),
  },
  rightView: {
    width: "30%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  rightTitle: (rightTextColor) => {
    return {
      color: rightTextColor ? Colors.DARKERGREEN : Colors.BLACK,
      fontFamily: Fonts.GloryBold,
      ...FontSize.rfs18,
      marginLeft: wp(10),
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

export default GoTrackHeader;
