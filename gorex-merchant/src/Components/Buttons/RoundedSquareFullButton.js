import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import FontFamily from "../../Constants/FontFamily";
import { hp, wp } from "../../utils/responsiveSizes";

const RoundedSquareFullButton = ({
  title,
  onPress,
  loading=false,
  disabled = false,
}) => {
  let buttonBackgroundColor = Colors.DARKERGREEN;
  if (disabled) {
    buttonBackgroundColor = Colors.GREY;
  }
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.button, { backgroundColor: buttonBackgroundColor }]}
      onPress={onPress}
    >
      <Text style={styles.title}>{title}</Text>
      {loading && <View style={styles.loading}><ActivityIndicator size={"small"} color={Colors.BLUE} /></View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: hp(57),
    width: wp(388),
    borderRadius: hp(5),
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: Colors.DARKERGREEN,
  },
  loading: {
    position: 'absolute',
    zIndex: 10,
    right: wp(30),
  },
  title: {
    ...FontSize.rfs18,
    ...FontFamily.bold,
    color: Colors.WHITE,
  },
});

export default RoundedSquareFullButton;
