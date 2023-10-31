import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from "react-native";

import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import Utilities from "../../utils/UtilityMethods";
import { hp, wp } from "../../utils/responsiveSizes";
import GeneralAPIWithEndPoint from "../../api/GeneralAPIWithEndPoint";
import {
  Diamond,
  Flatcard,
  FlatcardAr,
  Gold,
  GorexCoin,
  Platinum,
  Silver,
  GorexSignup,
  GorexOrderSticker,
  GorexRefferSticker,
  Forward,
  ForwardBlack,
  Reward,
  Date,
  EarnedCoins,
  Arrowen,
  WhiteMenu,
} from "../../assets";

import TopGorexClub from "../../Components/Header/TopGorexClub";
import { CommonContext } from "../../contexts/ContextProvider";
import moment from "moment";
import { showToast } from "../../utils/common";
import GetMembershipTiers from "../../api/GetMembershipTiers";
import BackHeaderSupport from "../../Components/Header/BackHeaderSupport";
import fonts from "../../Constants/fonts";
import { GorexClubText } from "../../assets";
import { GCoin } from "../../assets";

const Tabs = createMaterialTopTabNavigator();

const Tiers = ({ navigation, route }) => {
  const [tiers, setTiers] = useState();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    return navigation.addListener("focus", handleViewSwitch);
  }, [navigation]);

  const handleViewSwitch = () => {
    GetMembershipTiers().then((response) => {
      if (response.success) {
        setTiers(response.response);
      }
    });
  };

  function capitalizeFirstLetter(str) {
    // return str.charAt(0).toUpperCase() + str.slice(1);
    return `${t(str)}`;
  }

  const getTierCard = (imageSource, title, spendRange, goCoins) => {
    return (
      <ImageBackground
        source={isRTL ? FlatcardAr : Flatcard}
        style={{
          height: Utilities.hp(10),
          flexDirection: "row",
          marginBottom: Utilities.hp(2),
        }}
      >
        <Image
          style={{ height: "100%", width: "17%" }}
          resizeMode={"center"}
          source={imageSource}
        />

        <View
          style={{ height: "100%", width: "22%", justifyContent: "center" }}
        >
          <Text
            style={{
              color: Colors.WHITE,
              fontFamily: Fonts.LexendMedium,
              ...FontSize.rfs16,
            }}
          >
            {title}
          </Text>
        </View>

        <View
          style={{ width: "35%", alignSelf: "center", alignItems: "center" }}
        >
          <Text
            style={{
              color: Colors.ORANGE,
              fontFamily: Fonts.LexendRegular,
              marginBottom: Utilities.hp(0.7),
            }}
          >
            {t("gorexclub.spend")}
          </Text>
          <Text
            style={{
              color: Colors.WHITE,
              fontFamily: Fonts.LexendRegular,
              ...FontSize.rfs16,
            }}
          >
            {spendRange}
          </Text>
        </View>

        <View
          style={{ width: "30%", alignSelf: "center", alignItems: "center" }}
        >
          <Text
            style={{
              color: Colors.ORANGE,
              fontFamily: Fonts.LexendRegular,
              marginBottom: Utilities.hp(0.7),
            }}
          >
            {" "}
            {t("gorexclub.gocoins")}
          </Text>
          <Text
            style={{
              color: Colors.WHITE,
              fontFamily: Fonts.LexendRegular,
              ...FontSize.rfs16,
            }}
          >
            {goCoins}
          </Text>
        </View>
      </ImageBackground>
    );
  };

  const getTierCardForItem = (item) => {
    let imageName = Silver;
    if (item.target_name === "gold") {
      imageName = Gold;
    } else if (item.target_name === "platinum") {
      imageName = Platinum;
    } else if (item.target_name === "diamond") {
      imageName = Diamond;
    }

    return (
      <ImageBackground
        source={isRTL ? FlatcardAr : Flatcard}
        // resizeMode={"contain"}
        style={{
          height: Utilities.hp(8),
          flexDirection: "row",
          marginBottom: Utilities.hp(2),
          alignItems: "center",
          borderRadius: 4,
        }}
      >
        <Image
          style={{ height: "55%", width: "15%" }}
          resizeMode={"contain"}
          source={imageName}
        />

        <View
          style={{ height: "100%", width: "22%", justifyContent: "center" }}
        >
          <Text
            style={{
              color: Colors.WHITE,
              fontFamily: Fonts.LexendMedium,
              ...FontSize.rfs16,
              textAlign: "left",
            }}
          >
            {capitalizeFirstLetter(item.target_name)}
          </Text>
        </View>

        <View
          style={{ width: "35%", alignSelf: "center", alignItems: "center" }}
        >
          <Text
            style={{
              color: Colors.ORANGE,
              fontFamily: Fonts.LexendRegular,
              marginBottom: Utilities.hp(0.7),
            }}
          >
            {t("gorexclub.spend")}
          </Text>
          <Text
            style={{
              color: Colors.WHITE,
              fontFamily: Fonts.LexendRegular,
              ...FontSize.rfs16,
            }}
          >
            {item.from_target + " - " + item.to_target}
          </Text>
        </View>

        <View
          style={{ width: "30%", alignSelf: "center", alignItems: "center" }}
        >
          <Text
            style={{
              color: Colors.ORANGE,
              fontFamily: Fonts.LexendRegular,
              marginBottom: Utilities.hp(0.7),
            }}
          >
            {" "}
            {t("gorexclub.gocoins")}
          </Text>
          <Text
            style={{
              color: Colors.WHITE,
              fontFamily: Fonts.LexendRegular,
              ...FontSize.rfs16,
            }}
          >
            {item.points}
          </Text>
        </View>
      </ImageBackground>
    );
  };

  return (
    <View
      style={{
        paddingVertical: Utilities.hp(2),
        backgroundColor: "white",
        paddingHorizontal: Utilities.wp(2),
        flex: 1,
      }}
    >
      <FlatList
        data={tiers}
        renderItem={({ item }) => {
          return getTierCardForItem(item);
        }}
      />
    </View>
  );
};

const Rewards = ({ navigation }) => {
  const { userProfile } = useContext(CommonContext);

  let whatsAppText = `Check out gorex app! Enjoy hassle free car care and maintenance with our automotive service app. Schedule appointments, get quotes  for service both at our nearest service provider's site or at your door step.`;
  whatsAppText =
    whatsAppText +
    "\nDownload now to start simplifying your car care routine. \n\nhttps://play.google.com/store/apps/details?id=com.gorexcustomer \n\n https://apps.apple.com/pk/app/gorex-customer/id1633313842";

  const getPartnerCard = () => {
    return (
      <View
        style={{
          width: "90%",
        }}
      >
        <Text style={styles.gorexClubText}>
          {t("gorexclub.Gorex Club Partners")}
        </Text>
        <FlatList
          data={[1, 2, 3, 4]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            flex: 1,
          }}
          renderItem={() => (
            <View
              style={[
                styles.partnerCardContainer,
                {
                  height:
                    Platform.OS == "ios" ? Utilities.hp(11) : Utilities.hp(14),
                },
              ]}
            >
              <View style={styles.mainContentContainer}>
                <View style={styles.firstContentContainer}>
                  <Text style={styles.eliteText}>{t("gorexclub.Elite")}</Text>
                </View>
              </View>

              <View
                style={[
                  styles.secondContentContainer,
                  { width: Platform.OS == "ios" ? "58%" : "55%" },
                ]}
              >
                <Text style={styles.autoText}>ELITE AUTO</Text>
                <Text style={styles.headlineText}>
                  {t("gorexclub.Headline")}
                </Text>
                <Text style={styles.discountText}>
                  20% {t("common.discount")}...
                </Text>
              </View>

              <View
                style={{
                  width: Platform.OS == "ios" ? "20%" : "22%",
                  marginTop: 5,
                }}
              >
                <Text style={styles.gCoinText}>+ {t("gorexclub.gocoins")}</Text>
                <View></View>
                <Image
                  source={GCoin}
                  resizeMode={"contain"}
                  style={styles.gCoinImage}
                />
              </View>
            </View>
          )}
        />
      </View>
    );
  };

  const getRewardCard = (
    title,
    isSpendBase,
    subTitle,
    isCompleted,
    rightImage,
    isReferFriend,
    orderNow,
    callback
  ) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar";
    return (
      <View style={[styles.card, styles.cardShadow]}>
        <View style={{ height: "100%", width: "70%" }}>
          <View
            style={{
              flexDirection: "row",
              paddingVertical: Utilities.hp(0.5),
            }}
          >
            <View
              style={{
                // width: "56%",
                justifyContent: "center",
                textAlign: "left",
                marginRight: wp(5),
              }}
            >
              <Text style={styles.title}>{title}</Text>
            </View>
            {isSpendBase && (
              <View style={{ width: "44%", alignItems: "flex-start" }}>
                <TouchableOpacity activeOpacity={1} style={styles.spendBased}>
                  <Text
                    style={{
                      color: Colors.ORANGE,
                      fontFamily: Fonts.LexendMedium,
                      ...FontSize.rfs12,
                    }}
                  >
                    {t("gorexclub.spendbase")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              height: "30%",
              alignItems: "center",
            }}
          >
            <Image
              source={GorexCoin}
              style={{ height: "70%", width: "10%" }}
              resizeMode={"contain"}
            />
            <View style={{ width: "80%", justifyContent: "center" }}>
              <Text style={styles.subTitle}>{subTitle}</Text>
            </View>
          </View>

          <View style={{ height: "40%", justifyContent: "center" }}>
            <TouchableOpacity
              style={[
                styles.cardButton,
                {
                  backgroundColor: isCompleted
                    ? Colors.LIGHT_GREY
                    : Colors?.ORANGE,
                },
              ]}
              disabled={isCompleted}
              onPress={callback}
            >
              <View style={styles.row1}>
                <Text
                  style={[
                    styles.buttonText,
                    {
                      left: Utilities.wp(13),
                      color: isCompleted ? Colors.BLACK : Colors.WHITE,
                    },
                  ]}
                >
                  {isReferFriend
                    ? t("gorexclub.refernow")
                    : orderNow
                    ? t("gorexclub.ordernow")
                    : isCompleted
                    ? t("gorexclub.completed")
                    : t("gorexclub.complete")}
                </Text>
                <Image
                  style={styles.forwardIcon}
                  source={
                    isRTL ? Arrowen : isCompleted ? ForwardBlack : Forward
                  }
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: "100%", width: "30%", alignItems: "center" }}>
          <Image
            source={rightImage}
            style={{ height: "100%", width: "80%", resizeMode: "contain" }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingVertical: Utilities.hp(2),
        }}
      >
        {/*{getPartnerCard()}*/}
        <Text style={styles.rewardText}>{t("gorexclub.rewards")}</Text>
        {getRewardCard(
          t("gorexclub.signupreward"),
          false,
          t("gorexclub.x100"),
          true,
          GorexSignup,
          false,
          false,
          () => {
            // ("Signup Pressed");
          }
        )}

        {getRewardCard(
          t("gorexclub.completeprofile"),
          false,
          t("gorexclub.x200"),
          userProfile?.profile_completed,
          GorexSignup,
          false,
          false,
          () => {
            if (!userProfile?.profile_completed) {
              navigation.navigate("ProfileUpdate");
            }
          }
        )}

        {getRewardCard(
          t("gorexclub.orderreward"),
          true,
          t("gorexclub.spendmore"),
          false,
          GorexOrderSticker,
          false,
          true,
          () => {
            //("I am here---");
            const resetAction = CommonActions.reset({
              index: 0,
              routes: [{ name: "Dashboard" }],
            });
            navigation.dispatch(resetAction);
          }
        )}

        {getRewardCard(
          t("gorexclub.friend"),
          false,
          t("gorexclub.referFriend"),
          false,
          GorexRefferSticker,
          true,
          false,
          () => {
            Linking.openURL(`whatsapp://send?text= ${whatsAppText}`)
              .then((res) => {})
              .catch((err) => {
                Alert.alert(t("common.alert"), t("support.whatsapp"), [
                  { text: t("common.OK") },
                ]);
              });
          }
        )}
      </ScrollView>
    </View>
  );
};

const History = ({ navigation }) => {
  const { t } = useTranslation();
  const { userProfile } = useContext(CommonContext);
  const [history, setHistory] = useState(null);

  useEffect(() => {}, []);

  useEffect(() => {
    return navigation.addListener("focus", handleViewSwitch);
  }, [navigation]);

  const handleViewSwitch = () => {
    getHistory().then();
  };

  const getHistory = async () => {
    const body = { customer: userProfile.id };
    const historyResponse = await GeneralAPIWithEndPoint(
      "/points/history",
      body
    );
    if (historyResponse === "No Reward Yet!") {
      showToast("Error", historyResponse, "error");
    } else {
      setHistory(historyResponse);
    }
  };

  const getSingleRowItemForHistoryCard = (icon, title, subTitle) => {
    return (
      <View style={[styles.header]}>
        <View style={{ width: "16%", alignItems: "center" }}>
          <Image
            style={{ resizeMode: "contain", height: wp(20), width: wp(20) }}
            source={icon}
          />
        </View>
        <View style={{ width: "42%" }}>
          <Text style={[styles.title, { ...FontSize.rfs14 }]}>{title}</Text>
        </View>

        <View
          style={{
            width: "42%",
            justifyContent: "flex-end",
            flexDirection: "row",
          }}
        >
          <Text
            style={[
              styles.subTitle,
              {
                color:
                  title === t("gorexclub.earnedgocoins")
                    ? Colors.DARKERGREEN
                    : Colors.LIGHTGREY,
                ...FontSize.rfs14,
              },
            ]}
          >
            {subTitle}
          </Text>
        </View>
      </View>
    );
  };

  const getFlatListRowCardForEarnedRewardHistory = (item) => {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View
          style={[
            styles.card,
            styles.cardShadow,
            {
              flexDirection: "column",
              justifyContent: "space-around",
              paddingVertical: hp(25),
            },
          ]}
        >
          {getSingleRowItemForHistoryCard(
            Reward,
            t("gorexclub.reward"),
            item?.reward
          )}
          {getSingleRowItemForHistoryCard(
            EarnedCoins,
            t("gorexclub.earnedgocoins"),
            item?.points
          )}
          {getSingleRowItemForHistoryCard(
            Date,
            t("gorexclub.date"),
            moment(item?.date).format("DD/MM/YYYY")
          )}
          {getSingleRowItemForHistoryCard(
            Date,
            t("gorexclub.expiry"),
            moment(item?.expire_date).format("DD/MM/YYYY")
          )}
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        paddingVertical: Utilities.hp(2),
        paddingHorizontal: Utilities.wp(2),
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <Text
        style={{
          ...FontSize.rfs18,
          fontFamily: Fonts.LexendBold,
          marginLeft: Utilities.wp(3),
          alignSelf: "flex-start",
        }}
      >
        {t("gorexclub.earnedrewards")}
      </Text>
      <FlatList
        data={history}
        contentContainerStyle={{ paddingVertical: hp(20) }}
        renderItem={({ item }) => {
          return getFlatListRowCardForEarnedRewardHistory(item);
        }}
      />
    </View>
  );
};

const Mytabs = () => {
  return (
    <Tabs.Navigator
      swipeEnabled={true}
      tabBarOptions={{
        activeTintColor: Colors.ORANGE,
        inactiveTintColor: Colors.GREY_TEXT,
        indicatorStyle: { backgroundColor: Colors.ORANGE, height: 3 },
        labelStyle: {
          ...FontSize.rfs14,
          fontFamily: Fonts.LexendMedium,
          textTransform: "none",
        },
        style: { borderBottomColor: Colors.ORANGE, borderBottomWidth: 2 },
      }}
    >
      <Tabs.Screen name={t("gorexclub.tiers")} component={Tiers} />
      <Tabs.Screen name={t("gorexclub.rewards")} component={Rewards} />
      <Tabs.Screen name={t("gorexclub.history")} component={History} />
    </Tabs.Navigator>
  );
};

const GorexCards = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isVisible = route?.params?.isVisible;

  return (
    <View style={styles.container}>
      <TopGorexClub
        title={t("menu.GorexClub")}
        leftIcon={WhiteMenu}
        leftPress={() => navigation.openDrawer()}
        modalValue={isVisible}
      />

      <View style={{ flex: 1 }}>
        <Mytabs />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
  paddedContent: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  paymentTitle: {
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs15,
    color: Colors.BLACK_OPAC,
    fontWeight: "bold",
  },
  price: {
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs56,
    color: Colors.BLACK,
    fontWeight: "bold",
    marginTop: hp(5),
  },
  card: {
    flexDirection: "row",
    height: Utilities.hp(20),
    width: Utilities.wp(92),
    backgroundColor: Colors.WHITE,
    borderRadius: Utilities.hp(2),
    padding: Utilities.wp(3),
    marginBottom: Utilities.hp(3),
  },

  cardShadow: {
    shadowColor: Colors.GREY,
    shadowOffset: { height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
    borderColor: Colors.LIGHT_GREY,
    borderWidth: 1,
  },

  spendBased: {
    height: Utilities.hp(3),
    width: Utilities.wp(25),
    backgroundColor: Colors.LIGHT_ORANGE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.ORANGE,
    borderRadius: Utilities.wp(1),
  },

  icon: {
    width: hp(60),
    height: hp(60),
    resizeMode: "contain",
  },
  transactionCards: {
    height: "90%",
    width: wp(330),
    marginTop: 20,
    borderRadius: wp(20),
    marginRight: wp(10),
    justifyContent: "space-between",
  },
  transactionCard: {
    width: wp(330),
    borderRadius: wp(10),
    marginTop: 10,
    flexDirection: "row",
    padding: hp(20),
    elevation: 1,
    margin: 4,
    shadowColor: "#C7CCD1",
  },
  orderNumber: {
    fontFamily: Fonts.LexendBold,
    fontWeight: "bold",
    marginTop: 10,
    ...FontSize.rfs20,
    color: Colors.BLACK,
  },
  description: {
    fontFamily: Fonts.LexendRegular,
    marginTop: 10,
    ...FontSize.rfs18,
    color: Colors.BLACK,
  },
  wallet: {
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs11,
    color: Colors.BLACK_OPAC,
    marginTop: hp(11),
  },
  transaction: {
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs16,
    color: Colors.DARKERGREEN,
  },
  plus: {
    width: hp(47),
    height: hp(47),
  },
  time: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs11,
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
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    color: Colors.GREY_PLACEHOLDER,
  },
  nText: {
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    color: Colors.BLACK,
  },
  cardHeading: {
    ...FontSize.rfs10,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    color: Colors.BLACK,
  },
  cardValue: {
    ...FontSize.rfs13,
    fontFamily: Fonts.LexendBold,
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
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs15,
    color: Colors.BLACK,
    margin: 10,
  },
  image: {
    width: wp(300),
    height: wp(200),
    alignItems: "center",
    margin: wp(5),
    backgroundColor: Colors.RED,
  },
  images: {
    width: "100%",
    height: "100%",
    borderRadius: wp(10),
    resizeMode: "cover",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: Colors.BLACK,
    ...FontSize.rfs16,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
  },

  subTitle: {
    color: Colors.LIGHTGREY,
    fontFamily: Fonts.LexendRegular,
    ...FontSize.rfs16,
    marginLeft: "3%",
    textAlign: "left",
  },

  cardButton: {
    alignItems: "center",
    justifyContent: "center",
    height: Utilities.hp(5),
    width: Utilities.wp(33),
    borderRadius: Utilities.wp(1),
  },

  paddedContent1: {
    borderWidth: 1,
  },
  heading: {
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs16,
    color: Colors.BLACK,
  },
  value: {
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs16,
    color: Colors.LIGHTGREY,
    width: wp(65),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: Utilities.hp(18),
    marginBottom: hp(12),
  },
  makePrimary: {
    width: Utilities.wp(30),
    height: 30,
    borderRadius: Utilities.wp(1),
    padding: Utilities.wp(0.07),
    borderColor: Colors.BLACK,
    justifyContent: "center",
  },
  primary: {
    width: Utilities.wp(30),
    color: Colors.BLACK,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs16,
  },
  button: {
    width: wp(120),
    height: wp(40),
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.DARKERGREEN,
    borderRadius: wp(8),
    marginBottom: 20,
    marginStart: 20,
  },
  buttonText: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs12,
    color: Colors.WHITE,
  },
  forwardIcon: {
    width: "120%",
    marginTop: 2,
    height: "80%",
    resizeMode: "contain",
  },
  row1: {
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(12),
  },
  rewardText: {
    fontFamily: fonts.LexendBold,
    fontSize: 18,
    color: "#17151F",
    marginVertical: 16,
    textAlign: "left",
    alignSelf: "flex-start",
    marginHorizontal: 20,
  },
  gCoinImage: {
    width: 24,
    height: 24,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  gCoinText: {
    color: Colors.LIGHTGREY,
    fontFamily: fonts.LexendMedium,
    fontSize: 11,
    textAlign: "right",
    width: "100%",
  },
  discountText: {
    fontFamily: fonts.LexendMedium,
    fontSize: 12,
    color: Colors.LIGHTGREY,
    textAlign: "left",
  },
  headlineText: {
    fontFamily: fonts.LexendBold,
    fontSize: 14,
    color: "#17151F",
    textAlign: "left",
  },
  autoText: {
    fontFamily: fonts.LexendMedium,
    fontSize: 12,
    color: Colors.LIGHTGREY,
    textAlign: "left",
  },
  secondContentContainer: {
    marginTop: 5,
    marginHorizontal: 8,
  },
  eliteText: {
    fontFamily: fonts.LexendMedium,
    fontSize: 18,
    color: "#FFFFFF",
  },
  firstContentContainer: {
    width: 69,
    height: 69,
    backgroundColor: "#FF4E00",
    borderColor: "#F2F2F2",
    borderWidth: 1,
    borderRadius: 69,
    alignItems: "center",
    justifyContent: "center",
  },
  mainContentContainer: {
    width: "20%",
  },
  partnerCardContainer: {
    width: Utilities.wp(90),
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: Utilities.wp(4),
    borderColor: "#F2F2F2",
    borderWidth: 1,
    shadowColor: Colors.GREY,
    shadowOffset: { height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: "row",
    marginBottom: 18,
    alignSelf: "center",
  },
  gorexClubText: {
    fontFamily: fonts.LexendBold,
    color: "#17151F",
    fontSize: 18,
    marginVertical: 18,
    textAlign: "left",
  },
});

export default GorexCards;
