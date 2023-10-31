import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";

// ** Third Party Packages
import moment from "moment/moment";
import { useTranslation } from "react-i18next";

// ** Custom Components
import { CouponDel } from "../../assets";
import { showToast } from "../../utils/common";
import { hp, wp } from "../../utils/responsiveSizes";
import { CommonContext } from "../../contexts/ContextProvider";

import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import Utilities from "../../utils/UtilityMethods";
import BackHeader from "../../Components/Header/BackHeader";
import Footer from "../ProductsAndServices/components/Footer";
import CouponButton from "../../Components/Buttons/CouponButton";
import FontFamily from "../../Constants/FontFamily";
import { useNavigation } from "@react-navigation/native";
import ValidateOfferCoupon from "../../api/validationOfferCoupon";
import OfferCreateAPI from "../../api/offerCreateApi";
import Loader from "../../Components/Loader";

function OfferRedeem({ route }) {
  const { t, i18n } = useTranslation();
  const { title, banner, companyCode } = route?.params;

  const isRTL = i18n.language === "ar";
  const { userProfile } = useContext(CommonContext);
  const navigation = useNavigation();

  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidCoupon, setIsValidCoupon] = useState(false);
  const [offerCoupon, setOfferCoupon] = useState("");
  const onPressCouponDelete = () => {
    setCouponCode("");
    setIsValidCoupon(false);
  };

  const onPressCouponApply = () => {
    Keyboard.dismiss();

    if (couponCode.length <= 0) {
      showToast("Error", "Please enter coupon code", "error");
    } else {
      setLoading(true);
      ValidateOfferCoupon({
        driver_id: userProfile?.id,
        coupon: couponCode,
      }).then(({ success, response }) => {
        setLoading(true);
        if (parseInt(success) === 200) {
          setIsValidCoupon(true);
          setOfferCoupon(couponCode);
          navigation.navigate("GoDChooseVehicle", {
            offerTitle: title,
            offerCoupon: couponCode,
            offer: true,
          });
        } else if (parseInt(success) === 400) {
          setIsValidCoupon(false);
          showToast(t("errors.error"), response, "error");
        } else {
          setIsValidCoupon(false);
          showToast(
            t("errors.error"),
            t("placeOrder.coupon_error_message"),
            "error"
          );
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <BackHeader title={title} />

      <View
        style={{
          shadowColor: "#171717",
          shadowOffset: { width: 3, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={styles.image}
          source={{ uri: `data:image/gif;base64,${banner}` }}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.mainWrapper}>
          <Text style={styles.offerPromoDescription}>
            {companyCode
              ? t("offers.companyCodeOfferPromoDescription")
              : t("offers.offerPromoDescription")}
          </Text>

          <Text style={styles.promoCode}>
            {companyCode ? t("offers.companyCode") : t("offers.PromoCode")}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: hp(60),
              backgroundColor: Colors.GHOST_WHITE,
              borderRadius: hp(30),
              paddingLeft: wp(20),
              paddingRight: wp(10),
              marginBottom: wp(30),
            }}
          >
            <TextInput
              style={[
                styles.couponInput,
                { textAlign: isRTL ? "right" : "left" },
              ]}
              placeholder={t("placeOrder.enterCouponCode")}
              placeholderTextColor={Colors.LIGHTGREY}
              value={couponCode}
              onChangeText={(value) => setCouponCode(value)}
            />

            {isValidCoupon ? (
              <View style={{ flexDirection: "row", width: "10%" }}>
                <TouchableOpacity
                  style={{ width: "100%", justifyContent: "center" }}
                  onPress={() => {
                    onPressCouponDelete();
                  }}
                >
                  <Image
                    source={CouponDel}
                    style={[styles.del, { width: Utilities.wp(6) }]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <CouponButton
                title={t("placeOrder.apply")}
                onPress={() => onPressCouponApply()}
              />
            )}
          </View>

          {/*<Text style={styles.offerPromoDescription}>*/}
          {/*  {companyCode*/}
          {/*    ? t("offers.companyCodeDescription2")*/}
          {/*    : t("offers.description2")}*/}
          {/*</Text>*/}
          <Text style={styles.offerPromoDescription}>
            {companyCode
              ? t("offers.companyCodeDescription3")
              : t("offers.description3")}
          </Text>
        </View>
      </KeyboardAvoidingView>

      {/*<Footer*/}
      {/*  disabled={!isValidCoupon}*/}
      {/*  title={t("offers.confirm")}*/}
      {/*  onPress={() =>*/}
      {/*    navigation.navigate("GoDChooseVehicle", {*/}
      {/*      offerTitle: title,*/}
      {/*      offerCoupon,*/}
      {/*      offer: true,*/}
      {/*    })*/}
      {/*  }*/}
      {/*/>*/}
    </View>
  );
}

export default OfferRedeem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  mainWrapper: {
    // flex: 1,
    margin: wp(25),
  },
  offerPromoDescription: {
    fontFamily: Fonts.LexendRegular,
    ...FontSize.rfs18,
    color: Colors.BLACK,
    textAlign: "left",
    marginBottom: wp(30),
  },
  promoCode: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs24,
    color: Colors.BLACK,
    textAlign: "left",
    marginBottom: wp(20),
  },
  couponInput: {
    ...FontSize.rfs14,
    ...FontFamily.medium,
    color: Colors.DARKERGREEN,
    width: "75%",
  },
  image: {
    width: Utilities.wp(93),
    height: Utilities.hp(25),
    borderRadius: wp(10),
    resizeMode: "cover",
  },
});
