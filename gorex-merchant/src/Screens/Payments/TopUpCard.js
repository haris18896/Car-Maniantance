import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { NoTopUpCard, Visa } from "../../assets";
import BackHeader from "../../Components/Header/BackHeader";
import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import { hp, wp } from "../../utils/responsiveSizes";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Footer from "../ProductsAndServices/components/Footer";
import FontSize from "../../Constants/FontSize";
import Utilities from "../../utils/UtilityMethods";
import { showToast } from "../../utils/common";
import Loader from "../../Components/Loader";
import WebView from "react-native-webview";
import GetWallet from "../../api/GetWallet";
import { CommonContext } from "../../contexts/ContextProvider";
import CreateTopUp from "../../api/CreateTopUp";

import ChargeCardForTopUp from "../../api/ChargeCardForTopUp";
import { GetProfile } from "../../api/CallAPI";
import { setPlaceOrderNow } from "../../contexts/global";
import analytics from "@react-native-firebase/analytics";
import { isObjEmpty } from "../../utils/utils";

const renderEmptyListComponent = (t) => {
  return (
    <View style={styles.container2}>
      <Image
        resizeMode="contain"
        transitionDuration={1000}
        source={NoTopUpCard}
        style={styles.item}
      />
      <Text style={styles.text}>{t("creditcard.nocard")}</Text>
      <Text style={styles.title2}>{t("creditcard.account")}</Text>
    </View>
  );
};

const renderRowItem = ({ t, item, selectedCard, setSelectedCard }) => {
  return (
    <TouchableOpacity
      style={styles.rowItem}
      onPress={() => {
        setSelectedCard(item);
      }}
    >
      <View
        style={[
          styles.card,
          styles.cardShadow,
          selectedCard && selectedCard.id === item.id && styles.selectedCard,
        ]}
      >
        <View style={styles.imageContainer}>
          <Image source={Visa} style={styles.icon} />
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.xText}>{item.number.substring(0, 4)}</Text>
          <Text style={styles.xText}>{item.number.substring(4, 8)}</Text>
          <Text style={styles.xText}>{item.number.substring(8, 12)}</Text>
          <Text style={styles.xText}>{item.number.substring(12, 16)}</Text>
        </View>

        <View style={styles.holderContainer}>
          <View>
            <Text style={styles.cardHeading}>{t("creditcard.cardHolder")}</Text>
            <Text style={styles.cardValue}>{item?.card_holder[1]}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TopUpCard = ({ route }) => {
  const { onDemandOrder } = useContext(CommonContext);
  const { success, amount, comingFromNormal, comingTitle, comingFromOnDemand } =
    route?.params;

  const navigation = useNavigation();
  const { t } = useTranslation();

  const [url, setUrl] = useState();
  const [wallet, setWallet] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const { partnerId, setUserProfile, userProfile } = useContext(CommonContext);

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "top_up_card_screen",
    });
  }, []);

  const getMyCards = useCallback(() => {
    const { id } = userProfile;
    if (wallet.length === 0) {
      GetWallet(id).then(({ success, response }) => {
        if (success) {
          setWallet(response);
          if (!selectedCard) {
            setSelectedCard(response?.[0]);
          }
        } else {
          showToast("Error", response, "error");
        }
      });
    }
  }, [userProfile?.id]);

  useFocusEffect(getMyCards);

  const getButtonTitle = useMemo(() => {
    return comingFromNormal || comingFromOnDemand
      ? t("payment.ConfirmPayment")
      : t("setting.confirm") + " " + t("payment.Top-up");
  }, [comingFromNormal, comingFromOnDemand]);

  const topUpAmount = async () => {
    if (parseInt(amount) <= 1) {
      showToast("Error!", "Amount must be greater then 1", "error");
    } else if (!selectedCard?.id) {
      showToast("Error!", "Select your card first", "error");
    } else {
      processTopUp();
      await analytics().logEvent("payment", {});
    }
  };

  const processTopUp = () => {
    const data = {
      customer: userProfile?.id,
      amount: amount,
      card_number: selectedCard.id,
      date: moment().format("YYYY-MM-DD"),
      status: "draft",
    };

    setLoading(true);
    CreateTopUp(data).then(({ success, response }) => {
      if (success) {
        ChargeCardForTopUp(response).then(({ success, response }) => {
          setLoading(false);
          if (success) {
            setUrl(response);
          } else {
            showToast("Error", response, "error");
          }
        });
      } else {
        setLoading(false);
        showToast("Error", response, "error");
      }
    });
  };

  const OrderAnalytics = ({ name }) => {
    if (!isObjEmpty(onDemandOrder)) {
      analytics()
        .setUserProperty("service", `${onDemandOrder?.service?.name}`)
        .catch((error) => {
          analytics().logEvent("serviceError", {
            firebase_error_value: "Invalid service",
            firebase_error_code: 6,
          });
        });
      analytics()
        .setUserProperty("Price", `${onDemandOrder?.service?.price}`)
        .catch((error) => {
          analytics().logEvent("PriceError", {
            firebase_error_value: "Invalid Price",
            firebase_error_code: 6,
          });
        });
      analytics()
        .setUserProperty(
          "serviceProvider",
          `${onDemandOrder?.serviceProvider?.name}`
        )
        .catch((error) => {
          analytics().logEvent("serviceProviderError", {
            firebase_error_value: "Invalid serviceProvider",
            firebase_error_code: 6,
          });
        });
      analytics()
        .setUserProperty(
          "date",
          `${moment.unix(onDemandOrder?.date).format("YYYY-MM-DD")}`
        )
        .catch((error) => {
          analytics().logEvent("dateError", {
            firebase_error_value: "Invalid date",
            firebase_error_code: 6,
          });
        });
      analytics()
        .setUserProperty("Vehicle", `${onDemandOrder?.vehicle?.name}`)
        .catch((error) => {
          analytics().logEvent("vehiclError", {
            firebase_error_value: "Invalid vehicle",
            firebase_error_code: 6,
          });
        });
      analytics()
        .setUserProperty(
          "VehicleModel",
          `${onDemandOrder?.vehicle?.vehicle_model}`
        )
        .catch((error) => {
          analytics().logEvent("vechileModelError", {
            firebase_error_value: "invalid vehicle name",
            firebase_error_code: 6,
          });
        });

      analytics().logScreenView({
        screen_name: `${name}`,
        service: `${onDemandOrder?.service?.name}`,
        Price: `${onDemandOrder?.service?.price}`,
        serviceProvider: `${onDemandOrder?.serviceProvider?.name}`,
        date: `${moment.unix(onDemandOrder?.date).format("YYYY-MM-DD")}`,
        Vehicle: `${onDemandOrder?.vehicle?.name}`,
        VehicleModel: `${onDemandOrder?.vehicle?.vehicle_model}`,
      });

      analytics().logEvent(`${name}`, {
        service: `${onDemandOrder?.service?.name}`,
        Price: `${onDemandOrder?.service?.price}`,
        serviceProvider: `${onDemandOrder?.serviceProvider?.name}`,
        date: `${moment.unix(onDemandOrder?.date).format("YYYY-MM-DD")}`,
        Vehicle: `${onDemandOrder?.vehicle?.name}`,
        VehicleModel: `${onDemandOrder?.vehicle?.vehicle_model}`,
      });
    }
  };

  const fetchAndUpdateLatestProfile = async () => {
    const { id } = userProfile;
    const getProfileResponse = await GetProfile({ profileID: id });
    if (getProfileResponse?.success) {
      setUserProfile(getProfileResponse?.data[0]);
      if (comingFromOnDemand) {
        setPlaceOrderNow(true);
        setTimeout(() => {
          navigation.navigate("GoDPlaceOrder", { placeOrderNow: true });
        }, 1000);
      } else if (comingFromNormal) {
        setPlaceOrderNow(true);
        setTimeout(() => {
          navigation.navigate("PaymentMethod", { placeOrderNow: true });
        }, 1000);
      } else {
        navigation.navigate("TopUpSuccess");
      }
    } else {
      return navigation.goBack();
    }
  };
  const renderCardList = () => {
    return (
      <View style={styles.paddedContent}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: Utilities.wp(95),
              paddingVertical: Utilities.hp(2),
              paddingHorizontal: Utilities.hp(1),
            }}
          >
            <Text style={{ ...FontSize.rfs20, fontFamily: Fonts.LexendBold }}>
              {t("payment.paymentoptions")}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("AddCard")}>
              <Text
                style={{
                  ...FontSize.rfs14,
                  color: Colors.DARKERGREEN,
                  fontFamily: Fonts.LexendMedium,
                  top: 2,
                }}
              >
                {t("gorexOnDemand.addNew")}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{ height: wallet.length === 0 ? "100%" : Utilities.hp(30) }}
          >
            <FlatList
              data={wallet}
              horizontal={wallet.length !== 0}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={() => renderEmptyListComponent(t)}
              renderItem={({ item }) =>
                renderRowItem({ t, item, selectedCard, setSelectedCard })
              }
            />
          </View>
        </View>
      </View>
    );
  };

  const renderWebViewForUrwayPayment = () => {
    return (
      <WebView
        onShouldStartLoadWithRequest={(request) => true}
        javaScriptEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={["*"]}
        useWebKit
        startInLoadingState
        scalesPageToFit
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error: ", nativeEvent);
        }}
        onNavigationStateChange={(state) => {
          if (state?.url?.includes("ResponseCode=000")) {
            fetchAndUpdateLatestProfile().then();
            OrderAnalytics({ name: "purchase" });
          } else if (state?.url?.includes("ResponseCode=337")) {
            showToast(
              t("errors.error"),
              t("payment.TransactionLimitExceeded"),
              "error"
            );
          } else if (state?.url?.includes("ResponseCode=001")) {
            showToast("Error", "Pending for Authorisation", "error");
          }
        }}
        source={{
          uri: url.toString(),
        }}
        style={{ marginTop: 20 }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <BackHeader title={comingTitle ? comingTitle : t("common.Top")} />
      {!url ? renderCardList() : renderWebViewForUrwayPayment()}
      {!url && (
        <Footer
          title={getButtonTitle}
          disabled={!selectedCard}
          onPress={topUpAmount}
        />
      )}
      <Loader visible={loading} />
    </View>
  );
};

export default TopUpCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  btn: {
    alignItems: "center",
    backgroundColor: Colors.ORANGE,
    borderRadius: 5,
    height: Utilities.hp(8),
    marginBottom: 10,
    justifyContent: "center",
    width: wp(330),
    alignSelf: "center",
    top: Utilities.hp(6),
  },
  titless: {
    color: Colors.WHITE,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs14,
  },
  imageContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container2: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  paddedContent: {
    paddingHorizontal: wp(14),
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  paymentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  paymentTitle: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs15,
    color: Colors.BLACK_OPAC,
    fontWeight: "bold",
  },
  price: {
    fontFamily: Fonts.LexendLight,
    textAlign: "left",
    ...FontSize.rfs56,
    color: Colors.BLACK,
    fontWeight: "bold",
    marginTop: hp(5),
  },
  card: {
    marginHorizontal: Utilities.wp(2),
    height: Utilities.hp(25),
    width: Utilities.wp(80),
    backgroundColor: Colors.WHITE,
    marginTop: Utilities.hp(1),
    borderRadius: hp(10),
    padding: hp(13),
    justifyContent: "space-around",

    shadowColor: "#171717",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    borderTopColor: "#F2F2F2",
    borderTopWidth: 1,
    borderTopLeftWidth: 1,
    borderTopRightWidth: 1,
    borderTopLeftColor: "#F2F2F2",
    borderTopRightColor: "#F2F2F2",
  },

  selectedCard: {
    borderTopColor: Colors.DARKERGREEN,
    borderColor: Colors.DARKERGREEN,
    borderWidth: 3,
    borderTopWidth: 3,
    elevation: 0,
    shadowOffset: { width: 0, height: 0 },
  },

  icon: {
    width: hp(60),
    height: hp(60),
    resizeMode: "contain",
  },
  transactionCards: {
    minHeight: hp(30),
    width: "86%",
    borderRadius: wp(10),
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: hp(20),
    elevation: 1,
    margin: 4,
  },
  transactionCard: {
    width: "95%",
    alignSelf: "center",
    borderRadius: wp(10),
    marginTop: Utilities.wp(2),
    flexDirection: "row",
    justifyContent: "space-between",
    padding: hp(20),
    elevation: 1,
    backgroundColor: "white",
    shadowColor: "#171717",
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  orderNumber: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs16,
    color: Colors.BLACK,
  },
  wallet: {
    fontFamily: Fonts.LexendRegular,
    textAlign: "left",
    ...FontSize.rfs12,
    color: Colors.BLACK_OPAC,
    marginTop: hp(11),
  },
  transaction: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs14,
    color: Colors.DARKERGREEN,
  },
  plus: {
    width: hp(47),
    height: hp(47),
  },
  time: {
    fontFamily: Fonts.LexendRegular,
    textAlign: "left",
    ...FontSize.rfs12,
    color: Colors.BLACK_OPAC,
    marginTop: hp(11),
  },
  rightView: {
    justifyContent: "center",
    alignItems: "center",
  },
  plusButton: {
    height: hp(40),
    width: hp(40),
    borderRadius: 7,
    backgroundColor: Colors.LIGHT_BLUE,
    position: "absolute",
    bottom: hp(20),
    right: hp(20),
    justifyContent: "center",
    alignItems: "center",
  },
  xText: {
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    color: Colors.GREY_PLACEHOLDER,
  },
  nText: {
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    color: Colors.BLACK,
  },
  cardHeading: {
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    color: Colors.BLACK,
  },
  cardValue: {
    ...FontSize.rfs16,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    color: Colors.BLACK,
  },
  numberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: hp(12),
  },
  holderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: hp(12),
  },
  allTransaction: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs14,
    color: Colors.BLACK,
    marginTop: Utilities.hp(3),
    margin: 10,
  },
  item: {
    height: hp(160),
    resizeMode: "contain",
    width: wp(105),
    marginTop: hp(60),
  },
  text: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendBold,
    textAlign: "center",
    ...FontSize.rfs24,
    marginTop: hp(5),
  },
  title2: {
    color: "#B8B9C1",
    width: "70%",
    fontFamily: Fonts.LexendMedium,
    textAlign: "center",
    ...FontSize.rfs14,
    marginTop: hp(10),
  },
});

// export default TopUpCard;
