import React from "react";
import { View, StyleSheet, ScrollView, Text, Image } from "react-native";
import Colors from "../../Constants/Colors";
import Header from "../../Components/Header/BackHeader";
import { arrowRightWhite, SuccessPhone } from "../../assets";
import BottomButton from "../../Components/Buttons/BottomButton";
import { hp, wp } from "../../utils/responsiveSizes";
import { useTranslation } from "react-i18next";
import Fonts from "../../Constants/fonts";
import { useNavigation } from "@react-navigation/native";
import FontSize from "../../Constants/FontSize";

export default function Success() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header title={t("Reset Password")} />

      <View
        contentContainerStyle={styles.contentContainer}
        style={styles.content}
      >
        <Image style={styles.image} source={SuccessPhone} />
        <Text style={styles.title}>{t("auth.success")}</Text>
        <Text style={styles.subTitle}>{t("auth.successSubTitle")}</Text>
        <Text style={styles.subTitle}>{t("auth.successSubTitle2")}</Text>
      </View>

      <BottomButton
        icon={arrowRightWhite}
        title={t("auth.signIn")}
        onPress={() => navigation.navigate("Login")}
        // onPress={() => navigation.navigate('ResetPasswordSuccess')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: wp(22),
  },
  content: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: wp(100),
    height: hp(150),
  },

  title: {
    marginVertical: hp(10),
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendBold,
  },

  subTitle: {
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendMedium,
    color: Colors.GREY,
  },
});
