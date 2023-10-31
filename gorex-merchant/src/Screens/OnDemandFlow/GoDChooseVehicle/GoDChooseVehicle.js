import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import { NoVehicle, RoundPlus } from "../../../assets";
import Colors from "../../../Constants/Colors";
import FontSize from "../../../Constants/FontSize";
import FontFamily from "../../../Constants/FontFamily";
import { hp, wp } from "../../../utils/responsiveSizes";

import BackHeader from "../../../Components/Header/BackHeader";
import VehicleCard from "../../../Components/Cards/VehicleCard";
import CheckBoxCard from "../../../Components/Cards/CheckBoxCard";
import MessageWithImage from "../../../Components/MessageWithImage";
import Footer from "../../ProductsAndServices/components/Footer";
import GetMyVehicles from "../../../api/GetMyVehicles";
import { showToast } from "../../../utils/common";
import { CommonContext } from "../../../contexts/ContextProvider";
import Loader from "../../../Components/Loader";
import analytics from "@react-native-firebase/analytics";
import Fonts from "../../../Constants/fonts";
import OfferCreateAPI from "../../../api/offerCreateApi";
// import crashlytics from "@react-native-firebase/crashlytics";

const GoDChooseVehicle = ({ route }) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { userProfile, onDemandOrder, setOnDemandOrder } =
    useContext(CommonContext);

  const { offerTitle, offer } = route?.params;
  const offerCoupon = route?.params?.offerCoupon;

  const { check } = route.params;
  const isRTL = i18n.language === "ar";

  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(
    route?.params?.isOnDemand ? onDemandOrder?.vehicle : null
  );

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "GonD_vehicles_screen",
    });
  }, []);

  useEffect(() => {
    return navigation.addListener("focus", handleViewSwitch);
  }, [navigation]);

  const handleViewSwitch = () => {
    getVehicles().then();
  };

  const Confirm = () => {
    setLoading(true);
    if (offerCoupon) {
      OfferCreateAPI({
        driver_id: userProfile?.id,
        vehicle_id: selectedVehicle?.id,
        coupon: offerCoupon,
      }).then(({ success, response }) => {
        setLoading(false);
        if (parseInt(success) === 200) {
          navigation.navigate("OfferPromoSuccess", { title: offerTitle });
        } else if (parseInt(success) === 400) {
          showToast("Error", response, "error");
        } else {
          showToast("Error", t("offers.errorCreateOrder"), "error");
        }
      });
    } else {
      showToast("Error", t("offers.pleaseGoBackAndProvideCouponCode"), "error");
    }
  };

  const getVehicles = async () => {
    setLoading(true);
    GetMyVehicles(userProfile?.id).then(({ success, response }) => {
      setLoading(false);
      if (success) {
        setVehicles(response);
      } else {
        showToast("Error", response, "error");
        // crashlytics().recordError(response);
      }
    });
  };

  const onPressBackButton = () => {
    setOnDemandOrder({});
    navigation.goBack();
  };

  const onPressNext = async () => {
    if (offer) {
      await Confirm();
    } else if (
      check &&
      onDemandOrder &&
      onDemandOrder?.vehicle &&
      onDemandOrder?.service &&
      onDemandOrder?.vehicle &&
      onDemandOrder?.address &&
      onDemandOrder?.serviceProvider &&
      onDemandOrder?.slot &&
      onDemandOrder?.date
    ) {
      onDemandOrder.vehicle = selectedVehicle;
      navigation.navigate("GoDPlaceOrder", { onDemandOrder: onDemandOrder });
    } else if (onDemandOrder) {
      onDemandOrder.vehicle = selectedVehicle;
      navigation.navigate("GoDChooseService");
    } else {
      setOnDemandOrder({ vehicle: selectedVehicle });
      navigation.navigate("GoDChooseService");
    }
  };

  const data = useMemo(() => {
    let array = [];
    if (searchQuery === "") {
      array = [...vehicles];
    } else {
      array = vehicles.filter((item) =>
        item?.manufacturer?.[1]
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
    return array;
  }, [searchQuery, vehicles, navigation]);

  const showVehicles = () => {
    if (vehicles.length <= 0 && !loading) {
      return (
        <View style={{ height: "74%" }}>
          <View style={{ height: hp(60) }} />
          <MessageWithImage
            imageSource={NoVehicle}
            message={t("gorexOnDemand.noVehicleAdded")}
            description={t("gorexOnDemand.noVehicleDescription")}
          />
          <View style={{ height: hp(60) }} />
        </View>
      );
    } else {
      return (
        <>
          <View style={{ height: hp(10) }} />

          <View style={styles.searchBarContainer(Platform.OS)}>
            <TextInput
              style={styles.searchInput(isRTL)}
              placeholder={t("service.search")}
              value={searchQuery}
              placeholderTextColor={Colors.GREY}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>

          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedVehicle(item)}>
                <>
                  <VehicleCard
                    cardStyle={styles.cardStyle(
                      item?.id === selectedVehicle?.id
                    )}
                    vehicle={item}
                    isComingFromOnDemand={true}
                  />
                  <View style={{ height: hp(10) }} />
                </>
              </TouchableOpacity>
            )}
          />
        </>
      );
    }
  };

  return (
    <View style={styles.screen}>
      <BackHeader
        title={offer ? offerTitle : t("common.gorexOnDemand")}
        leftPress={onPressBackButton}
        // rightIcon={RoundPlus}
        rightIcon={vehicles.length > 0 && RoundPlus}
        RightPress={() =>
          navigation.navigate("VehicleInformation", {
            isComingFromOnDemand: true,
          })
        }
      />
      {/*<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>*/}
      <View style={{ height: hp(20) }} />

      <View style={styles.chooseVehicleHeader(vehicles)}>
        <Text style={styles.chooseVehicle}>
          {t("gorexOnDemand.pleaseChooseYourVehicle")}
        </Text>
        {vehicles.length <= 0 && !loading && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("VehicleInformation", {
                isComingFromOnDemand: true,
              })
            }
          >
            <Text style={styles.addNew}>{t("gorexOnDemand.addNew")}</Text>
          </TouchableOpacity>
        )}
      </View>

      {showVehicles()}

      <Footer
        title={offer ? t("common.apply") : t("common.next")}
        disabled={!selectedVehicle}
        onPress={onPressNext}
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
  content: {
    flex: 1,
    borderWidth: 1,
    borderColor: "red",
  },
  chooseVehicleHeader: (vehicles) => {
    return {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: vehicles.length ? "flex-start" : "space-between",

      paddingHorizontal: wp(20),
    };
  },
  chooseVehicle: {
    ...FontSize.rfs18,
    ...FontFamily.bold,
    color: Colors.BLACK,
  },
  addNew: {
    ...FontSize.rfs16,
    ...FontFamily.bold,
    color: Colors.DARKERGREEN,
  },
  isVehicleRunningContainer: {
    paddingStart: wp(20),
    alignItems: "flex-start",
  },
  isVehicleRunning: {
    ...FontSize.rfs18,
    ...FontFamily.bold,
    color: Colors.BLACK,
  },
  searchBarContainer: (Platform) => {
    return {
      backgroundColor: Colors.LIGHT_GREY,
      margin: 15,
      paddingVertical: Platform === "ios" ? 10 : 0,
      paddingHorizontal: 15,
      borderRadius: 50,
      textAlign: "left",
      height: 40,
    };
  },
  searchInput: (isRTL) => {
    return {
      ...FontSize.rfs14,
      color: Colors.BLACK,
      textAlign: isRTL ? "right" : "left",
      fontFamily: Fonts.LexendMedium,
    };
  },
  cardStyle: (showBorder) => {
    return {
      borderColor: Colors.DARKERGREEN,
      borderWidth: showBorder ? 2 : 0,
    };
  },

  CheckBoxCardStyle: {
    width: "50%",
    shadowColor: Colors.WHITE,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
});

export default GoDChooseVehicle;
