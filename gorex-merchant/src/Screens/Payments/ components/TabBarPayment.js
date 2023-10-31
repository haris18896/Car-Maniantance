import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../../Constants/Colors";
import Fonts from "../../../Constants/fonts";
import Utilities from "../../../utils/UtilityMethods";
import FontSize from "../../../Constants/FontSize";

const TabBarPayment = ({ active, onPressTab }) => {
  const { t } = useTranslation();
  return (
      <View style={styles.container}>
        <TouchableOpacity style={active === 1 ? styles.active : styles.inactive} onPress={() => onPressTab(1)}>
          <Text style={active === 1 ? styles.textActive : styles.text}>{t("history.Wallet")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={active === 2 ? styles.active : styles.inactive} onPress={() => onPressTab(2)}>
          <Text style={active === 2 ? styles.textActive : styles.text}>{t("history.Card")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={active === 3 ? styles.active : styles.inactive} onPress={() => onPressTab(3)}>
          <Text style={active === 3 ? styles.textActive : styles.text}>{t("history.Transactions")}</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Utilities.hp(6),
    flexDirection: "row",
  },
  inactive: {
    justifyContent: "center",
    alignItems: "center",
    width: "34%",
    borderBottomWidth: 1.5,
    borderColor: Colors.BLACK,
  },
  active: {
    justifyContent: "center",
    alignItems: "center",
    width: "34%",
    borderBottomColor: Colors.BLACK,
    borderBottomWidth: 5,
  },
  text: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs14,
    color: Colors.GREY,
  },
  textActive: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs16,
    color: Colors.BLACK,
  },
});

export default TabBarPayment;
