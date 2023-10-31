import React from "react";
import { Image, Text, View } from "react-native";
import { NoVehicle } from "../../assets";
import { useTranslation } from "react-i18next";

export const EmptyListView = (props) => {
  const { image, imageSize, text, title } = props;
  console.log("props : ", props);
  return (
    <View style={styles.container}>
      {/*<Image*/}
      {/*  resizeMode="contain"*/}
      {/*  transitionDuration={1000}*/}
      {/*  source={image}*/}
      {/*  style={styles.itemImage(imageSize)}*/}
      {/*/>*/}
      <Text style={styles.text}> {text}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  itemImage: (imageSize) => {
    return {
      width: imageSize?.width || 0,
      height: imageSize?.height || 0,
    };
  },
  text: {},
  title: {},
});
