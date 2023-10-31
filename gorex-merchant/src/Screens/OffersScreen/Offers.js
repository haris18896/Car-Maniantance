import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import { hp, wp } from "../../utils/responsiveSizes";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { GreenPhoneMessage } from "../../assets";
import Loader from "../../Components/Loader";
import BackHeader from "../../Components/Header/BackHeader";
import { t } from "i18next";
import LinearGradient from "react-native-linear-gradient";
import FontSize from "../../Constants/FontSize";
import analytics from "@react-native-firebase/analytics";

const OTPScreens = ({ route }) => {
  const email = route?.params?.email;
  const phone = route?.params?.phone;
  const [loading, setLoading] = useState(false);
  const [resendTime, setResendTime] = useState(120);

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "OTP_verification_screen",
    });
  }, []);

  function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

  const formatTime = (t) => {
    var minutes = Math.floor(t / 60);
    var seconds = t - minutes * 60;
    var finalTime =
      str_pad_left(minutes, "0", 2) + ":" + str_pad_left(seconds, "0", 2);
    return finalTime;
  };

  return (
    <View style={styles.container}>
      <BackHeader title={t("OTP Verification")} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <View>
          <GreenPhoneMessage width={wp(62.75)} height={hp(85.5)} />
          <Text style={styles.descriptionVerification}>Verification Code</Text>
          <Text style={styles.description}>
            Please type the varification code sent to
          </Text>
          <Text style={styles.medium}>{phone || email}</Text>
        </View>
        <View style={{ marginTop: 20 }}></View>
        <LinearGradient colors={["#000", "#362380"]}>
          {resendTime === 0 && (
            <View style={styles.signupButton}>
              <Text style={styles.signupText}>Did not get code. ? </Text>
              <TouchableOpacity onPress={() => console.log("Resend OTP")}>
                <Text style={styles.forgotText}>Resend Code</Text>
                <Text style={styles.timer}>00:{formatTime(resendTime)}</Text>
              </TouchableOpacity>
            </View>
          )}
          {resendTime !== 0 && (
            <View style={styles.signupButton}>
              <Text style={styles.signupText}>
                Resend code in {` `}
                <Text style={styles.timer}>00:{formatTime(resendTime)}</Text>
              </Text>
            </View>
          )}
          <View style={{ height: hp(500) }}>
            <OTPInputView
              pinCount={6}
              style={[styles.otpWrapper]}
              autoFocusOnLoad
              onCodeFilled={() => {
                console.log("Verify OTP");
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
    ...FontSize.rfs16,
    fontFamily: Fonts.LexendMedium,
    color: Colors.GREY_TEXT,
    marginTop: hp(15),
  },
  descriptionVerification: {
    textAlign: "center",
    ...FontSize.rfs20,
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
    fontFamily: Fonts.LexendMedium,
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
    marginTop: 75,
    marginHorizontal: wp(35),
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
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendBold,
    color: Colors.WHITE,
  },
  forgotText: {
    color: Colors.WHITE,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs16,
    marginBottom: 5,
  },
});

export default OTPScreens;
