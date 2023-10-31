import React, { useContext, useRef, useState, useEffect } from "react";
import {
  Text,
  View,
  Alert,
  Image,
  Linking,
  Platform,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

// ** Custom Components
import {
  GreenCarPin,
  BlackArrowDown,
  WhiteBlackCurrentLocation,
  GreenCheckBoxChecked,
  GreyCheckBoxUnchecked,
  InfoImage,
  NoVehicle,
} from "../../../assets";
import Fonts from "../../../Constants/fonts";
import { isObjEmpty } from "../../../utils/utils";
import { showToast } from "../../../utils/common";
import FontSize from "../../../Constants/FontSize";
import Utilities from "../../../utils/UtilityMethods";
import { hp, wp } from "../../../utils/responsiveSizes";
import { RoundedSquareFullButton } from "../../../Components";

// ** Custom Theme && Styles
import Colors from "../../../Constants/Colors";
import MapStyle from "../../../Constants/MapStyle";

// ** Third Party Packages
import MapView from "react-native-maps";
import { useTranslation } from "react-i18next";
import RBSheet from "react-native-raw-bottom-sheet";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";

// ** Store && Actions
import { CommonContext } from "../../../contexts/ContextProvider";
import GetGoTrackDevicesAPI from "../../../api/GetGoTrackDevicesAPI";
import GetGoTrackMapDataAPI from "../../../api/GetGoTrackMapDataAPI";
import MessageWithImage from "../../../Components/MessageWithImage";
import axios from "axios";
import { encode as base64Encode } from "base-64";
import Loader from "../../../Components/Loader";

function GoTrackTracking({
  selectedDevice,
  confirmDevice,
  setSelectedDevice,
  setConfirmDevice,
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  // Refs
  const mapRef = useRef();
  const RBSheetRef = useRef();

  // ** Store
  const { userProfile, setCurrentLocation, currentLocation } =
    useContext(CommonContext);

  // ** States
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [devicesList, setDevicesList] = useState([]);
  const [trackingData, setTrackingData] = useState({});
  const [deviceModal, setDeviceModal] = useState(false);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);

  const currentDate = new Date();
  const currentISODate = currentDate.toISOString();

  // Calculate the date one month ago
  const oneMonthAgoDate = new Date(currentDate);

  oneMonthAgoDate.setMonth(currentDate.getMonth() - 1);
  const oneMonthAgoISODate = oneMonthAgoDate.toISOString();

  const to = currentISODate;
  const from = oneMonthAgoISODate;

  const isFocused = useIsFocused();

  const devicesListApi = async () => {
    setLoading(true);
    await GetGoTrackDevicesAPI(userProfile?.id).then(
      ({ success, response, error }) => {
        setLoading(false);
        if (success) {
          const filteredResponse = [];
          for (const item of response) {
            if (item.status === "active") {
              filteredResponse.push(item);
            }
          }
          setDevicesList(filteredResponse);
          if (response.length >= 2) {
            const filteredResponse = [];
            for (const item of response) {
              if (item.status === "active") {
                filteredResponse.push(item);
              }
            }
            setConfirmDevice(filteredResponse?.[0]);
            setSelectedDevice(filteredResponse?.[0]);
          }
        } else {
          showToast("Error", error, "error");
        }
      }
    );
  };

  // const trackDataAPI = async () => {
  //   setLoading(true);
  //   const dataObj = new FormData();
  //   dataObj.append("username", "gorex");
  //   dataObj.append("password", "abcd1234$!");
  //   dataObj.append("vehicleId", confirmDevice?.tracking_vehicle_id);

  //   await GetGoTrackMapDataAPI(dataObj).then(({ success, response, error }) => {
  //     setLoading(false);
  //     if (success) {
  //       setTrackingData(response);
  //       setCurrentCoordinates({
  //         latitude: parseFloat(response?.latitude),
  //         longitude: parseFloat(response?.longitude),
  //       });
  //     } else {
  //       showToast("Error", error, "error");
  //     }
  //   });
  // };

  const trackDataAPI = async () => {
    if (confirmDevice?.tracking_vehicle_id) {
      try {
        const username = "ahmad@yopmail.com";
        const password = "admin";

        const basicAuthHeader =
          "Basic " + base64Encode(`${username}:${password}`);
        const deviceConfig = {
          method: "get",
          url: `http://144.24.209.247:9090/api/reports/route?deviceId=${confirmDevice?.tracking_vehicle_id}&groupId=0&from=${from}&to=${to}`,
          headers: {
            Authorization: basicAuthHeader,
            "Content-Type": "application/json",
          },
          timeout: 3000,
        };
        const deviceResponse = await axios.request(deviceConfig);
        if (deviceResponse.data !== []) {
          const positions = deviceResponse.data;
          if (positions.length > 0) {
            const lastPosition = positions[positions.length - 1];
            setTrackingData(lastPosition);
            setCurrentCoordinates({
              latitude: parseFloat(lastPosition?.latitude),
              longitude: parseFloat(lastPosition?.longitude),
            });
          } else {
            setTrackingData(positions);
          }
        } else {
          showToast("Error", "hello", "error");
        }
      } catch (error) {
        console.error("Error in trackDataAPI:", error);
        if (error.response && error.response.status === 500) {
          showToast(
            "Error",
            "Internal Server Error. Please try again later.",
            "error"
          );
        } else {
          showToast("Error", error.message, "error");
        }
      }
    }
  };

  //**  RBSheet
  useEffect(() => {
    if (deviceModal) {
      RBSheetRef?.current.open();
      devicesListApi().then();
    } else {
      RBSheetRef?.current.close();
    }
  }, [deviceModal]);

  // ** Get Current Location
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (location) => {
        setCurrentCoordinates({
          latitude: parseFloat(location?.coords?.latitude),
          longitude: parseFloat(location?.coords?.longitude),
        });
        setCurrentLocation({
          latitude: parseFloat(location?.coords?.latitude),
          longitude: parseFloat(location?.coords?.longitude),
        });
      },
      (error) => {
        setCurrentCoordinates({ latitude: 24.7136, longitude: 46.6753 });
        setCurrentLocation({ latitude: 24.7136, longitude: 46.6753 });
        LocationAlert(error.message);
      }
    );
  };

  // ** Go To the Current Location
  const onPressCurrentLocationButton = () => {
    mapRef?.current?.animateToRegion({
      latitude: currentCoordinates?.latitude,
      longitude: currentCoordinates?.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    setReload(!reload);
  };

  useEffect(() => {
    let intervalId;

    const trackAndAnimate = async () => {
      await trackDataAPI();
    };

    const startTracking = () => {
      if (isObjEmpty(trackingData)) {
        trackAndAnimate();
      }
      if (confirmDevice?.tracking_vehicle_id) {
        intervalId = setInterval(() => {
          trackAndAnimate();
        }, 3000);
      }
    };

    if (isFocused) {
      startTracking();
      onPressCurrentLocationButton();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [confirmDevice, currentCoordinates, isFocused, trackingData]);

  //** Alert
  const LocationAlert = (message) => {
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
          onPress: async () => {
            if (Platform.OS === "ios") {
              Linking.openURL("app-settings:").then();
            } else {
              Linking.openSettings().then();
            }
          },
        },
      ]
    );
  };

  let coordinates = {
    latitude: trackingData?.latitude,
    longitude: trackingData?.longitude,
  };

  // ** Current Location Marker
  const showCurrentLocationMarker = () => {
    return (
      <MapView.Marker key={"1"} coordinate={currentCoordinates}>
        <View style={{ width: "30%", height: "30%" }}>
          <Image
            source={GreenCarPin}
            style={{
              width: 60,
              height: 60,
              resizeMode: "contain",
              transform: [
                {
                  rotate: trackingData?.direction
                    ? `${trackingData?.direction}deg`
                    : "0deg",
                },
              ],
            }}
          />
        </View>
      </MapView.Marker>
    );
  };

  useEffect(() => {
    return navigation.addListener("focus", async () => {
      await getCurrentLocation();
      onPressCurrentLocationButton();
      if (trackingData) {
        setLoaded(true);
        setTimeout(() => {
          setLoaded(false);
        }, 3000);
      }
    });
  }, [navigation, trackingData]);

  return (
    <View style={styles.container}>
      {currentCoordinates && (
        <MapView
          ref={mapRef}
          initialRegion={{
            latitude: currentCoordinates?.latitude,
            longitude: currentCoordinates?.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={styles.map}
          userInterfaceStyle={"light"}
          userLocationPriority="high"
          customMapStyle={MapStyle}
        >
          {trackingData && showCurrentLocationMarker()}
        </MapView>
      )}

      <TouchableOpacity
        style={[styles.content]}
        onPress={onPressCurrentLocationButton}
      >
        <WhiteBlackCurrentLocation width={wp(130)} height={wp(130)} />
      </TouchableOpacity>

      {/*<View*/}
      {/*  style={styles.mapActions}*/}
      {/*  // onPress={onPressCurrentLocationButton}*/}
      {/*>*/}
      {/*  <TouchableOpacity*/}
      {/*    style={styles.trafficLight}*/}
      {/*    onPress={() => console.log("traffic light pressed")}*/}
      {/*  >*/}
      {/*    <BlackWhiteTrafficLight width={wp(130)} height={wp(130)} />*/}
      {/*  </TouchableOpacity>*/}

      {/*  <TouchableOpacity*/}
      {/*    style={styles.trafficArrows}*/}
      {/*    onPress={() => console.log("traffic light pressed")}*/}
      {/*  >*/}
      {/*    <BlackWhiteTrafficLight width={wp(130)} height={wp(130)} />*/}
      {/*  </TouchableOpacity>*/}
      {/*</View>*/}

      <View style={styles.VehicleSelector}>
        <TouchableOpacity
          onPress={() => setDeviceModal(true)}
          style={styles.vehicleDropDown}
        >
          <Text style={styles.vehicleName}>
            {confirmDevice?.name || t("GoTrack.dashboard.selectDevice")}
          </Text>
          <BlackArrowDown
            style={{ marginLeft: wp(10) }}
            width={wp(14)}
            height={wp(14)}
          />
        </TouchableOpacity>
      </View>

      <RBSheet
        height={Utilities.hp(60)}
        ref={RBSheetRef}
        closeOnDragDown={true}
        animationType={"fade"}
        onClose={() => setDeviceModal(false)}
        customStyles={{
          wrapper: {},
          container: {
            paddingHorizontal: wp(20),
            borderTopLeftRadius: hp(20),
            borderTopRightRadius: hp(20),
          },
          draggableIcon: {
            // backgroundColor: "#000",
            marginTop: wp(30),
            width: wp(60),
          },
        }}
      >
        <TouchableOpacity
          style={styles.modalCancel}
          onPress={() => setDeviceModal(false)}
        >
          <Text
            style={{
              color: Colors.BLACK,
              fontFamily: Fonts.LexendMedium,
              ...FontSize.rfs18,
            }}
          >
            {t("vehicle.cancel")}
          </Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={"large"} color={Colors.BLUE} />
          </View>
        ) : (
          <View style={styles.VehicleSelectView}>
            <FlatList
              data={devicesList}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={
                devicesList.length === 0 && {
                  flex: 1,
                  justifyContent: "center",
                }
              }
              ListEmptyComponent={
                <View style={styles.EmptyVehiclesList}>
                  <MessageWithImage
                    imageSource={NoVehicle}
                    message={t("GoTrack.dashboard.noDevice")}
                    description={t("GoTrack.dashboard.addDeviceToAccount")}
                  />
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.selectVehicleButton}
                  onPress={() => setSelectedDevice(item)}
                >
                  {item.name === selectedDevice.name ? (
                    <GreenCheckBoxChecked width={wp(20)} height={hp(20)} />
                  ) : (
                    <GreyCheckBoxUnchecked width={wp(20)} height={hp(20)} />
                  )}
                  <Text style={styles.selectedVehicleName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <View style={styles.bottomButton}>
          <RoundedSquareFullButton
            title={t("GoTrack.track.track")}
            onPress={() => {
              setDeviceModal(false);
              setConfirmDevice(selectedDevice);
            }}
          />
        </View>
      </RBSheet>
      {loaded && <Loader visible={loaded} />}
    </View>
  );
}

export default GoTrackTracking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "red",
    // backgroundColor: "#B0B3BA19",
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    bottom: hp(0),
  },
  content: {
    position: "absolute",
    bottom: hp(55),
    right: wp(20),
    overflow: "hidden",
    width: wp(100),
    height: wp(100),
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    shadowColor: Colors.GREY,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  mapActions: {
    position: "absolute",
    top: hp(25),
    right: wp(10),
    // overflow: "hidden",
    // alignItems: "center",
    // justifyContent: "center",
  },
  trafficLight: {
    backgroundColor: Colors.BLACK,
    width: wp(70),
    height: hp(70),
    // overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    // borderRadius: wp(500)
  },
  VehicleSelector: {
    position: "absolute",
    left: wp(30),
    top: wp(20),
  },
  vehicleDropDown: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: wp(20),
    paddingVertical: wp(10),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: wp(7),
    elevation: 1,
    shadowColor: Colors.GREY,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  EmptyVehiclesList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleName: {
    fontFamily: Fonts.LexendRegular,
    ...FontSize.rfs16,
    color: Colors.BLACK,
    textAlign: "left",
  },
  modalCancel: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 999,
  },
  VehicleSelectView: {
    marginVertical: hp(20),
    flex: 1,
  },
  bottomButton: {
    marginBottom: wp(30),
  },
  selectVehicleButton: {
    marginVertical: hp(5),
    paddingVertical: hp(10),
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedVehicleName: {
    textAlign: "left",
    color: Colors.BLACK,
    fontFamily: Fonts.LexendRegular,
    ...FontSize.rfs16,
    marginLeft: wp(20),
  },
});
