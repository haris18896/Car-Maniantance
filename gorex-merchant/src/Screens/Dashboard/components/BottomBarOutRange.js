import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { OutRange } from "../../../assets";
import Colors from "../../../Constants/Colors";
import { hp, wp } from "../../../utils/responsiveSizes";
import Fonts from "../../../Constants/fonts";
import LinearGradient from "react-native-linear-gradient";
import Utilities from "../../../utils/UtilityMethods";
import FontSize from "../../../Constants/FontSize";

const BottomBarOutRange = ({ resetFilter }) => {
  const [active, setActive] = useState(1);

  useEffect(() => {
    setActive(null);
  }, [resetFilter]);
  return (
    <LinearGradient
      colors={[
        "rgba(0,0,0,0.0)",
        "rgba(0,0,0,0.2)",
        "rgba(0,0,0,0.3)",
        "rgba(0,0,0,0.4)",
        "rgba(0,0,0,0.5)",
        "rgba(0,0,0,0.6)",
        "rgba(0,0,0,0.7)",
        "rgba(0,0,0,0.8)",
        "rgba(0,0,0,0.9)",
        "rgba(0,0,0,0.9)",
        "rgba(0,0,0,1)",
      ]}
      style={styles.container}
    >
      <View style={styles.buttonContainer}>
        <Image source={OutRange} style={{resizeMode:'center', height:'50%'}} />
        <Text style={styles.rangeText}>Out of range</Text>
        <Text style={styles.serviceNotVisible}>We do not operate here, yet.</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: Utilities.hp(20),
  },
  buttons: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: -wp(75),
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent:'flex-end',
  },
  button: {
    backgroundColor: Colors.GHOST_WHITE,
    height: wp(103),
    width: wp(140),
    borderRadius: wp(10),
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: "transparent",
    height: wp(103),
    width: wp(140),
    borderRadius: wp(10),
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: Colors.DARKERGREEN,
    borderLeftColor: Colors.DARKERGREEN,
    borderRightColor: Colors.DARKERGREEN,
    borderLeftWidth: 2.0,
    borderRightWidth: 2.0,
    borderBottomWidth: 2.0,
    borderTopColor: Colors.DARKERGREEN,
    borderTopWidth: 2.0,
  },
  buttonText: {
    color: Colors.BLACK,
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendMedium,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  buttonTextActive: {
    color: Colors.WHITE,
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendMedium,
    alignSelf: "flex-start",
    marginTop: 20,
    padding: 10,

    height: "50%",
    width: wp(138),
    backgroundColor: Colors.DARKERGREEN,
    borderBottomColor: Colors.DARKERGREEN,
    borderLeftColor: Colors.DARKERGREEN,
    borderRightColor: Colors.DARKERGREEN,
    borderLeftWidth: 2.0,
    borderRightWidth: 2.0,
    borderBottomWidth: 2.0,
    borderTopColor: Colors.DARKERGREEN,
    borderRadius: wp(10),
  },

  heading: {
    ...FontSize.rfs22,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    color: Colors.WHITE,
  },
  rangeText: {
    marginTop: 10,
    alignSelf: "center",
    color: Colors.ORANGE,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs30,
  },
  serviceNotVisible: {
    alignSelf: "center",
    color: "#FFFFFF",
    fontFamily: Fonts.LexendMedium,
    marginLeft: 2,
    ...FontSize.rfs16,
  },
});

export default BottomBarOutRange;
