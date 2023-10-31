import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { AppLogo, WhiteGreenMenu } from "../../assets";

import { hp, wp } from "../../utils/responsiveSizes";
import Utilities from "../../utils/UtilityMethods";
import { useTranslation } from "react-i18next";

const HomeHeader = ({ onPress }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <LinearGradient
      colors={[
        "rgba(0,0,0,1)",
        "rgba(0,0,0,0.7)",
        "rgba(0,0,0,0.6)",
        "rgba(0,0,0,0.5)",
        "rgba(0,0,0,0.4)",
        "rgba(0,0,0,0.3)",
        "rgba(0,0,0,0.2)",
        "rgba(0,0,0,0.1)",
        "rgba(0,0,0,0.0)",
      ]}
      style={styles.container}
    >
      <TouchableOpacity onPress={onPress} style={styles.menuButton}>
        <WhiteGreenMenu
          width={wp(34.4)}
          height={hp(20.3)}
          style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
        />
      </TouchableOpacity>
      <AppLogo height={hp(40)} width={wp(150)} />
      <View style={styles.placeholder} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",

    width: "100%",
    height: hp(
      Utilities.isIosDevice() && Utilities.hasNotch() ? Utilities.hp(18) : 90
    ),
    flexDirection: "row",
    paddingHorizontal: 9,
  },
  logo: {
    width: 120,
    resizeMode: "contain",
    height: hp(50),
  },
  menuButton: {
    height: wp(50),
    width: wp(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(20),
  },
  menu: {
    height: hp(20),
    width: wp(20),
  },
  placeholder: {
    width: wp(40),
  },
});

export default HomeHeader;
