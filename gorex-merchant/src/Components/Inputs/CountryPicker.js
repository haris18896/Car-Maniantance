import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { KSA, PK } from "../../Constants/country";
import CustomBottomSheet from "../BottomSheet/CustomBottomSheet";
import CustomCheckBox from "./CheckBoxCustom";
import Utilities from "../../utils/UtilityMethods";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import { hp, wp } from "../../utils/responsiveSizes";
import { WhiteArrowDown } from "../../assets";
import Colors from "../../Constants/Colors";

const CountryPickerInput = () => {
  const [country, setCountry] = useState(KSA);
  const [selectedCountry, setSelectedCountry] = useState(KSA);

  return (
    <>
      <CustomBottomSheet
        height={58}
        open={country?.open ?? false}
        onSelect={() => {
          setCountry({
            ...country,
            open: false,
          });
          setSelectedCountry(country);
        }}
        onClose={() =>
          setCountry({
            ...country,
            open: false,
          })
        }
      >
        <View style={{ marginTop: Utilities.wp(9) }}>
          <View style={{ marginLeft: 20 }}>
            <CustomCheckBox
              setChecked={() => setCountry({ open: true, ...KSA })}
              checked={country.cca2 === "SA"}
              hideRight
              title="Saudi Arabia"
              style={{
                ...FontSize.rfs14,
              }}
            />
            <CustomCheckBox
              setChecked={() => setCountry({ open: true, ...PK })}
              checked={country.cca2 === "PK"}
              hideRight
              title="Pakistan"
              style={{
                ...FontSize.rfs14,
              }}
            />
          </View>
        </View>
      </CustomBottomSheet>
      <Text style={styles.inputLabel}>Select Country</Text>
      <TouchableOpacity
        onPress={() =>
          setCountry({
            ...country,
            open: true,
          })
        }
        style={styles.picker}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            resizeMode: "contain",
          }}
        >
          <Text>{selectedCountry?.flag}</Text>
          <Text style={styles.selectedValue}>{selectedCountry?.name}</Text>
        </View>
        <WhiteArrowDown height={hp(7.7)} width={wp(14)} />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  picker: {
    width: Utilities.wp(90),
    height: Utilities.wp(13),
    borderRadius: hp(30),
    borderWidth: 1.5,
    borderColor: Colors.WHITE,
    color: Colors.WHITE,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(13),
  },
  inputLabel: {
    color: Colors.WHITE,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs18,
    marginBottom: Utilities.wp(3),
    marginLeft: Utilities.wp(1),
  },
  selectedValue: {
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendRegular,
    textAlign: "left",
    marginLeft: Utilities.wp(2),
    color: Colors.WHITE,
  },
  downIcon: {
    width: hp(25),
    height: hp(25),
  },
  titless: {
    color: Colors.WHITE,
    fontFamily: Fonts.LexendBold,
    fontWeight: "bold",
    textAlign: "left",
    ...FontSize.rfs18
  },
});

export default CountryPickerInput;
