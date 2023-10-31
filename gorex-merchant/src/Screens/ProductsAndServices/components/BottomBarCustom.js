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
import Utilities from "../../../utils/UtilityMethods";
import FontSize from "../../../Constants/FontSize";

const BottomBarCustom = ({btnTitle, onPress, updateCart, cartUpdated, totalPrice, hideButton, vat, completed, updateCartParam, order,}) => {
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
    <View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.content} onPress={price > 0 && !hideButton ? () => onPress(price) : () => {}}>
          {price > 0 && !hideButton ? (
            <View style={styles.buttonContainer2}>
              <TouchableOpacity
                onPress={onPress ? () => onPress(price) : () => {}}
              >
                <Text style={styles.title}>
                  {btnTitle ||
                    t(
                      updateCartParam && cartUpdated
                        ? t("productsAndServices.updateCart")
                        : t("productsAndServices.viewCart")
                    )}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonContainer2}>
              <View>
                <Text style={styles.title}>{btnTitle || t("productsAndServices.addToCart")}</Text>
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
          <Text style={styles.price}>
            {t("common.sar")} {price}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.DARKERGREEN,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Utilities.hp(2),
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    paddingVertical: 2,
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
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs20,
    paddingBottom: Utilities.wp(2),
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

export default BottomBarCustom;
