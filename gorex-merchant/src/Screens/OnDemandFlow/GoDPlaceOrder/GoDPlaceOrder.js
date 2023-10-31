import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import Colors from "../../../Constants/Colors";
import FontSize from "../../../Constants/FontSize";
import FontFamily from "../../../Constants/FontFamily";
import { hp, wp } from "../../../utils/responsiveSizes";
import {
  AddWallet,
  CheckBoxChecked,
  CheckBoxUnchecked,
  CouponDel,
  CouponImage,
  Infogrey,
} from "../../../assets";

import Divider from "../../../Components/Divider";
import BackHeader from "../../../Components/Header/BackHeader";
import Footer from "../../ProductsAndServices/components/Footer";
import moment from "moment";
import CreateOrder, { ApplePay } from "../../../api/CreateOrder";
import { showToast } from "../../../utils/common";
import { CommonContext } from "../../../contexts/ContextProvider";
import Loader from "../../../Components/Loader";
import WalletModel from "../../../Components/Modal/WalletModel";
import { getPlaceOrderNow, setPlaceOrderNow } from "../../../contexts/global";
import Utilities from "../../../utils/UtilityMethods";
import CouponButton from "../../../Components/Buttons/CouponButton";
import i18n from "i18next";
import Fonts from "../../../Constants/fonts";
import CouponDetail from "../../../api/CouponDetail";
import ValidateCoupon from "../../../api/ValidateCoupon";
import analytics from "@react-native-firebase/analytics";
import { AppEventsLogger } from "react-native-fbsdk-next";
import getPaymentMethod from "../../../api/getPaymentMethod";
import { isObjEmpty } from "../../../utils/utils";
// import crashlytics from "@react-native-firebase/crashlytics";

const GoDPlaceOrder = ({ route }) => {
  const { userProfile, onDemandProduct } = useContext(CommonContext);
  let scrollViewRef = useRef();
  const { placeOrderNow, onDemandOrder, COD } = route?.params;

  const { t } = useTranslation();
  const navigation = useNavigation();

  const isRTL = i18n.language === "ar";

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(
    onDemandOrder?.service?.price
      ? onDemandOrder?.service?.price
      : onDemandProduct?.product?.price
  );
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState("");
  const [isValidCoupon, setIsValidCoupon] = useState(false);
  const [modalWallet, setModalWallet] = useState(false);
  const [couponPrice, setCouponPrice] = useState(
    onDemandOrder?.service?.price
      ? onDemandOrder?.service?.price
      : onDemandProduct?.product?.price
  );
  const [paymentData, setPaymentData] = useState();
  const [paymentMethodId, setPaymentMethodId] = useState();

  useEffect(() => {
    if (placeOrderNow && userProfile?.balance >= price) {
      createOrder();
      setPlaceOrderNow(false);
    }

    if (placeOrderNow && userProfile?.balance < price) {
      showToast(
        t("errors.error"),
        t("gorexOnDemand.unableToUpdateTheWallet"),
        "error"
      );
    }
  }, [placeOrderNow]);

  // const OrderAnalytics = ({ name }) => {
  //   if (!isObjEmpty(onDemandOrder)) {
  //     analytics()
  //       .setUserProperty("service", `${onDemandOrder?.service?.name}`)
  //       .catch((error) => {
  //         analytics().logEvent("serviceError", {
  //           firebase_error_value: "Invalid service",
  //           firebase_error_code: 6,
  //         });
  //       });
  //     analytics()
  //       .setUserProperty("Price", `${onDemandOrder?.service?.price}`)
  //       .catch((error) => {
  //         analytics().logEvent("PriceError", {
  //           firebase_error_value: "Invalid Price",
  //           firebase_error_code: 6,
  //         });
  //       });
  //     analytics()
  //       .setUserProperty(
  //         "serviceProvider",
  //         `${onDemandOrder?.serviceProvider?.name}`
  //       )
  //       .catch((error) => {
  //         analytics().logEvent("serviceProviderError", {
  //           firebase_error_value: "Invalid serviceProvider",
  //           firebase_error_code: 6,
  //         });
  //       });
  //     analytics()
  //       .setUserProperty(
  //         "date",
  //         `${moment.unix(onDemandOrder?.date).format("YYYY-MM-DD")}`
  //       )
  //       .catch((error) => {
  //         // analytics().logEvent("dateError", {
  //         //   firebase_error_value: "Invalid date",
  //         //   firebase_error_code: 6,
  //         // });
  //       });
  //     analytics()
  //       .setUserProperty("Vehicle", `${onDemandOrder?.vehicle?.name}`)
  //       .catch((error) => {
  //         // analytics().logEvent("vehiclError", {
  //         //   firebase_error_value: "Invalid vehicle",
  //         //   firebase_error_code: 6,
  //         // });
  //       });
  //     // analytics()
  //     //   .setUserProperty(
  //     //     "VehicleModel",
  //     //     `${onDemandOrder?.vehicle?.vehicle_model}`
  //     //   )
  //     //   .catch((error) => {
  //     //     analytics().logEvent("vechileModelError", {
  //     //       firebase_error_value: "invalid vehicle name",
  //     //       firebase_error_code: 6,
  //     //     });
  //     //   });

  //     // analytics().logScreenView({
  //     //   screen_name: `${name}`,
  //     //   service: `${onDemandOrder?.service?.name}`,
  //     //   Price: `${onDemandOrder?.service?.price}`,
  //     //   serviceProvider: `${onDemandOrder?.serviceProvider?.name}`,
  //     //   date: `${moment.unix(onDemandOrder?.date).format("YYYY-MM-DD")}`,
  //     //   Vehicle: `${onDemandOrder?.vehicle?.name}`,
  //     //   VehicleModel: `${onDemandOrder?.vehicle?.vehicle_model}`,
  //     // });

  //     // analytics().logEvent(`${name}`, {
  //     //   service: `${onDemandOrder?.service?.name}`,
  //     //   Price: `${onDemandOrder?.service?.price}`,
  //     //   serviceProvider: `${onDemandOrder?.serviceProvider?.name}`,
  //     //   date: `${moment.unix(onDemandOrder?.date).format("YYYY-MM-DD")}`,
  //     //   Vehicle: `${onDemandOrder?.vehicle?.name}`,
  //     //   VehicleModel: `${onDemandOrder?.vehicle?.vehicle_model}`,
  //     // });

  //     // AppEventsLogger.setUserData({
  //     //   service: `${onDemandOrder?.service?.name}`,
  //     //   Price: `${onDemandOrder?.service?.price}`,
  //     //   serviceProvider: `${onDemandOrder?.serviceProvider?.name}`,
  //     //   date: `${moment.unix(onDemandOrder?.date).format("YYYY-MM-DD")}`,
  //     //   Vehicle: `${onDemandOrder?.vehicle?.name}`,
  //     //   VehicleModel: `${onDemandOrder?.vehicle?.vehicle_model}`,
  //     // });

  //     // AppEventsLogger.logEvent(`${name}`, {
  //     //   service: `${onDemandOrder?.service?.name}`,
  //     //   Price: `${onDemandOrder?.service?.price}`,
  //     //   serviceProvider: `${onDemandOrder?.serviceProvider?.name}`,
  //     //   date: `${moment.unix(onDemandOrder?.date).format("YYYY-MM-DD")}`,
  //     //   Vehicle: `${onDemandOrder?.vehicle?.name}`,
  //     //   VehicleModel: `${onDemandOrder?.vehicle?.vehicle_model}`,
  //     // });

  //     // AppEventsLogger.logEvent("page_view", {
  //     //   screen_name: "dashboard_screen",
  //     // });
  //   }
  // };

  // useEffect(() => {
  //   OrderAnalytics({ name: "add_to_cart" });
  //   AppEventsLogger.logPurchase(onDemandOrder?.service?.price, "SAR", {
  //     param: "AddToCart",
  //   });
  // }, [onDemandOrder]);

  useEffect(() => {
    getPaymentMethod({
      serviceProviderId: onDemandOrder?.serviceProvider?.id
        ? onDemandOrder?.serviceProvider?.id
        : onDemandProduct?.productProvider?.id,
    })
      .then((response) => {
        setPaymentData(response?.response?.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const onPressCouponApply = () => {
    Keyboard.dismiss();
    if (couponCode.length <= 0) {
      showToast("Error", "Please enter coupon code", "error");
    } else {
      let orderBody = getOrderData();
      orderBody.coupon_codes = couponCode;

      ValidateCoupon({ body: orderBody }).then(({ success, response }) => {
        if (success && response !== undefined) {
          setPrice(parseFloat(response));
          setCouponPrice(parseFloat(response));
          setIsValidCoupon(true);
          setCoupon(couponCode);
          if (parseFloat(response) === 0) {
            setPaymentMethod("Wallet");
          }
        } else {
          setIsValidCoupon(false);
          setPaymentMethod(null);
          showToast("Error", t("placeOrder.coupon_error_message"), "error");
        }
      });
    }
  };
  const checkIfCouponProductIdsAreInCartOrder = (arrayIds) => {
    let isValidProduct = false;

    const index = arrayIds.findIndex((id) => id === onDemandOrder?.service?.id);
    if (index !== -1) {
      isValidProduct = true;
    }
    return isValidProduct;
  };
  const onPressCouponDelete = () => {
    setPrice(
      onDemandOrder?.service?.price
        ? onDemandOrder?.service?.price
        : onDemandProduct?.product?.price
    );
    setCouponCode("");
    setCouponPrice(
      onDemandOrder?.service?.price
        ? onDemandOrder?.service?.price
        : onDemandProduct?.product?.price
    );
    setIsValidCoupon(false);
    setPaymentMethod(null);
  };

  const getOrderData = () => {
    return {
      driver: userProfile?.id,
      vehicle_id: onDemandOrder?.vehicle?.id,
      service_provider: onDemandOrder?.serviceProvider?.id,
      payment_method_id: paymentMethodId,
      coupon_codes: coupon,
      card_number: false,
      schedule_date: moment.unix(onDemandOrder.date).format("YYYY-MM-DD"),
      notes: onDemandOrder?.notes,
      on_demand: true,
      address_id: onDemandOrder?.address?.id,
      slot_id: onDemandOrder?.slot?.id,
      sub_total: price,
      order_lines: [
        [
          0,
          0,
          {
            product_id: onDemandOrder?.service?.id
              ? onDemandOrder?.service?.id
              : onDemandProduct?.product?.id,
            quantity: 1,
            price: onDemandOrder?.service?.price
              ? onDemandOrder?.service?.price
              : onDemandProduct?.product?.price,
            total_price: onDemandOrder?.service?.price
              ? onDemandOrder?.service?.price
              : onDemandProduct?.product?.price,
          },
        ],
      ],
    };
  };

  const onPressPlaceOrder = async () => {
    if (paymentMethod === "Credit Card") {
      navigation.navigate("TopUpCard", {
        amount: price,
        comingFromOnDemand: true,
        comingFromNormal: false,
        success: false,
        title: t("payment.paymentCredit_DebitCard"),
      });
    } else if (paymentMethod === "Wallet" && userProfile?.balance < price) {
      setModalWallet(true);
    } else if (paymentMethod === "Wallet" && userProfile?.balance >= price) {
      createOrder();
    } else if (paymentMethod === "COD") {
      createOrder();
    } else if (paymentMethod === "Credit Card") {
      createOrder();
    } else if (paymentMethod === "Apple Pay") {
      postApplePay();
    } else {
      showToast("Error", "Random Error", "error");
      // crashlytics().recordError("Random Error at placing order");
    }

    await analytics().setUserProperty("PaymentMethod", `${paymentMethod}`);
    await analytics().logEvent("PaymentMethod", {
      payment_method: `${paymentMethod}`,
    });
  };

  const postApplePay = () => {
    setLoading(true);
    ApplePay({
      orderId: 10,
    }).then(({ success, response }) => {
      setTimeout(() => {
        setLoading(false);
        if (response) {
        } else {
          showToast("Error", response, "error");
          // crashlytics().recordError(response);
        }
      }, 1000);
    });
  };

  const createOrder = () => {
    let data = getOrderData();
    setLoading(true);
    CreateOrder(data).then(({ success, response }) => {
      setTimeout(() => {
        setLoading(false);
        if (success) {
          // OrderAnalytics({ name: "purchase" });
          // AppEventsLogger.logPurchase(onDemandOrder?.service?.price, "SAR", {
          //   param: "purchase",
          // });
          navigation.navigate("OrderConfirmed", { order_id: response });
          showToast(
            t("payment.success"),
            t("payment.Order is created successfully"),
            "success"
          );
        } else {
          showToast("Error", response, "error");
          // crashlytics().recordError(response);
        }
      }, 1000);
    });
  };

  const renderOrderDetailItem = (title, value, routeName) => {
    return (
      <View>
        <View style={{ height: hp(20) }} />

        <View style={styles.orderDetailTitleContainer}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(routeName, { isOnDemand: true, check: true });
            }}
          >
            <Text style={styles.edit}>{t("common.edit")}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: hp(10) }} />
        <View style={{ alignItems: "flex-start" }}>
          <Text style={styles.orderDetailValue}>{value}</Text>
        </View>
        <View style={{ height: hp(20) }} />
        <Divider />
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={{ flex: 1 }}>
        <BackHeader
          title={t("common.gorexOnDemand")}
          leftPress={() => navigation.navigate("Slots", { check: false })}
        />
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* {renderOrderDetailItem(
            t("common.vehicle"),
            `${onDemandOrder.vehicle.manufacturer[1]} - ${onDemandOrder.vehicle.vehicle_model[1]} / ${onDemandOrder.vehicle.year_id[1]}`,
            "GoDChooseVehicle"
          )} */}
          {/* {renderOrderDetailItem(
            t("common.address"),
            onDemandOrder.address.address,
            "GoDChooseAddressAndSlot"
          )} */}
          {renderOrderDetailItem(
            t("common.timeSlot"),
            `${moment.unix(onDemandOrder.date).format("DD-MMMM-YYYY")}, ${
              onDemandOrder?.slot?.start_time
            } - ${onDemandOrder?.slot?.end_time}`,
            "Slots"
          )}
          {renderOrderDetailItem(
            t("common.service"),
            onDemandOrder?.service?.name
              ? onDemandOrder?.service?.name
              : onDemandProduct?.product?.name,
            "GoDChooseService"
          )}
          {renderOrderDetailItem(
            t("common.serviceProvider"),
            onDemandOrder?.serviceProvider?.name
              ? onDemandOrder?.serviceProvider?.name
              : onDemandProduct?.productProvider.name,
            "GoDChooseAddressAndSlot"
          )}

          <View style={{ height: hp(20) }} />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View>
              <Text style={styles.title}>{t("placeOrder.couponCode")}</Text>
              <View style={{ height: hp(10) }} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  height: hp(60),
                  backgroundColor: Colors.GHOST_WHITE,
                  borderRadius: hp(30),
                  paddingLeft: wp(20),
                  paddingRight: wp(10),
                }}
              >
                <TextInput
                  style={[
                    styles.couponInput,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                  placeholder={t("placeOrder.enterCouponCode")}
                  placeholderTextColor={Colors.LIGHTGREY}
                  value={couponCode}
                  onChangeText={(value) => setCouponCode(value)}
                  onFocus={() => {
                    setTimeout(() => {
                      scrollViewRef.current.scrollToEnd({ animated: true });
                    }, 500);
                  }}
                />

                {isValidCoupon ? (
                  <View style={{ flexDirection: "row", width: "10%" }}>
                    <TouchableOpacity
                      style={{ width: "100%", justifyContent: "center" }}
                      onPress={() => {
                        onPressCouponDelete();
                      }}
                    >
                      <Image
                        source={CouponDel}
                        style={[styles.del, { width: Utilities.wp(6) }]}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>

                    {/*<TouchableOpacity style={{width:'50%', alignItems:'center'}} onPress={() => onPressCouponInfo()}>*/}
                    {/*    <Image source={Infogrey} style={[styles.del,{width: Utilities.wp(6)}]} resizeMode="contain"/>*/}
                    {/*</TouchableOpacity>*/}
                  </View>
                ) : (
                  <CouponButton
                    title={t("placeOrder.apply")}
                    onPress={() => onPressCouponApply()}
                  />
                )}
              </View>
            </View>
          </KeyboardAvoidingView>

          <View style={styles.orderTotal}>
            <Text style={[styles.title, { marginVertical: hp(20) }]}>
              {t("common.orderTotal")}
            </Text>
            <View style={styles.orderDetailTitleContainer}>
              <Text style={styles.subTitle}>{t("common.subTotal")}</Text>
              <Text style={styles.subTitle}>
                {t("common.sar")}{" "}
                {onDemandOrder?.service?.price
                  ? onDemandOrder?.service?.price
                  : onDemandProduct?.product?.price}
              </Text>
            </View>
            <View style={styles.orderDetailTitleContainer}>
              <Text style={styles.subTitle}>{t("common.discount")}</Text>
              <Text style={styles.subTitle}>
                - {t("common.sar")}{" "}
                {onDemandProduct?.product?.price && couponPrice
                  ? onDemandProduct?.product?.price - couponPrice
                  : onDemandOrder?.service?.price && couponPrice
                  ? onDemandOrder?.service?.price - couponPrice
                  : 0}
              </Text>
            </View>
            {/*<View style={styles.orderDetailTitleContainer}>*/}
            {/*  <Text style={[styles.subTitle, { ...FontSize.rfs18, color: Colors.DARK_BLACK }]}>*/}
            {/*    {t("common.VAT")}*/}
            {/*  </Text>*/}
            {/*  <Text style={[styles.subTitle, { ...FontSize.rfs18, color: Colors.DARK_BLACK }]}>*/}
            {/*    {t("common.sar")}*/}
            {/*  </Text>*/}
            {/*</View>*/}

            <View
              style={[
                styles.orderDetailTitleContainer,
                { marginVertical: hp(20) },
              ]}
            >
              <Text
                style={[styles.subTitleTotal, { color: Colors.DARK_BLACK }]}
              >
                {t("common.total")}
              </Text>
              <Text
                style={[styles.subTitleTotal, { color: Colors.DARKERGREEN }]}
              >
                {t("common.sar")} {couponPrice}
              </Text>
            </View>
          </View>

          {/*<View style={{ height: hp(20) }} />*/}

          {/*<View*/}
          {/*  style={{ flexDirection: "row", justifyContent: "space-between" }}*/}
          {/*>*/}
          {/*  <Text style={styles.subTitle}>{t("common.totalAmount")}</Text>*/}
          {/*  <Text style={styles.subTitle}>*/}
          {/*    {t("common.sar")} {price}*/}
          {/*  </Text>*/}
          {/*</View>*/}

          {/*<View style={{ height: hp(20) }} />*/}

          {/*<Divider />*/}

          {/*<View style={{ height: hp(20) }} />*/}

          {price > 0 && (
            <>
              <View style={{ alignItems: "flex-start" }}>
                <Text style={styles.title}>{t("common.payment")}</Text>
              </View>

              <View style={{ height: hp(16) }} />

              <FlatList
                // contentContainerStyle={styles.paymentMethodContainer}
                style={{
                  flexGrow: 1,
                }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={paymentData}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[
                      styles.paymentMethodContainer,
                      {
                        borderWidth:
                          paymentMethod === "credit_card" ? hp(3) : 0,
                      },
                    ]}
                    onPress={() => {
                      setPaymentMethod(item?.name),
                        setPaymentMethodId(item?.id);
                    }}
                  >
                    <View style={styles.checkBoxContainer}>
                      <Image
                        style={styles.checkBox}
                        source={
                          item?.name === paymentMethod
                            ? CheckBoxChecked
                            : CheckBoxUnchecked
                        }
                      />
                    </View>
                    <View style={styles.paymentMethodTitleContainer}>
                      <Text style={styles.paymentMethodTitle}>
                        {item?.name === "Wallet"
                          ? t("placeOrder.wallet")
                          : item?.name == "Apple Pay"
                          ? "Apple Pay"
                          : item?.name === "COD"
                          ? t("placeOrder.cashOnDelivery")
                          : item?.name === "Credit Card"
                          ? t("placeOrder.creditCard")
                          : item?.name}
                      </Text>
                      {item?.name === "Wallet" && (
                        <Text style={styles.paymentMethodDescription}>
                          {userProfile?.balance.toFixed(2) +
                            " " +
                            t("productsAndServices.SAR")}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />

              {/* <TouchableOpacity
                  style={[
                    styles.paymentMethodContainer,
                    {
                      borderWidth: paymentMethod === "credit_card" ? hp(3) : 0,
                    },
                  ]}
                  onPress={() => setPaymentMethod("credit_card")}
                >
                  <View style={styles.checkBoxContainer}>
                    <Image
                      style={styles.checkBox}
                      source={
                        paymentMethod === "credit_card"
                          ? CheckBoxChecked
                          : CheckBoxUnchecked
                      }
                    />
                  </View>
                  <View style={styles.paymentMethodTitleContainer}>
                    <Text style={styles.paymentMethodTitle}>
                      {t("placeOrder.creditCard")}
                    </Text>
                  </View>
                </TouchableOpacity> */}
              {/* </ScrollView> */}
              {/*</ScrollView>*/}
            </>
          )}
        </ScrollView>
        <WalletModel
          show={modalWallet}
          image={AddWallet}
          text={t("placeOrder.notEnoughBalance")}
          buttonTitle={t("placeOrder.addBalance")}
          onPressClose={() => {
            setModalWallet(false);
          }}
          onPressBottomButton={() => {
            setModalWallet(false);
            navigation.navigate("TopUp", {
              comingFromOnDemand: true,
              comingFromNormal: false,
            });
          }}
        />
      </View>

      <Footer
        title={t("payment.place")}
        rightTitle={`${t("common.sar")} ${price}`}
        disabled={!paymentMethod}
        onPress={onPressPlaceOrder}
      />
      <Loader visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  contentContainer: {
    padding: wp(20),
  },
  orderDetailTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subTitle: {
    ...FontSize.rfs18,
    color: Colors.DARK_BLACK,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
  },
  subTitleTotal: {
    ...FontSize.rfs20,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
  },
  orderTotal: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: hp(20),
    borderColor: Colors.LIGHT_GREY,
  },
  title: {
    ...FontSize.rfs24,
    ...FontFamily.bold,
    color: Colors.DARK_BLACK,
    textAlign: "left",
  },
  edit: {
    ...FontSize.rfs18,
    ...FontFamily.bold,
    color: Colors.DARKERGREEN,
  },
  orderDetailValue: {
    ...FontSize.rfs14,
    ...FontFamily.medium,
    color: Colors.DARK_BLACK,
  },
  totalAmount: {
    ...FontSize.rfs24,
    ...FontFamily.bold,
    color: Colors.DARKERGREEN,
  },
  paymentMethodsContainer: {
    // flexDirection: "row",
    paddingBottom: 15,
    // justifyContent: "space-between",
  },
  paymentMethodContainer: {
    width: wp(156),
    height: hp(78),
    borderRadius: hp(11),
    borderColor: Colors.DARKERGREEN,
    marginRight: wp(10),
    backgroundColor: Colors.BORDER_GRAYLIGHTEST,
  },
  checkBoxContainer: {
    alignItems: "flex-end",
    marginTop: hp(10),
    marginEnd: hp(10),
  },
  checkBox: {
    width: wp(20),
    height: wp(20),
    resizeMode: "contain",
  },
  paymentMethodTitleContainer: {
    marginStart: wp(16),
    // backgroundColor: 'red',
  },
  paymentMethodTitle: {
    ...FontSize.rfs16,
    ...FontFamily.medium,
    color: Colors.DARK_BLACK,
    // color: 'green',
    textAlign: "left",
  },
  paymentMethodDescription: {
    ...FontSize.rfs12,
    ...FontFamily.medium,
    color: Colors.DARK_BLACK,
    textAlign: "left",
  },
  couponInput: {
    width: "70%",
    ...FontSize.rfs14,
    ...FontFamily.medium,
    color: Colors.DARKERGREEN,
  },
});

export default GoDPlaceOrder;
