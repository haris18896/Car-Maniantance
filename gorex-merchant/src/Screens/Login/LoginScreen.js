import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useTranslation } from "react-i18next";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useNavigation, CommonActions } from "@react-navigation/native";

import { AppLogo } from "../../assets";
import { SignIn, SaveFCMToken } from "../../api/CallAPI";
import Colors from "../../Constants/Colors";
import { KSA } from "../../Constants/country";
import FontSize from "../../Constants/FontSize";
import FontFamily from "../../Constants/FontFamily";
import { hp, wp } from "../../utils/responsiveSizes";
import { CommonContext } from "../../contexts/ContextProvider";
import { showToast, savePartnerId } from "../../utils/common";

import Loader from "../../Components/Loader";
import FullButton from "../../Components/Buttons/FullButton";
import InputWithLabel from "../../Components/Inputs/InputWithLabel";
import LanguagePickerInput from "../../Components/Inputs/LanguagePickerInput";
import LinearGradientComp from "../../Components/Background/LinearGradientComp";
import ChangeLanguage from "../../api/ChangeLanguage";

// ** Firebase Analytics
import analytics from "@react-native-firebase/analytics";
import messaging from "@react-native-firebase/messaging";

const Login = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setPartnerId, setUserProfile } = useContext(CommonContext);

  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState(KSA);

  const [mobileNumber, setMobileNumber] = useState("");
  const [isMobileNumberEmpty, setIsMobileNumberEmpty] = useState(false);

  const [password, setPassword] = useState("");
  const [fcmtoken, setFcmtoken] = useState("");
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [isKeepMeLoggedIn, setIsKeepMeLoggedIn] = useState(true);

  useEffect(() => {
    analytics().setAnalyticsCollectionEnabled(true);
    analytics().logScreenView({
      screen_name: "login_screen",
    });
    async function FCMTokenAnalytics() {
      await messaging()
        .getToken()
        .then((token) => {
          setFcmtoken(token);
          // if (user) {
          // TODO: Call Notification API
          // }
        })
        .catch((err) => {});
    }

    FCMTokenAnalytics().then();
  }, []);

  const login = async () => {
    setIsMobileNumberEmpty(!mobileNumber.length);
    setIsPasswordEmpty(!password.length);

    if (mobileNumber.length > 0 && password.length > 0) {
      setLoading(true);
      SignIn({
        phoneNumber: `${country?.countryCode}${mobileNumber}`,
        password,
        agent:
          Platform.OS === "ios"
            ? "gorex-ios"
            : Platform.OS === "android" && "gorex-android",
      }).then(({ success, data, message }) => {
        setLoading(false);
        if (success) {
          setPartnerId(data?.userID);
          setUserProfile(data?.profileData);

          analytics().setUserId(`${data?.userID}`);

          if (isKeepMeLoggedIn) {
            savePartnerId(data?.userParentId).then();
          }

          SaveFCMToken({ fcmtoken, userParentId: data?.userParentId }).then(
            (res) => {
              // console.log("fcmtoken added successfully : ", res);
            }
          );

          ChangeLanguage(data?.profileData.id).then((response) => {
            // console.log("Language ===>> ", response);
          });

          // Log custom analytics event here
          analytics().setUserProperties({ user_id: `${data?.userID}` });
          analytics().logScreenView({
            screen_name: "login_screen",
            user_id: `${data?.userID}`,
          });

          analytics().logEvent("login", {
            user_id: `${data?.userID}`,
          });

          setTimeout(() => {
            const resetAction = CommonActions.reset({
              index: 0,
              routes: [{ name: "Dashboard" }],
            });
            navigation.dispatch(resetAction);
          }, 200);
        } else {
          // crashlytics().recordError(message);
          showToast("Error", message, "error");
        }
      });
    }
  };

  return (
    <LinearGradientComp>
      <View style={styles.container}>
        <View style={styles.firstRow}>
          <LanguagePickerInput />
        </View>
        <View
          style={{
            height:
              Platform.OS === "ios"
                ? hp(165)
                : hp(165) - StatusBar.currentHeight / 2,
          }}
        />
        <View style={styles.LogoContainer}>
          <AppLogo height={hp(50)} width={wp(200)} />
        </View>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          <InputWithLabel
            darkTheme
            type="mobile"
            label={t("login.mobileNumber")}
            value={mobileNumber}
            setValue={setMobileNumber}
            country={country}
            setCountry={setCountry}
            keyboardType="number-pad"
            placeholder={t("login.mobileNumberPlaceholder")}
            error={isMobileNumberEmpty}
          />

          <View style={{ height: hp(20) }} />

          <InputWithLabel
            darkTheme
            type="password"
            label={t("login.password")}
            value={password}
            setValue={setPassword}
            placeholder={t("login.passwordPlaceholder")}
            error={isPasswordEmpty}
          />

          <View style={{ height: hp(20) }} />
          <View style={styles.forgotPasswordContainer}>
            <View
              style={styles.checkboxContainer}
              onPress={() => setIsSelection(!checked)}
            >
              <BouncyCheckbox
                size={20}
                fillColor={Colors.DARKERGREEN}
                unfillColor="transparent"
                iconStyle={{ borderColor: Colors.DARKERGREEN, borderRadius: 5 }}
                innerIconStyle={{ borderWidth: 2, borderRadius: 5 }}
                isChecked={isKeepMeLoggedIn}
                disableText={true}
                onPress={(isChecked) => setIsKeepMeLoggedIn(isChecked)}
              />

              <Text style={styles.label}>{t("auth.keepMeLoggedIn")}</Text>
            </View>
            <Text
              style={styles.forgotPasswordText}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              {t("auth.Forgot Password?")}
            </Text>
          </View>
          <View style={{ height: hp(38) }} />

          <FullButton
            disbaled={loading}
            title={t("auth.signIn")}
            style={{ width: wp(388) }}
            onPress={login}
          />

          <View style={styles.signUpButton}>
            <Text style={styles.signUpText}>{t("auth.Donthaveanaccount")}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.singUpLink}>{t("auth.Signuphere")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Loader visible={loading} />
      </View>
    </LinearGradientComp>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  firstRow: {
    height: hp(100),
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  LogoContainer: {
    alignItems: "center",
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: hp(70),
    paddingBottom: hp(100),
    paddingHorizontal: wp(22),
  },
  signUpButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  signUpText: {
    ...FontSize.rfs14,
    ...FontFamily.medium,
    color: Colors.WHITE,

    textAlign: "center",
    marginTop: hp(20),
  },
  singUpLink: {
    ...FontSize.rfs18,
    ...FontFamily.medium,
    color: Colors.DARKERGREEN,

    marginTop: hp(5),
    textAlign: "center",
    textDecorationLine: "underline",
  },
  forgotPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: hp(5),
  },
  forgotPasswordText: {
    ...FontFamily.bold,
    color: Colors.WHITE,

    textAlign: "right",
    textDecorationLine: "underline",
  },
  checkboxContainer: {
    flexDirection: "row",
  },
  label: {
    ...FontSize.rfs14,
    ...FontFamily.regular,
    color: Colors.WHITE,

    textAlign: "left",
    marginLeft: wp(10),
  },
  corporateContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});

export default Login;
