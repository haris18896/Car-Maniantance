import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";

import moment from "moment";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import styles from "./styles";
import { KSA } from "../../Constants/country";
import { showToast } from "../../utils/common";
import GeneralAPIAction from "../../api/GeneralAPIAction";

import Loader from "../../Components/Loader";
import Header from "../../Components/Header/BackHeader";
import Footer from "../ProductsAndServices/components/Footer";
import InputWithLabel from "../../Components/Inputs/InputWithLabel";

// ** Firebase Analytics
import analytics from "@react-native-firebase/analytics";
import { AppEventsLogger } from "react-native-fbsdk-next";

const Register = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [errorFields, setErrorFields] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [country, setCountry] = useState(KSA);
  const [emailAddress, setEmailAddress] = useState("");
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "sign_up_screen",
    });
  }, []);

  const onChangeText = (fieldName) => {
    setErrorFields(errorFields.filter((error) => error !== fieldName));
  };

  const isPasswordValidForCharacterLength = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z]).{8,}$/;
    if (passwordRegex.test(password)) {
      return true;
    } else {
      return false;
    }
  };

  const isValidForm = () => {
    let errorFields = [];
    if (firstName === "") {
      errorFields.push("firstName");
    }
    if (lastName === "") {
      errorFields.push("lastName");
    }
    if (mobileNumber === "") {
      errorFields.push("mobileNumber");
    }
    if (password === "") {
      errorFields.push("password");
    }
    if (password.length < 4) {
      // !isPasswordValidForCharacterLength(password)
      errorFields.push("password");
      Alert.alert(null, "Password must contain at least 4 characters.");
    }
    if (confirmPassword === "") {
      errorFields.push("confirmPassword");
    }
    if (password !== confirmPassword) {
      errorFields.push("password");
      errorFields.push("confirmPassword");
    }
    if (errorFields.length) {
      setErrorFields(errorFields);
      return false;
    }
    return true;
  };

  const onPressSignInHere = () => {
    navigation.navigate("Login", { customer: true });
  };

  const singUp = async () => {
    if (isValidForm()) {
      let body = {
        first_name: firstName,
        last_name: lastName,
        phone: `${country?.countryCode}${mobileNumber}`,
        email: emailAddress,
        password: password,
        confirm_password: confirmPassword,
      };
      if (dob) {
        body = { ...body, dob: moment(dob).format("YYYY-MM-DD") };
      }
      if (gender) {
        body = { ...body, gender: gender };
      }

      setLoading(true);
      const signUpResponse = await GeneralAPIAction("register", body, null);
      setLoading(false);
      if (signUpResponse?.success) {
        Alert.alert("OTP Sent", signUpResponse?.response, [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("OTP", {
                email: body?.email,
                phone: body?.phone,
                fromRegister: true,
              });
            },
          },
        ]);
        await analytics().logEvent("sign_up", {
          gender: gender,
          date_of_birth: dob,
        });

        // Facebook App Events Logs
        AppEventsLogger.logEvent(
          AppEventsLogger.AppEvents.CompletedRegistration,
          {
            [AppEventsLogger.AppEventParameters
              .RegistrationEmail]: `${body?.email}`,
            [AppEventsLogger.AppEventParameters
              .RegistrationPhone]: `${body?.phone}`,
          }
        );

        // await crashlytics().setAttributes({
        //   gender,
        //   date_of_birth: dob,
        // });
      } else {
        // crashlytics().recordError(signUpResponse?.response);
        showToast("Error", signUpResponse?.response, "error");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t("auth.Sign Up")} />

      {/*<ScrollView style={styles.content}  showsVerticalScrollIndicator={false}>*/}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.spacer} />

            <View style={styles.row}>
              <InputWithLabel
                containerStyle={styles.smallInput}
                label={t("signUp.firstName")}
                name="firstName"
                value={firstName}
                setValue={setFirstName}
                onChangeText={onChangeText}
                error={errorFields?.includes("firstName")}
                placeholder={t("signUp.firstNamePlaceholder")}
              />

              <InputWithLabel
                containerStyle={styles.smallInput}
                label={t("signUp.lastName")}
                name="lastName"
                value={lastName}
                setValue={setLastName}
                onChangeText={onChangeText}
                error={errorFields?.includes("lastName")}
                placeholder={t("signUp.lastNamePlaceholder")}
              />
            </View>

            <View style={styles.spacer} />

            <InputWithLabel
              type="mobile"
              label={t("signUp.mobileNumber")}
              name="mobileNumber"
              value={mobileNumber}
              setValue={setMobileNumber}
              onChangeText={onChangeText}
              country={country}
              setCountry={setCountry}
              keyboardType="number-pad"
              error={errorFields?.includes("mobileNumber")}
              placeholder={t("signUp.mobileNumberPlaceholder")}
            />

            <View style={styles.spacer} />

            <InputWithLabel
              label={t("signUp.email")}
              value={emailAddress}
              setValue={setEmailAddress}
              keyboardType="email-address"
              placeholder={t("signUp.emailPlaceholder")}
            />

            <View style={styles.spacer} />

            <View style={styles.row}>
              <InputWithLabel
                type="date"
                containerStyle={styles.smallInput}
                label={t("signUp.dob")}
                value={dob}
                maximumDate={new Date()}
                setValue={setDob}
                placeholder={t("signUp.dobPlaceholder")}
              />

              <InputWithLabel
                type="gender"
                containerStyle={styles.smallInput}
                label={t("signUp.gender")}
                value={gender}
                setValue={setGender}
                placeholder={t("signUp.genderPlaceholder")}
              />
            </View>

            <View style={styles.spacer} />

            <InputWithLabel
              type="password"
              label={t("signUp.password")}
              name="password"
              value={password}
              setValue={setPassword}
              onChangeText={onChangeText}
              error={errorFields?.includes("password")}
              placeholder={t("signUp.passwordPlaceholder")}
            />

            <View style={styles.spacer} />

            <InputWithLabel
              type="password"
              label={t("signUp.confirmPassword")}
              name="confirmPassword"
              value={confirmPassword}
              setValue={setConfirmPassword}
              onChangeText={onChangeText}
              error={errorFields?.includes("confirmPassword")}
              placeholder={t("signUp.confirmPasswordPlaceholder")}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/*</ScrollView>*/}

      <View style={styles.signUpButton}>
        <Text style={styles.signUpText}>{t("auth.AlreadyHaveAnAccount")}</Text>
        <TouchableOpacity onPress={onPressSignInHere}>
          <Text style={styles.singUpLink}>{t("auth.signInHere")}</Text>
        </TouchableOpacity>
      </View>

      <Footer title={t("auth.Sign Up")} onPress={singUp} />

      <Loader visible={loading} />
    </View>
  );
};

export default Register;
