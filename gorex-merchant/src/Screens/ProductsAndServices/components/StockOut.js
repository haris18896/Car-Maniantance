import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import FullButton from "../../../Components/Buttons/FullButton";
import Colors from "../../../Constants/Colors";
import Fonts from "../../../Constants/fonts";
import { hp, wp } from "../../../utils/responsiveSizes";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import SmallButton from "../../../Components/Buttons/SmallButton";
import FontSize from "../../../Constants/FontSize";

// create a component
const StockOut = ({
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
    <View>
      <View style={styles.container}>
        <View style={styles.content}>
          {price > 0 && !hideButton ? (
            <View style={styles.buttonContainer2}>
              <TouchableOpacity
                onPress={onPress ? () => onPress(price) : () => {}}
              >
                <Text style={styles.title}>{btnTitle || t("View Order")}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonContainer2}>
              <View>
                <Text style={styles.title}>{btnTitle || t("Add to cart")}</Text>
              </View>
            </View>
          )}
          {completed && (
            <View style={styles.buttonContainer}>
              <SmallButton
                type="cancel"
                onPress={() => navigation.navigate("Complain", { order })}
                title={"Complain"}
              />
            </View>
          )}
          {/* <Text style={styles.total}>{t("bottom.Grand Total")}</Text> */}
          <Text style={styles.price}>
            {t("common.SAR")} {price}
          </Text>
        </View>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.RED,
    height: hp(60),

    paddingVertical: wp(5),
    paddingHorizontal: wp(10),
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
    color: Colors.WHITE,
  },
  totalVat: {
    fontFamily: Fonts.SFProDisplaySemiBold,
    textAlign: "left",
    ...FontSize.rfs12,
    color: Colors.WHITE,
  },
  price: {
    fontFamily: Fonts.SFProDisplaySemiBold,
    textAlign: "left",
    ...FontSize.rfs22,
    color: Colors.WHITE,
  },
  vatPrice: {
    fontFamily: Fonts.SFProDisplaySemiBold,
    textAlign: "left",
    ...FontSize.rfs14,
    color: Colors.WHITE,
  },
  buttonContainer: {
    // marginTop: wp(10),
    alignItems: "center",
    alignSelf: "flex-start",
    // marignRight: 30,
    // backgroundColor: "red",
  },
  title: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "center",
    alignSelf: "center",

    fontWeight: "bold",
    color: Colors.WHITE,
    ...FontSize.rfs22,
  },
  buttonContainer2: {
    alignItems: "center",

    alignSelf: "center",
    justifyContent: "center",
  },
});

//make this component available to the app
export default StockOut;
