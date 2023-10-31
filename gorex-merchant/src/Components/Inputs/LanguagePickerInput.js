import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import { useTranslation } from "react-i18next";
import CustomBottomSheet from "../BottomSheet/CustomBottomSheet";
import CustomCheckBox from "./CheckBoxCustom";
import Utilities from "../../utils/UtilityMethods";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import { hp, wp } from "../../utils/responsiveSizes";
import Colors from "../../Constants/Colors";
import RNRestart from "react-native-restart";

const LanguagePickerInput = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState({
    name: i18n?.language == "en" ? "English" : "اللغة العربية",
  });

  const [selectedLanguage, setSelectedLanguage] = useState({
    name: i18n?.language == "en" ? "English" : "اللغة العربية",
  });

  const changeLanguage = ({ i18n, lang }) => {
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang).then(() => {
        const isRTL = i18n.language === "ar";
        I18nManager.forceRTL(isRTL);
        setTimeout(() => {
          RNRestart.Restart();
        }, 1);
      });
    }
  };

  return (
    <>
      <CustomBottomSheet
        height={58}
        open={language?.open ?? false}
        onSelect={() => {
          setLanguage({
            ...language,
            open: false,
          });
          setSelectedLanguage(language);
          changeLanguage({
            i18n,
            lang: language.name === "English" ? "en" : "ar",
          });
        }}
        onClose={() =>
          setLanguage({
            ...language,
            open: false,
          })
        }
      >
        <View style={{ marginTop: Utilities.wp(9) }}>
          <View style={{ marginLeft: 20 }}>
            <CustomCheckBox
              checkstyle={{ height: 20, width: 20 }}
              setChecked={() => setLanguage({ open: true, name: "English" })}
              checked={language.name === "English"}
              hideRight
              title="English"
              style={{
                ...FontSize.rfs14,
              }}
            />
            <CustomCheckBox
              checkstyle={{ height: 20, width: 20 }}
              setChecked={() =>
                setLanguage({ open: true, name: "اللغة العربية" })
              }
              checked={language.name === "اللغة العربية"}
              hideRight
              title="اللغة العربية"
              style={{
                ...FontSize.rfs14,
              }}
            />
          </View>
        </View>
      </CustomBottomSheet>
      <TouchableOpacity
        onPress={() =>
          setLanguage({
            ...language,
            open: true,
          })
        }
        style={{ height: "50%", justifyContent: "flex-end", marginRight: 20 }}
      >
        <Text style={styles.inputLabel}> {t("language.select")}</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  picker: {
    width: Utilities.wp(90),
    height: Utilities.wp(13),
    borderRadius: hp(30),
    borderWidth: 1.5,
    borderColor: Colors.WHITE,
    color: Colors.WHITE,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(13),
  },
  inputLabel: {
    color: Colors.ORANGE,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs16,
  },
  selectedValue: {
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendRegular,
    textAlign: "left",
    marginLeft: Utilities.wp(2),
    color: Colors.WHITE,
  },
  downIcon: {
    width: hp(25),
    height: hp(25),
  },
  titless: {
    color: Colors.WHITE,
    fontFamily: Fonts.LexendBold,
    fontWeight: "bold",
    textAlign: "left",
    ...FontSize.rfs18,
  },
});

export default LanguagePickerInput;
