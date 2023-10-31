import { t } from "i18next";
import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { useDispatch } from "react-redux";
import { Successvehicle } from "../../../assets";
import Colors from "../../../Constants/Colors";
import Fonts from "../../../Constants/fonts";
import { hp, wp } from "../../../utils/responsiveSizes";
import FontSize from "../../../Constants/FontSize";

import Footer from "./Footer";
import {useTranslation} from "react-i18next";

function UpdateVehicle({ onPress }) {
  const dispatch = useDispatch();
    const { t }       = useTranslation();

  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        transitionDuration={1000}
        source={Successvehicle}
        style={styles.item}
      />
      <Text style={styles.text}>SuccessVehicle</Text>
      <Text style={styles.title}>{t("vehicle.youhavenovehicle")}</Text>
      <View
        style={{
          justifyContent: "center",
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <Footer title={t("Done")} onPress={onPress} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    // alignSelf: "center",
    justifyContent: "center",
  },
  item: {
    height: hp(160),
    resizeMode: "contain",
    width: wp(105),
    marginTop: hp(60),
  },
  text: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendMedium,
    textAlign: "center",
    ...FontSize.rfs24,
    marginTop: hp(5),
  },
  title: {
    color: "#B8B9C1",
    width: "70%",
    fontFamily: Fonts.LexendMedium,
    textAlign: "center",
    ...FontSize.rfs16,
    marginTop: hp(10),
  },
});
export default UpdateVehicle;
