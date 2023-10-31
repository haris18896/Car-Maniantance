import React from "react";
import { StyleSheet } from "react-native";

import { CountryPicker as CP } from "react-native-country-codes-picker";

import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import { PK, KSA } from "../../Constants/country";
import FontFamily from "../../Constants/FontFamily";
import { unwantedCountries } from "../../Constants/unwantedCountries";

const CountryPicker = ({show, setShow, setCountry}) => {
    const onSelectCountry = (country) => {
        country?.code === 'PK' ? setCountry(PK) : setCountry(KSA);
        setShow(false);
    };

    return (
        <CP
            style={styles.cpStyles}
            show={show}
            excludedCountries={unwantedCountries}
            onBackdropPress={() => setShow(false)}
            pickerButtonOnPress={(item) => onSelectCountry(item)}
        />
    );
};

const styles = StyleSheet.create({
    cpStyles: {
        // Styles for whole modal [View]
        modal: {
            height: 150,
            backgroundColor: "white",
        },
        // Styles for bottom input line [View]
        line: {
            height: 0,
        },
        flag: {
            width: 17,
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
            ...FontFamily.medium,
            color: Colors.BLACK,
        },
        countryName: {
            ...FontSize.rfs14,
            ...FontFamily.medium,
            color: Colors.BLACK,
        },
    },
});

export default CountryPicker;
