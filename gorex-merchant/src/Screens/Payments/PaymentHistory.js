import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ScrollView,
} from "react-native";

import moment from "moment";
import { useTranslation } from "react-i18next";
import RBSheet from "react-native-raw-bottom-sheet";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import {
  MenuBlack,
  NoTopUpCard,
  Visa,
  Mada,
  Master,
  American,
  Delete,
} from "../../assets";
import Utilities from "../../utils/UtilityMethods";
import { hp, wp } from "../../utils/responsiveSizes";

import TabBarPayment from "./ components/TabBarPayment";
import Footer from "../ProductsAndServices/components/Footer";
import GetWallet from "../../api/GetWallet";

import DeleteCreditCard from "../../api/DeleteCreditCard";
import BackHeader from "../../Components/Header/BackHeader";
import { CommonContext } from "../../contexts/ContextProvider";
import GetTransactions from "../../api/Transactions";
import Loader from "../../Components/Loader";
import analytics from "@react-native-firebase/analytics";
import SmallButton from "../../Components/Buttons/SmallButton";
import {GetProfile} from "../../api/CallAPI";
// import crashlytics from "@react-native-firebase/crashlytics";

const PaymentHistory = ({ route }) => {
  const { userProfile, setUserProfile } = useContext(CommonContext);

  const activeTab = route?.params?.activeTab;

  const refRBSheet = useRef();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [wallet, setWallet] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletHistory, setWalletHistory] = useState();
  const [active, setActive] = useState(activeTab ? activeTab : 1);

  useEffect(() => {
    return navigation.addListener("focus", handleViewSwitch);
  }, [navigation]);

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "payment_history_screen",
    });
  }, []);

  const handleViewSwitch = () => {
    getCustomerCards(false);
    getTransactionHistory();
  };

  const getCustomerCards = (refreshing) => {
    if (refreshing) {
      setRefreshing(true);
    }
    setLoading(true)
    GetWallet(userProfile?.id).then(({ success, response }) => {
      setRefreshing(false);
      setLoading(false)
      if (success) {
        setWallet(response);
      } else {
        showToast("Error", response, "error");
        // crashlytics().recordError(response);
      }
    });
  };

  const getTransactionHistory = () => {
    setLoading(true);
    GetTransactions(userProfile?.id).then(({ success, response }) => {
      setLoading(false);
      if (success) {
        setWalletHistory(response);
      } else {
        showToast("Error", response, "error");
        // crashlytics().recordError(response);
      }
    });
  };

  const onPressDeleteCardIcon = (item) => {
    Alert.alert("Confirm", "Are you sure you want to delete this card?", [
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          removeCard(item);
        },
      },
      {
        text: "Cancel",
        onPress: () => {},
      },
    ]);
  };

  const removeCard = (card) => {
    setLoading(true);
    DeleteCreditCard(card.id).then(({ success, response }) => {
      setLoading(false);
      if (success) {
        getCustomerCards(true);
      } else {
        showToast("Card Not Removed", response, "error");
        // crashlytics().recordError(response);
      }
    });
  };

  const getWalletScreen = () => {
    return (
      <View style={styles.paymentContainer}>
        <Text style={styles.paymentTitle}> {t("history.Balance")}</Text>
        <Text style={styles.price}>{userProfile?.balance.toFixed(2)}</Text>
        <Text style={[styles.paymentTitle, { marginBottom: hp(40) }]}>
          {" "}
          {t("common.SAR")}
        </Text>
        {/*<SmallButton*/}
        {/*    title={t("order_history.transfer")}*/}
        {/*    onPress={() => {*/}
        {/*      navigation.navigate('TransferScreen')*/}
        {/*    }}*/}
        {/*    backgroundColor={Colors.ORANGE}*/}
        {/*/>*/}
      </View>
    );
  };

  const renderEmptyListComponent = () => {
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

  const renderRowItem = (item) => {
    let cardBrandImage = Visa;
    if (item.card_brand && item.card_brand.toLowerCase() === "mada") {
      cardBrandImage = Mada;
    } else if (item.card_brand && item.card_brand.toLowerCase() === "master") {
      cardBrandImage = Master;
    }
    return (
      <View style={styles.rowItem}>
        <View style={[styles.card, styles.cardShadow]}>
          <View style={styles.imageContainer}>
            <Image source={cardBrandImage} style={styles.icon} />
            <TouchableOpacity
              onPress={() => {
                onPressDeleteCardIcon(item);
              }}
              style={{ width: wp(50), alignItems: "flex-end" }}
            >
              <Image source={Delete} style={styles.delete_icon} />
            </TouchableOpacity>
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
      </View>
    );
  };

  const fetchAndUpdateLatestProfile = async () => {
    GetProfile({ profileID: userProfile.id })
        .then((getProfileResponse) => {
          if (getProfileResponse?.success) {
            setUserProfile(getProfileResponse?.data[0]);
          }
        })
    // .catch((err) => crashlytics().recordError(err));
  };

  const onRefresh = async () => {
    await fetchAndUpdateLatestProfile()
    await getCustomerCards()
    await getTransactionHistory();
  };

  return (
    <View style={styles.container}>
      <BackHeader
        leftIcon={MenuBlack}
        leftPress={() => {
          navigation.openDrawer();
        }}
        title={t("history.Wallet")}
      />

      {!userProfile?.parent_partner_id && (
        <TabBarPayment
          active={active}
          onPressTab={(tab) => {
            setActive(tab);
          }}
        />
      )}

      <ScrollView
        style={styles.paddedContent}
        contentContainerStyle={{ flex: 1, justifyContent: "center" }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        {active === 1 ? (
          getWalletScreen()
        ) : active === 2 ? (
          <>
            <View style={{ flex: 1, width: Utilities.wp(100) }}>
              {wallet.length > 0 ? (
                <FlatList
                  refreshing={refreshing}
                  onRefresh={() => {
                    getCustomerCards();
                  }}
                  data={wallet}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => renderRowItem(item)}
                />
              ) : (
                renderEmptyListComponent()
              )}
            </View>
            <RBSheet
              height={Utilities.hp(20)}
              ref={refRBSheet}
              closeOnDragDown={true}
              closeOnPressMask={false}
              customStyles={{
                container: {
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                },
                wrapper: { backgroundColor: "#17151FB3" },
                draggableIcon: { backgroundColor: "#000" },
              }}
            >
              <TouchableOpacity
                style={{ position: "absolute", top: 10, right: 20 }}
                onPress={() => {
                  refRBSheet.current.close();
                }}
              >
                <Text
                  style={{
                    color: Colors.BLACK,
                    fontFamily: Fonts.LexendMedium,
                    ...FontSize.rfs14,
                    marginTop: Utilities.hp(2),
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              {/*<TouchableOpacity style={styles.btn} onPress={() => {removeCard(selectedCard.id);}}>*/}
              {/*  <Text style={styles.titless}>Delete Card</Text>*/}
              {/*</TouchableOpacity>*/}
            </RBSheet>
          </>
        ) : (
          <>
            <FlatList
              style={{ width: "100%" }}
              data={walletHistory}
              contentContainerStyle={{ paddingBottom: hp(40) }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.container2}>
                  <Image
                    resizeMode="contain"
                    transitionDuration={1000}
                    style={styles.item}
                  />
                  <Text style={styles.text}>
                    {t("creditcard.notransaction")}
                  </Text>
                  <Text style={styles.title2}>{t("creditcard.noaccount")}</Text>
                </View>
              }
              // ListHeaderComponent={() => {
              //   return (
              //       <>
              //         <View>
              //           <Text style={styles.allTransaction}>{t("creditcard.lasttransactions")}</Text>
              //           {walletHistory?.length > 0 && (
              //               <View style={styles.transactionCard}>
              //                 <View>
              //                   <Text style={styles.orderNumber}>{walletHistory[0]?.card_number}</Text>
              //                   <Text style={styles.time}>
              //                     {moment(walletHistory[0]?.created_at).format("DD/MM/YYYY hh:mm A")}
              //                   </Text>
              //                 </View>
              //                 <View style={styles.rightView}>
              //                   <Text style={styles.transaction}>+{walletHistory[0]?.amount} {t("common.SAR")}</Text>
              //                   <Text style={styles.wallet}>{" "}{t("history.Wallet")}
              //                   </Text>
              //                 </View>
              //               </View>
              //           )}
              //         </View>
              //         <Text style={styles.allTransaction}>{t("creditcard.allTransaction")}</Text>
              //       </>
              //   );
              // }}
              renderItem={({ item }) => (
                <View style={[styles.transactionCard]}>
                  <View>
                    <Text style={styles.orderNumber}>{item?.description}</Text>
                    <Text style={styles.time}>{item?.date}</Text>
                  </View>
                  <View style={styles.rightView}>
                    <Text
                      style={[
                        styles.transaction,
                        item.type !== "Wallet top-up" && {
                          color: Colors.ORANGE,
                        },
                      ]}
                    >
                      {item.type !== "Wallet top-up" ? "-" : "+"} {item?.amount}{" "}
                      {t("common.SAR")}
                    </Text>
                    <Text style={styles.wallet}> {t("history.Wallet")}</Text>
                  </View>
                </View>
              )}
            />
          </>
        )}
      </ScrollView>
      {active === 1 && !userProfile?.parent_partner_id ? (
        <Footer
          title={t("common.Top")}
          onPress={() => navigation.navigate("TopUp")}
        />
      ) : (
        active === 2 && (
          <Footer
            title={t("creditcard.add")}
            onPress={() => navigation.navigate("AddCard", { wallet })}
          />
        )
      )}

      <Loader visible={loading} />
    </View>
  );
};

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
    flex: 1,
    // justifyContent: "center",
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

export default PaymentHistory;
