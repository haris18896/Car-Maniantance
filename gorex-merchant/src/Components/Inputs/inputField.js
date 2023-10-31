import React, { useState, memo } from "react";
import {
  View,
  Text,
  Image,
  Platform,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";

// ** Custom Theme && Styling
import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import { wp, hp } from "../../utils/responsiveSizes";

function InputField({
  img,
  label,
  value,
  placeholder,
  onChangeText,
  selectionColor,
  onPressBarCode,
  placeholderColor,
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View style={styles.InputWrapper}>
      <Text style={styles.inputHeading}>{label}</Text>

      <View
        style={[
          styles.inputValueWrapper(Platform.OS),
          isFocused && styles.inputValueWrapperFocused,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={selectionColor}
          caretColor={selectionColor}
        />

        {img && (
          <Pressable onPress={onPressBarCode}>
            <Image source={img} style={styles.endEndorsement} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default memo(InputField);

const styles = StyleSheet.create({
  InputWrapper: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  inputHeading: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs16,
    color: Colors.BLACK,
    textAlign: "left",
    marginBottom: wp(10),
  },
  inputValueWrapper: (platform) => {
    return {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: `#F2F2F2`,
      borderRadius: wp(25),
      paddingVertical: platform === "ios" ? hp(8) : 0,
      paddingHorizontal: wp(20),
      marginBottom: wp(20),
      borderWidth: 1,
      borderColor: "transparent",
    };
  },
  input: {
    fontFamily: Fonts.LexendRegular,
    ...FontSize.rfs16,
    textAlign: "left",
    color: Colors.BLACK,
    padding: hp(5),
    width: "90%",
  },
  endEndorsement: {
    width: wp(20),
    height: hp(20),
    marginLeft: wp(10),
  },
  inputValueWrapperFocused: {
    backgroundColor: Colors.WHITE,
    borderColor: Colors.DARKERGREEN,
  },
});
