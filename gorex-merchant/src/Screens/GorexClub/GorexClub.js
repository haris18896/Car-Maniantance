import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

import { useTranslation } from "react-i18next";

import { Cross } from "../../assets";
import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import Utilities from "../../utils/UtilityMethods";
import HeaderGorexClub from "../../Components/Header/HeaderGorexClub";
import { hp, wp } from "../../utils/responsiveSizes";
import FooterGorex from "../ProductsAndServices/components/FooterGorex";
import analytics from "@react-native-firebase/analytics";

const GorexClub = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "gorex_club_screen",
    });
  }, []);

  return (
    <View style={styles.container}>
      <HeaderGorexClub leftIcon={Cross} style={{ width: Utilities.wp(1) }}>
        <View
          style={{ marginHorizontal: wp(20), paddingVertical: Utilities.hp(2) }}
        >
          <Text
            style={{
              ...FontSize.rfs24,
              color: Colors.BLACK,
              fontFamily: Fonts.LexendBold,
              alignSelf: "flex-start",
            }}
          >
            {t("gorexclub.experience")}
          </Text>
          <Text
            style={{
              ...FontSize.rfs14,
              color: Colors.GREY,
              fontFamily: Fonts.LexendMedium,
              alignSelf: "flex-start",
              textAlign: "left",
              marginTop: Utilities.hp(3),
            }}
          >
            {t("gorexclub.member")}
          </Text>

          <Text
            style={{
              ...FontSize.rfs14,
              color: Colors.GREY,
              fontFamily: Fonts.LexendMedium,
              alignSelf: "flex-start",
              textAlign: "justify",
              marginTop: Utilities.hp(2),
            }}
          >
            {t("gorexclub.miss")}
          </Text>
          <Text
            style={{
              ...FontSize.rfs14,
              color: Colors.BLACK,
              fontFamily: Fonts.LexendMedium,
              alignSelf: "flex-start",
              textAlign: "justify",
              marginTop: Utilities.hp(1),
            }}
          >
            {t("gorexclub.join")}
          </Text>
        </View>
      </HeaderGorexClub>

      <FooterGorex
        backgroundColor={Colors.ORANGE}
        title={t("gorexclub.btnjoin")}
        onPress={() => {
          {
            navigation.navigate("GorexCards");
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  paddedContent: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  paymentTitle: {
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs15,
    color: Colors.BLACK_OPAC,
    fontWeight: "bold",
  },
  price: {
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs56,
    color: Colors.BLACK,
    fontWeight: "bold",
    marginTop: hp(5),
  },
  card: {
    height: hp(233),
    width: wp(348),
    backgroundColor: Colors.WHITE,
    marginTop: hp(25),
    borderRadius: hp(12),
    padding: hp(13),
    justifyContent: "space-around",
    margin: 4,
    elevation: 2,
    shadowColor: "#C7CCD1",
  },
  icon: {
    width: hp(60),
    height: hp(60),
    resizeMode: "contain",
  },
  transactionCards: {
    height: "90%",
    width: wp(330),
    marginTop: 20,
    borderRadius: wp(20),
    marginRight: wp(10),
    justifyContent: "space-between",
  },
  transactionCard: {
    width: wp(330),
    borderRadius: wp(10),
    marginTop: 10,
    flexDirection: "row",
    padding: hp(20),
    elevation: 1,
    margin: 4,
    shadowColor: "#C7CCD1",
  },
  orderNumber: {
    fontFamily: Fonts.LexendBold,
    fontWeight: "bold",
    marginTop: 10,
    ...FontSize.rfs20,
    color: Colors.BLACK,
  },
  description: {
    fontFamily: Fonts.LexendRegular,
    marginTop: 10,
    ...FontSize.rfs18,
    color: Colors.BLACK,
  },
  wallet: {
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs11,
    color: Colors.BLACK_OPAC,
    marginTop: hp(11),
  },
  transaction: {
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs16,
    color: Colors.DARKERGREEN,
  },
  plus: {
    width: hp(47),
    height: hp(47),
  },
  time: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs11,
    color: Colors.BLACK_OPAC,
    marginTop: hp(11),
  },
  rightView: {
    justifyContent: "center",
    alignItems: "center",
  },
  plusButton: {
    height: hp(40),
    width: hp(40),
    borderRadius: 7,
    backgroundColor: Colors.LIGHT_BLUE,
    position: "absolute",
    bottom: hp(20),
    right: hp(20),
    justifyContent: "center",
    alignItems: "center",
  },
  xText: {
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    color: Colors.GREY_PLACEHOLDER,
  },
  nText: {
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    color: Colors.BLACK,
  },
  cardHeading: {
    ...FontSize.rfs10,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    color: Colors.BLACK,
  },
  cardValue: {
    ...FontSize.rfs13,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    color: Colors.BLACK,
  },
  numberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: hp(12),
  },
  holderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: hp(12),
  },
  allTransaction: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs15,
    color: Colors.BLACK,
    margin: 10,
  },
  image: {
    width: wp(300),
    height: wp(200),
    alignItems: "center",
    margin: wp(5),

    backgroundColor: Colors.RED,
  },
  images: {
    width: "100%",
    height: "100%",
    borderRadius: wp(10),
    resizeMode: "cover",
  },
});

export default GorexClub;
