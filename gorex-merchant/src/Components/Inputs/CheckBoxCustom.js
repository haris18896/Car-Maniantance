import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import { hp, wp } from "../../utils/responsiveSizes";
import { GreenCheckBoxChecked, GreyCheckBoxUnchecked } from "../../assets";

const CustomCheckBox = ({
  title,
  checked,
  disabled,
  titlestyle,
  setChecked,
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
        {checked ? <GreenCheckBoxChecked /> : <GreyCheckBoxUnchecked />}
        <Text style={titlestyle ? titlestyle : styles.titleText}>
          {title ? title : item?.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(21),
  },
  leftView: {
    flexDirection: "row",
    alignItems: "center",
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

export default CustomCheckBox;
