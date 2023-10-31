import React, { useState, useEffect, useContext } from "react";
import { Image, Linking, Platform, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Fonts from "../Constants/fonts";
import Colors from "../Constants/Colors";
import Utilities from "../utils/UtilityMethods";
import FontSize from "../Constants/FontSize";

import { useTranslation } from "react-i18next";

import { Update } from "../assets";
import Footer from "./ProductsAndServices/components/Footer";
import { hp, wp } from "../utils/responsiveSizes";

const ForceUpdate = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.paymentContainer}>
        <View style={{ height: "70%", justifyContent: "center" }}>
          <Image
            source={Update}
            style={{ resizeMode: "contain", width: wp(200), height: hp(200) }}
          />
        </View>
        <View style={{ height: "20%" }}>
          <Text style={styles.title}>{t("pleaseUpdateGorex")}</Text>
          <Text style={styles.description}>
            {`${t("updateText1")} \n ${t("updateText2")} \n ${t(
              "updateText3"
            )}`}
          </Text>
        </View>
      </View>

      <View style={{ justifyContent: "flex-end" }}>
        <Footer
          title={t("updateApp")}
          onPress={() => {
            if (Platform.OS === "ios") {
              Linking.openURL(
                "https://apps.apple.com/us/app/gorex-customer/id1633313842"
              );
            } else {
              // Android Link
              Linking.openURL(
                "https://play.google.com/store/apps/details?id=com.gorexcustomer"
              );
            }
          }}
        />
      </View>
    </View>
  );
};

export { ForceUpdate };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },

  paymentContainer: {
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1,
  },

  title: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs30,
    color: Colors.BLACK,
    fontWeight: "bold",
  },

  description: {
    fontFamily: Fonts.LexendRegular,
    ...FontSize.rfs18,
    color: Colors.GREY_TEXT,
    textAlign: "center",
    marginTop: Utilities.hp(1),
  },
});
