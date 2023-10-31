import React from "react";
import { View, StyleSheet, TextInput } from "react-native";

import { useTranslation } from "react-i18next";

import { BlackSearch } from "../../assets";
import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import { hp, wp } from "../../utils/responsiveSizes";

const SearchBar = ({ search, onChangeText }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <View style={styles.container}>
      <BlackSearch height={wp(15.6)} width={wp(15.6)} />
      <TextInput
        value={search}
        onChangeText={onChangeText}
        style={[styles.input, {textAlign: isRTL? "right" : "left"}]}
        numberOfLines={1}
        placeholder={t("productsAndServices.search")}
        placeholderTextColor="#000"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(5),
    borderWidth: 1,
    borderColor: Colors.BORDER_GRAYLIGHT,
    backgroundColor: "#C7CCD133",
    height: hp(55),
    alignItems: "center",
    borderRadius: 5,
    paddingLeft: wp(20),
    flexDirection: "row",
  },
  input: {
    flex: 1,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs14,
  },
});

export default SearchBar;
