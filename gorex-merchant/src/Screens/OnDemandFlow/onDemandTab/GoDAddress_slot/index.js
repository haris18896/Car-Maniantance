import React, {
  useRef,
  useState,
  Fragment,
  useContext,
  useLayoutEffect,
} from "react";

// ** Third Party Packages
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

// ** Custom Components
import { NoAddress } from "../../../../assets";
import Colors from "../../../../Constants/Colors";
import Loader from "../../../../Components/Loader";
import FontSize from "../../../../Constants/FontSize";
import { showToast } from "../../../../utils/common";
import { getSuperModifiedValues, isObjEmpty } from "../../../../utils/utils";
import { hp, wp } from "../../../../utils/responsiveSizes";
import FontFamily from "../../../../Constants/FontFamily";
import BackHeader from "../../../../Components/Header/BackHeader";
import AddressCard from "../../../../Components/Cards/AddressCard";
import Footer from "../../../ProductsAndServices/components/Footer";
import GetCustomerAddress from "../../../../api/GetCustomerAddress";
import CheckBoxCard from "../../../../Components/Cards/CheckBoxCard";
import { CommonContext } from "../../../../contexts/ContextProvider";
import MessageWithImage from "../../../../Components/MessageWithImage";
import DeleteCustomerAddress from "../../../../api/DeleteCustomerAddress";
import GetOnDemandUniqueDatesSlots from "../../../../api/OnDemandDatesSlots";

function GoDAddressSlot() {
  const addressesRef = useRef(null);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { userProfile, onDemandOrder, setOnDemandOrder } =
    useContext(CommonContext);

  // ** States
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [slots, setSlots] = useState([]);
  const [datesArray, setDatesArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [addressToUpdate, setAddressToUpdate] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [date, setDate] = useState("");
  const [uniqueDatesSlotsResponse, setUniqueDatesSlotsResponse] = useState({});
  const [selectedSlots, setSelectedSlots] = useState(
    onDemandOrder?.slotsList ? onDemandOrder?.slotsList : []
  );

  const getAddresses = async () => {
    setLoading(true);
    setRefreshing(true);
    await GetCustomerAddress(userProfile.id).then((response) => {
      setLoading(false);
      setRefreshing(false);
      if (response.success) {
        setAddresses(response.response);
        if (isObjEmpty(onDemandOrder?.address)) {
          setSelectedAddress(response.response[0]);
        } else {
          setSelectedAddress(onDemandOrder?.address);
        }
      }
    });
  };

  const getUniqueDateSlots = async () => {
    setLoading(true);
    setRefreshing(true);
    await GetOnDemandUniqueDatesSlots(onDemandOrder?.service?.id).then(
      (response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.success) {
          const datesData = Object.keys(response.response);
          setDatesArray(datesData);
          setUniqueDatesSlotsResponse(response.response);
          const initialSelectedDate = datesData[0];

          if (onDemandOrder?.date && onDemandOrder?.slotsList) {
            setDate(onDemandOrder?.date);
            const onDemandDate = moment
              .unix(onDemandOrder?.date)
              .format("YYYY-MM-DD");
            setSlots(response.response[onDemandDate]);
          } else {
            setDate(moment(initialSelectedDate).unix());
            setSlots(response.response[initialSelectedDate]);
            setSelectedSlots([]);
          }
        } else {
          showToast("Error", response, "error");
        }
      }
    );
  };

  const onPressDate = (item) => {
    setSlots(uniqueDatesSlotsResponse[item]);
    setDate(moment(item).unix());
    setSelectedSlots([]);
  };

  const handleSwitch = async () => {
    await getAddresses();
    await getUniqueDateSlots();
  };

  useLayoutEffect(() => {
    return navigation.addListener("focus", () => handleSwitch());
  }, [navigation]);

  const onPressAddressCard = (address, index) => {
    addressesRef?.current?.scrollToIndex({ index });
    setSelectedAddress(address);
  };

  const onPressDeleteAddress = (address) => {
    Alert.alert(
      "Delete Address",
      "Do you really want to delete this address?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log("Delete Address Alert Cancelled"),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteAddress(address),
        },
      ]
    );
  };

  const deleteAddress = (address) => {
    DeleteCustomerAddress(address.id).then((response) => {
      if (response.success) {
        getAddresses();
      }
    });
  };

  const onPressUpdateAddress = (address) => {
    navigation.navigate("AddNewAddress", {
      addressToUpdate: address,
      serviceId: onDemandOrder?.service?.id,
    });
  };

  const toggleSlotSelection = (slot) => {
    setSelectedSlots((prevSelectedSlots) => {
      const isSelected = prevSelectedSlots.some((item) => item.id === slot.id);

      if (isSelected) {
        return prevSelectedSlots.filter((item) => item.id !== slot.id);
      } else {
        return [...prevSelectedSlots, slot];
      }
    });
  };

  const onPressNext = () => {
    const modifiedOrder = getSuperModifiedValues(
      { date, slotsList: selectedSlots },
      onDemandOrder
    );

    if (
      onDemandOrder?.date &&
      !isObjEmpty(modifiedOrder) &&
      onDemandOrder?.slotsList
    ) {
      setOnDemandOrder({
        date: date,
        slot: null,
        slotsList: selectedSlots,
        serviceProvider: {},
        address: selectedAddress,
        service: onDemandOrder?.service,
        vehicle: onDemandOrder?.vehicle,
        expanded_tab: onDemandOrder?.expanded_tab,
      });

      navigation.push("GoDServiceProvider");
    } else {
      setOnDemandOrder({
        date: date,
        slotsList: selectedSlots,
        address: selectedAddress,
        service: onDemandOrder?.service,
        vehicle: onDemandOrder?.vehicle,
        expanded_tab: onDemandOrder?.expanded_tab,
        slot: onDemandOrder?.slot ? onDemandOrder?.slot : null,
        serviceProvider: onDemandOrder?.serviceProvider
          ? onDemandOrder?.serviceProvider
          : {},
      });
      navigation.push("GoDServiceProvider");
    }
  };

  return (
    <View style={styles.container}>
      <BackHeader
        title={t("common.gorexOnDemand")}
        leftPress={() => navigation.push("VehiclesServices")}
      />
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={async () => {
              await getAddresses();
              await getUniqueDateSlots();
            }}
          />
        }
      >
        <View style={styles.selectAddressHeader}>
          <Text style={styles.selectAddress}>
            {t("gorexOnDemand.pleaseSelectAddress")}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AddNewAddress", {
                serviceId: onDemandOrder?.service?.id,
              })
            }
          >
            <Text style={styles.addNew}>{t("gorexOnDemand.addNew")}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mainWrapper}>
          {loading ? (
            <Loader visible={true} />
          ) : (
            <Fragment>
              <View style={styles.addressCards}>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ref={addressesRef}
                  data={addresses}
                  contentContainerStyle={
                    addresses.length === 0 && {
                      flex: 1,
                      justifyContent: "center",
                    }
                  }
                  ListEmptyComponent={
                    <View>
                      <View style={{ height: hp(60) }} />
                      <MessageWithImage
                        width={100}
                        height={75}
                        imageSource={NoAddress}
                        message={t("gorexOnDemand.noAddressAdded")}
                        description={t("gorexOnDemand.noAddressDescription")}
                      />
                      <View style={{ height: hp(60) }} />
                    </View>
                  }
                  onRefresh={getAddresses}
                  refreshing={refreshing}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, index }) => (
                    <AddressCard
                      index={index}
                      address={item}
                      onPress={onPressAddressCard}
                      onPressDelete={() => onPressDeleteAddress(item)}
                      onPressUpdate={() => onPressUpdateAddress(item)}
                      selectedAddress={selectedAddress}
                    />
                  )}
                />
              </View>

              <View style={styles.pleaseChooseServiceContainer}>
                <Text style={styles.title}>
                  {t("gorexOnDemand.whatTimeWeCanExpect")}
                </Text>
                <Text style={styles.subtitle}>
                  {t("gorexOnDemand.timeExpectDetail")}
                </Text>
              </View>

              <FlatList
                keyExtractor={(item) => item}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={datesArray}
                contentContainerStyle={[
                  datesArray.length === 0 && {
                    flex: 1,
                    justifyContent: "center",
                  },
                ]}
                ListEmptyComponent={
                  <View style={styles.EmptyVehiclesList}>
                    <MessageWithImage
                      imageSource={NoAddress}
                      message={t("gorexOnDemand.emptyList")}
                      description={t("gorexOnDemand.noDatesFound")}
                    />
                  </View>
                }
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
                  {t("gorexOnDemand.selectTimeSlot")}
                </Text>
                <Text style={styles.subtitle}>
                  {t("gorexOnDemand.timeExpectDetail")}
                </Text>
              </View>

              <FlatList
                data={slots}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                  { marginVertical: wp(8) },
                  slots.length === 0 && { flex: 1, justifyContent: "center" },
                ]}
                ListEmptyComponent={
                  <View style={styles.EmptyVehiclesList}>
                    <MessageWithImage
                      imageSource={NoAddress}
                      message={t("gorexOnDemand.emptyList")}
                      description={t("gorexOnDemand.noSlotsFound")}
                    />
                  </View>
                }
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
                    checked={
                      selectedSlots.length > 0 &&
                      selectedSlots.some((slot) => slot.id === item.id)
                    }
                    onPress={() => toggleSlotSelection(item)}
                  />
                )}
              />
            </Fragment>
          )}
        </View>
      </ScrollView>

      <Footer
        title={t("common.next")}
        disabled={
          !date || isObjEmpty(selectedAddress) || selectedSlots.length === 0
        }
        onPress={onPressNext}
      />
    </View>
  );
}

export default GoDAddressSlot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  selectAddressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(20),
    marginTop: hp(15),
  },
  selectAddress: {
    ...FontSize.rfs18,
    ...FontFamily.bold,
    color: Colors.BLACK,
    textAlign: "left",
  },
  addNew: {
    ...FontSize.rfs16,
    ...FontFamily.bold,
    color: Colors.DARKERGREEN,
  },
  addressCards: {
    paddingVertical: hp(10),
    marginBottom: hp(15),
  },
  pleaseChooseServiceContainer: {
    paddingStart: wp(20),
    alignItems: "flex-start",
    marginVertical: hp(10),
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
  mainWrapper: {
    flex: 1,
  },
});
