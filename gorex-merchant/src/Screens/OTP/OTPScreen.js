import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTranslation } from "react-i18next";
import { CommonActions, useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import OTPInputView from "@twotalltotems/react-native-otp-input";

import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import Colors from "../../Constants/Colors";
import { showToast } from "../../utils/common";
import { GreenPhoneMessage } from "../../assets";
import Utilities from "../../utils/UtilityMethods";
import GeneralAPIWithEndPoint from "../../api/GeneralAPIWithEndPoint";
import { hp, wp } from "../../utils/responsiveSizes";

import Loader from "../../Components/Loader";
import BackHeader from "../../Components/Header/BackHeader";
import analytics from "@react-native-firebase/analytics";

const OTP = ({ route }) => {
  const email = route?.params?.email;
  const phone = route?.params?.phone;
  const fromRegister = route?.params?.fromRegister;

  const { t } = useTranslation();
  const navigation = useNavigation();
  const timerCount = 90;

  const [loading, setLoading] = useState(false);
  const [resendTime, setResendTime] = useState(timerCount);

  useEffect(() => {
    countTimer();
    analytics().logScreenView({
      screen_name: "OTP_screen",
    });
    return () => {
      clearInterval(timeout);
    };
  }, []);

  let timeout = null;
  const countTimer = () => {
    let time = 120;
    timeout = setInterval(() => {
      if (time !== 120) {
        time = resendTime;
      }
      if (time > 0) {
        setResendTime((_time) => {
          if (_time > 0) {
            return _time - 1;
          } else {
            clearInterval(timeout);
            return 0;
          }
        });
      } else {
        clearInterval(timeout);
      }
    }, 1000);
  };
  function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

  const formatTime = (t) => {
    var minutes = Math.floor(t / 60);
    var seconds = t - minutes * 60;
    return str_pad_left(minutes, "0", 2) + ":" + str_pad_left(seconds, "0", 2);
  };

  const sendOtp = async () => {
    const body = { phone_number: phone };
    const forgotPasswordResponse = await GeneralAPIWithEndPoint(
      "/generate/api/otp",
      body
    );
    setResendTime(timerCount);
    clearInterval(timeout);
    countTimer();
    showToast("Success", forgotPasswordResponse, "success");
  };

  const verifyOtp = async (otp) => {
    setLoading(true);
    const body = { phone, otp_code: otp };
    const verifyOTPResponse = await GeneralAPIWithEndPoint("/verify/otp", body);
    setLoading(false);

    if (verifyOTPResponse === "Invalid OTP!") {
      showToast("Error", verifyOTPResponse, "error");
    } else {
      showToast("Success", verifyOTPResponse, "success");
      if (fromRegister) {
        const resetAction = CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
        navigation.dispatch(resetAction);
      } else {
        navigation.navigate("ResetPassword", { phone });
      }
    }
  };

  return (
    <View style={styles.container}>
      <BackHeader title={t("OTP.verify")} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <View>
          <View style={{ alignItems: "center" }}>
            <GreenPhoneMessage width={wp(63)} height={hp(85)} />
          </View>
          <Text style={styles.descriptionVerification}>{t("OTP.code")}</Text>
          <Text style={styles.description}>{t("OTP.codesent")}</Text>
          <Text style={styles.medium}>{phone || email}</Text>
        </View>
        <LinearGradient colors={["#000", "#362380"]} style={{ flex: 1 }}>
          {resendTime === 0 && (
            <View style={styles.signupButton}>
              <Text style={styles.signupText}>{t("OTP.getcode")}</Text>
              <View style={{ height: hp(10) }} />
              <TouchableOpacity onPress={sendOtp}>
                <Text style={styles.forgotText}>{t("OTP.resend")}</Text>
                {/*<Text style={styles.timer}>{resendTime} {t("OTP.seconds")} </Text>*/}
              </TouchableOpacity>
            </View>
          )}
          {resendTime !== 0 && (
            <View style={styles.signupButton}>
              <Text style={styles.signupText}>
                {t("OTP.resendcode")} {` `}
                <Text style={styles.timer}>
                  {resendTime} {t("OTP.seconds")}{" "}
                </Text>
              </Text>
            </View>
          )}
          <View
            style={{
              height: Utilities.hp(22),
              paddingHorizontal: Utilities.wp(15),
              paddingTop: Utilities.hp(6),
            }}
          >
            <OTPInputView
              pinCount={4}
              style={[styles.otpWrapper]}
              autoFocusOnLoad
              onCodeFilled={(value) => {
                verifyOtp(value).then();
              }}
              editable={true}
              codeInputFieldStyle={styles.otpInptItem}
            />
          </View>
        </LinearGradient>
        <View></View>
      </ScrollView>
      <Loader visible={loading} />
    </View>
  );
};

// define your styles
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  content: {
    flex: 1,

    marginTop: hp(10),
  },
  buttonContainer: {
    marginTop: hp(14),
  },
  bottomText: {
    marginTop: hp(15),
    textAlign: "center",
    ...FontSize.rfs13,
    fontFamily: Fonts.LexendRegular,
    color: Colors.GREY_TEXT,
  },
  timer: {
    textAlign: "center",
    fontFamily: Fonts.LexendMedium,
    color: Colors.DARKERGREEN,
  },
  description: {
    textAlign: "center",
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendMedium,
    color: Colors.GREY_TEXT,
    marginTop: hp(15),
  },

  descriptionVerification: {
    textAlign: "center",
    ...FontSize.rfs24,
    fontFamily: Fonts.LexendBold,
    color: Colors.BLACK,
    marginTop: hp(15),
  },
  phoneLogo: {
    alignSelf: "center",
    marginTop: 10,
    width: wp(100),
    height: wp(100),
    resizeMode: "contain",
  },
  medium: {
    color: Colors.BLACK,
    textAlign: "center",
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendBold,
    marginBottom: Utilities.hp(3),
  },
  otpInptItem: {
    width: wp(34),
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.DARKERGREEN,
    alignItems: "center",
    textAlign: "center",
    color: Colors.WHITE,
    ...FontSize.rfs24,
    fontFamily: Fonts.LexendRegular,
  },
  otpWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  contentContainerStyle: {
    justifyContent: "space-between",
    flex: 1,
  },
  signupButton: {
    justifyContent: "flex-end",
    alignItems: "center",

    marginBottom: hp(15),
    marginRight: wp(20),
    marginTop: hp(23),
  },
  signupText: {
    textAlign: "center",
    ...FontSize.rfs15,
    fontFamily: Fonts.LexendRegular,
    color: Colors.WHITE,
  },

  forgotText: {
    color: Colors.WHITE,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs16,
    marginBottom: 5,
    textDecorationLine: "underline",
  },
});

//make this component available to the app
export default OTP;
