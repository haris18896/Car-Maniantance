import React, {useState} from "react";
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity } from "react-native";

import moment from "moment";
import { useTranslation } from "react-i18next";

import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import FontFamily from "../../Constants/FontFamily";
import { hp, wp } from "../../utils/responsiveSizes";
import { ArrowDown, ShowPassword, HidePassword } from "../../assets";

import DatePicker from "../Picker/DatePicker";
import CountryPicker from "../BottomSheet/CountryPicker";
import GenderPicker from "../../Components/BottomSheet/GenderPicker";

const InputWithLabel = ({ darkTheme = false, label, placeholder, containerStyle, type, name, value, setValue, onChangeText, country, setCountry, editable = true, keyboardType, returnKeyType, maxLength, minimumDate= null, maximumDate= null, error }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [showText, setShowText] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const leftContainer = () => {
    if (type === 'mobile') {
      return (
        <TouchableOpacity style={styles.countryCodeContainer} disabled={!editable} onPress={() => setShowCountryPicker(true)}>
          <Text style={{...FontSize.rfs16}}>{country?.flag}</Text>
          <View style={{width: wp(10)}} />
          <Text style={styles.countryCode(darkTheme)}>{country?.countryCode}</Text>
          <View style={{width: wp(10)}} />
          <Image style={styles.mobileArrowDown} source={ArrowDown} />
          <View style={{width: wp(10)}} />
          <View style={styles.pipe} />
          <View style={{width: wp(10)}} />
          <CountryPicker show={showCountryPicker} setShow={setShowCountryPicker} setCountry={setCountry} />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const rightContainer = () => {
    if (type === 'password') {
      return (
        <TouchableOpacity style={styles.passwordEyeContainer} onPress={() => setShowText(!showText)}>
          <View style={{width: wp(20)}} />
          <Image style={styles.passwordEye} source={showText ? ShowPassword : HidePassword} />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const picker = () => {
    const onPressPicker = () => {
      type === 'gender' ? setShowGenderPicker(true) : type === 'date' ? setShowDatePicker(true) : null;
    };

    return (
      <TouchableOpacity style={styles.pickerContainer} onPress={onPressPicker}>
        <Text style={styles.pickerLabel}>
          {type === 'gender' && value ? t(`common.${value}`) : type === 'date' && value ? moment(value).format("Do MMM, YYYY") : placeholder}
        </Text>
        <Image style={styles.pickerArrowDown} source={ArrowDown} />
        {type === 'gender' ?
          <GenderPicker
            show={showGenderPicker}
            setShow={setShowGenderPicker}
            value={value}
            setValue={setValue} />
        : type === 'date' ?
          <DatePicker show={showDatePicker} setShow={setShowDatePicker} date={value} setDate={setValue} minimumDate={minimumDate} maximumDate={maximumDate} />
        : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[containerStyle]}>
      <View style={{alignItems: 'flex-start'}}>
        <Text style={styles.label(darkTheme)}>{label}</Text>
      </View>
      <View style={{ height: hp(10) }} />
      <View style={styles.inputContainer(darkTheme, error, isFocused)}>
        {leftContainer()}
        {type === 'date' || type === 'gender' ? picker() :
          <TextInput
            style={styles.textInput(isRTL, darkTheme)}
            placeholder={placeholder}
            placeholderTextColor={darkTheme ? Colors.WHITE : Colors.BLACK}

            value={value}
            onChangeText={(value) => {
              setValue(value);
              onChangeText ? onChangeText(name) : null;
            }}

            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}

            editable={editable}
            maxLength={maxLength}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            secureTextEntry={type === 'password' && !showText ? true : false} />}
        {rightContainer()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: (darkTheme) => {
    return {
      ...FontSize.rfs16,
      ...FontFamily.medium,
      color: darkTheme ? Colors.WHITE : Colors.BLACK,
    };
  },
  inputContainer: (darkTheme, error, isFocused) => {
    return {
      flexDirection: "row",
      height: hp(50),
      paddingHorizontal: wp(20),

      borderWidth: hp(1),
      borderRadius: hp(25),
      backgroundColor: darkTheme ? Colors.DARK_BLACK : Colors.BORDER_GRAYLIGHTEST,
      borderColor: error ? Colors.RED : isFocused ? Colors.DARKERGREEN : darkTheme ? Colors.DARK_BLACK : Colors.BORDER_GRAYLIGHTEST,
    };
  },
  textInput: (isRTL, darkTheme) => {
    return {
      flex: 1,
      textAlign: isRTL ? 'right' : 'left',

      ...FontSize.rfs16,
      ...FontFamily.regular,
      color: darkTheme ? Colors.WHITE : Colors.BLACK,
    };
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: (darkTheme) => {
    return {
      ...FontSize.rfs16,
      ...FontFamily.bold,
      color: darkTheme ? Colors.WHITE : Colors.BLACK,
    };
  },
  mobileArrowDown: {
    width: wp(9),
    height: hp(6),
    resizeMode: 'contain',
  },
  pipe: {
    width: wp(2),
    height: hp(13),
    backgroundColor: Colors.LIGHTGREY,
  },
  pickerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerLabel: {
    ...FontSize.rfs16,
    ...FontFamily.regular,
    color: Colors.BLACK,
  },
  pickerArrowDown: {
    width: wp(14),
    height: hp(7.7),
    resizeMode: 'stretch',
  },
  passwordEyeContainer: {
    height: hp(50),
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordEye: {
    width: wp(22),
    height: hp(15),
    resizeMode: 'contain',
  },
});

export default InputWithLabel;
