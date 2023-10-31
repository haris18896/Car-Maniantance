import React, { useState, useEffect, useContext } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
} from "react-native";

// ** Custom Components
import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import { isObjEmpty } from "../../utils/utils";
import { showToast } from "../../utils/common";
import FontSize from "../../Constants/FontSize";
import Utilities from "../../utils/UtilityMethods";
import { hp, wp } from "../../utils/responsiveSizes";
import BackHeader from "../../Components/Header/BackHeader";
import Footer from "../ProductsAndServices/components/Footer";
import InputWithLabel from "../../Components/Inputs/InputWithLabel";
import {
  Delete,
  Mada,
  Master,
  NoTopUpCard,
  Visa,
  WalletMobile,
  WalletMobileUp,
} from "../../assets";

// ** Third Party Components
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

// ** Store And Actions
import GetWallet from "../../api/GetWallet";
import DeleteCreditCard from "../../api/DeleteCreditCard";
import { CommonContext } from "../../contexts/ContextProvider";
import { WebView } from "react-native-webview";
import analytics from "@react-native-firebase/analytics";
import moment from "moment/moment";
import CreateTopUp from "../../api/CreateTopUp";
import ChargeCardForTopUp from "../../api/ChargeCardForTopUp";
import Loader from "../../Components/Loader";
import { GetProfile } from "../../api/CallAPI";
import { setPlaceOrderNow } from "../../contexts/global";
const TransferScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { userProfile, setUserProfile } = useContext(CommonContext);

  // ** States
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({});
  const [isCardSelected, setIsCardSelected] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState();

  useEffect(() => {
    getCustomerCards();
  }, [refreshing, navigation]);

  const getCustomerCards = () => {
    if (refreshing) {
      setRefreshing(true);
    }

    GetWallet(userProfile?.id).then(({ success, response }) => {
      setRefreshing(false);
      if (success) {
        setCards(response);
        setSelectedCard(response[0]);
      } else {
        showToast("Error", response, "error");
        // crashlytics().recordError(response);
      }
    });
  };

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

  return (
    <View style={styles.container}>
      <BackHeader title={t("order_history.transfer")} />

      {url ? (
        getWebviewForUrwayPaymentView(
          url,
          navigation,
          userProfile,
          setUserProfile
        )
      ) : (
        <>
          {!isCardSelected ? (
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
                <Text
                  style={{ ...FontSize.rfs20, fontFamily: Fonts.LexendBold }}
                >
                  {t("payment.paymentoptions")}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("AddCard")}
                >
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

              {cards.length > 0 ? (
                <FlatList
                  data={cards}
                  horizontal={true}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) =>
                    renderRowItem(
                      item,
                      selectedCard,
                      setIsCardSelected,
                      setSelectedCard
                    )
                  }
                />
              ) : (
                <RenderEmptyListComponent t={t} />
              )}
            </View>
          ) : (
            <KeyboardAvoidingView
              style={styles.initialComponent}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View style={{ alignItems: "center" }}>
                <Image
                  style={{
                    resizeMode: "contain",
                    width: Utilities.wp(30),
                  }}
                  source={WalletMobileUp}
                />
              </View>

              <InputWithLabel
                label={t("walletTopUp.enterAmount")}
                value={amount}
                setValue={setAmount}
                maxLength={16}
                keyboardType="numeric"
                returnKeyType="done"
                placeholder={t("walletTopUp.enterAmountPlaceholder")}
              />
            </KeyboardAvoidingView>
          )}

          <Footer
            disabled={
              (!selectedCard.id && !isCardSelected) ||
              (isCardSelected && amount < 2)
            }
            buttonStyle={{ backgroundColor: Colors.ORANGE }}
            title={t("Next.next")}
            onPress={() => {
              if (!isCardSelected) {
                setIsCardSelected(true);
              } else {
                topUpAmount();
              }
            }}
          />
          <Loader visible={loading || refreshing} />
        </>
      )}
    </View>
  );
};

const getWebviewForUrwayPaymentView = (
  url,
  navigation,
  userProfile,
  setUserProfile
) => {
  const fetchAndUpdateLatestProfile = async () => {
    const { id } = userProfile;
    const getProfileResponse = await GetProfile({ profileID: id });
    if (getProfileResponse?.success) {
      setUserProfile(getProfileResponse?.data[0]);
      navigation.navigate("TopUpSuccess");
    } else {
      return navigation.goBack();
    }
  };

  return (
    <WebView
      style={{ marginTop: hp(20) }}
      source={{ uri: url }}
      useWebKit
      scalesPageToFit
      javaScriptEnabled
      startInLoadingState
      originWhitelist={["*"]}
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      onShouldStartLoadWithRequest={() => true}
      onError={({ nativeEvent }) =>
        console.log(`WebView Error: ${nativeEvent}`)
      }
      onNavigationStateChange={(state) => {
        if (state?.url?.includes("ResponseCode=000")) {
          fetchAndUpdateLatestProfile().then();
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
    />
  );
};

const RenderEmptyListComponent = ({ t }) => {
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

const renderRowItem = (
  item,
  selectedCard,
  setIsCardSelected,
  setSelectedCard
) => {
  let cardBrandImage = Visa;
  if (item.card_brand && item.card_brand.toLowerCase() === "mada") {
    cardBrandImage = Mada;
  } else if (item.card_brand && item.card_brand.toLowerCase() === "master") {
    cardBrandImage = Master;
  }
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
          <Image source={cardBrandImage} style={styles.icon} />
          {/*<TouchableOpacity*/}
          {/*    onPress={() => {*/}
          {/*        setSelectedCard(item)*/}
          {/*        // setIsCardSelected(true)*/}
          {/*        // onPressDeleteCardIcon(item);*/}
          {/*    }}*/}
          {/*    style={{ width: wp(50), alignItems: "flex-end" }}*/}
          {/*>*/}
          {/*    <Image source={Delete} style={styles.delete_icon} />*/}
          {/*</TouchableOpacity>*/}
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.xText}>{item.number.substring(0, 4)}</Text>
          <Text style={styles.xText}>{item.number.substring(4, 8)}</Text>
          <Text style={styles.xText}>{item.number.substring(8, 12)}</Text>
          <Text style={styles.xText}>{item.number.substring(12, 16)}</Text>
        </View>

        <View style={styles.holderContainer}>
          <View>
            {/*<Text style={styles.cardHeading}>{t('creditcard.cardHolder')}</Text>*/}
            <Text style={styles.cardValue}>{item?.card_holder[1]}</Text>
          </View>

          {/*<View>*/}
          {/*  <Text style={styles.cardHeading}>{t('creditcard.expires')}</Text>*/}
          {/*  <Text style={styles.cardValue}>{item?.date}</Text>*/}
          {/*</View>*/}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TransferScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  initialComponent: {
    flex: 1,
    paddingHorizontal: wp(20),
    justifyContent: "center",
  },
  topUpImage: {
    width: wp(84),
    height: hp(155),
    resizeMode: "contain",
    marginBottom: hp(130),
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
    flex: 1,
    justifyContent: "center",
  },
  paymentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  paymentTitle: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs20,
    color: Colors.BLACK_OPAC,
  },
  price: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs90,
    color: Colors.BLACK,
  },

  rowItem: {
    width: Utilities.wp(100),
    alignItems: "center",
    justifyContent: "center",
    height: Utilities.hp(25),
  },
  card: {
    backgroundColor: Colors.WHITE,
    height: "90%",
    width: Utilities.wp(95),
    borderRadius: hp(12),
    paddingHorizontal: hp(13),
    justifyContent: "space-around",
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    elevation: 2,
    borderColor: Colors.LIGHT_GREY,
    borderWidth: 1,
  },
  icon: {
    height: Utilities.wp(10),
    width: Utilities.wp(20),
    resizeMode: "contain",
  },

  delete_icon: {
    height: Utilities.wp(5),
    width: Utilities.wp(5),
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
    elevation: 2,
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
  selectedCard: {
    borderTopColor: Colors.DARKERGREEN,
    borderColor: Colors.DARKERGREEN,
    borderWidth: 3,
    borderTopWidth: 3,
    elevation: 0,
    shadowOffset: { width: 0, height: 0 },
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
    ...FontSize.rfs24,
    fontFamily: Fonts.LexendMedium,
    color: Colors.GREY_PLACEHOLDER,
  },
  nText: {
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    color: Colors.BLACK,
  },
  cardHeading: {
    ...FontSize.rfs16,
    fontFamily: Fonts.LexendRegular,
    color: Colors.BLACK,
  },
  cardValue: {
    ...FontSize.rfs16,
    fontFamily: Fonts.LexendBold,
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
