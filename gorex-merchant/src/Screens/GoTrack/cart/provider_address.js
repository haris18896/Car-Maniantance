import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import Colors from "../../../Constants/Colors";
import { showToast } from "../../../utils/common";
import FontSize from "../../../Constants/FontSize";
import FontFamily from "../../../Constants/FontFamily";
import { hp, wp } from "../../../utils/responsiveSizes";
import { CommonContext } from "../../../contexts/ContextProvider";
import AddCustomerAddress from "../../../api/AddCustomerAddress";
import GetCustomerAddress from "../../../api/GetCustomerAddress";
import UpdateCustomerAddress from "../../../api/UpdateCustomerAddress";
import DeleteCustomerAddress from "../../../api/DeleteCustomerAddress";
import { Empty, NoAddress } from "../../../assets";

import BackHeader from "../../../Components/Header/BackHeader";
import MessageWithImage from "../../../Components/MessageWithImage";
import Footer from "../../ProductsAndServices/components/Footer";
import SelectAddressBottomSheet from "../../../Components/BottomSheet/SelectAddressBottomSheet";
import GetAddressFromCoordinates from "../../../api/GetAddressFromCoordinates";
import CheckBoxCard from "../../../Components/Cards/CheckBoxCard";
import AddressCard from "../../../Components/Cards/AddressCard";
import Loader from "../../../Components/Loader";
import { getSuperModifiedValues, isObjEmpty } from "../../../utils/utils";
import NearByProductProviders from "../../../api/NearByProductProviders";
// import crashlytics from "@react-native-firebase/crashlytics";

const ProductAddressAndProvider = () => {
  const {
    userProfile,
    onDemandProduct,
    setOnDemandProduct,
    setSelectedBranch,
  } = useContext(CommonContext);

  console.log("onDemandProduct : ", onDemandProduct?.productProvider);

  const { t } = useTranslation();
  const navigation = useNavigation();
  const addressesRef = useRef(null);

  // const [time, setTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressToUpdate, setAddressToUpdate] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [nearbyProductProviders, setNearbyProductProviders] = useState([]);
  const [selectedProductProvider, setSelectedProductProvider] = useState({});

  console.log("selected product provider", selectedProductProvider);

  const [showAddressModal, setShowAddressModal] = useState(false);
  useEffect(() => {
    navigation.addListener("focus", getAddresses);
  }, [navigation]);

  const getAddresses = () => {
    setLoading(true);
    GetCustomerAddress(userProfile.id).then((response) => {
      setLoading(false);
      if (response.success) {
        setAddresses(response.response);
        if (isObjEmpty(selectedAddress)) {
          setSelectedAddress(response.response[0]);
        }
      }
    });
  };

  useEffect(() => {
    if (selectedAddress) {
      checkNearByServiceProvidersForRegion({
        latitude: selectedAddress.latitude,
        longitude: selectedAddress.longitude,
      });
    }
  }, [selectedAddress]);

  const checkNearByServiceProvidersForRegion = (region) => {
    NearByProductProviders({
      region: region,
      serviceId: onDemandProduct.product.id,
      userId: userProfile.id,
    }).then((response) => {
      if (response.success) {
        setNearbyProductProviders(response.response);
        console.log("setNearbyProductProviders", response);
      } else {
        setNearbyProductProviders([]);
      }
    });
  };

  const onPressCancelAddress = () => {
    setShowAddressModal(false);
  };

  const onPressConfirmAddress = (
    name,
    selectedCoordinates,
    nearbyProductProviders,
    addressId
  ) => {
    onPressCancelAddress();
    setLoading(true);
    GetAddressFromCoordinates(selectedCoordinates).then((response) => {
      setLoading(false);
      if (response.success) {
        if (addressId) {
          // API: Update Customer Address
          UpdateCustomerAddress({
            addressId,
            addressName: name,
            latitude: selectedCoordinates?.latitude,
            longitude: selectedCoordinates?.longitude,
            address: response?.response[0]?.formatted_address,
          }).then((response) => {
            setAddressToUpdate(null);
            if (!response.success) {
              showToast("Error", response, "error");
            } else {
              getAddresses();
            }
          });
        } else {
          // API: Add Customer Address
          AddCustomerAddress({
            addressName: name,
            partnerID: userProfile.id,
            latitude: selectedCoordinates?.latitude,
            longitude: selectedCoordinates?.longitude,
            address: response?.response[0]?.formatted_address,
          }).then((response) => {
            if (!response.success) {
              showToast("Error", response, "error");
            } else {
              getAddresses();
              if (!selectedAddress) {
                setSelectedAddress({
                  id: response.response,
                  name: name,
                  address: response?.response[0]?.formatted_address,
                  latitude: selectedCoordinates?.latitude,
                  longitude: selectedCoordinates?.longitude,
                });
              }
            }
          });
        }
      } else {
        showToast("Error", response, "error");
      }
    });
  };

  const onPressSelectServiceProvider = (item) => {
    setSelectedProductProvider(item);
    setSelectedBranch(item);
  };

  const onPressNextButton = async () => {
    const modifiedOrder = getSuperModifiedValues(
      { productProvider: selectedProductProvider },
      onDemandProduct
    );

    if (selectedProductProvider && !isObjEmpty(modifiedOrder)) {
      await setOnDemandProduct({
        address: selectedAddress,
        product: onDemandProduct?.product,
        productProvider: selectedProductProvider,
      });
      console.log("navigating to payment page....", onDemandProduct);
      navigation.navigate("GoTrackSlots", {
        isOnDemand: true,
        COD: selectedProductProvider?.is_cod_active,
      });
    } else {
      await setOnDemandProduct({
        address: selectedAddress,
        product: onDemandProduct?.product,
        productProvider: !isObjEmpty(onDemandProduct?.productProvider)
          ? onDemandProduct?.productProvider
          : selectedProductProvider,
      });
      console.log("payemnt page navigation....", onDemandProduct);
      navigation.navigate("GoTrackSlots", {
        isOnDemand: true,
        COD: selectedProductProvider?.is_cod_active,
      });
    }
  };

  const onPressAddressCard = (address, index) => {
    addressesRef?.current?.scrollToIndex({ index });
    setSelectedAddress(address);
    setSelectedProductProvider({});
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
        setNearbyProductProviders([]);
      }
    });
    // .catch(err => crashlytics().recordError(err))
  };

  const onPressUpdateAddress = (address) => {
    setShowAddressModal(true);
    setAddressToUpdate(address);
  };

  return (
    <View style={styles.screen}>
      <BackHeader title={t("common.products")} />
      <View style={styles.contentContainer}>
        <View style={{ height: hp(20) }} />
        <View style={styles.selectAddressHeader}>
          <Text style={styles.selectAddress}>
            {t("gorexOnDemand.pleaseSelectAddress")}
          </Text>
          <TouchableOpacity onPress={() => setShowAddressModal(true)}>
            <Text style={styles.addNew}>{t("gorexOnDemand.addNew")}</Text>
          </TouchableOpacity>
        </View>

        {addresses.length > 0 ? (
          <View style={{ flex: 0.5, paddingTop: hp(10) }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              ref={addressesRef}
              data={addresses}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <AddressCard
                  index={index}
                  address={item}
                  onPress={onPressAddressCard}
                  onPressDelete={onPressDeleteAddress}
                  onPressUpdate={onPressUpdateAddress}
                  selectedAddress={selectedAddress}
                />
              )}
            />
          </View>
        ) : (
          <View>
            <View style={{ height: hp(60) }} />
            <MessageWithImage
              imageSource={NoAddress}
              message={t("gorexOnDemand.noAddressAdded")}
              description={t("gorexOnDemand.noAddressDescription")}
            />
            <View style={{ height: hp(60) }} />
          </View>
        )}
        <View style={styles.pickerTitleWrapper}>
          <Text style={styles.pickerTitle}>
            {t("gorexOnDemand.nearByServiceProvider")}
          </Text>
          <View style={{ height: hp(5) }} />
          {/*<Text style={styles.oneServiceOnly}>*/}
          {/*  {t("gorexOnDemand.oneServiceOnly")}*/}
          {/*</Text>*/}
        </View>

        <View style={{ height: hp(10) }} />
        <View style={{ flex: 1 }}>
          {nearbyProductProviders.length > 0 ? (
            <FlatList
              data={nearbyProductProviders}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                return (
                  <CheckBoxCard
                    isCheckboxOnRight={true}
                    title={item?.name}
                    checked={selectedProductProvider?.id === item?.id}
                    onPress={() => onPressSelectServiceProvider(item)}
                  />
                );
              }}
            />
          ) : (
            <View>
              <View style={{ height: hp(60) }} />
              <MessageWithImage
                imageSource={Empty}
                message={t("gorexOnDemand.noProductAdded")}
                description={t("gorexOnDemand.noProductDescription")}
              />
              <View style={{ height: hp(60) }} />
            </View>
          )}
        </View>
      </View>

      <View style={{ flex: 0.15, justifyContent: "flex-end" }}>
        <Footer
          title={t("common.next")}
          disabled={isObjEmpty(selectedProductProvider) || !selectedAddress}
          onPress={onPressNextButton}
        />
      </View>

      <Loader visible={loading} />

      <SelectAddressBottomSheet
        visible={showAddressModal}
        serviceId={onDemandProduct.product.id}
        addressToUpdate={addressToUpdate}
        closeSheet={onPressCancelAddress}
        onPressConfirmAddress={onPressConfirmAddress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  contentContainer: {
    flex: 0.85,
  },
  content: {
    flex: 1,
  },
  selectAddressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(20),
  },
  selectAddress: {
    ...FontSize.rfs18,
    ...FontFamily.bold,
    color: Colors.BLACK,
  },
  addNew: {
    ...FontSize.rfs16,
    ...FontFamily.bold,
    color: Colors.DARKERGREEN,
  },
  pickerTitleContainer: {
    flexDirection: "row",
    textAlign: "left",
  },
  pickerTitleWrapper: {
    // width: "90%",
    //   backgroundColor: 'red',
    alignItems: "flex-start",
    paddingHorizontal: wp(20),
  },
  oneServiceOnly: {
    color: Colors.BLACK,
  },
  pickerTitle: {
    ...FontSize.rfs18,
    ...FontFamily.bold,
    color: Colors.BLACK,
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
  selectContainer: (value) => {
    return {
      flex: 1,
      alignItems: "flex-start",
      paddingStart: value ? wp(10) : wp(33),
    };
  },
  select: {
    ...FontSize.rfs16,
    ...FontFamily.bold,
    color: Colors.WHITE,
  },
  // cardStyle: {
  //     width: wp(388),
  //     marginVertical: hp(5),
  //     marginHorizontal: wp(20),
  // },
});

export default ProductAddressAndProvider;
