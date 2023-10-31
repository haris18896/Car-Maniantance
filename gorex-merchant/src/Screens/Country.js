import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { Mark, MarkWhite } from "../assets";
import { setCountry as updateCountry } from "../utils/common";
import BackHeader from "../Components/Header/BackHeader";
import Colors from "../Constants/Colors";
import Fonts from "../Constants/fonts";
import { hp,  wp } from "../utils/responsiveSizes";
import Footer from "./ProductsAndServices/components/Footer";
import { useTranslation } from "react-i18next";
import { KSA, PK } from "../Constants/country";
import Utilities from "../utils/UtilityMethods";
import CountryPickerCustom from "../Components/Inputs/CountryPickerCustom";
import FontSize from "../Constants/FontSize";
import FontFamily from "../Constants/FontFamily";

const Country = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [country, setCountry] = useState(route?.params?.country);

  useEffect(() => {
    updateCountry(country);
  }, [country]);

  return (
    <View style={styles.container}>
      <BackHeader title={t("setting.country")} />
      <View style={{ marginTop: Utilities.wp(4), flex: 1 }}>
        <View style={{ marginLeft: 20 }}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => setCountry({ open: true, ...KSA })}
        >
          <Text style={styles.title}>{t("common.saudiArabia")}</Text>
          <Image
            source={country?.cca2 === "SA" ? Mark : MarkWhite}
            style={{
              width: wp(20),
              height: hp(20),
            }}
          />
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          onPress={() => setCountry({ open: true, ...PK })}
          style={styles.row}
        >
          <Text style={styles.title}>{t("common.pakistan")}</Text>
          <Image
            source={country?.cca2 === "PK" ? Mark : MarkWhite}
            style={{
              width: wp(20),
              height: hp(20),
            }}
          />
        </TouchableOpacity>
        <Divider />
        </View>
      </View>
      <Footer
        title={t("profile.saveChanges")}
        onPress={() => {
          navigation.navigate("Setting");
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

export default Country;
