import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import FullButton from "../../../Components/Buttons/FullButton";
import Colors from "../../../Constants/Colors";
import Fonts from "../../../Constants/fonts";
import { hp, wp } from "../../../utils/responsiveSizes";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import SmallButton from "../../../Components/Buttons/SmallButton";
import { Arrowen, Next } from "../../../assets";
import Utilities from "../../../utils/UtilityMethods";
import FontSize from "../../../Constants/FontSize";

// create a component
const FooterGorex = ({
  btnTitle,
  onPress,
  updateCart,
  totalPrice,
  hideButton,
  vat,
  title,
  completed,
  backgroundColor,
  order,
  disabled,
  containerStyle,
}) => {
  const [price, setPrice] = useState(0);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("cart");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };
  const getServices = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("services");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    if (isFocused) {
      if (totalPrice > 0) {
        setPrice(totalPrice);
      } else {
        getData().then((data) => {
          let _price = 0;
          data?.forEach((item) => {
            _price += Number(item?.price) * Number(item?.quantity);
          });
          getServices().then((data) => {
            if (data) {
              data?.forEach((item) => {
                _price += Number(item?.price) * Number(item?.quantity);
              });
            }
            setPrice(_price);
          });
          setPrice(_price);
        });
      }
    }
  }, [isFocused, updateCart, totalPrice]);

  return (
    <TouchableOpacity
      disabled={disabled}
      style={containerStyle}
      onPress={onPress}
    >
      <View
        style={{
          ...styles.container,
          backgroundColor: backgroundColor
            ? backgroundColor
            : Colors.DARKERGREEN,
        }}
      >
        <View style={styles.bottomTextContainer}>
          <Text
            style={[
              styles.title,
              { color: isRTL ? Colors.BLACK : Colors.WHITE },
            ]}
          >
            {title}
          </Text>
          <TouchableOpacity onPress={onPress}>
            <Image
              resizeMode="contain"
              style={styles.icon}
              source={isRTL ? Arrowen : Next}
            ></Image>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Utilities.hasNotch() ? 10 : 0,
    paddingVertical: Utilities.hp(3),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    paddingVertical: 2,
  },

  icon: {
    height: Utilities.hp(2),
  },
  // total: {
  //   fontFamily: Fonts.SFProDisplaySemiBold,
  //   textAlign: "left",
  //   ...FontSize.rfs14,
  //   color: Colors.WHITE,
  // },
  // totalVat: {
  //   fontFamily: Fonts.SFProDisplaySemiBold,
  //   textAlign: "left",
  //   ...FontSize.rfs12,
  //   color: Colors.WHITE,
  // },
  // price: {
  //   fontFamily: Fonts.SFProDisplaySemiBold,
  //   textAlign: "left",
  //   ...FontSize.rfs22,
  //   color: Colors.WHITE,
  // },
  // vatPrice: {
  //   fontFamily: Fonts.SFProDisplaySemiBold,
  //   textAlign: "left",
  //   ...FontSize.rfs14,
  //   color: Colors.WHITE,
  // },
  buttonContainer: {
    alignItems: "center",
    alignSelf: "flex-start",
  },
  title: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs20,
    paddingBottom: Utilities.wp(2),
    color: Colors.WHITE,
  },
  buttonContainer2: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
});

//make this component available to the app
export default FooterGorex;
