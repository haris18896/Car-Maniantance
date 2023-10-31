import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation, CommonActions } from "@react-navigation/native";

import { Forward } from "../../assets";
import Colors from "../../Constants/Colors";
import { showToast } from "../../utils/common";
import FontSize from "../../Constants/FontSize";
import FontFamily from "../../Constants/FontFamily";
import { hp, wp } from "../../utils/responsiveSizes";
import GeneralAPIWithEndPoint from "../../api/GeneralAPIWithEndPoint";

import Loader from "../../Components/Loader";
import Header from "../../Components/Header/BackHeader";
import BottomButton from "../../Components/Buttons/BottomButton";
import InputWithLabel from "../../Components/Inputs/InputWithLabel";
import Utilities from "../../utils/UtilityMethods";
import Footer from "../ProductsAndServices/components/Footer";
import analytics from "@react-native-firebase/analytics";

const ResetPassword = ({ route }) => {
  const phone = route?.params?.phone;

  const { t } = useTranslation();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "reset_password_screen",
    });
  }, []);

  const resetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      showToast(
        "Error!",
        "New password and confirm password does not match",
        "error"
      );
    } else {
      setLoading(true);
      const body = {
        phone_number: phone,
        new_password: newPassword,
        confirm_password: confirmNewPassword,
      };
      const resetPasswordResponse = await GeneralAPIWithEndPoint(
        "/reset/password",
        body
      );
      setLoading(false);
      showToast("Success", resetPasswordResponse, "success");
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      navigation.dispatch(resetAction);
    }
  };

  return (
    <View style={styles.screen}>
      <Header title={t("auth.ResetPassword")} />

      <View style={styles.contentContainer}>
        <View style={{ height: hp(98) }} />
        <Text style={styles.heading}>{t("auth.newPassword")}</Text>
        <View style={{ height: hp(8) }} />
        <Text style={styles.subHeading}>{t("auth.newpassworddifferent")}</Text>
        <View style={{ height: hp(32) }} />

        <InputWithLabel
          type="password"
          label={t("resetPassword.newPassword")}
          value={newPassword}
          setValue={setNewPassword}
          placeholder={t("resetPassword.newPasswordPlaceholder")}
        />

        <View style={{ height: hp(20) }} />

        <InputWithLabel
          type="password"
          label={t("resetPassword.confirmNewPassword")}
          value={confirmNewPassword}
          setValue={setConfirmNewPassword}
          placeholder={t("resetPassword.confirmNewPasswordPlaceholder")}
        />
      </View>

      <Footer
        title={t("auth.ResetPassword")}
        disabled={!newPassword || !confirmNewPassword}
        onPress={resetPassword}
      />

      <Loader visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(20),
  },
  heading: {
    ...FontSize.rfs24,
    ...FontFamily.bold,
    color: Colors.BLACK,
    alignSelf: "flex-start",
  },
  subHeading: {
    ...FontSize.rfs14,
    ...FontFamily.medium,
    color: Colors.BLACK,

    marginTop: hp(3),
    alignSelf: "flex-start",
  },
});

export default ResetPassword;
