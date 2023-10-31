import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useTranslation } from "react-i18next";
import { CommonActions, useNavigation } from "@react-navigation/native";

import Colors from "../../../Constants/Colors";
import FontSize from "../../../Constants/FontSize";
import FontFamily from "../../../Constants/FontFamily";
import { hp, wp } from "../../../utils/responsiveSizes";

import moment from "moment";
import Loader from "../../../Components/Loader";
import { showToast } from "../../../utils/common";
import { CommonContext } from "../../../contexts/ContextProvider";
import BackHeader from "../../../Components/Header/BackHeader";
import Footer from "../../ProductsAndServices/components/Footer";
import CheckBoxCard from "../../../Components/Cards/CheckBoxCard";
import GetServiceProviderSlots from "../../../api/GetServiceProviderSlots";
import analytics from "@react-native-firebase/analytics";
// import crashlytics from "@react-native-firebase/crashlytics";

const Slots = ({ route }) => {
  const {
    inCartOrder,
    setInCartOrder,
    selectedBranch,
    onDemandOrder,
    setOnDemandOrder,
  } = useContext(CommonContext);

  const { isOnDemand, COD } = route?.params;

  console.log("Slots", COD, onDemandOrder?.service);

  const selectedService = isOnDemand
    ? onDemandOrder.service
    : inCartOrder?.services[0];
  const selectedServiceProvider = isOnDemand
    ? onDemandOrder.serviceProvider
    : selectedBranch;

  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [datesArray, setDatesArray] = useState([]);
  const [serviceProvidersData, setServiceProvidersData] = useState({});
  const [date, setDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  let datesList = [...Array(10)].map((_, i) =>
    moment().add(i, "day").startOf("day").unix()
  );

  const dates = datesList.slice(1);

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "GonD_slots_screen",
    });
  }, []);

  useEffect(() => {
    return navigation.addListener("focus", handleViewSwitch);
  }, [navigation]);

  const handleViewSwitch = () => {
    getServiceProviderSlots();
  };

  const getServiceProviderSlots = () => {
    setLoading(true);
    GetServiceProviderSlots({
      serviceProvider: selectedServiceProvider,
      service: selectedService,
    }).then((response) => {
      setLoading(false);
      if (response.success) {
        const datesData = Object.keys(response.response);
        setDatesArray(datesData);
        setServiceProvidersData(response.response);
        const initialSelectedDate = datesData[0];
        if (onDemandOrder?.date) {
          setDate(onDemandOrder?.date);
          setSlots(
            response.response[
              moment.unix(onDemandOrder?.date).format("YYYY-MM-DD")
            ]
          );
          setSelectedSlot(onDemandOrder?.slot);
        } else if (!onDemandOrder?.date) {
          setDate(moment(initialSelectedDate).unix());
          setSlots(response.response[initialSelectedDate]);
        }
      } else {
        showToast("Error", response, "error");
      }
    });
    // .catch((err) => crashlytics().recordError(err));
  };

  const onPressService = (item) => {
    setSelectedSlot(item);
  };

  const onPressDate = (item) => {
    setSlots(serviceProvidersData[item]);
    setDate(moment(item).unix());
    setSelectedSlot(null);
  };

  const onPressNextButton = () => {
    if (isOnDemand) {
      onDemandOrder.date = date;
      onDemandOrder.slot = selectedSlot;
      navigation.navigate("GoDPlaceOrder", {
        onDemandOrder: onDemandOrder,
        COD,
      });
    } else {
      inCartOrder.date = date;
      inCartOrder.slot = selectedSlot;
      navigation.navigate("PaymentMethod");
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.contentContainer}>
        <BackHeader
          title={t("common.gorexOnDemand")}
          leftPress={() =>
            navigation.navigate("GoDChooseAddressAndSlot", { check: false })
          }
        />

        <View style={{ height: hp(20) }} />
        <View style={styles.pleaseChooseServiceContainer}>
          <Text style={styles.title}>
            {t("gorexOnDemand.whatTimeWeCanExpect")}
          </Text>
          <Text style={styles.subtitle}>
            {t("gorexOnDemand.timeExpectDetail")}
          </Text>
        </View>

        <View style={{ height: hp(15) }} />

        <FlatList
          keyExtractor={(item) => item}
          horizontal={true}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          showsHorizontalScrollIndicator={false}
          data={datesArray}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.dateOutBox}>
                <TouchableOpacity
                  style={[
                    styles.dateBox,
                    item === moment.unix(date).format("YYYY-MM-DD") && {
                      borderColor: Colors.DARKERGREEN,
                    },
                  ]}
                  onPress={() => {
                    onPressDate(item);
                  }}
                >
                  <Text
                    style={[
                      styles.title,
                      item === moment.unix(date).format("YYYY-MM-DD") && {
                        color: Colors.DARKERGREEN,
                      },
                    ]}
                  >
                    {moment(item).format("DD")}
                  </Text>
                  <Text
                    style={[
                      styles.dateSubtitle,
                      item === moment.unix(date).format("YYYY-MM-DD") && {
                        color: Colors.DARKERGREEN,
                      },
                    ]}
                  >
                    {moment(item).format("MMM")}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />

        <View style={styles.pleaseChooseServiceContainer}>
          <Text style={styles.title}>
            {t("gorexOnDemand.pleaseSelectASlot")}
          </Text>
          <Text style={styles.subtitle}>
            {t("gorexOnDemand.pleaseSelectOneSlot")}
          </Text>
          {/* <View style={{ height: hp(5) }} />
                        <Text style={styles.oneServiceOnly}>{t("gorexOnDemand.oneServiceOnly")}</Text> */}
        </View>

        <View style={{ height: hp(15) }} />

        <View style={{ height: hp(450) }}>
          <FlatList
            data={slots}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            renderItem={({ item }) => (
              <CheckBoxCard
                cardStyle={{
                  width: "45%",
                  marginHorizontal: wp(10),
                  height: hp(60),
                }}
                isCheckboxOnRight={true}
                title={item?.start_time + " - " + item?.end_time}
                checked={selectedSlot?.id === item?.id}
                onPress={() => onPressService(item)}
              />
            )}
          />
        </View>
      </View>
      <Footer
        title={t("common.next")}
        disabled={!selectedSlot}
        onPress={onPressNextButton}
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
  contentContainer: {
    flex: 1,
  },
  pleaseChooseServiceContainer: {
    paddingStart: wp(20),
    alignItems: "flex-start",
  },
  title: {
    ...FontSize.rfs18,
    ...FontFamily.bold,
    color: Colors.BLACK,
  },
  subtitle: {
    ...FontSize.rfs14,
    ...FontFamily.medium,
    color: Colors.LIGHTGREY,
  },
  dateSubtitle: {
    ...FontSize.rfs14,
    color: Colors.BLACK,
  },
  oneServiceOnly: {
    ...FontSize.rfs14,
    ...FontFamily.medium,
    color: Colors.LIGHTGREY,
  },

  dateOutBox: {
    width: wp(80),
    height: hp(95),
    margin: wp(5),
    justifyContent: "space-between",
    alignItems: "center",
  },

  dateBox: {
    width: "80%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.LIGHTGREY,
    borderRadius: 5,
    padding: 8,
  },

  leaveNote: (isRTL) => {
    return {
      paddingVertical: 0,
      textAlign: isRTL ? "right" : "left",

      ...FontSize.rfs16,
      ...FontFamily.medium,
      color: Colors.BLACK,
    };
  },
  selectContainer: (value) => {
    return {
      flex: 1,
      alignItems: "flex-start",
      paddingStart: value ? wp(10) : wp(33),
    };
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",

    width: wp(186),
    height: hp(50),
    borderRadius: hp(10),
    paddingStart: wp(13),
    backgroundColor: Colors.BLACK,
  },
  pickerButtonImage: {
    width: wp(24),
    height: wp(24),
    resizeMode: "contain",
  },
  select: {
    ...FontSize.rfs16,
    ...FontFamily.bold,
    color: Colors.WHITE,
  },
});

export default Slots;
