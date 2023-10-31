import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Keyboard,
} from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import { Forward } from "../../assets";
import Colors from "../../Constants/Colors";
import { KSA } from "../../Constants/country";
import FontSize from "../../Constants/FontSize";
import Utilities from "../../utils/UtilityMethods";
import FontFamily from "../../Constants/FontFamily";
import { hp, wp } from "../../utils/responsiveSizes";
import GeneralAPIWithEndPoint from "../../api/GeneralAPIWithEndPoint";

import Loader from "../../Components/Loader";
import Header from "../../Components/Header/BackHeader";
import BottomButton from "../../Components/Buttons/BottomButton";
import InputWithLabel from "../../Components/Inputs/InputWithLabel";
import Footer from "../ProductsAndServices/components/Footer";
import analytics from "@react-native-firebase/analytics";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [country, setCountry] = useState(KSA);
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "forgot_password_screen",
    });
  }, []);

  const onChangeText = (fieldName) => {
    setIsValidPhoneNumber(true);
  };

  const sendPassword = async () => {
    setLoading(true);
    const body = {
      phone_number: `${country?.countryCode}${mobileNumber}`,
    };
    const forgotPasswordResponse = await GeneralAPIWithEndPoint(
      "/generate/api/otp",
      body
    );
    setLoading(false);
    Alert.alert("OTP Sent", forgotPasswordResponse, [
      {
        text: "OK",
        onPress: () =>
          navigation.navigate("OTP", { phone: body?.phone_number }),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title={t("auth.Forgot Password")} navigate={navigation} />

      <View style={styles.forgotContainer}>
        <Text style={styles.heading}>{t("auth.ResetPassword")}</Text>
        <Text style={styles.subHeading}>{t("auth.account")}</Text>
      </View>

      <View style={{ height: hp(36) }} />

      <TouchableOpacity
        activeOpacity={1}
        style={styles.inputFieldWrapper}
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <InputWithLabel
          type="mobile"
          label={t("forgotPassword.mobileNumber")}
          name="mobileNumber"
          value={mobileNumber}
          setValue={setMobileNumber}
          onChangeText={onChangeText}
          country={country}
          setCountry={setCountry}
          keyboardType="number-pad"
          error={!isValidPhoneNumber}
          placeholder={t("forgotPassword.mobileNumberPlaceholder")}
        />
      </TouchableOpacity>

      <Footer
        title={t("auth.ResetPassword")}
        onPress={() => {
          if (Utilities.isPhoneNumberValid(mobileNumber)) {
            sendPassword().then();
          } else {
            setIsValidPhoneNumber(false);
          }
        }}
      />
      <Loader visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  inputFieldWrapper: {
    flex: 1,
    paddingHorizontal: wp(20),
  },
  forgotContainer: {
    marginTop: wp(98),
    paddingHorizontal: wp(20),
  },
  heading: {
    ...FontSize.rfs30,
    ...FontFamily.bold,
    color: Colors.BLACK,
    alignSelf: "flex-start",
  },
  subHeading: {
    ...FontSize.rfs14,
    ...FontFamily.semiBold,
    color: Colors.BLACK,

    marginTop: hp(3),
    alignSelf: "flex-start",
  },
});

export default ForgotPassword;
