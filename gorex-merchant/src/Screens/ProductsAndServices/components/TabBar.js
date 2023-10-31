import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import Fonts from "../../../Constants/fonts";
import Colors from "../../../Constants/Colors";
import { useTranslation } from "react-i18next";
import Utilities from "../../../utils/UtilityMethods";
import { hp, wp } from "../../../utils/responsiveSizes";
import FontSize from "../../../Constants/FontSize";

// create a component
const TabBar = ({ active }) => {

  const navigation = useNavigation();
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("ProductsListing")} disabled={active === 1} style={active === 1 ? styles.leftActive : styles.leftButton}>
        <Text style={active === 1 ? styles.textActive : styles.text}>{t("productsAndServices.products")}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ServicesListing")} disabled={active === 2} style={active === 2 ? styles.rightButtonActive : styles.rightButton}>
        <Text style={active === 2 ? styles.textActive : styles.text}>{t("productsAndServices.services")}</Text>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    height: Utilities.hp(6),
    flexDirection: "row",
    marginTop: 7,
  },
  leftButton: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    width: "50%",
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1.5,
    borderColor: Colors.BLACK,
  },
  leftActive: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",

    borderBottomColor: Colors.BLACK,
    borderBottomWidth: 5,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  rightButton: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    width: "50%",
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1.5,
    borderColor: Colors.BLACK,
  },
  rightButtonActive: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",

    borderBottomColor: Colors.BLACK,
    borderBottomWidth: 5,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  text: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs14,
    color: Colors.GREY,
  },
  textActive: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs14,
    color: Colors.BLACK,
    fontWeight: "bold",
  },
});

//make this component available to the app
export default TabBar;
