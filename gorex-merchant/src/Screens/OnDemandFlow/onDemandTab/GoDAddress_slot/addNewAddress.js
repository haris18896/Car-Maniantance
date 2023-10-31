import React, { useContext, useEffect, useRef, useState } from "react";

// ** Third Party Packages
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  Linking,
} from "react-native";
import MapView from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";

// ** Custom Components
import Colors from "../../../../Constants/Colors";
import MapStyle from "../../../../Constants/MapStyle";
import FontSize from "../../../../Constants/FontSize";
import FontFamily from "../../../../Constants/FontFamily";
import { hp, wp } from "../../../../utils/responsiveSizes";
import { RoundedSquareFullButton } from "../../../../Components";
import BackHeader from "../../../../Components/Header/BackHeader";
import { CommonContext } from "../../../../contexts/ContextProvider";
import {
  CurrentLocation,
  GreenWhiteCurrentLocation,
  MapPin,
  MyPin,
  OutOfRange,
} from "../../../../assets";
import NearByServiceProviders from "../../../../api/NearbyServiceProviders";
import InputWithLabel from "../../../../Components/Inputs/InputWithLabel";
import { isObjEmpty } from "../../../../utils/utils";
import UpdateCustomerAddress from "../../../../api/UpdateCustomerAddress";
import GetAddressFromCoordinates from "../../../../api/GetAddressFromCoordinates";
import AddCustomerAddress from "../../../../api/AddCustomerAddress";
import GetCustomerAddress from "../../../../api/GetCustomerAddress";

function AddNewAddress({ route }) {
  const { serviceId, addressToUpdate = {} } = route?.params;

  let addressCoordinates = {
    latitude: parseFloat(addressToUpdate?.latitude),
    longitude: parseFloat(addressToUpdate?.longitude),
  };

  const showCurrentLocationMarker = (currentCoordinates) => {
    return (
      <MapView.Marker key={"1"} coordinate={currentCoordinates}>
        <View style={{ width: "30%", height: "30%" }}>
          <Image
            source={MyPin}
            style={{ width: 60, height: 60, resizeMode: "contain" }}
          />
        </View>
      </MapView.Marker>
    );
  };

  const mapRef = useRef();
  let refBottomSheet = useRef();
  const { currentLocation, userProfile, setCurrentLocation, onDemandOrder } =
    useContext(CommonContext);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [name, setName] = useState(addressToUpdate?.name || "");
  const [loading, setLoading] = useState(false);
  // const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(
    onDemandOrder && onDemandOrder.address ? onDemandOrder.address : {}
  );
  const [addresses, setAddresses] = useState([]);
  const [selectedCoordinates, setSelectedCoordinates] =
    useState(currentLocation);
  const [nearbyServiceProviders, setNearbyServiceProviders] = useState([]);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (location) => {
        setCurrentLocation({
          latitude: parseFloat(location?.coords.latitude),
          longitude: parseFloat(location?.coords.longitude),
        });
      },
      (error) => {
        setCurrentLocation({ latitude: 24.7136, longitude: 46.6753 });
        showAlert(error.message);
      }
    );
  };

  const onPressCurrentLocationButton = () => {
    mapRef?.current?.animateToRegion({
      latitude: addressToUpdate?.latitude
        ? parseFloat(addressToUpdate?.latitude)
        : parseFloat(currentLocation.latitude),
      longitude: addressToUpdate?.longitude
        ? parseFloat(addressToUpdate?.longitude)
        : parseFloat(currentLocation.longitude),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  useEffect(() => {
    return navigation.addListener("focus", () => {
      onPressCurrentLocationButton();
      getCurrentLocation();
    });
  }, [navigation]);
  const checkNearByServiceProvidersForRegion = (region) => {
    NearByServiceProviders({
      region: region,
      serviceId: serviceId,
      userId: userProfile.id,
    }).then((response) => {
      if (response.success) {
        setNearbyServiceProviders(response.response);
      }
    });
  };

  useEffect(() => {
    checkNearByServiceProvidersForRegion(currentLocation);
  }, []);

  const showAlert = (message) => {
    Alert.alert(
      t("dashboard.location_error_title"),
      t("dashboard.location_error_message"),
      [
        {
          text: t("setting.cancel"),
          style: "destructive",
        },
        {
          text: t("dashboard.open_settings"),
          onPress: openSettings,
        },
      ]
    );
  };

  const openSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:").then();
    } else {
      Linking.openSettings().then();
    }
  };

  const onPressConfirmAddress = () => {
    setLoading(true);
    GetAddressFromCoordinates(selectedCoordinates).then((response) => {
      setLoading(false);
      if (response.success) {
        if (addressToUpdate?.id) {
          // API: Update Customer Address
          let addressId = addressToUpdate?.id;
          UpdateCustomerAddress({
            addressId,
            addressName: name,
            latitude: selectedCoordinates?.latitude,
            longitude: selectedCoordinates?.longitude,
            address: response?.response[0]?.formatted_address,
          }).then((response) => {
            if (!response.success) {
              showToast("Error", response, "error");
              // crashlytics().recordError(response);
            } else {
              navigation.navigate("GoDAddressSlot");
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
              navigation.navigate("GoDAddressSlot");
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
          // .catch((err) => crashlytics().recordError(err));
        }
      } else {
        showToast("Error", response, "error");
      }
    });
  };

  return (
    <View style={styles.container}>
      <BackHeader title={t("common.gorexOnDemand")} />

      {nearbyServiceProviders.length > 0 && (
        <View style={styles.outOfRangeWrapper}>
          <OutOfRange width={27} height={20} />
          <Text style={styles.outOfRangeText}>
            {t("gorexOnDemand.outOfRange")}
          </Text>
        </View>
      )}

      <View style={styles.mapWrapper}>
        {currentLocation && (
          <MapView
            ref={mapRef}
            initialRegion={{
              latitude: !isObjEmpty(addressToUpdate)
                ? parseFloat(addressToUpdate?.latitude)
                : parseInt(currentLocation?.latitude),
              longitude: !isObjEmpty(addressToUpdate)
                ? parseFloat(addressToUpdate?.latitude)
                : parseInt(currentLocation?.longitude),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={styles.map}
            userInterfaceStyle={"dark"}
            userLocationPriority="high"
            customMapStyle={MapStyle}
            onRegionChangeComplete={(region, details) => {
              setSelectedCoordinates(region);
              checkNearByServiceProvidersForRegion(region);
            }}
          >
            {addressCoordinates?.latitude && addressCoordinates?.longitude
              ? showCurrentLocationMarker(addressCoordinates)
              : showCurrentLocationMarker(currentLocation)}
          </MapView>
        )}

        <TouchableOpacity
          style={[styles.content]}
          onPress={onPressCurrentLocationButton}
        >
          <GreenWhiteCurrentLocation width={wp(60)} height={wp(60)} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrapper}>
        <InputWithLabel
          label={t("common.name")}
          placeholder={t("gorexOnDemand.selectAddressPlaceholder")}
          value={name}
          setValue={setName}
        />

        <View style={styles.confirmationWrapper}>
          <RoundedSquareFullButton
            disabled={loading || name.length <= 0}
            title={t("gorexOnDemand.confirmAddress")}
            onPress={() => {
              onPressConfirmAddress();
              // setName("");
            }}
            loading={loading}
          />
        </View>
      </View>
    </View>
  );
}

export default AddNewAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    bottom: hp(0),
  },
  content: {
    position: "absolute",
    bottom: hp(50),
    right: wp(20),
  },
  outOfRangeWrapper: {
    backgroundColor: Colors.BLACK,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: wp(10),
    paddingHorizontal: wp(15),
  },
  mapPin: {
    width: wp(46),
    height: hp(71),
    resizeMode: "contain",
  },
  currentLocation: {
    width: wp(60),
    height: wp(60),
    marginEnd: hp(20),
    marginBottom: hp(20),
    resizeMode: "contain",
    alignSelf: "flex-end",
    justifyContent: "flex-end",
  },
  outOfRangeText: {
    marginLeft: wp(10),
    ...FontSize.rfs14,
    ...FontFamily.semiBold,
    color: Colors.ORANGE,
  },
  mapWrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  confirmationWrapper: {
    marginTop: hp(20),
  },
  searchWrapper: {
    marginVertical: hp(35),
    marginHorizontal: hp(20),
  },
});
