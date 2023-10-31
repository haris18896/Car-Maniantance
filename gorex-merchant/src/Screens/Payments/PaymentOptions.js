import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  I18nManager,
} from "react-native";

import { useDispatch } from "react-redux";
import { GreenCheckBoxChecked, GreyCheckBoxUnchecked } from "../../assets";

import { useTranslation } from "react-i18next";
import RNRestart from "react-native-restart";
import { useNavigation } from "@react-navigation/native";
import Footer from "../ProductsAndServices/components/Footer";
import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import { hp, wp } from "../../utils/responsiveSizes";
import BackHeader from "../../Components/Header/BackHeader";
import FontSize from "../../Constants/FontSize";
import Utilities from "../../utils/UtilityMethods";
import analytics from "@react-native-firebase/analytics";

const PaymentOptions = (props) => {
  const navigation = useNavigation();
  const [checked, setChecked] = React.useState("Wallet");
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const { t, i18n } = useTranslation();
  const [method, setMethod] = useState(
    method == "Wallet" ? "Wallet" : "Credit Card"
  );

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "payment_options_screen",
    });
  }, []);

  const toggleLang = (lang) => {
    if (lang !== i18n.method) {
      i18n.changemethod(lang).then(() => {
        const isRTL = i18n.method === "ar";
        I18nManager.forceRTL(isRTL);
        setTimeout(() => {
          RNRestart.Restart();
        }, 1);
      });
    }
  };

  return (
    <View style={styles.container}>
      <BackHeader title={t("payment.paymentoptions")} />

      <View style={styles.paddedContent}>
        <Text style={styles.title}>{t("payment.favourite")}</Text>

        <View style={{ marginTop: Utilities.wp(2) }}>
          <TouchableOpacity
            onPress={() => {
              setMethod("Wallet");
            }}
            style={styles.row}
          >
            <Text style={styles.paeymentTitle}>{t("payment.wallet")}</Text>
            {method === "Wallet" ? (
              <GreenCheckBoxChecked width={wp(20)} height={wp(20)} />
            ) : (
              <GreyCheckBoxUnchecked width={wp(20)} height={wp(20)} />
            )}
          </TouchableOpacity>
        </View>

        <View style={{ width: Utilities.wp(90), marginTop: Utilities.wp(-2) }}>
          <TouchableOpacity
            onPress={() => {
              setMethod("Credit Card");
            }}
            style={styles.row}
          >
            <Text style={styles.paeymentTitle}>{t("payment.creditcard")}</Text>
            {method === "Credit Card" ? (
              <GreenCheckBoxChecked width={wp(20)} height={wp(20)} />
            ) : (
              <GreyCheckBoxUnchecked width={wp(20)} height={wp(20)} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Footer
        title={t("payment.save")}
        onPress={() => {
          navigation.goBack();
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
  paeymentTitle: {
    marginTop: Utilities.hp(2),
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    color: Colors.BLACK,
  },
  title: {
    marginTop: Utilities.hp(2),
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    color: Colors.BLACK,
  },
  row: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "center",
    width: "100%",
  },
  paddedContent: {
    paddingHorizontal: Utilities.wp(5),
    flex: 1,
  },
});

export default PaymentOptions;
