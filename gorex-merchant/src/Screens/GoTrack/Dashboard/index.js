import React, { useRef, useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

// ** Custom Components
import Loader from "../../../Components/Loader";
import SpeedometerComponent from "../../../Components/Speedometer";

//** axios */
import axios from "axios";
import { encode as base64Encode } from "base-64";

// ** Custom Theme && Styles
import {
  Reminder,
  Diagnosis,
  InfoImage,
  NoVehicle,
  BatteryIC,
  DistanceIC,
  LocationIC,
  EngineTemp,
  FuelLevelIC,
  BlackArrowDown,
  GreenCheckBoxChecked,
  GreyCheckBoxUnchecked,
} from "../../../assets";
import Fonts from "../../../Constants/fonts";
import Colors from "../../../Constants/Colors";
import { isObjEmpty } from "../../../utils/utils";
import FontSize from "../../../Constants/FontSize";
import Utilities from "../../../utils/UtilityMethods";
import { hp, wp } from "../../../utils/responsiveSizes";
import { RoundedSquareFullButton } from "../../../Components";

// ** Third Party Packages
import Geocoder from "react-native-geocoding";
import { useTranslation } from "react-i18next";
import RBSheet from "react-native-raw-bottom-sheet";
import { useIsFocused, useNavigation } from "@react-navigation/native";

// ** Store && Action
import { showToast } from "../../../utils/common";
import { CommonContext } from "../../../contexts/ContextProvider";
import GetGoTrackDevicesAPI from "../../../api/GetGoTrackDevicesAPI";
import MessageWithImage from "../../../Components/MessageWithImage";
import GetGoTrackMapDataAPI from "../../../api/GetGoTrackMapDataAPI";

function GoTrackDashboard({
  selectedDevice,
  confirmDevice,
  setSelectedDevice,
  setConfirmDevice,
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  // ** Context
  const { userProfile } = useContext(CommonContext);

  // ** Refs
  const RBSheetRef = useRef();
  const ReminderRef = useRef();
  const DiagnosisREf = useRef();

  // ** States
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [devicesList, setDevicesList] = useState([]);
  const [trackingData, setTrackingData] = useState({});
  const [trackingFuel, setTrackingFuel] = useState({});
  const [devicesModal, setDevicesModal] = useState(false);
  const [trackingDistance, setTrackingDistance] = useState({});
  const [trackingDataAddress, setTrackingDataAddress] = useState(false);

  let latitude = trackingData?.latitude;
  let longitude = trackingData?.longitude;

  const currentDate = new Date();

  const currentISODate = currentDate.toISOString();

  const oneHourAgoDate = new Date(currentDate);
  oneHourAgoDate.setHours(currentDate.getHours() - 1);
  const oneHourAgoISODate = oneHourAgoDate.toISOString();
  const sevenDaysAgoDate = new Date(currentDate);
  sevenDaysAgoDate.setDate(currentDate.getDate() - 7);
  const sevenDaysAgoISODate = sevenDaysAgoDate.toISOString();

  const from7Days = sevenDaysAgoISODate;
  const to7Days = currentISODate;

  const from = oneHourAgoISODate;
  const to = currentISODate;

  // ** States List
  const statesList = [
    trackingFuel?.[0]?.spentFuel
      ? {
          id: 1,
          name: t("GoTrack.dashboard.FuelLevel"),
          value: `${trackingFuel?.[0]?.spentFuel} %`,
          icon: FuelLevelIC,
        }
      : null,
    trackingFuel?.[0]?.endOdometer
      ? {
          id: 8,
          name: t("GoTrack.dashboard.totalOdometer"),
          value: `${Number(trackingFuel?.[0]?.endOdometer) / 1000} KM`,
          icon: FuelLevelIC,
        }
      : null,
    trackingFuel?.[0]?.distance
      ? {
          id: 2,
          name: t("GoTrack.dashboard.distance"),
          value: `${(trackingFuel?.[0]?.distance / 1000).toFixed(2)} KM`,
          icon: DistanceIC,
        }
      : null,
    trackingDistance?.attributes?.totalDistance
      ? {
          id: 3,
          name: t("GoTrack.dashboard.totalSpeedIn7Days"),
          value: `${(
            trackingDistance?.attributes?.totalDistance / 1000
          ).toFixed(3)} KM`,
          icon: DistanceIC,
        }
      : null,

    trackingFuel?.[0]?.averageSpeed
      ? {
          id: 6,
          name: t("GoTrack.dashboard.averageSpeedIn7Days"),
          value: `${trackingFuel?.[0]?.averageSpeed?.toFixed(2)} KM`,
          icon: FuelLevelIC,
        }
      : null,
    trackingFuel?.[0]?.maxSpeed
      ? {
          id: 7,
          name: t("GoTrack.dashboard.maxSpeedIn7Days"),
          value: `${trackingFuel?.[0]?.maxSpeed?.toFixed(2)} KM`,
          icon: FuelLevelIC,
        }
      : null,

    trackingData?.attributes?.battery
      ? {
          id: 4,
          name: t("GoTrack.dashboard.batteryVolt"),
          value: `${trackingData?.attributes?.battery?.toFixed(2)} ${t(
            "GoTrack.dashboard.volts"
          )}`,
          icon: BatteryIC,
        }
      : null,
    trackingData?.temperature
      ? {
          id: 5,
          name: t("GoTrack.dashboard.EngineTemp"),
          value: `${trackingData?.temperature} °C`,
          icon: EngineTemp,
        }
      : null,
    {
      id: 9,
      name: t("GoTrack.dashboard.ignition"),
      value:
        trackingData?.attributes?.ignition === true
          ? "Ignition on"
          : "Ignition off",
      icon: FuelLevelIC,
    },
    {
      id: 9,
      name: t("GoTrack.dashboard.motion"),
      value: trackingData?.attributes?.ignition === true ? "Moving" : "Stopped",
      icon: FuelLevelIC,
    },
    // {
    //   id: 7,
    //   name: t("GoTrack.dashboard.totalTripsIn7Days"),
    //   value: trackingData?.temperature
    //     ? `${trackingData?.temperature} °C`
    //     : "NA",
    //   icon: DistanceIC,
    // },
  ];

  //** devicesListApi */
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

  const handleDeviceChange = () => {
    setLoaded(true);
    setTimeout(() => {
      setLoaded(false);
    }, 300);
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
  //       console.log("api success", response);
  //       setTrackingData(response);
  //     } else {
  //       showToast("Error", error, "error");
  //     }
  //   });
  // };

  //** trackDataAPI */
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
          } else {
            setTrackingData(positions);
          }
        } else {
          setTrackingData(deviceResponse.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  //**trackDistanceAPI */
  const trackDistanceAPI = async () => {
    if (confirmDevice?.tracking_vehicle_id) {
      try {
        const username = "ahmad@yopmail.com";
        const password = "admin";

        const basicAuthHeader =
          "Basic " + base64Encode(`${username}:${password}`);
        const deviceConfig = {
          method: "get",
          url: `http://144.24.209.247:9090/api/reports/route?deviceId=${confirmDevice?.tracking_vehicle_id}&groupId=0&from=${from7Days}&to=${to7Days}`,
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
            setTrackingDistance(lastPosition);
          } else {
            setTrackingDistance(positions);
          }
        } else {
          setTrackingDistance(deviceResponse.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  //** trackFuelAPI */
  const trackFuelAPI = async () => {
    if (confirmDevice?.tracking_vehicle_id) {
      try {
        const username = "ahmad@yopmail.com";
        const password = "admin";

        const basicAuthHeader =
          "Basic " + base64Encode(`${username}:${password}`);
        const deviceConfig = {
          method: "get",
          url: `http://144.24.209.247:9090/api/reports/summary?deviceId=${confirmDevice?.tracking_vehicle_id}&groupId=0&from=${from7Days}&to=${to7Days}`,
          headers: {
            Authorization: basicAuthHeader,
            "Content-Type": "application/json",
          },
          timeout: 3000,
        };
        const deviceResponse = await axios.request(deviceConfig);
        if (deviceResponse.data !== []) {
          const positions = deviceResponse.data;
          setTrackingFuel(positions);
        } else {
          setTrackingFuel(deviceResponse.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  //** Geocoder */
  const geocoder = () => {
    if (trackingData?.latitude && trackingData?.longitude) {
      Geocoder.init("AIzaSyAC8v-kKXGvsLJ5j70V332XFxa-m-WKjzE");
      Geocoder.from(latitude, longitude)
        .then((response) => {
          const address = response.results[0].formatted_address;
          setTrackingDataAddress(address);
        })
        .catch((error) => {
          Alert.alert("Error reverse geocoding:", error);
        });
    } else {
      setTrackingDataAddress(false);
    }
  };

  //**  RBSheet
  useEffect(() => {
    if (confirmDevice === null) {
      devicesListApi().then();
    }

    if (devicesModal) {
      RBSheetRef?.current.open();
      if (confirmDevice === null) {
        devicesListApi().then();
      }
    } else {
      RBSheetRef?.current.close();
    }
  }, [devicesModal]);

  const isFocused = useIsFocused();

  useEffect(() => {
    let intervalId;
    geocoder();
    const trackAndAnimate = async () => {
      await trackDataAPI();
      await trackDistanceAPI();
      await trackFuelAPI();
    };

    const startTracking = () => {
      if (isObjEmpty(trackingData)) {
        trackAndAnimate();
      }
      if (confirmDevice?.tracking_vehicle_id === 0) {
        setTrackingData({});
        setTrackingFuel({});
        setTrackingDistance({});
        // Add other conditions for different accuracy levels if needed
      } else {
        intervalId = setInterval(() => {
          trackAndAnimate();
        }, 5000);
      }
    };
    if (isFocused) {
      startTracking(); // Start tracking when component mounts
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [confirmDevice, trackingData?.accuracy, isFocused]);

  // useEffect(() => {
  //   return navigation.addListener("focus", () => devicesListApi());
  // }, [navigation]);

  // ** Reminders Modal
  // useEffect(() => {
  //   if (reminderModal) {
  //     ReminderRef?.current.open();
  //   } else {
  //     ReminderRef?.current.close();
  //   }
  // }, [reminderModal]);

  // ** Diagnosis Modal
  // useEffect(() => {
  //   if (diagnosisModal) {
  //     DiagnosisREf?.current.open();
  //   } else {
  //     DiagnosisREf?.current.close();
  //   }
  // }, [diagnosisModal]);

  useEffect(() => {
    return navigation.addListener("focus", async () => {
      if (trackingData) {
        setLoaded(true);
        setTimeout(() => {
          setLoaded(false);
        }, 3000);
      }
    });
  }, [navigation, trackingData]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>{t("GoTrack.dashboard.metrics")}</Text>
          <Text style={styles.titleDescription}>
            {t("GoTrack.dashboard.synced")}: 5 min ago
          </Text>
        </View>
        <View style={styles.VehicleSelector}>
          <TouchableOpacity
            onPress={() => setDevicesModal(true)}
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
      </View>

      {/* Speed Meter */}
      <View style={styles.SpeedMeter}>
        <SpeedometerComponent value={trackingData?.speed} maxValue={200} />
      </View>

      {/* Stats */}
      <FlatList
        data={statesList.filter((item) => item !== null)}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.VehicleStatesContainer}
        ItemSeparatorComponent={() => null}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.VehicleStatesWrapper} key={index}>
              <View style={styles.vehicleState}>
                <Image
                  source={item?.icon}
                  style={styles.stateIcon}
                  resizeMode={"contain"}
                />
                <View style={styles.vehicleStateDescription}>
                  <Text style={styles.stateName}>{item?.name}</Text>
                  <Text style={styles.stateValue}>{item?.value}</Text>
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Locations */}
      <View style={[styles.vehicleState, { marginHorizontal: wp(20) }]}>
        <Image source={LocationIC} style={styles.stateIcon} />
        <View style={styles.vehicleStateDescription}>
          <Text style={styles.stateName}>
            {t("GoTrack.dashboard.currentLocation")}
          </Text>
          <Text style={styles.stateValue}>
            {trackingDataAddress
              ? trackingDataAddress
              : "Yet there is no address available"}
          </Text>
        </View>
      </View>

      {/* Reminders */}
      {/*<TouchableOpacity*/}
      {/*  onPress={() => setReminderModal(true)}*/}
      {/*  style={[styles.vehicleState, { marginHorizontal: wp(20) }]}*/}
      {/*>*/}
      {/*  <Image source={Reminder} style={styles.stateIcon} />*/}
      {/*  <View style={styles.vehicleStateDescription}>*/}
      {/*    <Text style={styles.stateName}>*/}
      {/*      {t("GoTrack.dashboard.reminders")}*/}
      {/*    </Text>*/}
      {/*    <Text style={styles.stateValue}>*/}
      {/*      NEXT OIL CHANGE DUE AT 5,000 MILES*/}
      {/*    </Text>*/}
      {/*  </View>*/}
      {/*</TouchableOpacity>*/}

      {/* Diagnosis */}
      {/*<TouchableOpacity*/}
      {/*  onPress={() => setDiagnosisModal(true)}*/}
      {/*  style={[styles.vehicleState, { marginHorizontal: wp(20) }]}*/}
      {/*>*/}
      {/*  <Image source={Diagnosis} style={styles.stateIcon} />*/}
      {/*  <View style={styles.vehicleStateDescription}>*/}
      {/*    <Text style={styles.stateName}>*/}
      {/*      {t("GoTrack.dashboard.diagnosis")}*/}
      {/*    </Text>*/}
      {/*    <Text style={styles.stateValue}>*/}
      {/*      CATALYTIC CONVERTER BELOW THRESHOLD*/}
      {/*    </Text>*/}
      {/*  </View>*/}
      {/*</TouchableOpacity>*/}

      {/* Vehicles Modal */}
      <RBSheet
        height={Utilities.hp(60)}
        ref={RBSheetRef}
        closeOnDragDown={true}
        closeOnPressBack={true}
        animationType={"fade"}
        onClose={() => setDevicesModal(false)}
        customStyles={{
          container: {
            paddingHorizontal: wp(20),
            borderTopLeftRadius: hp(20),
            borderTopRightRadius: hp(20),
          },
          draggableIcon: {
            marginTop: wp(30),
            width: wp(60),
          },
        }}
      >
        <TouchableOpacity
          style={styles.modalCancel}
          onPress={() => setDevicesModal(false)}
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
              refreshing={loading}
              onRefresh={devicesListApi}
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
              renderItem={({ item }) => {
                return (
                  item?.status === "active" && (
                    <TouchableOpacity
                      style={styles.selectVehicleButton}
                      onPress={() => setSelectedDevice(item)}
                    >
                      {item.name === selectedDevice?.name ? (
                        <GreenCheckBoxChecked width={wp(20)} height={hp(20)} />
                      ) : (
                        <GreyCheckBoxUnchecked width={wp(20)} height={hp(20)} />
                      )}
                      <Text style={styles.selectedVehicleName}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )
                );
              }}
            />
          </View>
        )}

        <View style={styles.bottomButton}>
          <RoundedSquareFullButton
            title={t("GoTrack.dashboard.switch")}
            onPress={() => {
              setConfirmDevice(selectedDevice);
              setDevicesModal(false);
            }}
          />
        </View>
      </RBSheet>

      {/* Reminders Modal */}
      {/*<RBSheet*/}
      {/*  height={Utilities.hp(60)}*/}
      {/*  ref={ReminderRef}*/}
      {/*  closeOnDragDown={true}*/}
      {/*  closeOnPressBack={true}*/}
      {/*  animationType={"fade"}*/}
      {/*  onClose={() => setReminderModal(false)}*/}
      {/*  customStyles={{*/}
      {/*    container: {*/}
      {/*      paddingHorizontal: wp(20),*/}
      {/*      borderTopLeftRadius: hp(20),*/}
      {/*      borderTopRightRadius: hp(20),*/}
      {/*    },*/}
      {/*    draggableIcon: {*/}
      {/*      marginTop: wp(30),*/}
      {/*      width: wp(60),*/}
      {/*    },*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <View style={styles.titleWrapper}>*/}
      {/*    <Text style={styles.modalTitle}>*/}
      {/*      {t("GoTrack.dashboard.reminders")}*/}
      {/*    </Text>*/}
      {/*  </View>*/}

      {/*  <View style={styles.VehicleSelectView}>*/}
      {/*    <FlatList*/}
      {/*      data={devicesList}*/}
      {/*      showsVerticalScrollIndicator={false}*/}
      {/*      keyExtractor={(item) => item.id}*/}
      {/*      renderItem={({ item }) => (*/}
      {/*        <TouchableOpacity*/}
      {/*          style={[*/}
      {/*            styles.selectVehicleButton,*/}
      {/*            { borderBottomWidth: 1, borderColor: Colors.LIGHT_GREY },*/}
      {/*          ]}*/}
      {/*          onPress={() => setSelectedDevice(item)}*/}
      {/*        >*/}
      {/*          <Image source={Reminder} style={styles.icon} />*/}
      {/*          <Text style={styles.listValue}>*/}
      {/*            NEXT OIL CHANGE DUE AT 5,000 MILES*/}
      {/*          </Text>*/}
      {/*        </TouchableOpacity>*/}
      {/*      )}*/}
      {/*    />*/}
      {/*  </View>*/}

      {/*  <View style={styles.bottomButton}>*/}
      {/*    <RoundedSquareFullButton*/}
      {/*      title={t("GoTrack.dashboard.close")}*/}
      {/*      onPress={() => setDevicesModal(false)}*/}
      {/*    />*/}
      {/*  </View>*/}
      {/*</RBSheet>*/}

      {/* Diagnosis Modal */}
      {/*<RBSheet*/}
      {/*  height={Utilities.hp(60)}*/}
      {/*  ref={DiagnosisREf}*/}
      {/*  closeOnDragDown={true}*/}
      {/*  closeOnPressBack={true}*/}
      {/*  animationType={"fade"}*/}
      {/*  onClose={() => setDiagnosisModal(false)}*/}
      {/*  customStyles={{*/}
      {/*    container: {*/}
      {/*      paddingHorizontal: wp(20),*/}
      {/*      borderTopLeftRadius: hp(20),*/}
      {/*      borderTopRightRadius: hp(20),*/}
      {/*    },*/}
      {/*    draggableIcon: {*/}
      {/*      marginTop: wp(30),*/}
      {/*      width: wp(60),*/}
      {/*    },*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <View style={styles.titleWrapper}>*/}
      {/*    <Text style={styles.modalTitle}>*/}
      {/*      {t("GoTrack.dashboard.diagnosis")}*/}
      {/*    </Text>*/}
      {/*  </View>*/}

      {/*  <View style={styles.VehicleSelectView}>*/}
      {/*    <FlatList*/}
      {/*      data={devicesList}*/}
      {/*      showsVerticalScrollIndicator={false}*/}
      {/*      keyExtractor={(item) => item.id}*/}
      {/*      renderItem={({ item }) => (*/}
      {/*        <TouchableOpacity*/}
      {/*          style={[*/}
      {/*            styles.selectVehicleButton,*/}
      {/*            { borderBottomWidth: 1, borderColor: Colors.LIGHT_GREY },*/}
      {/*          ]}*/}
      {/*          onPress={() => setSelectedDevice(item)}*/}
      {/*        >*/}
      {/*          <Image source={Diagnosis} style={styles.icon} />*/}
      {/*          <Text style={styles.listValue}>*/}
      {/*            CATALYTIC CONVERTER BELOW THRESHOLD*/}
      {/*          </Text>*/}
      {/*        </TouchableOpacity>*/}
      {/*      )}*/}
      {/*    />*/}
      {/*  </View>*/}

      {/*  <View style={styles.bottomButton}>*/}
      {/*    <RoundedSquareFullButton*/}
      {/*      title={t("GoTrack.dashboard.close")}*/}
      {/*      onPress={() => setDevicesModal(false)}*/}
      {/*    />*/}
      {/*  </View>*/}
      {/*</RBSheet>*/}
      {loaded && <Loader visible={loaded} />}
    </ScrollView>
  );
}

export default GoTrackDashboard;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#B0B3BA19",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(20),
    paddingVertical: wp(20),
  },
  titleView: {},
  EmptyVehiclesList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs18,
    color: Colors.BLACK,
    textAlign: "left",
  },
  titleDescription: {
    textAlign: "left",
    color: Colors.GREY,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs14,
  },
  VehicleStatesContainer: {
    marginHorizontal: wp(10),
    maxWidth: "100%",
  },
  VehicleStatesWrapper: {
    width: "50%",
  },
  vehicleState: {
    backgroundColor: Colors.WHITE,
    padding: wp(20),
    borderRadius: wp(10),
    margin: wp(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stateIcon: {
    width: wp(25),
    height: hp(25),
    marginRight: wp(14),
  },
  vehicleStateDescription: {
    maxWidth: "70%",
  },
  stateName: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs14,
    color: Colors.GREY_TEXT,
    textAlign: "left",
    marginBottom: wp(5),
  },
  stateValue: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs14,
    color: Colors.BLACK,
    textAlign: "left",
    marginRight: wp(5),
  },
  VehicleSelector: {},
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
  selectedVehicleName: {
    textAlign: "left",
    color: Colors.BLACK,
    fontFamily: Fonts.LexendRegular,
    ...FontSize.rfs16,
    marginLeft: wp(20),
  },
  titleWrapper: {
    marginTop: wp(10),
  },
  modalTitle: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs20,
    color: Colors.BLACK,
    textAlign: "left",
  },
  icon: {
    width: wp(24),
    height: wp(24),
  },
  listValue: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs14,
    color: Colors.BLACK,
    textAlign: "left",
    marginLeft: wp(10),
  },
  SpeedMeter: {
    marginBottom: wp(0),
    justifyContent: "center",
    alignItems: "center",
  },
});
