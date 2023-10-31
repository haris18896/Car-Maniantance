import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import FontFamily from "../../Constants/FontFamily";
import { hp, wp } from "../../utils/responsiveSizes";
import { CheckBoxChecked, CheckBoxUnchecked } from "../../assets";

import CardWithShadow from "./CardWithShadow";
import { useTranslation } from "react-i18next";
import Fonts from "../../Constants/fonts";

const CheckBoxCard = ({
  title,
  subTitle = "",
  cardStyle,
  checked,
  onPress,
  noshadow,
  description,
  noDescription,
  isCheckboxOnRight = false,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <CardWithShadow cardStyle={[styles.cardStyle, cardStyle]}>
      <TouchableOpacity style={styles.cardContent} onPress={onPress}>
        <View style={styles.cardBox}>
          {!isCheckboxOnRight && (
            <Image
              style={styles.checkBox}
              source={checked ? CheckBoxChecked : CheckBoxUnchecked}
            />
          )}

          <Text
            style={[
              styles.title,
              { width: subTitle.length > 0 ? "65%" : "90%" },
            ]}
          >
            {title}
          </Text>

          {subTitle.length > 0 && (
            <Text style={styles.subtitle}>
              {subTitle} {t("productsAndServices.SAR")}
            </Text>
          )}

          {isCheckboxOnRight && (
            <Image
              style={styles.checkBox}
              source={checked ? CheckBoxChecked : CheckBoxUnchecked}
            />
          )}
        </View>
        {!noDescription && (
          <View style={styles.descriptionWrapper}>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>
        )}
      </TouchableOpacity>
    </CardWithShadow>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    width: "90%", // wp(186),
    // height: hp(48),
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: wp(8),
  },

  cardContent: {
    // width: "100%",
    // height: "100%",
    paddingVertical: hp(10),
    flexDirection: "column",
    alignItems: "flex-start",
  },
  cardBox: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  descriptionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: wp(5),
    marginLeft: wp(39),
    marginRight: wp(20),
  },
  descriptionText: {
    fontFamily: Fonts.LexendRegular,
    ...FontSize.rfs14,
    color: Colors.GREY,
  },
  checkBox: {
    width: wp(20),
    height: wp(20),
    resizeMode: "contain",
    marginRight: "5%",
  },
  title: {
    width: "80%",
    ...FontSize.rfs16,
    ...FontFamily.medium,
    color: Colors.BLACK,
    textAlign: "left",
  },

  subtitle: {
    // width: "20%",
    ...FontSize.rfs18,
    ...FontFamily.medium,
    color: Colors.DARKERGREEN,
    textAlign: "right",
  },
});

export default CheckBoxCard;
