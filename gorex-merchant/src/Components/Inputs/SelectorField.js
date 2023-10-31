import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// ** Custom Components
import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import { GreyDownArrow } from "../../assets";
import FontSize from "../../Constants/FontSize";
import { hp, wp } from "../../utils/responsiveSizes";

function SelectorField({ title, onPress, placeholder, value }) {
  return (
    <View style={styles.InputWrapper}>
      {title && <Text style={styles.inputHeading}>{title}</Text>}

      <TouchableOpacity onPress={onPress} style={styles.inputValueWrapper}>
        <Text style={styles.inputSelector}>{value ? value : placeholder}</Text>
        <GreyDownArrow width={wp(14)} height={wp(14)} />
      </TouchableOpacity>
    </View>
  );
}

export default SelectorField;

const styles = StyleSheet.create({
  InputWrapper: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  inputHeading: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs16,
    color: Colors.BLACK,
    textAlign: "left",
    marginBottom: wp(10),
  },
  inputValueWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: `#F2F2F2`,
    borderRadius: wp(25),
    paddingVertical: hp(12),
    paddingHorizontal: wp(20),
    marginBottom: wp(20),
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputSelector: {
    fontFamily: Fonts.LexendRegular,
    ...FontSize.rfs16,
    textAlign: "left",
    color: Colors.BLACK,
  },
  endEndorsement: {
    width: wp(20),
    height: hp(20),
  },
});
