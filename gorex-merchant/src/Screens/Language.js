import React, {useContext, useState} from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  I18nManager,
  TouchableOpacity,
} from "react-native";

import { Divider } from "react-native-paper";
import RNRestart from "react-native-restart";
import { useTranslation } from "react-i18next";

import {
  Mark,
  MarkWhite,
} from "../assets";
import BackHeader from "../Components/Header/BackHeader";
import Colors from "../Constants/Colors";
import Fonts from "../Constants/fonts";
import { hp, wp } from "../utils/responsiveSizes";
import Footer from "./ProductsAndServices/components/Footer";
import FontSize from "../Constants/FontSize";
import FontFamily from "../Constants/FontFamily";
import ChangeLanguage from "../api/ChangeLanguage";
import {CommonContext} from "../contexts/ContextProvider";

const Language = () => {
  const {userProfile} = useContext(CommonContext);
  const {t, i18n } = useTranslation();
  const [language, setLanguage] = useState(
    i18n?.language === "en" ? "English" : "اللغة العربية"
  );

  const toggleLang = (lang) => {
    if (lang !== i18n.language) {
      ChangeLanguage(userProfile.id).then(({success, response})=>{
        i18n.changeLanguage(lang).then(() => {
          const isRTL = i18n.language === "ar";
          I18nManager.forceRTL(isRTL);
          setTimeout(() => {
            RNRestart.Restart();
          }, 1);
        });
      });
    }
  };

  return (
    <View style={styles.container}>
      <BackHeader title={t("language.language")} />
      <View style={styles.paddedContent}>
        <TouchableOpacity onPress={() => {
            setLanguage("English");
          }}
          style={styles.row}
        >
          <Text style={styles.title}>English</Text>
          <Image
            source={language === "English" ? Mark : MarkWhite}
            style={{
              width: wp(20),
              height: hp(20),
            }}
          />
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          onPress={() => {
            setLanguage("اللغة العربية");
          }}
          style={styles.row}
        >
          <Text style={styles.title}>{t("common.arabic")}</Text>
          <Image
            source={language === "اللغة العربية" ? Mark : MarkWhite}
            style={{
              width: wp(20),
              height: hp(20),
            }}
          />
        </TouchableOpacity>
        <Divider />
      </View>
      <Footer
        title={t("profile.saveChanges")}
        onPress={() => {
          toggleLang(language === "English" ? "en" : "ar");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  title: {
    ...FontSize.rfs18,
    ...FontFamily.medium,
    color: Colors.DARK_BLACK,
  },
  row: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "center",
    width: "90%",
    paddingVertical: hp(15),
  },
  paddedContent: {
    paddingHorizontal: wp(10),
    flex: 1,
  },
});

export default Language;
