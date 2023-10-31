import React, {useContext, useEffect, useState} from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import Utilities from "../../utils/UtilityMethods";
import FontFamily from "../../Constants/FontFamily";
import GeneralAPIWithEndPoint from "../../api/GeneralAPIWithEndPoint";
import { hp, wp } from "../../utils/responsiveSizes";
import { BlackArrowLeft, Cart, Forward, NoVehicle, GreenOilChange, WhiteArrowForward, WhiteArrowBackward } from "../../assets";


import TabBar from "./components/TabBar";
import Loader from "../../Components/Loader";
import BackHeader from "../../Components/Header/BackHeader";
import {CommonContext} from "../../contexts/ContextProvider";

const ServicesListing = ({ route }) => {
  const {selectedBranch, inCartOrder}  = useContext(CommonContext);

  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  const isRTL = i18n.language === "ar";

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const body = {
      branch_id: selectedBranch.id,
      category_type: "service",
    };
    GeneralAPIWithEndPoint("/branch/categories", body).then((response) => {
      setLoading(false);
      const categories = [];
      response.forEach((category) => {
        if (category?.id) {
          categories.push(category);
        }
      });
      setCategories(categories);
    });
  }, []);

  const onPressCartButton = () =>{
    if (inCartOrder?.services?.length > 0){
      navigation.navigate("Slots", {isOnDemand:false});
    }else {
      navigation.navigate("PaymentMethod");
    }
  }

  return (
      <View style={styles.container}>
        <BackHeader
            title={selectedBranch.name}
            rightIcon={Cart}
            RightPress={onPressCartButton}
        />
        <TabBar active={2} />
        <View style={styles.paddedContent}>
          {!loading && (
              <FlatList
                  data={categories}
                  style={styles.list}
                  ListEmptyComponent={() => (
                      <View style={styles.img}>
                        <Image
                            resizeMode="contain"
                            transitionDuration={1000}
                            source={NoVehicle}
                            style={styles.item}
                        />
                        <Text style={styles.text}>{t("productsAndServices.noServicesAdded")}</Text>
                      </View>
                  )}
                  renderItem={({ item }) => {
                    return (
                        <View style={[styles.service]}>
                          <View style={styles.titleContainer}>
                            <Text style={styles.title}>{item?.name}</Text>
                            <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate("ServicesSubCategory", {category: item,});}}>
                              <View style={{width: wp(32)}} />
                              <Text style={styles.buttonText}>{t("productsAndServices.order")}</Text>
                              <View style={{width: wp(13)}} />
                              <Image style={styles.orderButtonArrow} source={isRTL ? WhiteArrowBackward : WhiteArrowForward} />
                              <View style={{width: wp(13)}} />
                            </TouchableOpacity>
                          </View>
                          {item?.file ?
                              <Image
                                  style={styles.serviceImage}
                                  source={{ uri: `data:image/gif;base64,${item?.file}` }}
                              /> : <GreenOilChange width={wp(32)} height={wp(32)} /> }
                        </View>
                    );
                  }}
              />
          )}
        </View>
        <Loader visible={loading} />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  row: {
    margin: 10,
    width: "60%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(12),
  },
  paddedContent: {
    flex: 1,
    paddingHorizontal: wp(20),
  },
  productImage: {
    height: wp(140),
    width: wp(130),
    marginTop: 20,
    backgroundColor: Colors.RED,
    borderRadius: wp(8),
  },
  service: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginTop: hp(20),
    paddingEnd: hp(20),
    paddingStart: hp(40),
    paddingVertical: hp(20),

    borderRadius: hp(20),
    backgroundColor: Colors.BLACK,
  },
  titleContainer: {
    marginVertical: hp(40),
    justifyContent: 'space-between',
  },
  list: {
    flex: 1,
  },
  title: {
    ...FontSize.rfs18,
    ...FontFamily.bold,
    color: Colors.WHITE,
  },
  value: {
    fontFamily: Fonts.SFProDisplaySemiBold,
    textAlign: "left",
    ...FontSize.rfs16,
    color: "#B8B9C1",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: 'flex-start',

    height: hp(28),
    borderRadius: wp(5),
    backgroundColor: Colors.DARKERGREEN,
  },
  buttonText: {
    ...FontSize.rfs14,
    ...FontFamily.medium,
    color: Colors.WHITE,
  },
  orderButtonArrow: {
    width: wp(6),
    height: hp(9),
    resizeMode: "contain"
  },
  serviceImage: {
    width: wp(148),
    height: hp(160),
    borderRadius: hp(7),
    resizeMode: "stretch",
  },
  forwardIcon: {
    width: "120%",
    marginTop: 2,
    height: "80%",
    resizeMode: "contain",
  },
  img: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  item: {
    height: hp(160),
    resizeMode: "contain",
    width: wp(105),
    marginTop: hp(60),
  },
  text: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendMedium,
    textAlign: "center",
    ...FontSize.rfs24,
    marginTop: hp(5),
  },
  cartIcon: {
    width: wp(24),
    height: hp(26),
  }
});

export default ServicesListing;
