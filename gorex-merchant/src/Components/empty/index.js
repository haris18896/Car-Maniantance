import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";

import { useTranslation } from "react-i18next";
import { wp, hp } from "../../utils/responsiveSizes";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import Colors from "../../Constants/Colors";
import { Empty } from "../../assets";

function EmptyList() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  return (
    <View style={styles.container}>
      <Image transitionDuration={1000} source={Empty} style={styles.item} />
      <Text style={styles.text}>{t("orderHistoryEmpty.nothingShow")}</Text>
    </View>
  );
}

export default EmptyList;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  item: {
    height: hp(160),
    resizeMode: "contain",
    width: wp(105),
  },
  text: {
    color: Colors.BLACK,
    textAlign: "left",
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs20,
    marginTop: hp(10),
  },
});
