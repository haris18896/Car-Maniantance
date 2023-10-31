import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from "react-native";

import { Divider } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";

import Utilities from "../../utils/UtilityMethods";
import { removeCart, setCart, showToast } from "../../utils/common";
import { useKeyboard } from "../../contexts/KeyboardProvider";
import { hp, wp } from "../../utils/responsiveSizes";
import {
  Edit,
  Infogrey,
  EmptyCart,
  CouponDel,
  CouponImage,
  AddWallet,
  NoVehicle,
} from "../../assets";

import Footer from "./components/Footer";
import Loader from "../../Components/Loader";
import CouponDetail from "../../api/CouponDetail";
import CreateOrder from "../../api/CreateOrder";
import GetMyVehicles from "../../api/GetMyVehicles";
import CouponButton from "../../Components/Buttons/CouponButton";
import CheckBox from "../../Components/Inputs/CheckBox";
import BackHeader from "../../Components/Header/BackHeader";
import WalletModel from "../../Components/Modal/WalletModel";
import { CommonContext } from "../../contexts/ContextProvider";
import ClearCartModel from "../../Components/Modal/ClearCartModel";
import moment from "moment";
import FontSize from "../../Constants/FontSize";
import FontFamily from "../../Constants/FontFamily";
import analytics from "@react-native-firebase/analytics";

const PaymentMethod = ({ route }) => {
  const { userProfile, selectedBranch, inCartOrder, setInCartOrder } =
    useContext(CommonContext);
  const placeOrderNow = route?.params?.placeOrderNow
    ? route?.params?.placeOrderNow
    : false;

  let scrollViewRef = useRef();
  const focus = useIsFocused();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { isKeyboardOpened, keyboardHeight } = useKeyboard();

  const isRTL = i18n.language === "ar";

  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);

  const [edit, setEdit] = useState();
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);

  const [note, setNote] = useState("");
  const [totalPrice, setTotalPrice] = useState(
    inCartOrder ? inCartOrder.totalPrice : 0
  );

  const [modalCart, setmodalCart] = useState(false);
  const [modalWallet, setModalWallet] = useState(false);
  const [modalCoupon, setModalCoupon] = useState(false);
  const [modalVehicle, setModalVehicle] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [primaryVehicle, setPrimaryVehicle] = useState();

  const walletTitle =
    t("placeOrder.wallet") +
    "\n" +
    userProfile?.balance.toFixed(2) +
    " " +
    t("common.sar");

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "payment_method_screen",
    });
  }, []);

  useEffect(() => {
    return navigation.addListener("focus", handleViewSwitch);
  }, [navigation]);

  useEffect(() => {
    if (primaryVehicle === null) {
      setModalVehicle(true);
    }
  }, [primaryVehicle]);

  const handleViewSwitch = () => {
    getPrimaryVehicle();
    if (placeOrderNow && userProfile?.balance >= totalPrice) {
      createOrder();
    }
  };

  const getPrimaryVehicle = () => {
    GetMyVehicles(userProfile?.id).then(({ success, response }) => {
      if (success) {
        response?.map((vehicle) => {
          if (vehicle.is_primary) {
            setPrimaryVehicle(vehicle);
          }
        });
      }
    });
  };

  const deleteItem = (item, listIndex) => {
    if (listIndex === 0) {
      // Product
      let index = inCartOrder.products.findIndex(
        (myProduct) => myProduct.product.id === item.product.id
      );
      if (index !== -1) {
        inCartOrder.products.splice(index, 1);
        inCartOrder.totalPrice =
          inCartOrder.totalPrice - item.product.price * item.quantity;
        setCart(inCartOrder).then();
        setReload(!reload);
      }
    } else {
      // services
      let index = inCartOrder.services.findIndex(
        (myService) => myService.id === item.id
      );
      if (index !== -1) {
        inCartOrder.services.splice(index, 1);
        inCartOrder.totalPrice = inCartOrder.totalPrice - item.price;
        setCart(inCartOrder).then();
        setReload(!reload);
      }
    }
    if (!inCartOrder?.products?.length && !inCartOrder?.services?.length) {
      clearCartItems();
    }
    setTotalPrice(inCartOrder.totalPrice);
  };

  const gotoProductDetail = (item, listIndex) => {
    if (listIndex === 0) {
      navigation.navigate("ProductDetails", {
        product: item.product,
        count: item.quantity,
      });
    } else {
      navigation.navigate("ServicesListing");
    }
  };

  const loadFlatListFor = (items, listIndex, headerTitle) => {
    return (
      <FlatList
        data={items}
        ListHeaderComponent={() => (
          <View style={styles.textAlignmentContainer}>
            <Text style={styles.heading}>{headerTitle}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => (
          <Divider style={{ marginTop: hp(50), marginBottom: hp(20) }} />
        )}
        ListFooterComponent={() => (
          <Divider style={{ marginTop: hp(50), marginBottom: hp(20) }} />
        )}
        renderItem={({ item }) => getCartItem(item, listIndex)}
      />
    );
  };

  const getCartItem = (item, listIndex) => {
    return (
      <View>
        <View style={styles.rowContainer}>
          <Text style={styles.quantityText}>
            {listIndex === 0 ? item?.quantity : "1"}{" "}
            <Text style={{ ...FontSize.rfs14 }}>X</Text>
          </Text>
          <Text style={styles.title}>
            {listIndex === 0 ? item?.product.name : item?.name}
          </Text>
          <Text style={styles.price}>
            {t("common.SAR")}{" "}
            {listIndex === 0
              ? item?.quantity * item?.product.price
              : item?.price}
          </Text>
        </View>
        {edit && (
          <View
            style={{
              flexDirection: "row",
              width: Utilities.wp(18),
              height: Utilities.hp(6),
              alignSelf: "flex-end",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                gotoProductDetail(item, listIndex);
              }}
            >
              <Image source={Edit} style={styles.del} resizeMode="contain" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteItem(item, listIndex)}>
              <Image
                source={CouponDel}
                style={styles.del}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const clearCartItems = async () => {
    setInCartOrder(null);
    setCart(null).then();
    setReload(!reload);
  };

  const onSelectWallet = () => {
    setPaymentMethod("wallet_pay");
    setModalWallet(userProfile?.balance < totalPrice);
  };

  const onSelectCreditCard = () => {
    setPaymentMethod("credit_card");
  };

  const renderPaymentTypeButton = (title, onSelect, isSelected) => {
    let borderColor = isSelected
      ? Colors.DARKERGREEN
      : Colors.BORDER_GRAYLIGHTEST;
    let backgroundColor = isSelected
      ? Colors.WHITE
      : Colors.BORDER_GRAYLIGHTEST;

    return (
      <TouchableOpacity
        style={[
          styles.paymentTypeButton,
          { borderColor: borderColor, backgroundColor: backgroundColor },
        ]}
        onPress={onSelect}
      >
        <View
          style={{
            height: "100%",
            width: "80%",
            justifyContent: "center",
            paddingLeft: Utilities.wp(5),
            paddingTop: Utilities.hp(2),
          }}
        >
          <Text style={styles.checkText}>{title}</Text>
        </View>

        <View
          style={{ height: "100%", width: "20%", paddingTop: Utilities.hp(1) }}
        >
          <CheckBox onCheck={onSelect} isChecked={isSelected} hideRight />
        </View>
      </TouchableOpacity>
    );
  };

  const getOrderLineObjectForProductsOrServices = (item, index) => {
    if (index === 0) {
      return {
        product_id: item.product.id,
        quantity: item?.quantity,
        price: item?.product.price,
        total_price: item?.quantity * item?.product.price,
      };
    } else {
      return {
        product_id: item.id,
        quantity: 1,
        price: item?.price,
        total_price: item?.price,
      };
    }
  };

  const checkPaymentTypeAndAvailableBalance = () => {
    if (primaryVehicle == null) {
      setModalVehicle(true);
    } else if (paymentMethod === "credit_card") {
      navigation.navigate("TopUpCard", {
        amount: totalPrice,
        comingFromOnDemand: false,
        comingFromNormal: true,
      });
    } else if (
      paymentMethod === "wallet_pay" &&
      userProfile?.balance < totalPrice
    ) {
      setModalWallet(true);
    } else if (
      paymentMethod === "wallet_pay" &&
      userProfile?.balance >= totalPrice
    ) {
      if (primaryVehicle) {
        createOrder();
      } else {
        setModalVehicle(true);
      }
    } else {
      showToast("Error", "Random Error", "error");
    }
  };

  const createOrder = () => {
    let orderLines = [];

    inCartOrder?.products?.map((orderProduct) => {
      orderLines.push([
        0,
        0,
        getOrderLineObjectForProductsOrServices(orderProduct, 0),
      ]);
    });

    inCartOrder?.services?.map((service) => {
      orderLines.push([
        0,
        0,
        getOrderLineObjectForProductsOrServices(service, 1),
      ]);
    });

    let data = {
      driver: userProfile?.id,
      service_provider: selectedBranch?.id,
      payment_method: "wallet_pay",
      address: userProfile?.address ? userProfile?.address : "",
      sub_total: totalPrice,
      order_lines: orderLines,
      vehicle_id: primaryVehicle.id,
    };

    if (inCartOrder.date) {
      data = {
        ...data,
        on_demand: false,
        schedule_date: inCartOrder.date
          ? moment(inCartOrder.date).format("YYYY-MM-DD")
          : "",
        slot_id: inCartOrder.slot ? inCartOrder.slot.id : false,
      };
    }

    if (couponCode) {
      data = { ...data, coupon_codes: couponCode };
    }

    setLoading(true);
    CreateOrder(data).then(({ success, response }) => {
      setLoading(false);
      if (success) {
        navigation.navigate("OrderConfirmed", { order_id: response });
        showToast(
          "Success!",
          t("payment.Order is created successfully"),
          "success"
        );
        removeCart().then();
        setInCartOrder(null);
      } else {
        showToast("Error", response, "error");
      }
    });
  };

  const onPressCouponApply = () => {
    Keyboard.dismiss();
    if (couponCode.length <= 0) {
      showToast("Error", "Please enter coupon code", "error");
    } else {
      CouponDetail(couponCode).then(({ success, response }) => {
        if (success) {
          let couponData = response[0];
          let expiry_date = couponData["expire_date"];
          let expiryDate = moment(expiry_date);
          let currentDate = new Date();

          if (currentDate > expiryDate) {
            showToast("Error", "Coupon is expired", "error");
            return;
          } else if (couponData["status"] !== "validate") {
            showToast("Error", "Coupon is not valid", "error");
            return;
          } else if (
            !checkIfCouponProductIdsAreInCartOrder(couponData["product_ids"])
          ) {
            showToast(
              "Error",
              "Coupon is not valid for these products and services",
              "error"
            );
            return;
          }

          setCouponCode("Coupon code applied successfully.");
          setCouponData(response[0]);
        } else {
          showToast("Error", response[0], "error");
        }
      });
    }
  };
  const checkIfCouponProductIdsAreInCartOrder = (arrayIds) => {
    let isValidProduct = false;
    inCartOrder.products.map((orderProduct) => {
      const index = arrayIds.findIndex((id) => id === orderProduct.product.id);
      if (index !== -1) {
        isValidProduct = true;
      }
    });

    if (!isValidProduct) {
      inCartOrder.services.map((orderService) => {
        const index = arrayIds.findIndex((id) => id === orderService.id);
        if (index !== -1) {
          isValidProduct = true;
        }
      });
    }

    return isValidProduct;
  };
  const onPressCouponDelete = () => {
    setCouponData(null);
    setCouponCode("");
  };
  const onPressCouponInfo = () => {
    setModalCoupon(true);
  };

  const renderOrderDetailItem = (title, value, routeName) => {
    return (
      <View>
        <View style={styles.orderDetailTitleContainer}>
          <Text style={styles.heading}>{title}</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(routeName);
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
        <View style={{ height: hp(20) }} />
      </View>
    );
  };

  return !inCartOrder ? (
    <View style={styles.container}>
      <BackHeader
        title={t("emptyCart.cart")}
        RightPress={() => setEdit(true)}
      />
      <View style={styles.emptycart}>
        <Image source={EmptyCart} style={styles.emptyCart} />
        <View style={styles.onlymarginbG}>
          <Text style={styles.textstyling}>{t("emptyCart.emptyCart")}</Text>
          <Text
            style={[styles.noitem, { maxWidth: isRTL ? wp(191) : wp(245) }]}
          >
            {t("emptyCart.emptyCartDescription")}
          </Text>
        </View>
      </View>
      <Footer
        title={t("emptyCart.addProductsAndServices")}
        onPress={async () => {
          navigation.navigate("ProductsListing");
        }}
      />
    </View>
  ) : (
    <View style={styles.container}>
      {edit ? (
        <BackHeader
          title={selectedBranch?.name}
          rightTitle={t("common.cancel")}
          RightPress={() => {
            setEdit(false);
          }}
          leftIcon={CouponDel}
          leftPress={() => {
            setmodalCart(true);
          }}
        />
      ) : (
        <BackHeader
          title={selectedBranch?.name}
          rightTitle={t("common.edit")}
          RightPress={() => {
            setEdit(true);
          }}
        />
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.paddedContent}
        contentContainerStyle={styles.contentContainer}
      >
        <View>
          {inCartOrder.products.length > 0 &&
            loadFlatListFor(inCartOrder.products, 0, t("common.Products"))}
          {inCartOrder.services.length > 0 &&
            loadFlatListFor(inCartOrder.services, 1, t("common.Services"))}
        </View>

        {inCartOrder.date &&
          renderOrderDetailItem(
            t("common.timeSlot"),
            `${moment(inCartOrder.date).format("YYYY-MM-DD")}, ${
              inCartOrder.slot.start_time
            } - ${inCartOrder.slot.end_time}`,
            "Slots"
          )}

        <View>
          <View style={styles.textAlignmentContainer}>
            <Text style={styles.heading}>{t("placeOrder.couponCode")}</Text>
          </View>
          <View style={{ height: hp(20) }} />
          <Divider />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: hp(60),
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

            {couponData ? (
              <View style={{ flexDirection: "row", width: "20%" }}>
                <TouchableOpacity
                  style={{ width: "50%", alignItems: "center" }}
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

                <TouchableOpacity
                  style={{ width: "50%", alignItems: "center" }}
                  onPress={() => onPressCouponInfo()}
                >
                  <Image
                    source={Infogrey}
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
          <Divider />
        </View>
        <View style={{ height: hp(20) }} />
        <View style={styles.rowContainer}>
          <Text style={styles.heading}>{t("placeOrder.total")}</Text>
          <Text style={[styles.price, { ...FontSize.rfs24 }]}>
            {t("common.sar")} {totalPrice}
          </Text>
        </View>
        <View style={{ height: hp(20) }} />
        <Divider />
        <TextInput
          style={[styles.leaveNote, { textAlign: isRTL ? "right" : "left" }]}
          placeholder={t("placeOrder.leaveNote")}
          placeholderTextColor={Colors.LIGHTGREY}
          multiline={true}
          onChangeText={(text) => setNote(text)}
          value={note}
        />
        <Divider />
        <View style={{ height: hp(20) }} />
        <View style={styles.textAlignmentContainer}>
          <Text style={styles.heading}>{t("placeOrder.payment")}</Text>
        </View>

        <View style={styles.rowContainer2}>
          {renderPaymentTypeButton(
            walletTitle,
            onSelectWallet,
            paymentMethod === "wallet_pay"
          )}
          {renderPaymentTypeButton(
            t("placeOrder.creditCard"),
            onSelectCreditCard,
            paymentMethod === "credit_card"
          )}
        </View>

        {Utilities.isIosDevice() && isKeyboardOpened && (
          <View style={{ height: keyboardHeight * Utilities.hp(0.09) }} />
        )}
      </ScrollView>

      <Modal
        animationType="fade"
        visible={modalCoupon}
        transparent={true}
        onRequestClose={() => {
          setModalCoupon(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                paddingHorizontal: Utilities.wp(5),
                paddingVertical: Utilities.wp(6),
              }}
            >
              <Image
                source={CouponImage}
                style={{
                  width: Utilities.wp(10),
                  height: Utilities.hp(10),
                  resizeMode: "contain",
                  marginLeft: 10,
                }}
              />
              <View style={styles.textAlignmentContainer}>
                <Text style={{ ...styles.bigTitleCouponName }}>
                  {t("placeOrder.couponName")}
                </Text>
              </View>
              <Text
                style={{
                  color: Colors.BLACK,
                  marginLeft: 10,
                  fontFamily: Fonts.LexendMedium,
                  ...FontSize.rfs14,
                }}
              >
                {couponData && couponData["sequence_code"]}
              </Text>
              <View style={styles.textAlignmentContainer}>
                <Text style={[styles.bigTitleCouponNameDetails]}>
                  {t("placeOrder.details")}
                </Text>
              </View>

              {!couponData ? (
                <View style={styles.textAlignmentContainer}>
                  <Text style={[styles.description]}>
                    {t("placeOrder.applyCouponOnAll")}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={[styles.description]}>
                    {couponData && couponData["customer"][0]}
                  </Text>
                </View>
              )}
              <View style={styles.textAlignmentContainer}>
                <Text style={[styles.description]}>
                  {t("common.sar")} {couponData && couponData["amount"]}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.couponDetailModal}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.closeModel}>{t("common.close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
          // navigation.navigate("TopUp");
          navigation.navigate("TopUp", {
            comingFromOnDemand: false,
            comingFromNormal: true,
          });
        }}
      />

      <WalletModel
        show={modalVehicle}
        image={NoVehicle}
        text={t("vehicle.novehicleaccount")}
        buttonTitle={t("vehicle.Add Vehicle")}
        onPressClose={() => {
          setModalVehicle(false);
        }}
        onPressBottomButton={() => {
          setModalVehicle(false);
          navigation.navigate("VehicleInformation");
        }}
      />

      <ClearCartModel
        setmodalCart={setmodalCart}
        modalCart={modalCart}
        onPress={() => {
          clearCartItems().then();
        }}
      />

      <Footer
        title={t("placeOrder.placeOrder")}
        rightTitle={t("common.SAR") + " " + totalPrice}
        onPress={() => {
          checkPaymentTypeAndAvailableBalance();
        }}
      />

      <Loader visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  onlymarginbG: {
    marginTop: 25,
  },
  textstyling: {
    ...FontSize.rfs24,
    color: "black",
    fontFamily: Fonts.LexendBold,
    alignSelf: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
  noitem: {
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendMedium,
    color: Colors.LIGHTGREY,
    alignSelf: "center",
    marginTop: Utilities.hp(2),
    justifyContent: "center",
    textAlign: "center",
  },
  emptycart: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    flex: 1,
  },
  title2: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs20,
    marginTop: Utilities.hp(2),
  },
  type: {
    ...FontSize.rfs16,
    fontFamily: Fonts.LexendRegular,
    color: Colors.BLACK,
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: hp(20),
  },
  del: {
    width: Utilities.wp(8),
    height: Utilities.wp(9),
  },
  delInfo: {
    width: wp(40),
    height: hp(30),
    marginTop: Utilities.hp(2),
  },
  heading: {
    ...FontSize.rfs20,
    fontFamily: Fonts.LexendBold,
    color: Colors.BLACK,
  },
  checkText: {
    ...FontSize.rfs16,
    fontFamily: Fonts.LexendSemiBold,
    color: Colors.BLACK,
  },
  title: {
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendMedium,
    color: Colors.BLACK,
    width: Utilities.wp(60),
  },
  leaveNote: {
    ...FontSize.rfs16,
    fontFamily: Fonts.LexendMedium,
    color: Colors.BLACK,
    height: hp(80),
    width: Utilities.wp(90),
  },
  cross: {
    backgroundColor: Colors.BLUE,
    width: 25,
    marginTop: 5,
    height: 25,
    borderRadius: 25 / 2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  rowContainer2: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: Utilities.wp(85),
    marginTop: hp(16),
  },
  cancel: {
    color: Colors.ORANGE,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    marginTop: Utilities.hp(2),
    ...FontSize.rfs14,
  },
  couponInput: {
    width: "70%",
    ...FontSize.rfs18,
    ...FontFamily.medium,
    color: Colors.DARKERGREEN,
  },
  textarea: {
    borderColor: Colors.BLUE,
    borderWidth: 1,
    paddingVertical: hp(4),
    minHeight: hp(174),
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs15,
    textAlignVertical: "top",
    paddingHorizontal: hp(12),
    marginTop: hp(12),
    borderRadius: 8,
    color: Colors.BLACK,
  },
  eyestyling: {
    width: wp(20),
    tintColor: Colors.WHITE,
  },
  price: {
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendRegular,
    fontWeight: "800",
    color: Colors.DARKERGREEN,
  },
  rightView: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  quantityText: {
    color: Colors.DARKERGREEN,
    ...FontSize.rfs20,
    fontFamily: Fonts.LexendRegular,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: Colors.LIGHT_GREY,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    width: Utilities.wp(90),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  paddedContent: {
    paddingHorizontal: wp(20),
  },
  bigTitle: {
    fontFamily: Fonts.SFProDisplaySemiBold,
    ...FontSize.rfs16,
    color: Colors.BLUE,
  },
  closeModel: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs16,
    color: Colors.WHITE,
  },
  bigTitleCouponName: {
    marginLeft: 10,
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs14,
    color: Colors.DARKERGREEN,
  },
  bigTitleCouponNameDetails: {
    marginLeft: 10,
    marginTop: Utilities.hp(3),
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs14,
    color: Colors.DARKERGREEN,
  },
  description: {
    fontFamily: Fonts.LexendMedium,
    marginLeft: 13,
    paddingVertical: 3,
    ...FontSize.rfs14,
    color: Colors.BLACK,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  container2: {
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    borderBottomColor: "#B8B9C133",
    borderBottomWidth: 1,
    height: Utilities.hp(10),
    flexDirection: "row",
    paddingHorizontal: 9,
  },
  containerProfile: {
    justifyContent: "space-between",
    backgroundColor: Colors.BLUE,
    borderBottomLeftRadius: hp(20),
    borderBottomRightRadius: hp(20),
    height: hp(150),
    paddingTop: hp(20),
    flexDirection: "row",
    paddingHorizontal: 9,
  },
  logo: {
    width: 100,
    resizeMode: "contain",
    height: hp(25),
  },
  menuButton: {
    height: wp(50),
    width: wp(60),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(20),
  },
  placeholder: {
    width: wp(60),
  },
  space: {
    marginLeft: wp(40),
  },
  paymentTypeButton: {
    width: Utilities.wp(35),
    height: Utilities.wp(20),
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.BORDER_GRAYLIGHTEST,
    backgroundColor: Colors.BORDER_GRAYLIGHTEST,
  },
  textAlignmentContainer: {
    alignItems: "flex-start",
  },
  emptyCart: {
    width: wp(94),
    height: hp(90),
    resizeMode: "contain",
  },
  couponDetailModal: {
    backgroundColor: Colors.DARKERGREEN,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: Utilities.hp(2),
  },
  orderDetailTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  SlotTitle: {
    ...FontSize.rfs24,
    ...FontFamily.bold,
    color: Colors.DARK_BLACK,
  },
  edit: {
    ...FontSize.rfs18,
    ...FontFamily.bold,
    color: Colors.DARKERGREEN,
  },
});

export default PaymentMethod;
