import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// ** Custom Components
import { GreyArrowDown } from "../../assets";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import { wp } from "../../utils/responsiveSizes";
import Colors from "react-native/Libraries/NewAppScreen/components/Colors";

function ModalPicker(props) {
  const { onPress, label, value, disabled, width } = props;
  return (
    <View style={styles.pickerWrapper(width)}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={styles.picker}
      >
        <Text style={styles.pickerValue}>{value}</Text>
        <GreyArrowDown width={14} height={14} />
      </TouchableOpacity>
    </View>
  );
}

export default ModalPicker;

const styles = StyleSheet.create({
  pickerWrapper: (width) => {
    return {
      width: `${width}%`,
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      marginHorizontal: wp(5),
      marginVertical: wp(10),
    };
  },
  pickerLabel: {
    fontFamily: Fonts.LexendRegular,
    ...FontSize.rfs16,
    textAlign: "left",
    color: 'black',
    marginBottom: wp(8),
  },
  picker: {
    width: "100%",
    paddingLeft: wp(15),
    paddingRight: wp(20),
    paddingVertical: wp(14),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: wp(50),
    backgroundColor: "#F2F2F2",
  },
  pickerValue: {
    color: "#17151F",
    fontFamily: Fonts.LexendRegular,
    ...FontSize.rfs16,
    textAlign: "left",
  },
});
