import React from "react";
import { View, Text, StyleSheet } from "react-native";

// ** Custom Components
import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import { wp } from "../../utils/responsiveSizes";
import FontSize from "../../Constants/FontSize";

// ** Third Party Components
import Speedometer from "react-native-speedometer-chart";

const SpeedometerComponent = ({ value = 0, minValue = 0, maxValue = 200 }) => {
  return (
    <View style={styles.container}>
      <Speedometer
        showText
        size={250}
        // showIndicator
        showLabels
        minValue={minValue}
        totalValue={maxValue}
        value={parseInt(value)}
        text={parseInt(value)}
        outerColor={Colors.GREY}
        internalColor={"#4AD594"}
        textStyle={styles.textStyle}
        labelStyle={styles.labelStyle}
        // innerColor={'#f7f8f8'}
        innerCircleStyle={{
          height: wp(80),
          width: wp(145),
          position: "absolute",
          backgroundColor: "#f7f8f8",
        }}
        outerCircleStyle={{
          backgroundColor: Colors.GREY,
          borderWidth: 0,
          position: "relative",
        }}
        halfCircleStyle={{
          backgroundColor: Colors.DARKERGREEN,
          borderWidth: 0,
        }}
        labelFormatter={(number) => `${number}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  kmPerH: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs15,
    color: Colors.BLACK,
    textAlign: "center",
  },
  textStyle: {
    color: "#4AD594",
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs50,
    textAlign: "center",
    backgroundColor: "#f7f8f8",
  },
  labelStyle: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs11,
    textAlign: "center",
  },
});

export default SpeedometerComponent;
