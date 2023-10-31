import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import Colors from "../Constants/Colors";
import FontSize from "../Constants/FontSize";
import FontFamily from "../Constants/FontFamily";
import { hp, wp } from "../utils/responsiveSizes";

const MessageWithImage = ({
  imageSource,
  imageStyle,
  message,
  description,
}) => {
  return (
    <View style={{ alignItems: "center" }}>
      <Image style={[styles.image, imageStyle]} source={imageSource} />
      <View style={{ height: hp(30) }} />
      <Text style={styles.message}>{message}</Text>
      <View style={{ height: hp(13) }} />
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: wp(125),
    height: hp(100),
    resizeMode: "contain",
  },
  message: {
    ...FontSize.rfs24,
    ...FontFamily.bold,
    color: Colors.BLACK,
  },
  description: {
    ...FontSize.rfs16,
    ...FontFamily.medium,
    color: Colors.LIGHTGREY,

    width: wp(256),
    textAlign: "center",
  },
});

export default MessageWithImage;
