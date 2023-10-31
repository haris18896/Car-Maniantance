//import liraries
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Mark } from "../../assets";
import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import { hp, wp } from "../../utils/responsiveSizes";
import Utilities from "../../utils/UtilityMethods";

// create a component
const CountryPickerCustom = ({
  title,
  checked,
  titlestyle,
  disabled,
  setChecked,
  checkstyle,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => {
        setChecked(!checked);
      }}
      style={styles.checkBoxContainer}
    >
      <View style={styles.leftView}>
        <Text style={titlestyle ? titlestyle : styles.titleText}>
          {title ? title : item?.name}
        </Text>
        <Image
          source={checked ? Mark : null}
          style={{
            width: Utilities.wp(7),

            resizeMode: "contain",
            marginBottom: Utilities.hp(1),
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Utilities.hp(-2),
    width: Utilities.wp(90),
    height: Utilities.hp(8),
  },
  leftView: {
    flexDirection: "row",
    alignItems: "center",
    width: Utilities.wp(90),
    marginRight: 30,
    justifyContent: "space-between",
  },
  titleText: {
    marginLeft: wp(12),
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    color: Colors.BLACK,
  },
  price: {
    marginLeft: wp(12),
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    color: Colors.GREEN,
  },
});

//make this component available to the app
export default CountryPickerCustom;
