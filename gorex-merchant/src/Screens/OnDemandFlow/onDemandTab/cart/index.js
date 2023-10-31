import React, { useContext, useRef, useState, useMemo, useEffect } from "react";

// ** Third Party Packages
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Image,
  Keyboard,
  FlatList,
} from "react-native";
import { useTranslation } from "react-i18next";

// ** Custom Components
import Colors from "../../../../Constants/Colors";
import Loader from "../../../../Components/Loader";
import Footer from "../../../ProductsAndServices/components/Footer";
import BackHeader from "../../../../Components/Header/BackHeader";
import { useNavigation } from "@react-navigation/native";
import { hp, wp } from "../../../../utils/responsiveSizes";
import Divider from "../../../../Components/Divider";
import FontSize from "../../../../Constants/FontSize";
import FontFamily from "../../../../Constants/FontFamily";
import {
  CheckBoxChecked,
  CheckBoxUnchecked,
  CouponDel,
} from "../../../../assets";
import Utilities from "../../../../utils/UtilityMethods";
import CouponButton from "../../../../Components/Buttons/CouponButton";
import { showToast } from "../../../../utils/common";
import ValidateCoupon from "../../../../api/ValidateCoupon";
import moment from "moment/moment";
import { CommonContext } from "../../../../contexts/ContextProvider";
import analytics from "@react-native-firebase/analytics";
import OrderPlaced from "../success/orderConfirmed";
import CreateOrder, { ApplePay } from "../../../../api/CreateOrder";
import getPaymentMethod from "../../../../api/getPaymentMethod";

const RenderOrderDetailItem = ({ title, value, routeName }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View>
      <View style={{ height: hp(20) }} />

      <View style={styles.orderDetailTitleContainer}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.push(routeName);
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

function Cart({ route }) {
  let scrollViewRef = useRef();

  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { userProfile, onDemandOrder, setOrderId } = useContext(CommonContext);
  const isRTL = i18n.language === "ar";

  const { COD } = route?.params;

  // ** States
  const [price, setPrice] = useState(onDemandOrder?.service?.price);
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isValidCoupon, setIsValidCoupon] = useState(false);
  const [couponePrice, setCouponPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [modalWallet, setModalWallet] = useState(false);

  const [paymentData, setPaymentData] = useState();
  const [paymentMethodId, setPaymentMethodId] = useState();

  const timeSlot = useMemo(() => {
    const list =
      onDemandOrder?.serviceProvider?.timeSlots || JSON.stringify([]);
    return JSON.parse(list).filter(
      (item) => item?.slot_id === onDemandOrder?.slot
    );
  }, [onDemandOrder]);

  const handleSwitch = () => {
    getPaymentMethod({serviceProviderId: onDemandOrder?.serviceProvider?.service_provider_id})
      .then((response) => {
        setPaymentData(response?.response?.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    return navigation.addListener("focus", () => handleSwitch());
  }, [navigation]);

  const ItemsList = [
    {
      name: t("common.vehicle"),
      route: "VehiclesServices",
      value: `${onDemandOrder?.vehicle?.manufacturer[1]}, ${onDemandOrder?.vehicle?.vehicle_model[1]}, ${onDemandOrder?.vehicle?.year_id[1]}`,
    },
    {
      name: t("common.service"),
      route: "VehiclesServices",
      value: onDemandOrder?.service?.name,
    },
    {
      name: t("common.address"),
      route: "GoDAddressSlot",
      value: onDemandOrder?.address?.address,
    },
    {
      name: t("common.timeSlot"),
      route: "GoDAddressSlot",
      value: `${moment.unix(onDemandOrder?.date).format("D MMM, YYYY")} - ${
        timeSlot?.[0]?.time.split(" - ")[0]
      } - ${timeSlot?.[0]?.time.split(" - ")[1]}`,
    },
    {
      name: t("common.serviceProvider"),
      route: "GoDServiceProvider",
      value: onDemandOrder?.serviceProvider?.service_provider_name,
    },
  ];

  const getOrderData = () => {
    return {
      driver: userProfile?.id,
      vehicle_id: onDemandOrder?.vehicle?.id,
      service_provider: onDemandOrder?.serviceProvider?.service_provider_id,
      payment_method_id: paymentMethodId,
      coupon_codes: coupon,
      card_number: false,
      schedule_date: moment.unix(onDemandOrder?.date).format("YYYY-MM-DD"),
      // notes: onDemandOrder?.notes,
      on_demand: true,
      address_id: onDemandOrder?.address?.id,
      slot_id: onDemandOrder?.slot,
      sub_total: price,
      order_lines: [
        [
          0,
          0,
          {
            product_id: onDemandOrder?.service?.id,
            quantity: 1,
            price: onDemandOrder?.service?.price,
            total_price: onDemandOrder?.service?.price,
          },
        ],
      ],
    };
  };

  const onPressCouponDelete = () => {
    setCouponCode("");
    setIsValidCoupon(false);
    setPaymentMethod(null);
    setPrice(onDemandOrder?.service?.price);
    setCouponPrice(onDemandOrder?.service?.price);
  };

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
            setPaymentMethod("wallet_pay");
          }
        } else {
          setIsValidCoupon(false);
          setPaymentMethod(null);
          showToast("Error", t("placeOrder.coupon_error_message"), "error");
        }
      });
    }
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
      setLoading(false);
      if (success) {
        setOrderId(success);
        navigation.navigate("OrderPlaced");
        showToast(
          t("payment.success"),
          t("payment.Order is created successfully"),
          "success"
        );
      } else {
        showToast("Error", response, "error");
        // crashlytics().recordError(response);
      }
    });
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
    } else if (paymentMethod === "Apple Pay") {
      postApplePay();
    } else {
      showToast("Error", t("gorexOnDemand.selectPaymentMethod"), "error");
      // crashlytics().recordError("Random Error at placing order");
    }

    await analytics().setUserProperty("paymnet_method", `${paymentMethod}`);
    await analytics().logEvent("payment_method", {
      payment_method: `${paymentMethod}`,
    });
  };

  return (
    <View style={styles.screen}>
      <View style={{ flex: 1 }}>
        <BackHeader
          title={t("common.gorexOnDemand")}
          leftPress={() => navigation.push("GoDServiceProvider")}
        />

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {ItemsList.map((item, index) => (
            <RenderOrderDetailItem
              key={index}
              title={item.name}
              value={item.value}
              routeName={item.route}
            />
          ))}

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, marginBottom: wp(20) }}
          >
            <View>
              <Text style={[styles.title, { marginVertical: wp(15) }]}>
                {t("placeOrder.couponCode")}
              </Text>
              <View style={styles.inputWrapper}>
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

          <Divider />

          <View style={styles.totalAmount}>
            <Text style={[styles.title, { marginVertical: hp(20) }]}>
              {t("common.totalAmount")}
            </Text>

            <Text style={styles.titlePrice}>{`${t(
              "common.sar"
            )} ${price}`}</Text>
          </View>

          <Divider />

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
                          ? t("placeOrder.Apple Pay")
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

              {/* <ScrollView
                horizontal={true}
                style={styles.paymentMethodsContainer}
              > */}
              {/* <TouchableOpacity
                  style={[
                    styles.paymentMethodContainer,
                    {
                      borderWidth: paymentMethod === "wallet_pay" ? hp(3) : 0,
                    },
                  ]}
                  onPress={() => setPaymentMethod("wallet_pay")}
                >
                  <View style={styles.checkBoxContainer}>
                    <Image
                      style={styles.checkBox}
                      source={
                        paymentMethod === "wallet_pay"
                          ? CheckBoxChecked
                          : CheckBoxUnchecked
                      }
                    />
                  </View>
                  <View style={styles.paymentMethodTitleContainer}>
                    <Text style={styles.paymentMethodTitle}>
                      {t("placeOrder.wallet")}
                    </Text>
                    <Text style={styles.paymentMethodDescription}>
                      {userProfile?.balance.toFixed(2) +
                        " " +
                        t("productsAndServices.SAR")}
                    </Text>
                  </View>
                </TouchableOpacity> */}

              {/* {COD && (
                  <TouchableOpacity
                    style={[
                      styles.paymentMethodContainer,
                      {
                        borderWidth:
                          paymentMethod === "direct_payment" ? hp(3) : 0,
                      },
                    ]}
                    onPress={() => setPaymentMethod("direct_payment")}
                  >
                    <View style={styles.checkBoxContainer}>
                      <Image
                        style={styles.checkBox}
                        source={
                          paymentMethod === "direct_payment"
                            ? CheckBoxChecked
                            : CheckBoxUnchecked
                        }
                      />
                    </View>
                    <View style={styles.paymentMethodTitleContainer}>
                      <Text style={styles.paymentMethodTitle}>
                        {t("placeOrder.cod")}
                      </Text>
                      <Text style={styles.paymentMethodDescription}>
                        {t("placeOrder.cashOnDelivery")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )} */}

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
            </>
          )}
        </ScrollView>
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
}

export default Cart;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  contentContainer: {
    padding: wp(20),
  },
  title: {
    ...FontSize.rfs24,
    ...FontFamily.bold,
    color: Colors.DARK_BLACK,
    textAlign: "left",
  },
  titlePrice: {
    ...FontSize.rfs24,
    ...FontFamily.bold,
    color: Colors.DARKERGREEN,
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
  orderDetailTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: hp(60),
    backgroundColor: Colors.GHOST_WHITE,
    borderRadius: hp(30),
    paddingLeft: wp(20),
    paddingRight: wp(10),
  },
  couponInput: {
    width: "70%",
    ...FontSize.rfs14,
    ...FontFamily.medium,
    color: Colors.DARKERGREEN,
  },
  totalAmount: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentMethodsContainer: {
    paddingBottom: 15,
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
  paymentMethodTitle: {
    ...FontSize.rfs16,
    ...FontFamily.medium,
    color: Colors.DARK_BLACK,
    textAlign: "left",
    paddingHorizontal: wp(10),
  },
  paymentMethodDescription: {
    ...FontSize.rfs12,
    ...FontFamily.medium,
    color: Colors.DARK_BLACK,
    textAlign: "left",
    paddingHorizontal: wp(10),
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
});
