import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  Linking,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Colors from "../Constants/Colors";
import Fonts from "../Constants/fonts";
import { hp, wp } from "../utils/responsiveSizes";
import BackHeaderSupport from "../Components/Header/BackHeaderSupport";
import { ChatUs, EmailUs, MenuBlack } from "../assets";
import Utilities from "../utils/UtilityMethods";
import { useTranslation } from "react-i18next";
import FontSize from "../Constants/FontSize";
import { CommonContext } from "../contexts/ContextProvider";
import analytics from "@react-native-firebase/analytics";

const GorexSupport = ({ route, navigation }) => {
  const { t } = useTranslation();
  const order = route?.params?.order ? route?.params?.order : null;
  const check = route?.params?.check;
  const { setOnDemandOrder } = useContext(CommonContext);

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "gorex_support_screen",
    });

  }, []);

  useEffect(() => {
    if (check === false) {
      setOnDemandOrder({});
    }
  }, [check]);

  const whatsAppText = order
    ? `Support Required for Order: ${order.sequence_no}`
    : ``;
  const emailSubject = order
    ? `Support Required for Order: ${order.sequence_no}`
    : `Support`;

  return (
    <View style={styles.container}>
      <BackHeaderSupport
        leftPress={() => navigation.openDrawer()}
        title={t("support.gorexsupport")}
        leftIcon={true}
      >
        <View style={{ marginTop: Utilities.hp(3) }}>
          <Text
            style={{
              ...FontSize.rfs20,
              color: Colors.BLACK,
              fontFamily: Fonts.LexendBold,
              alignSelf: "center",
            }}
          >
            {t("support.help")}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(
              `whatsapp://send?phone=+966553773570&text= ${whatsAppText}`
            )
              .then((res) => {})
              .catch((err) => {
                Alert.alert(t("common.alert"), t("support.whatsapp"), [
                  { text: t("common.OK") },
                ]);
              });
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: Colors.ORANGE,
              width: Utilities.wp(85),
              paddingVertical: 13,
              textAlign: "center",
              alignSelf: "center",
              marginTop: Utilities.hp(3),
              borderRadius: wp(10),
            }}
          >
            <Image
              style={{
                width: 50,
                height: 50,
                marginLeft: 10,
                resizeMode: "contain",
                alignItems: "flex-start",
              }}
              source={ChatUs}
            />
            <Text
              style={{
                textAlign: "left",
                alignSelf: "center",
                alignItems: "center",
                marginLeft: 20,
                fontFamily: Fonts.PoppinsMedium,
                ...FontSize.rfs15,
                color: Colors.BLACK,
              }}
            >
              {t("support.chat")}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(
              `mailto:contact@gorex.ai?subject=${emailSubject}`
            ).then();
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: Colors.ORANGE,
              width: Utilities.wp(85),
              paddingVertical: 13,
              textAlign: "center",
              alignSelf: "center",
              marginTop: Utilities.hp(3),
              borderRadius: wp(10),
            }}
          >
            <Image
              source={EmailUs}
              style={{
                width: 50,
                height: 50,
                marginLeft: 10,
                resizeMode: "contain",
              }}
            />
            <Text
              style={{
                textAlign: "left",
                alignSelf: "center",
                ...FontSize.rfs15,
                alignItems: "center",
                marginLeft: 20,
                fontFamily: Fonts.PoppinsMedium,
                color: Colors.BLACK,
              }}
            >
              {t("support.email")}
            </Text>
          </View>
        </TouchableOpacity>
      </BackHeaderSupport>
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
    // resizeMode: 'contain',
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

export default GorexSupport;
