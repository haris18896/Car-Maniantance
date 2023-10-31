import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import BackHeader from "../../Components/Header/BackHeader";
import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import { hp, wp } from "../../utils/responsiveSizes";

import { useTranslation } from "react-i18next";
import Footer from "../ProductsAndServices/components/Footer";
import { CardSuccess } from "../../assets";
import Utilities from "../../utils/UtilityMethods";
import FontSize from "../../Constants/FontSize";

// create a component
const SuccessCard = () => {
  const [active, setActive] = useState(1);
  const [wallet, setWallet] = useState();
  const [walletHistory, setWalletHistory] = useState();
  const user = useSelector((state) => state.auth.user);

  const navigation = useNavigation();
  const { t } = useTranslation();
  const focus = useIsFocused();
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <BackHeader title={"Add Credit Card"} />

      <View style={styles.paddedContent}>
        <View style={styles.paymentContainer}>
          <Image source={CardSuccess} style={{resizeMode: "contain", width: Utilities.wp(40), marginBottom: Utilities.hp(2), marginLeft: Utilities.wp(2),}}/>
          <Text style={styles.price}>Success!</Text>
          <Text style={styles.paymentTitle}>You have successfully added {"\n"}a new credit card.</Text>
        </View>

        <Footer title={t("common.done")} onPress={() => navigation.navigate("PaymentHistory")}/>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  paymentTitle: {
    fontFamily: Fonts.LexendRegular,
    ...FontSize.rfs14,
    color: Colors.GREY_TEXT,
    textAlign: "center",
    marginTop: Utilities.hp(1),
  },
  container2: {
    alignItems: "center",
    flex: 1,
    // alignSelf: "center",
    justifyContent: "center",
  },
  paddedContent: {
    paddingHorizontal: wp(14),
    flex: 1,
    backgroundColor: Colors.WHITE,
    justifyContent: "center",

    alignItems: "center",
  },
  paymentContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",

    marginBottom: Utilities.hp(10),
  },
  price: {
    fontFamily: Fonts.LexendBold,
    textAlign: "center",
    alignSelf: "center",
    ...FontSize.rfs24,
    color: Colors.BLACK,
    fontWeight: "bold",
    marginTop: hp(7),
  },

  icon: {
    width: hp(60),
    height: hp(60),
    resizeMode: "contain",
  },

  wallet: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs11,
    color: Colors.BLACK_OPAC,
    marginTop: hp(11),
  },
  transaction: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs16,
    color: Colors.DARKERGREEN,
  },
  plus: {
    width: hp(47),
    height: hp(47),
  },
  time: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
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
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    color: Colors.GREY_PLACEHOLDER,
  },
  nText: {
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendRegular,
    textAlign: "left",
    color: Colors.BLACK,
  },
  cardHeading: {
    ...FontSize.rfs10,
    fontFamily: Fonts.LexendMedium,
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
    fontFamily: Fonts.SFProDisplaySemiBold,
    ...FontSize.rfs15,
    color: Colors.BLACK,
    margin: 10,
  },
  item: {
    height: hp(160),
    resizeMode: "contain",
    width: wp(105),
    marginTop: hp(60),
  },
  text: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendMedium,
    textAlign: "center",
    ...FontSize.rfs24,
    marginTop: hp(5),
  },
  title2: {
    color: "#B8B9C1",
    width: "70%",
    fontFamily: Fonts.LexendMedium,
    textAlign: "center",
    ...FontSize.rfs16,
    marginTop: hp(10),
  },
});

//make this component available to the app
export default SuccessCard;
