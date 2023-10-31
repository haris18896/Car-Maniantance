import React, { useState, useEffect, useContext } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";

import TabBar from "./components/TabBar";
import { getData, setCart } from "../../utils/common";
import StockOut from "./components/StockOut";
import { useTranslation } from "react-i18next";
import BackHeader from "../../Components/Header/BackHeader";
import BottomBarCustom from "./components/BottomBarCustom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { wp, hp } from "../../utils/responsiveSizes";

import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import Colors from "../../Constants/Colors";
import Utilities from "../../utils/UtilityMethods";
import { Cart, GreenOilChange } from "../../assets";

import { CommonContext } from "../../contexts/ContextProvider";
import Footer from "./components/Footer";
import analytics from "@react-native-firebase/analytics";

const ProductDetails = ({ route }) => {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { selectedBranch, inCartOrder, setInCartOrder } =
    useContext(CommonContext);
  const product = route?.params?.product;

  const [count, setCount] = useState(
    route?.params?.count ? route?.params?.count : 0
  );
  const [price, setPrice] = useState(0);

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "product_detail_screen",
    });
  }, []);

  useEffect(() => {
    if (inCartOrder) {
      setPrice(inCartOrder.totalPrice);
      inCartOrder.products.map((item) => {
        if (
          item.product.id === product.id &&
          item.product.name === product.name
        ) {
          setPrice(inCartOrder.totalPrice - item.quantity * item.product.price);
          setCount(item.quantity);
        }
      });
    }
  }, [isFocused]);

  const decreaseCount = () => {
    setCount(count - 1);
  };

  const increaseCount = () => {
    setCount(count + 1);
  };

  const addToCart = () => {
    let cartBranch = null;
    let cartServices = [];
    let cartProducts = [];
    let cartTotal = 0;

    if (inCartOrder) {
      cartBranch = inCartOrder.branch;
      cartServices = [...inCartOrder.services];
      cartProducts = [...inCartOrder.products];

      // check if the same product is already in cart
      let indexOfProductInCartOrder = -1;
      cartProducts.map((inCartProduct, index) => {
        if (inCartProduct.product.id === product.id) {
          indexOfProductInCartOrder = index;
        }
      });

      if (indexOfProductInCartOrder > -1) {
        cartProducts.splice(indexOfProductInCartOrder, 1);
      }

      cartProducts.push({ product: product, quantity: count });

      let cartPrice = 0;
      cartServices.map((cartService) => {
        cartPrice = cartPrice + cartService.price;
      });
      cartProducts.map((cartProduct) => {
        cartPrice =
          cartPrice + cartProduct.product.price * cartProduct.quantity;
      });

      cartTotal = cartPrice;
    } else {
      cartBranch = selectedBranch;
      cartServices = [];
      cartProducts = [{ product: product, quantity: count }];
      cartTotal = product.price * count;
    }

    let order = {
      branch: cartBranch,
      services: cartServices,
      products: cartProducts,
      totalPrice: cartTotal,
      date: null,
      slot: null,
    };

    setInCartOrder(order);
    setCart(order).then();
  };

  const onPressCartIcon = () => {
    // navigation.navigate("PaymentMethod");
    if (inCartOrder?.services?.length > 0) {
      navigation.navigate("Slots", { isOnDemand: false });
    } else {
      navigation.navigate("PaymentMethod");
    }
  };

  const onPressBottomButton = () => {
    if (inCartOrder && count <= 0) {
      if (inCartOrder?.services?.length > 0) {
        navigation.navigate("Slots", { isOnDemand: false });
      } else {
        navigation.navigate("PaymentMethod");
      }
    } else if (inCartOrder && count > 0) {
      if (inCartOrder.branch.id === selectedBranch.id) {
        addToCart();
        if (inCartOrder?.services?.length > 0) {
          navigation.navigate("Slots", { isOnDemand: false });
        } else {
          navigation.navigate("PaymentMethod");
        }
        // navigation.navigate("PaymentMethod");
      } else {
        Alert.alert(
          "Clear the previous cart to make an order from different branch"
        );
      }
    } else if (count > 0) {
      addToCart();
      if (inCartOrder?.services?.length > 0) {
        navigation.navigate("Slots", { isOnDemand: false });
      } else {
        navigation.navigate("PaymentMethod");
      }
      // navigation.navigate("PaymentMethod");
    }
  };

  const getBottomButtonTitle = () => {
    let title = t("service.addcart");
    if (inCartOrder && count > 0) {
      title = t("productsAndServices.updateCart");
    } else if (inCartOrder && count <= 0) {
      title = t("productsAndServices.viewCart");
    }
    return title;
  };

  const getTotalPriceForBottomButton = () => {
    let productPrice = count * product.price;
    return productPrice + price;
  };

  return (
    <View style={styles.container}>
      <BackHeader
        title={selectedBranch?.name}
        rightIcon={Cart}
        RightPress={() => {
          onPressCartIcon();
        }}
      />
      <TabBar active={1} />
      <View style={styles.paddedContent}>
        <View style={styles.imageContainer}>
          {product?.file ? (
            <Image
              style={styles.image}
              resizeMode="contain"
              source={{ uri: `data:image/gif;base64,${product?.file}` }}
            />
          ) : (
            <GreenOilChange width={wp(32)} height={wp(32)} />
          )}
        </View>
        <View style={styles.namePriceContainer}>
          <Text style={styles.name}>{product?.name}</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.price}>
            {t("common.SAR")} {product?.price}
          </Text>
        </View>
        <View
          style={{
            marginTop: 20,
          }}
        >
          <Text style={styles.quantityPrice}>
            {t("productsAndServices.selectQuantity")}
          </Text>
        </View>
        <View style={styles.incrementContainer}>
          <TouchableOpacity
            style={{
              width: Utilities.wp(10),
              paddingVertical: 10,
              alignItems: "center",
              display: "flex",
            }}
            disabled={count === 0}
            onPress={decreaseCount}
          >
            <Text
              style={{
                ...FontSize.rfs30,
                alignSelf: "center",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                width: Utilities.wp(3.5),
                backgroundColor: count === 0 ? Colors.GREY : Colors.BLACK,
                height: 2.2,
              }}
            />
          </TouchableOpacity>
          <Text style={[styles.count]}>{count}</Text>
          <TouchableOpacity
            style={{ width: Utilities.wp(10), paddingBottom: 2 }}
            onPress={increaseCount}
          >
            <Text
              style={{
                ...FontSize.rfs30,
                alignSelf: "center",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                color: Colors.BLACK,
              }}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Footer
        title={getBottomButtonTitle()}
        rightTitle={t("common.SAR") + " " + getTotalPriceForBottomButton()}
        onPress={() => {
          onPressBottomButton();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  paddedContent: {
    paddingHorizontal: wp(14),
    flex: 1,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Utilities.wp(2),
    marginTop: wp(15),
  },
  image: {
    width: "100%",
    height: Utilities.hp(28),
    margin: wp(5),
  },
  namePriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: wp(11),
  },
  name: {
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    color: Colors.BLACK,
    width: "70%",
  },
  price: {
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    color: Colors.DARKERGREEN,
  },
  quantityPrice: {
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendBold,
    fontWeight: "bold",
    textAlign: "left",
    color: Colors.BLACK,
  },
  descriptionContainer: {
    marginTop: 10,
  },
  description: {
    ...FontSize.rfs13,
    fontFamily: Fonts.PoppinsMedium,
    textAlign: "left",
    color: Colors.DARK_GREY,
  },
  incrementContainer: {
    marginTop: Utilities.hp(3),
    width: Utilities.wp(35),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: Utilities.wp(50),
    borderColor: Colors.BLACK,
    borderWidth: 2,
  },
  roundButton: {
    width: wp(30),
    height: wp(30),
    backgroundColor: Colors.DARKERGREEN,
    justifyContent: "center",
    alignItems: "center",
  },
  count: {
    ...FontSize.rfs27,
    fontFamily: Fonts.GloryBold,
    color: Colors.BLACK,
  },
  cartIcon: {
    width: wp(24),
    height: hp(26),
  },
});

export default ProductDetails;
