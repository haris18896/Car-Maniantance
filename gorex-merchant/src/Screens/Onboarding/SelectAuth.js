import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { AppLogo } from "../../assets";
import LinearGradientComp from "../../Components/Background/LinearGradientComp";
import CustomBottomSheet from "../../Components/BottomSheet/CustomBottomSheet";
import FullButton from "../../Components/Buttons/FullButton";
import CustomCheckBox from "../../Components/Inputs/CheckBoxCustom";
import CountryPickerInput from "../../Components/Inputs/CountryPicker";
import LanguagePickerInput from "../../Components/Inputs/LanguagePickerInput";
import Colors from "../../Constants/Colors";
import { KSA, PK } from "../../Constants/country";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import { hp, wp } from "../../utils/responsiveSizes";
import Utilities from "../../utils/UtilityMethods";

// create a component
const SelectAuth = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <LinearGradientComp>
      <View style={styles.container}>
        <View style={styles.LogoContainer}>
          <AppLogo height={hp(50)} width={wp(200)} />
        </View>

        <View style={styles.pickers}>
          <CountryPickerInput />
          <View style={{ marginBottom: Utilities.wp(3) }} />
          <LanguagePickerInput />
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.signInContainer}>
            <LinearGradient
              colors={["#26195B", "#281B60"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.signInGradient}
            >
              <Text style={styles.signInText}>Sign in as</Text>
            </LinearGradient>
          </View>

          <View style={styles.corporateContainer}>
            <FullButton
              onPress={() => navigation.navigate("Login", { customer: true })}
              title={t("onboarding.Customer")}
            />
          </View>
          <View style={styles.corporateContainer}>
            <FullButton
              onPress={() => navigation.navigate("Login", { customer: false })}
              title={t("onboarding.CorporateUser")}
            />
          </View>

          <View style={styles.signUpButton}>
            <Text style={styles.signUpText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.singUpLink}>Sign up here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradientComp>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "space-around",
  },

  logo: {
    resizeMode: "contain",
    width: Utilities.wp(40),
    marginTop: Utilities.hp(1),
  },

  singUpText: {
    color: Colors.WHITE,
    fontFamily: Fonts.LexendBold,
    textAlign: "center",
    ...FontSize.rfs16,
    letterSpacing: 2,
    marginTop: hp(20),
  },

  signInContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "70%",
    marginBottom: hp(22),
    borderBottomColor: Colors.DARKERGREEN,
    borderBottomWidth: 1,
    position: "relative",
  },
  signInGradient: {
    height: 30,
    width: "50%",
    position: "absolute",
    bottom: -14,
    left: "25%",
  },
  signInText: {
    color: "#fff",
    fontFamily: Fonts.LexendMedium,
    textAlign: "center",
    ...FontSize.rfs18,
    paddingVertical: 3,
  },

  signUpButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: hp(35),
  },
  signUpText: {
    color: Colors.WHITE,
    fontFamily: Fonts.LexendMedium,
    textAlign: "center",
    ...FontSize.rfs14,
    marginTop: hp(20),
  },
  singUpLink: {
    color: Colors.DARKERGREEN,
    fontFamily: Fonts.LexendMedium,
    textAlign: "center",
    ...FontSize.rfs14,

    marginTop: hp(5),
    textDecorationLine: "underline",
  },
  buttonContainer: {
    width: "90%",
  },
  corporateContainer: {
    marginTop: Utilities.wp(2),
  },
  LogoContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: Utilities.hp(20),
    width: "100%",
    marginTop: Utilities.hp(8),
  },
});

//make this component available to the app
export default SelectAuth;
