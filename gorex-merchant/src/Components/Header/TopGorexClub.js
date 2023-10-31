import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Button,
  FlatList,
} from "react-native";

import Modal from "react-native-modal";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

import fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";

import Utilities from "../../utils/UtilityMethods";
import { CommonContext } from "../../contexts/ContextProvider";
import { hp, rfs, wp } from "../../utils/responsiveSizes";
import GeneralAPIWithEndPoint from "../../api/GeneralAPIWithEndPoint";
import {
  AppLogo,
  GoCoinIcon,
  GorexClubCard,
  GorexClubLogo,
  GorexClubCardAr,
  Gold,
  Silver,
  Diamond,
  Platinum,
  CoinCalcultaion,
  Close,
  Cancel,
  GCoin,
  WhiteGreenMenu,
  // QR_code,
  CloseBlack,
  WhiteClose,
  barCode,
  discount,
  GorexCoin,
} from "../../assets";
import FontSize from "../../Constants/FontSize";
import FontFamily from "../../Constants/FontFamily";
import Fonts from "../../Constants/fonts";
import RBSheetModal from "../../Components/Modal";
import { ActivityIndicator } from "react-native";
import QRCode from "react-native-qrcode-svg";

const TopGorexClub = ({ title, leftIcon, children, leftPress, modalValue }) => {
  const { userProfile } = useContext(CommonContext);

  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const isRTL = i18n.language === "ar";

  const [points, setPoints] = useState(null);
  const [coinModalVisible, setCoinModalVisible] = useState(false);
  const [modal, setModal] = useState(modalValue != true ? false : true);
  const pointPrice = points?.remaining_points_for_next_tier * 3 || 0;
  const profile = true;

  const toggleModal = () => {
    setCoinModalVisible(!coinModalVisible);
  };

  useEffect(() => {
    return navigation.addListener("focus", handleViewSwitch);
  }, [navigation]);

  const handleViewSwitch = () => {
    getPoints().then();
  };

  const getPoints = async () => {
    const body = { customer: userProfile.id };
    const pointsResponse = await GeneralAPIWithEndPoint("/all/points", body);

    setPoints(pointsResponse);
  };

  const getBadge = () => {
    if (!userProfile?.pakage) {
      return <Image source={Silver} style={styles.badge} />;
    } else if (userProfile?.pakage.toLowerCase() === "silver") {
      return <Image source={Silver} style={styles.badge} />;
    } else if (userProfile?.pakage.toLowerCase() === "gold") {
      return <Image source={Gold} style={styles.badge} />;
    } else if (userProfile?.pakage.toLowerCase() === "diamond") {
      return <Image source={Diamond} style={styles.badge} />;
    } else if (userProfile?.pakage.toLowerCase() === "platinum") {
      return <Image source={Platinum} style={styles.badge} />;
    }
  };

  const getNextTier = () => {
    switch (userProfile?.pakage) {
      case "gold":
        return t("platinum");
      case "silver":
        return t("gold");
      case "platinum":
        return t("diamond");
      default:
        return t("silver");
    }
  };

  const getTier = () => {
    switch (userProfile?.package) {
      case "gold":
        return t("gold");
      case "platinum":
        return t("gold");
      case "diamond":
        return t("diamond");
      default:
        return t("silver");
    }
  };

  const getProgress = () => {
    let progress = 0;

    if (points?.remaining_points_for_next_tier > 0) {
      progress =
        (points?.available_points / points?.remaining_points_for_next_tier) *
        100;
    }

    return progress;
  };

  return (
    <View style={styles.fullContainer}>
      <View style={styles.root}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={leftPress ? leftPress : () => navigation.goBack()}
          >
            <WhiteGreenMenu
              width={wp(34.4)}
              height={hp(20.3)}
              style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
            />
            {/*<Image style={isRTL ? styles.logoAr : styles.logo} source={leftIcon} />*/}
          </TouchableOpacity>
          {title ? (
            <Text style={styles.title}>{title}</Text>
          ) : (
            <AppLogo height={hp(50)} width={wp(200)} />
          )}
          {/* <View style={{ width: Utilities.wp(15) }} /> */}
          <TouchableOpacity
            onPress={() => {
              setModal(true);
            }}
            style={{
              marginHorizontal: 10,
            }}
          >
            <Image
              source={barCode}
              resizeMode={"contain"}
              style={{
                height: 50,
                width: 50,
              }}
            />
          </TouchableOpacity>
        </View>

        <ImageBackground
          source={isRTL ? GorexClubCardAr : GorexClubCard}
          resizeMode="stretch"
          style={styles.gorexClubCard}
        >
          <View style={styles.cardTopContainer}>
            <Image
              source={GorexClubLogo}
              style={styles.gorexClubLogo}
              resizeMode="contain"
            />
            <LinearGradient
              colors={[Colors.BLUE, Colors.BLUE_O0]}
              style={styles.gorexCoinContainer}
              start={isRTL ? { x: 0, y: 0.5 } : { x: 1, y: 0.5 }}
              end={isRTL ? { x: 1, y: 0.5 } : { x: 0, y: 0.5 }}
            >
              <Image source={GoCoinIcon} style={styles.goCoinIcon} />
              <View style={styles.availableCoinsContainer}>
                <Text style={styles.availableGoCoins}>
                  {t("gorexclub.availableGoCoins")}
                </Text>
                <Text style={styles.availableCoins}>
                  {points?.available_points}
                </Text>
              </View>
            </LinearGradient>
          </View>
          <Text style={styles.name}>
            {userProfile?.name ? userProfile?.name : "No Name"}
          </Text>
          <View
            style={[
              styles.cardBottomContainer,
              {
                justifyContent:
                  userProfile?.pakage !== "diamond"
                    ? "space-between"
                    : "flex-end",
              },
            ]}
          >
            {userProfile?.pakage !== "diamond" && (
              <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.coinsToNextTier}>
                    {points?.remaining_points_for_next_tier}{" "}
                    {`${t("gorexclub.gocoinsto")}${getNextTier()}`}{" "}
                  </Text>
                  <TouchableOpacity
                    style={{ marginLeft: 5 }}
                    onPress={() => toggleModal()}
                  >
                    <CoinCalcultaion width={wp(20)} height={hp(20)} />
                  </TouchableOpacity>
                </View>
                <View style={{ height: hp(9) }} />
                <View style={styles.progressBar}>
                  <View style={styles.progressBarFilled(`${getProgress()}%`)} />
                </View>
              </View>
            )}

            <View style={styles.badgeContainer}>
              {getBadge()}
              <Text style={styles.badgeTitle}>
                {userProfile?.pakage ? `${t(userProfile?.pakage)}` : "N/A"}
              </Text>
            </View>
          </View>
        </ImageBackground>

        {children}
      </View>

      {coinModalVisible && (
        <View style={{ backgroundColor: "red" }}>
          <Modal
            isVisible={coinModalVisible}
            onBackdropPress={() => toggleModal()}
          >
            <View
              style={{
                backgroundColor: "white",
                width: "100%",
                padding: 20,
                borderRadius: 20,
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "flex-end" }}
                onPress={toggleModal}
              >
                <Cancel
                  width={wp(40)}
                  height={hp(40)}
                  style={styles.closeModal}
                />
              </TouchableOpacity>
              <View style={styles.gCoinContainer}>
                <Image source={GCoin} style={styles.Gcoin} />
                <Text style={styles.levelUp}>
                  {t("gorexclub.levelUpYourReward")}
                </Text>

                <View
                  style={{
                    marginBottom: 15,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Text style={styles.coinText}>
                    {t("gorexclub.currentlyHave")}
                  </Text>
                  <Text style={styles.goldText}>
                    {points?.available_points}
                  </Text>
                  <Text style={styles.coinText}>{t("gorexclub.points")}</Text>
                </View>
                <View
                  style={{
                    marginBottom: 15,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <Text style={styles.coinText}>
                    {t("gorexclub.ToReachNextTier")}
                  </Text>
                  <Text style={styles.goldText}>
                    {points?.remaining_points_for_next_tier}
                  </Text>
                  <Text style={styles.coinText}>
                    {t("gorexclub.morePoints")}
                  </Text>
                </View>

                <View
                  style={{
                    marginBottom: 15,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <Text style={styles.coinText}>
                    {t("gorexclub.spendCoin")}
                  </Text>

                  {isRTL ? (
                    <Text style={styles.goldText}>
                      {pointPrice} {t("gorexclub.sar")}
                    </Text>
                  ) : (
                    <Text style={styles.goldText}>
                      {t("gorexclub.sar")} {pointPrice}
                    </Text>
                  )}
                  <Text style={styles.coinText}>{t("gorexclub.toEarn")}</Text>
                  <Text style={styles.goldText}>
                    {points?.remaining_points_for_next_tier}
                  </Text>
                  <Text style={styles.coinText}>{t("gorexclub.points")}</Text>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}

      <RBSheetModal
        height={`80%`}
        open={modal}
        backgroundColor={"#17151FB3"}
        onClose={() => setModal(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <View style={styles.modalDataDescription}>
              <Text style={styles.modalNameAlphabet}>
                {userProfile?.first_name?.charAt(0)}
              </Text>
            </View>

            <View
              style={{
                marginLeft: 10,
              }}
            >
              <Text style={styles.modalTier}>{getTier()}</Text>

              <Text style={styles.modalUserName}>{userProfile?.name}</Text>

              <Text style={styles.modalId}>ID {userProfile?.id}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setModal(false)}
            style={{
              marginTop: 30,
            }}
          >
            <Image source={Close} style={styles.close} />
          </TouchableOpacity>
        </View>
        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1.5, y: 0 }}
          colors={["#362380", "#000000"]}
          style={{
            width: "100%",
            height: "90%",
            alignItems: "center",
            marginTop: 10,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          <View
            style={{
              height: 198,
              width: 198,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              marginTop: 120,
            }}
          >
            <QRCode
              size={160}
              value={JSON.stringify({
                profile_id: userProfile?.id,
                profile: profile,
              })}
            />
          </View>
          <Text
            style={{
              fontFamily: fonts.LexendBold,
              fontSize: 20,
              color: "white",
              marginTop: 40,
              marginBottom: 5,
              textAlign: "center",
              paddingHorizontal: 5,
            }}
          >
            {t("gorexclub.scannedServiceProvider")}
          </Text>
          <View
            style={{
              flexDirection: "row",
              maxWidth: "90%",
              marginTop: 30,
              alignItems: "center",
              justifyContent: "space-between",
              alignSelf: "center",
              marginHorizontal: Utilities.wp("5"),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                maxWidth: "45%",
                alignItems: "center",
                marginHorizontal: wp("10"),
              }}
            >
              <Image
                source={discount}
                resizeMode={"contain"}
                style={{
                  width: 25,
                  height: 25,
                }}
              />
              <Text
                style={{
                  fontFamily: fonts.LexendRegular,
                  fontSize: 16,
                  color: Colors.WHITE,
                  marginLeft: 10,
                  width: "100%",
                }}
              >
                {t("gorexclub.GetDiscount")}
              </Text>
            </View>
            <View
              style={{
                maxWidth: "100%",
                marginHorizontal: wp("5"),
              }}
            />
            <Image
              source={GorexCoin}
              resizeMode={"contain"}
              style={{
                width: 25,
                height: 25,
              }}
            />
            <Text
              style={{
                fontFamily: fonts.LexendRegular,
                fontSize: 16,
                color: Colors.WHITE,
                marginLeft: 10,
                width: "100%",
              }}
            >
              {t("gorexclub.EarnGoCoins")}
            </Text>
          </View>
        </LinearGradient>
      </RBSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  gorexClubCard: {
    alignSelf: "center",
    borderRadius: hp(10),
    width: wp(388),
    height: hp(215),
    padding: wp(20),
    justifyContent: "space-between",
  },
  gCoinContainer: {
    marginVertical: hp(10),
    marginHorizontal: wp(20),
  },
  levelUp: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs20,
    marginBottom: 15,
    textAlign: "left",
  },
  coinText: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs18,
    textAlign: "left",
  },
  goldText: {
    ...FontSize.rfs18,
    color: Colors.ORANGE,
    fontFamily: fonts.LexendMedium,
    textAlign: "left",
    marginHorizontal: 5,
  },
  closeModal: {
    color: Colors.BLACK,
    marginRight: hp(10),
  },
  Gcoin: {
    width: wp(70),
    height: wp(70),
    marginBottom: hp(15),
  },
  gorexClubLogo: {
    width: wp(132),
    height: hp(22),
  },
  goCoinIcon: {
    width: wp(35),
    height: wp(35),
  },
  gorexCoinContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    borderRadius: hp(22),
  },
  progressBar: {
    width: wp(206),
    height: hp(4),
    borderRadius: hp(2),
    backgroundColor: Colors.WHITE,
  },
  // progressBarFilled: {
  //   width: '10%',
  //   height: hp(4),
  //   borderRadius: hp(2),
  //   backgroundColor: Colors.ORANGE,
  // },
  progressBarFilled: (progress) => {
    return {
      width: progress,
      height: hp(4),
      borderRadius: hp(2),
      backgroundColor: Colors.ORANGE,
    };
  },
  badgeContainer: {
    borderColor: Colors.BLUE,
    // borderColor: 'red',
    paddingHorizontal: wp(6),
    flexDirection: "row",
    alignItems: "center",
    borderWidth: hp(2),
    borderRadius: hp(4),
    height: hp(35),
  },
  badge: {
    marginEnd: wp(5),
    marginStart: wp(7),
    width: wp(27),
    height: wp(27),
  },
  cardTopContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  availableCoinsContainer: {
    marginEnd: wp(3),
    marginStart: wp(10),
  },
  availableGoCoins: {
    ...FontSize.rfs10,
    color: Colors.WHITE,
    fontFamily: fonts.LexendRegular,
  },
  availableCoins: {
    ...FontSize.rfs14,
    color: Colors.ORANGE,
    fontFamily: fonts.LexendMedium,
    textAlign: "left",
  },
  name: {
    ...FontSize.rfs20,
    color: Colors.WHITE,
    fontFamily: fonts.LexendMedium,
    textAlign: "left",
  },
  coinsToNextTier: {
    ...FontSize.rfs12,
    color: Colors.WHITE,
    fontFamily: fonts.LexendRegular,
    textAlign: "left",
  },
  badgeTitle: {
    marginEnd: wp(15),
    ...FontSize.rfs14,
    color: Colors.WHITE,
    fontFamily: fonts.LexendMedium,
  },
  cardBottomContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  fullContainer: {
    height: Platform.OS === "android" ? hp(300) : hp(350),
    backgroundColor: Colors.WHITE,
  },
  root: {
    height: hp(226),
    backgroundColor: "#362380",
  },
  container: {
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? 0 : hp(50),
    height: Platform.OS === "android" ? Utilities.hp(8) : Utilities.hp(14),
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
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
  arrow: {
    width: wp(15),
    height: wp(15),
  },
  logo: {
    width: Utilities.wp(7),
    height: hp(25),
    resizeMode: "contain",
    scaleX: 1,
  },
  logoAr: {
    width: Utilities.wp(7),
    height: hp(25),
    resizeMode: "contain",
    scaleX: -1,
  },
  menuButton: {
    width: Utilities.wp(15),
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    width: wp(60),
  },
  space: {
    marginLeft: wp(30),
  },
  title: {
    color: Colors.WHITE,
    fontFamily: fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs20,
  },
  modalView: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: Utilities.wp(8),
    justifyContent: "space-between",
  },
  modalHeader: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  modalDataDescription: {
    height: 40,
    width: 40,
    borderRadius: 40,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  modalNameAlphabet: {
    fontFamily: fonts.LexendMedium,
    fontSize: 15,
    color: "black",
  },
  modalTier: {
    fontFamily: fonts.LexendMedium,
    fontSize: 15,
    color: "black",
    marginBottom: 3,
    textAlign: "left",
  },
  modalUserName: {
    fontFamily: fonts.LexendBold,
    fontSize: 17,
    color: "black",
    marginBottom: 4,
    textAlign: "left",
  },
  modalId: {
    fontFamily: fonts.LexendMedium,
    fontSize: 15,
    color: "black",
    textAlign: "left",
  },
  close: {
    width: Utilities.wp(5),
    height: Utilities.wp(5),
  },
});

export default TopGorexClub;
