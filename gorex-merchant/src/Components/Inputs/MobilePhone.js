import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { ArrowDown } from "../../assets";
import { unwantedCountries } from "../../Constants/unwantedCountries";
import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import { hp, wp } from "../../utils/responsiveSizes";
import { useTranslation } from "react-i18next";
import { CountryPicker } from "react-native-country-codes-picker";
import { getAllCountries } from "react-native-country-picker-modal";
import Utilities from "../../utils/UtilityMethods";
import FontSize from "../../Constants/FontSize";
import { t } from "i18next";

const MobilePhone = ({
  title,
  login,
  isValid = true,
  secured = false,
  select,
  date,
  options,
  error,
  changeHandler,
  defaultValue,
  disabled,
  keyboard,
  type,
  code,
  titleUp,
  dial_code,
  showError,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);
  const [cr, setCr] = useState();
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState({
    flag: "🇸🇦",
  });
  const [countryCode, setCountryCode] = useState("+966");

  useEffect(() => {
    if (defaultValue) setText(defaultValue);
  }, [defaultValue]);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    getCountries();
    setLoading(false);
  }, [loading]);

  const getCountries = () => {
    getAllCountries().then((ctr) => {
      let filtered = ctr.filter((c) => c.cca2 == "PK" || c.cca2 == "SKA");
      setCr(filtered);
    });
  };

  return (
    <>
      {loading ? null : (
        <View>
          {!login && <Text style={styles.titleUpUpdate}>{title}</Text>}
          <View
            style={[
              styles.container2,
              login ? styles.login : styles.grey,
              error ? styles.errorFieldStyle : {},
              {
                justifyContent: "center",
                borderWidth: isFocused || showError || !isValid ? 1 : 0,
                borderColor:
                  showError || !isValid
                    ? Colors.RED
                    : isFocused
                    ? Colors.DARKERGREEN
                    : null,
              },
            ]}
          >
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() =>
                  setTimeout(() => {
                    setShow(true);
                  }, 0)
                }
                style={{
                  ...styles.selectInput,
                }}
              >
                <Text
                  style={{
                    ...FontSize.rfs16,
                    fontFamily: Fonts.LexendMedium,
                    marginTop: -3,

                    color:
                      countryCode == ""
                        ? Colors.GREY
                        : login
                        ? "white"
                        : "black",
                  }}
                >
                  {country?.flag}
                  {"  "}
                  {countryCode == "" ? "Country Code" : countryCode}
                </Text>
                <View style={{ width: wp(10) }} />
                <Image
                  source={ArrowDown}
                  style={{ height: hp(6), width: wp(9) }}
                />
              </TouchableOpacity>

              <TextInput
                onBlur={() => setIsFocused(false)}
                onFocus={() => setIsFocused(true)}
                value={text}
                textAlignVertical="center"
                multiline={type === "textarea"}
                onChangeText={(value) => {
                  setText(value.replace(/[^0-9]/g, ""));
                  changeHandler(countryCode + value);
                }}
                placeholder={t("auth.yourmobile")}
                placeholderTextColor={login ? Colors.WHITE : Colors.BLACK}
                style={[
                  type === "textarea" ? styles.textarea : styles.selectInput2,
                  {
                    textAlign: isRTL ? "right" : "left",
                    color: login ? "white" : "black",
                    fontFamily: login ? Fonts.LexendLight : Fonts.LexendRegular,
                    fontWeight: "normal",
                    width: wp(255),
                    paddingVertical: 0,
                  },
                ]}
                editable={disabled ? false : true}
                secureTextEntry={secured}
                keyboardType={keyboard ? keyboard : "default"}
              />

              <CountryPicker
                show={show}
                excludedCountries={unwantedCountries}
                onBackdropPress={() => setShow(false)}
                countryList={cr}
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
                    width: Utilities.wp(4),
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

                  // Styles for search message [Text]
                }}
                // containerStyle={styles.phoneContainer}
                // textContainerStyle={styles.textInput}
                // when picker button press you will get the country object with dial code
                pickerButtonOnPress={(item) => {
                  setCountry(item);
                  setCountryCode(item?.dial_code);
                  changeHandler(item?.dial_code + text);
                  setShow(false);
                }}
              />
            </View>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
  titleUpUpdate: {
    // position: "absolute",
    // top: 0,
    ...FontSize.rfs16,
    color: Colors.BLACK,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    paddingBottom: 7,
    paddingTop: 12,
  },
  login: {
    marginTop: 5,
    backgroundColor: Colors.BLACK,
    height: Utilities.wp(12),
    fontFamily: Fonts.LexendLight,
  },
  grey: {
    backgroundColor: Colors.BORDER_GRAYLIGHTEST,
  },
  errorFieldStyle: {
    borderColor: Colors.RED,
    borderWidth: 1,
  },
  container2: {
    height: hp(45),
    borderRadius: 50,
    width: "100%",
  },
  textareaContainer: {
    height: hp(174),

    marginBottom: hp(10),
  },
  title: {
    ...FontSize.rfs14,
    color: Colors.WHITE,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
  },

  input: {
    borderBottomColor: Colors.BLUE,
    borderBottomWidth: 1,

    // paddingHorizontal: wp(5),
    // paddingVertical: hp(4),

    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs15,
    color: Colors.BLACK,
    // paddingLeft: 0,
  },
  textarea: {
    borderColor: Colors.BLUE,
    borderWidth: 1,
    paddingVertical: hp(4),
    minHeight: hp(174),
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs14,
    // paddingLeft: 0,
    // textAlignVertical: "top",
    paddingHorizontal: hp(12),
    // marginTop: hp(12),
    borderRadius: 8,
    color: Colors.BLACK,
  },
  selectInput: {
    // borderBottomColor: Colors.BLUE,
    // borderWidth: 1,
    width: Utilities.wp(28),
    alignSelf: "center",
    paddingLeft: Utilities.wp(4),
    flexDirection: "row",
    alignItems: "center",
    borderRightColor: Colors.GREY,
    borderRightWidth: 1,
    // textAlign: "left",
    ...FontSize.rfs14,
  },
  selectInput2: {
    paddingHorizontal: 10,
    fontFamily: Fonts.LexendLight,
    color: Colors.WHITE,
    ...FontSize.rfs16,
  },
  down: {
    position: "absolute",
    right: 0,
    bottom: 10,
  },
  pickerText: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs15,
    color: Colors.BLACK,
  },
  phoneContainer: {
    width: "75%",
    height: 50,
  },
  button: {
    marginTop: 30,
    width: "75%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
  textInput: {
    paddingVertical: 0,
  },
});

export default MobilePhone;
