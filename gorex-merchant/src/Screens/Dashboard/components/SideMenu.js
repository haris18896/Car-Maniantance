import React, { useContext } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { CommonActions, DrawerActions } from "@react-navigation/native";

import Colors from "../../../Constants/Colors";
import {
  WhiteCross,
  GreenHome,
  GreenWallet,
  GreenCar,
  GreenOrderHistory,
  GreenOffers,
  GreenSettings,
  OrangeGorexSupport,
  OrangeGorexClub,
  Logout,
  GorexOnDemandIcon,
  ImagePlaceHolder,
  GoTrackGreen,
} from "../../../assets";
import { hp, wp } from "../../../utils/responsiveSizes";
import Fonts from "../../../Constants/fonts";
import { useNavigation } from "@react-navigation/native";
import { CommonContext } from "../../../contexts/ContextProvider";
import { useTranslation } from "react-i18next";
import Utilities from "../../../utils/UtilityMethods";
import FontSize from "../../../Constants/FontSize";
import {
  removeCart,
  removePartnerId,
  removeProfileUpdate,
} from "../../../utils/common";
import Footer from "../../ProductsAndServices/components/Footer";

const SideMenu = () => {
  const {
    userProfile,
    setUserProfile,
    setPartnerId,
    setSelectedBranch,
    setInCartOrder,
  } = useContext(CommonContext);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const onClose = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const menu = [
    {
      id: 1,
      name: t("menu.Home"),
      screen: "DashboardScreen",
    },
    {
      id: 2,
      name: t("menu.GorexOnDemand"),
      screen: "WelcomeOnDemand",
    },
    {
      id: 3,
      name: t("menu.Wallet"),
      screen: "PaymentHistory",
    },
    {
      id: 4,
      name: t("menu.My Vehicles"),
      screen: "MyVehicles",
    },
    {
      id: 5,
      name: t("menu.GoTrack"),
      screen: "GoTrackDashboard",
    },
    {
      id: 6,
      name: t("menu.My Orders History"),
      screen: "OrderHistory",
    },
    {
      id: 7,
      name: t("menu.Offers"),
      screen: "OfferData",
    },
    {
      id: 8,
      name: t("menu.Settings"),
      screen: "Setting",
    },
    {
      id: 9,
      name: t("menu.Support"),
      screen: "GorexSupport",
    },
    {
      id: 10,
      name: t("menu.GorexClub"),
      screen: "GorexCards",
    },
    // {
    //   id:9,
    //   name: t("menu.Logout"),
    //   screen: "",
    // },
  ];

  const gotoProfileScreen = () => {
    onClose();
    navigation.navigate("ProfileUpdate");
  };

  const onPressSideMenuItem = (item) => {
    if (item.id === 11) {
      onPressLogoutButton();
    } else {
      onClose();
      navigation.navigate(item?.screen);
    }
  };

  const onPressLogoutButton = () => {
    Alert.alert(t("setting.confirm"), t("setting.surelogout"), [
      {
        text: t("menu.Logout"),
        style: "destructive",
        onPress: async () => {
          await logoutAction();
        },
      },
      {
        text: t("common.no"),
        onPress: () => {},
      },
    ]);
  };

  const logoutAction = async () => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
    navigation.dispatch(resetAction);

    setTimeout(async () => {
      setPartnerId(0);
      setUserProfile(null);
      setInCartOrder(null);
      setSelectedBranch(null);

      await removeProfileUpdate();
      await removePartnerId();
      await removeCart();
    }, 1000);
  };

  const getImageFromItem = (item) => {
    switch (item.id) {
      case 1:
        return <GreenHome width={wp(26)} height={hp(27.75)} />;
      case 2:
        return <GorexOnDemandIcon width={wp(26)} height={hp(22.5)} />;
      case 3:
        return <GreenWallet width={wp(26)} height={hp(22.5)} />;
      case 4:
        return <GreenCar width={wp(26)} height={hp(24.4)} />;
      case 5:
        return <GoTrackGreen width={wp(26)} height={wp(26)} />;
      case 6:
        return <GreenOrderHistory width={wp(26)} height={wp(26)} />;
      case 7:
        return <GreenOffers width={wp(26)} height={hp(30.5)} />;
      case 8:
        return <GreenSettings width={wp(26)} height={wp(26)} />;
      case 9:
        return <OrangeGorexSupport width={wp(26)} height={hp(28.5)} />;
      case 10:
        return <OrangeGorexClub width={wp(26)} height={hp(26.5)} />;
      case 11:
        return <Logout width={wp(26)} height={hp(26.5)} />;
      default:
        return <GreenHome width={wp(26)} height={hp(27.75)} />;
    }
  };

  const getTopProfileView = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          gotoProfileScreen();
        }}
        style={styles.avatarContainer}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>
            {userProfile?.first_name?.charAt(0)}
          </Text>
        </View>
        <View>
          <Text style={styles.welcome}>{t("menu.hello")}</Text>
          <Text style={styles.name}>{userProfile?.first_name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.drawer}>
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => onClose()}
        >
          <WhiteCross width={wp(20.7)} height={wp(20.7)} />
        </TouchableOpacity>

        {getTopProfileView()}

        <View style={styles.menu}>
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            data={menu}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => {
                  onPressSideMenuItem(item);
                }}
              >
                {getImageFromItem(item)}
                <Text
                  style={[
                    styles.menuText,
                    item.id === 11 && { color: Colors.RED },
                  ]}
                >
                  {item?.name}{" "}
                </Text>
                {item?.id === 5 && <Text style={styles.newText}>New</Text>}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      <Footer
        title={t("menu.Logout")}
        buttonStyle={{ backgroundColor: Colors.ORANGE }}
        onPress={onPressLogoutButton}
        // rightTitle={" "}
      />
    </>
  );
};

SideMenu.propTypes = {
  props: PropTypes.object,
  onClose: PropTypes.func,
};

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: Colors.BLUE,
    paddingLeft: wp(20),
    paddingTop: Platform.OS === "ios" ? hp(30) : 0,
  },
  logoContainer: {
    marginTop: Utilities.wp(5),
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  logo: {
    width: Utilities.wp(4),
    resizeMode: "contain",
  },
  uperSafeArea: {
    backgroundColor: Colors.BLACK_OPAC,
    width: "100%",
  },
  leftRightContainer: {
    flexDirection: "row",
    flex: 1,
  },
  rightSide: {
    backgroundColor: Colors.BLACK_OPAC,
    flex: 1,
  },
  avatarContainer: {
    flexDirection: "row",
    marginTop: hp(30),
  },
  avatar: {
    height: Utilities.hp(5),
    width: Utilities.hp(5),
    backgroundColor: Colors.WHITE,
    borderRadius: Utilities.hp(1),
    justifyContent: "center",
    alignItems: "center",
  },

  avatarLetter: {
    fontFamily: Fonts.GloryBold,
    ...FontSize.rfs24,
    color: Colors.DARKERGREEN,
  },

  welcome: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs14,
    color: Colors.WHITE,
    marginLeft: 10,
  },
  name: {
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs20,
    color: Colors.WHITE,
    marginTop: Utilities.hp(0.5),
    marginLeft: 10,
  },
  menu: {
    marginTop: Utilities.hp(5),
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(30),
  },
  drawerIcon: {
    width: Utilities.wp(5),
    paddingVertical: Utilities.hp(2.7),
  },
  menuText: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs14,
    color: Colors.WHITE,
    marginLeft: Utilities.hp(4),
  },
  version: {
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    color: Colors.WHITE,
    marginLeft: Utilities.hp(2),
    alignSelf: "center",
  },
  versionContainer: {
    marginTop: hp(50),
    alignItems: "center",
    alignSelf: "center",
    marginLeft: Utilities.hp(4),
  },
  newText: {
    backgroundColor: Colors.DARKERGREEN,
    color: Colors.WHITE,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs14,
    marginLeft: wp(5),
    paddingHorizontal: wp(10),
    paddingVertical: wp(2),
    borderRadius: 11,
    overflow: "hidden",
  },
});

export default SideMenu;
