//import liraries
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import FullButton from "../../../Components/Buttons/FullButton";
import Colors from "../../../Constants/Colors";
import Fonts from "../../../Constants/fonts";
import { hp, wp } from "../../../utils/responsiveSizes";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

// create a component
const BottomBar = ({
  btnTitle,
  onPress,
  updateCart,
  totalPrice,
  hideButton,
  vat,
  completed,
  order,
}) => {
  const [price, setPrice] = useState(0);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const isFocused = useIsFocused();
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
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.total}>{t("bottom.Grand Total")}</Text>
        <Text style={styles.price}>
          {price} {t("common.SAR")}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.totalVat}>{t("bottom.Vat Amount")}</Text>
        <Text style={styles.vatPrice}>
          {vat || vat == 0 ? vat : (price * 8) / 100} {t("common.SAR")}
        </Text>
      </View>
      {price > 0 && !hideButton && (
        <View style={styles.buttonContainer}>
          <FullButton
            onPress={onPress ? () => onPress(price) : () => {}}
            title={btnTitle || t("bottom.View Order")}
          />
        </View>
      )}
      {completed && (
        <View style={styles.buttonContainer}>
          <FullButton
            type="cancel"
            onPress={() => navigation.navigate("Complain", { order })}
            title={"Complain"}
          />
        </View>
      )}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.DARKERGREEN,
    minHeight: hp(50),
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
    paddingVertical: wp(20),
    paddingHorizontal: wp(27),
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  total: {
    fontFamily: Fonts.SFProDisplaySemiBold,
    textAlign: "left",
    ...FontSize.rfs14,
    color: Colors.BLACK,
  },
  totalVat: {
    fontFamily: Fonts.SFProDisplaySemiBold,
    textAlign: "left",
    ...FontSize.rfs12,
    color: Colors.BLACK,
  },
  price: {
    fontFamily: Fonts.SFProDisplaySemiBold,
    textAlign: "left",
    ...FontSize.rfs24,
    color: Colors.BLUE,
  },
  vatPrice: {
    fontFamily: Fonts.SFProDisplaySemiBold,
    textAlign: "left",
    ...FontSize.rfs14,
    color: Colors.BLUE,
  },
  buttonContainer: {
    marginTop: wp(10),
  },
});

//make this component available to the app
export default BottomBar;
