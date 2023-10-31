import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

import { CountryPicker } from "react-native-country-codes-picker";

import styles from "./CountryCodeStyles";

import { ArrowDown } from "../../../assets";
import Fonts from "../../../Constants/fonts";
import FontSize from "../../../Constants/FontSize";
import Colors from "../../../Constants/Colors";
import { wp } from "../../../utils/responsiveSizes";

import { unwantedCountries } from "../../../Constants/unwantedCountries";

const CountryCode = ({ screen }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.picker}>
      <Text></Text>
      <View style={{ width: wp(10) }} />
      <Text style={styles.countryCode(screen)}>
      </Text>
      <View style={{ width: wp(10) }} />
      <Image source={ArrowDown} style={styles.arrow} />

      <CountryPicker
        show={showPicker}
        excludedCountries={unwantedCountries}
        onBackdropPress={() => setShowPicker(false)}
        style={{
          // Styles for whole modal [View]
          modal: {
            height: 150,
            backgroundColor: "white",
          },
          // Styles for modal backdrop [View]
          backdrop: {},
          // Styles for bottom input line [View]
          line: {
            height: 0,
          },
          // Styles for list of countries [FlatList]
          itemsList: {},
          flag: {
            width: wp(24),
          },
          // Styles for input [TextInput]
          textInput: {
            height: 0,
            padding: 0,
            backgroundColor: Colors.WHITE,
          },
          // Styles for country button [TouchableOpacity]
          countryButtonStyles: {
            height: 40,
            width: 300,
            color: Colors.BLACK,
            backgroundColor: "transparent",
          },
          dialCode: {
            ...FontSize.rfs14,
            fontFamily: Fonts.LexendMedium,
            color: Colors.BLACK,
          },
          countryName: {
            ...FontSize.rfs14,
            fontFamily: Fonts.LexendMedium,
            color: Colors.BLACK,
          },
        }}
        pickerButtonOnPress={(item) => {
          setCountry(item);
          setCountryCode(item?.dial_code);
          changeHandler(item?.dial_code + text);
          setShow(false);
        }}
      />
    </TouchableOpacity>
  );
};

export default CountryCode;
