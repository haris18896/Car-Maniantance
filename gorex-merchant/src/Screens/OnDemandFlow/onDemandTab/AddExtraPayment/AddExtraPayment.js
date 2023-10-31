import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Colors from "../../../../Constants/Colors";
import BackHeader from "../../../../Components/Header/BackHeader";
import { StyleSheet } from "react-native";
import Divider from "../../../../Components/Divider";
import FontSize from "../../../../Constants/FontSize";
import FontFamily from "../../../../Constants/FontFamily";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import i18n from "i18next";
import { hp, wp } from "../../../../utils/responsiveSizes";
import fonts from "../../../../Constants/fonts";
import { FlatList } from "react-native";
import CreateOrder, {
  ApplePay,
  CreateExtraService,
} from "../../../../api/CreateOrder";
import { CommonContext } from "../../../../contexts/ContextProvider";
import { setPlaceOrderNow } from "../../../../contexts/global";
import getPaymentMethod from "../../../../api/getPaymentMethod";
import { Image } from "react-native";
import { CheckBoxChecked, CheckBoxUnchecked } from "../../../../assets";
import Footer from "../../../ProductsAndServices/components/Footer";
import { showToast } from "../../../../utils/common";
import Loader from "../../../../Components/Loader";

const AddExtraPayment = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const selectedService = route?.params?.selectedService;
  const [paymentData, setPaymentData] = useState();
  const [paymentMethodId, setPaymentMethodId] = useState();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const { userProfile, orderId } = useContext(CommonContext);
  const [loading, setLoading] = useState(false);

  const isRTL = i18n.language === "ar";

  //   useEffect(() => {
  //     if (userProfile?.balance >= selectedService?.price) {
  //       createOrder();
  //       setPlaceOrderNow(false);
  //     }

  //     if (userProfile?.balance < selectedService?.price) {
  //       showToast(
  //         t("errors.error"),
  //         t("gorexOnDemand.unableToUpdateTheWallet"),
  //         "error"
  //       );
  //     }
  //   }, []);

  useEffect(() => {
    getPaymentMethod()
      .then((response) => {
        setPaymentData(response?.response?.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const onPressPlaceOrder = async () => {
    if (paymentMethod === "Credit Card") {
      navigation.navigate("TopUpCard", {
        amount: selectedService?.price,
        comingFromOnDemand: true,
        comingFromNormal: false,
        success: false,
        title: t("payment.paymentCredit_DebitCard"),
      });
    } else if (
      paymentMethod === "Wallet" &&
      userProfile?.balance < selectedService?.price
    ) {
      setModalWallet(true);
    } else if (
      paymentMethod === "Wallet" &&
      userProfile?.balance >= selectedService?.price
    ) {
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
      orderId: orderId,
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
    setLoading(true);
    CreateExtraService({
      orderId: orderId,
      productId: selectedService?.id,
      paymentId: paymentMethodId,
    }).then(({ success, response }) => {
      setTimeout(() => {
        setLoading(false);
        if (response) {
          navigation.navigate("AddExtraService");
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
              navigation.navigate(routeName, { ExtraServiceModal: true });
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
    <View style={styles.mainContainer}>
      <BackHeader title={t("gorexOnDemand.Add Extra Service")} />
      <View style={styles.containerContainer}>
        {renderOrderDetailItem(
          t("common.service"),
          selectedService.name,
          "ExtraService"
        )}
        <View style={styles.orderDetailTitleContainer}>
          <Text style={[styles.title, { marginVertical: hp(20) }]}>
            Total Amount
          </Text>
          <Text style={styles.subTitle}>
            {selectedService?.price} {t("common.sar")}
          </Text>
        </View>
        <View style={{ height: hp(20) }} />
        <Divider />

        <View style={{ alignItems: "flex-start", marginTop: 10 }}>
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
                  borderWidth: paymentMethod === "credit_card" ? hp(3) : 0,
                },
              ]}
              onPress={() => {
                setPaymentMethod(item?.name), setPaymentMethodId(item?.id);
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
      </View>
      <Footer
        title={t("gorexOnDemand.Confirm & Pay")}
        rightTitle={selectedService?.price + " " + `${t("common.sar")} `}
        disabled={!paymentMethod}
        onPress={onPressPlaceOrder}
      />
      <Loader visible={loading} />
    </View>
  );
};

export default AddExtraPayment;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  containerContainer: {
    flex: 1,
    padding: wp(20),
  },
  orderDetailTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  subTitle: {
    ...FontSize.rfs22,
    color: Colors.DARKERGREEN,
    fontFamily: fonts.LexendBold,
    textAlign: "left",
  },
  subTitleTotal: {
    ...FontSize.rfs20,
    fontFamily: fonts.LexendBold,
    textAlign: "left",
  },
  orderTotal: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: hp(20),
    borderColor: Colors.LIGHT_GREY,
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
});
