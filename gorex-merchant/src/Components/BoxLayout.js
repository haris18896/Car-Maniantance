//import liraries
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../Constants/Colors";
import Fonts from "../Constants/fonts";
import { hp, wp } from "../utils/responsiveSizes";

// create a component
const BoxLayout = ({ children, title, hideHeader }) => {
  return (
    <View style={styles.container}>
      {!hideHeader && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      <View style={styles.paddedContent}>{children}</View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.BLUE,
    height: hp(40),
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: Colors.BOX_GRAY,
    // minHeight: hp(214),
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.BOX_BORDER,
    borderRadius: 6,
  },
  title: {
    color: Colors.WHITE,
    ...FontSize.rfs16,
    fontFamily: Fonts.SFProDisplaySemiBold,
    textAlign: "left",
  },
  paddedContent: {
    padding: wp(20),
  },
});

//make this component available to the app
export default BoxLayout;
