import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import {GreyCheckBoxUnchecked, GreenCheckBoxChecked } from "../../assets";
import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import { hp, wp } from "../../utils/responsiveSizes";

const CheckBox = ({title, hideRight, serviceChecked, item, isChecked, titlestyle, disabled, onCheck, checkstyle,}) => {
  const [checked, setChecked] = useState(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => {
        if (serviceChecked) serviceChecked(!checked, item);
        if (onCheck) {
          onCheck(!checked);
        }
        setChecked(!checked);
      }}
      style={styles.checkBoxContainer}
    >
      <View style={styles.leftView}>
        {checked
          ?
          <GreenCheckBoxChecked width={wp(20)} height={wp(20)} />
          :
          <GreyCheckBoxUnchecked width={wp(20)} height={wp(20)} />
        }
        <Text style={titlestyle ? titlestyle : styles.titleText}>{title ? title : item?.name}</Text>
      </View>
      {!hideRight && <Text style={styles.price}>{"SAR " + item?.price}</Text>}
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  checkBoxContainer: {
    width:'100%',
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
    ...FontSize.rfs16,
    fontFamily: Fonts.LexendMedium,
  },
  price: {
    ...FontSize.rfs16,
    fontFamily: Fonts.LexendMedium,
    color: Colors.DARKERGREEN,
  },
});

//make this component available to the app
export default CheckBox;
