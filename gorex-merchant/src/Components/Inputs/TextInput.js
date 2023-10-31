import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import { GreyArrowDown, GreyEye, GreenEye, WhiteEye } from "../../assets";
import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import { hp, wp } from "../../utils/responsiveSizes";
import SelectOptions from "./SelectOptions";
import { useTranslation } from "react-i18next";
import FontSize from "../../Constants/FontSize";
import Utilities from "../../utils/UtilityMethods";

const InputText = ({
                       title,
                       login,
                       secured = false,
                       select,
                       date,
                       options,
                       showError,
                       changeHandler,
                       name,
                       defaultValue,
                       row = false,
                       disabled,
                       keyboard,
                       type,
                       error,
                       forceTitle,
                       minDate = null,
                       maxDate = new Date(Date.now()),
                       onFocus = () => {},
                       placeholder,
                       errorMessage,
                       titleUp,
                       returnKeyType = "default",
                       dontHaveTitle = true,
                   }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [text, setText] = useState("");
    const [showSelect, setShowSelect] = useState(false);
    const [_date, setDate] = useState("");
    const [open, setOpen] = useState(false);
    const [isPasswordSecure, setIsPasswordSecure] = useState(secured);
    const selectOption = (option) => {
        setShowSelect(false);
        changeHandler(option?.value);
        setText(option?.label);
    };
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar";

    useEffect(() => {
        if (defaultValue) setText(defaultValue);
    }, [defaultValue]);

  return (
      <View style={{ marginTop: 15 }}>
        <TouchableOpacity
            onPress={() => {
              if (select) {
                setShowSelect(!showSelect);
              } else if (date) setOpen(true);
            }}
            disabled={(!select && !date) || disabled}
            style={[type === "textarea" ? styles.textareaContainer : styles.container, { width: "100%" }]}
        >
          {!login && dontHaveTitle && (
            <View style={styles.inputLabelContainer}>
              <Text style={styles.titleUpUpdate}>{title}</Text>
            </View>
          )}
          {select || date ? (
              <View style={[styles.selectInput]}>

                        {!text ? (
                            <Text style={[styles.textPlaceholder]}>{date ? "DD/MM/YYYY" : isRTL ? "يرجى الاختيار" : "Select " + title}</Text>
                        ) : (
                            <Text style={styles.textNormal}>{select ? text : text ? moment(text).format("DD/MM/YYYY") : ""}</Text>
                        )}

                        <GreyArrowDown height={hp(7.7)} width={wp(14)} />


                    </View>
                ) : (
                    <View>
                        <TextInput
                            value={text}
                            multiline={type === "textarea"}
                            onChangeText={(value) => {
                                setText(value);
                                changeHandler(value);
                            }}
                            onBlur={() => setIsFocused(false)}
                            onFocus={() => {
                                setIsFocused(true);
                                onFocus({ xmlName: name });
                            }}
                            returnKeyType={returnKeyType}
                            placeholderTextColor={login ? Colors.WHITE : Colors.BLACK}
                            placeholder={forceTitle ? title : isRTL ? "ادخل" + title : "Enter your " + title}
                            style={[type === "textarea" ? styles.textarea : styles.input,
                                login ? styles.login : styles.grey,
                                {
                                    width: "100%",
                                    textAlign: isRTL ? "right" : "left",
                                    borderWidth: isFocused || showError ? 1 : 0,
                                    borderColor: showError
                                        ? Colors.RED
                                        : isFocused
                                            ? Colors.DARKERGREEN
                                            : null,
                                },
                            ]}
                            editable={disabled ? false : true}
                            secureTextEntry={isPasswordSecure}
                            keyboardType={keyboard ? keyboard : "default"}
                        />

                        {secured && (
                            <TouchableOpacity style={styles.iconinput} onPress={() => {
                                setIsPasswordSecure((prev) => !prev);
                            }}>
                                {isPasswordSecure ? (
                                    <GreyEye width={wp(22)} height={hp(15)} />
                                ) : (
                                    <GreenEye width={wp(22)} height={hp(15)} />
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </TouchableOpacity>
            {/* {error && (
        <Text
          style={{
            color: Colors.BLUE,
            marginTop: -10,
            ...FontSize.rfs12,
          }}
        >
          Field is Required!
        </Text>
      )} */}
            <View>
                <SelectOptions
                    visible={showSelect}
                    options={options}
                    error={error}
                    selectOption={selectOption}
                />

                <DatePicker
                    modal
                    open={open}
                    date={new Date()}
                    error={error}
                    mode="date"
                    minimumDate={minDate}
                    maximumDate={new Date("2023-12-31")}
                    onConfirm={(_date) => {
                        setOpen(false);
                        setDate(_date);
                        setText(_date);
                        changeHandler(moment(_date).format("MM/DD/YYYY"));
                    }}
                    onCancel={() => {
                        setOpen(false);
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
  },
  iconinput: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: wp(20),
    height: '100%',
    justifyContent:'center',
  },
  inputLabelContainer: {
    alignItems: 'flex-start'
  },
  textareaContainer: {
    marginBottom: hp(10),
  },
    title: {
        marginLeft: Utilities.wp(5),
        ...FontSize.rfs16,
        color: Colors.BLACK,
        fontFamily: Fonts.LexendRegular,
    },
    textPlaceholder:{
        color: Colors.BLACK,
        fontFamily: Fonts.LexendRegular,
        ...FontSize.rfs16,
    },
    textNormal:{
        color: Colors.BLACK,
        fontFamily: Fonts.LexendRegular,
        ...FontSize.rfs16,
    },
    titleUp: {
        ...FontSize.rfs12,
        color: Colors.GREY,
        fontFamily: Fonts.LexendMedium,
    },
    titleUpUpdate: {
        ...FontSize.rfs16,
        color: Colors.BLACK,
        fontFamily: Fonts.LexendMedium,
        paddingBottom: 7,
    },
    input: {
        paddingLeft: Utilities.hp(2.5),
        color: Colors.BLACK,
        marginHorizontal: wp(10),
        height: hp(50),
        borderRadius: hp(25),
        marginLeft: "auto",
        marginRight: "auto",
        ...FontSize.rfs16,
        textAlign: "left",
        paddingHorizontal: hp(55),
        paddingVertical: hp(5),
        fontWeight: "normal",
        fontFamily: Fonts.LexendRegular,
    },
    textarea: {
        borderColor: Colors.BLUE,
        borderWidth: 1,
        paddingVertical: hp(4),
        minHeight: hp(174),
        fontFamily: Fonts.LexendMedium,
        textAlign: "left",
        ...FontSize.rfs15,
        paddingHorizontal: hp(12),
        marginTop: hp(12),
        borderRadius: 8,
        color: Colors.BLACK,
    },
    login: {
        backgroundColor: Colors.BLACK,
        color: Colors.WHITE,
        borderWidth: 1,
        borderColor: Colors.BLACK,
        height: Utilities.wp(12),
        fontFamily: Fonts.LexendLight,
        fontWeight: "normal",
    },
    grey: {
        backgroundColor: Colors.BORDER_GRAYLIGHTEST,
        color: Colors.BLACK,
        borderColor: Colors.BORDER_GRAYLIGHTEST,
        width: wp(330),
    },
    selectInput: {
        flexDirection:'row',
        height: Utilities.hp(5),
        borderRadius: Utilities.hp(2.5),
        paddingHorizontal:Utilities.wp(5),
        backgroundColor: Colors.BORDER_GRAYLIGHTEST,
        alignItems:'center',
        justifyContent: 'space-between',
    },
    selectInputText: {
        textColor: 'red',
        ...FontSize.rfs16,
        paddingTop: Utilities.hp(1),
        fontFamily: Fonts.LexendRegular,
    },
});

export default InputText;
