import React, { useContext, useEffect, useRef, useState } from "react";

// ** Third Party Packages
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// ** Custom Components
import Colors from "../../../../Constants/Colors";
import TrackingHeader from "../../../../Components/Header/TrackingHeader";
import MapView from "react-native-maps";
import {
  ArrowArabic,
  CloseBlack,
  GreenWhiteCurrentLocation,
  MyPin,
  RedArrow,
  Watch,
  barCode,
} from "../../../../assets";
import Geolocation from "@react-native-community/geolocation";
import MapStyle from "../../../../Constants/MapStyle";
import { hp, wp } from "../../../../utils/responsiveSizes";
import { CommonContext } from "../../../../contexts/ContextProvider";
import FontSize from "../../../../Constants/FontSize";
import FontFamily from "../../../../Constants/FontFamily";
import TrackingFooterComponent from "../components/TrackingFooter";
import RBSheetModal from "../../../../Components/Modal";
import Utilities from "../../../../utils/UtilityMethods";
import fonts from "../../../../Constants/fonts";
import Lottie from "lottie-react-native";

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

function TrackServiceStatus() {
  const mapRef = useRef();
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { setCurrentLocation } = useContext(CommonContext);

  const isRTL = i18n.language === "ar";

  // ** States
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const [modal, setModal] = useState(false);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (location) => {
        setCurrentCoordinates({
          latitude: parseFloat(location?.coords.latitude),
          longitude: parseFloat(location?.coords.longitude),
        });
        setCurrentLocation({
          latitude: parseFloat(location?.coords.latitude),
          longitude: parseFloat(location?.coords.longitude),
        });
      },
      (error) => {
        setCurrentCoordinates({ latitude: 24.7136, longitude: 46.6753 });
        setCurrentLocation({ latitude: 24.7136, longitude: 46.6753 });
        showAlert(error.message);
      }
    );
  };

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

  const handleViewSwitch = () => {
    getCurrentLocation();
  };

  useEffect(() => {
    return navigation.addListener("focus", handleViewSwitch);
  }, [navigation]);

  const onPressCurrentLocationButton = () => {
    mapRef?.current?.animateToRegion({
      latitude: currentCoordinates.latitude,
      longitude: currentCoordinates.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        {currentCoordinates && (
          <>
            <MapView
              ref={mapRef}
              initialRegion={{
                latitude: currentCoordinates?.latitude,
                longitude: currentCoordinates?.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              style={styles.map}
              userInterfaceStyle={"dark"}
              userLocationPriority="high"
              customMapStyle={MapStyle}
            ></MapView>

            {showCurrentLocationMarker()}
            <TrackingHeader
              bg={modal ? Colors.DARKERGREEN : Colors.ORANGE}
              title={
                modal
                  ? "Your service provider is en route"
                  : t("tracking.orderPending")
              }
              onClose={() => navigation.navigate("MyGorexOnDemandRequests")}
            />

            {!!modal && (
              <View
                style={{
                  backgroundColor: "white",
                  width: "90%",
                  height: "6.4%",
                  alignSelf: "center",
                  marginTop: 30,
                  borderRadius: 8,
                  flexDirection: "row",
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: "15%",
                    // height: "10%",
                    backgroundColor: "#4AD594",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={Watch}
                    style={{
                      height: 25,
                      width: 25,
                    }}
                    resizeMode={"contain"}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      color: "black",
                      fontFamily: fonts.LexendRegular,
                      fontSize: 13,
                      marginHorizontal: 10,
                      marginTop: 9,
                      textAlign: "center",
                      textAlignVertical: "center",
                    }}
                  >
                    Estimated time
                  </Text>
                  <Text
                    style={{
                      color: "black",
                      fontFamily: fonts.LexendBold,
                      fontSize: 16,
                      marginHorizontal: 11,
                      textAlignVertical: "center",
                    }}
                  >
                    5:09
                  </Text>
                </View>
              </View>
            )}
          </>
        )}

        <View style={styles.trackingFooterWrapper}>
          <TrackingFooterComponent
            rating={"4.4"}
            distance={"0.3"}
            date={"1st Apr, 2023"}
            timeSlots={"09:00 - 10:00"}
            serviceName={"Car Wash Services . Waterless Car Wash"}
            title={t("tracking.YourServiceProvider")}
            serviceProvider={"Elite Auto Service"}
            onPressMessage={() => {
              navigation.navigate("ExtraService");
            }}
            onPressCall={() => {
              setModal(true);
            }}
          />
        </View>

        <TouchableOpacity
          style={[styles.content]}
          onPress={onPressCurrentLocationButton}
        >
          <GreenWhiteCurrentLocation width={wp(60)} height={wp(60)} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        // disabled={disabled}
        // onPress={onPress}
        style={styles.footerButtonContainer(Colors.RED)}
      >
        <Text style={[styles.title]}>{t("tracking.cancelService")}</Text>
        <Image style={styles.icon} source={isRTL ? ArrowArabic : RedArrow} />
      </TouchableOpacity>
      {modal && (
        <RBSheetModal
          height={60}
          open={modal}
          onClose={() => setModal(false)}
          backgroundColor={"transparent"}
        >
          <View style={styles.modalContainer}>
            <View style={styles.draggableContainer} />
            <View style={styles.modalView}>
              <TouchableOpacity onPress={() => setModal(false)}>
                <Image source={CloseBlack} style={styles.close} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalHeaderContainer}>
              <ActivityIndicator size={"large"} />
              {/* <Lottie
              ref={animationRef}
              source={movingarrows}
              autoPlay
              loop
              resizeMode="contain"
              style={[
                styles.lottieStyle,
                {
                  transform: isRTL
                    ? [{ rotate: "270deg" }]
                    : [{ rotate: "0deg" }],
                  marginBottom: isRTL ? -15 : -15,
                },
              ]}
            /> */}
              <Text style={styles.headerTextStyle}>
                Your service provider is here{"\n"}and ready to start.
              </Text>
            </View>
          </View>
          <View style={styles.footerContainer}>
            <View style={styles.modalFooterContent}>
              <Image
                source={barCode}
                resizeMode={"contain"}
                style={styles.qrCodeImage}
              />
            </View>
            <Text style={styles.footerTextStyle}>
              Please present this code to the service{"\n"}provider to confirm
              your service and{"\n"}start the process.
            </Text>
          </View>
        </RBSheetModal>
      )}
    </View>
  );
}

export default TrackServiceStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footerButtonContainer: (bg) => {
    const updatedColor = bg.replace("rgba", "rgba");
    const updatedOpacity = 0.15; // Replace with the desired opacity value (between 0 and 1)
    const updatedColorWithOpacity = updatedColor.replace(
      /\d+(?:\.\d+)?(?=%?\))/,
      String(updatedOpacity)
    );

    return {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: updatedColorWithOpacity,
      paddingTop: hp(17),
      paddingBottom: hp(48),
      paddingHorizontal: wp(20),
    };
  },
  title: {
    ...FontSize.rfs22,
    ...FontFamily.medium,
    color: Colors.RED,
  },
  icon: {
    width: hp(14),
    height: hp(18),
    resizeMode: "contain",
  },
  trackingFooterWrapper: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
  },
  header: {
    zIndex: 10,
  },
  content: {
    position: "absolute",
    bottom: hp(250),
    right: wp(20),
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  mapWrapper: {
    flex: 1,
    // justifyContent: "space-between",
  },
  modalView: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: Utilities.wp(8),
    // marginTop: Utilities.wp(2),
  },
  close: {
    width: Utilities.wp(6),
    height: Utilities.wp(6),
    marginLeft: "100%",
  },
  modalContainer: {
    // backgroundColor: "#4AD594",
    width: "100%",
  },
  draggableContainer: {
    backgroundColor: "#0000001A",
    width: 63,
    height: 6,
    alignSelf: "center",
    marginTop: Utilities.wp(5),
  },
  modalHeaderContainer: {
    flexDirection: "row",
    marginVertical: 30,
    marginHorizontal: 25,
  },
  headerTextStyle: {
    fontFamily: fonts.LexendMedium,
    fontSize: 22,
    color: "white",
    // textAlign: "center",
    marginHorizontal: 15,
  },
  footerContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalFooterContent: {
    width: "40%",
    height: "48%",
    padding: 3,
    borderRadius: 8,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 10,
    elevation: 10,
  },
  qrCodeImage: {
    height: 270,
    width: 270,
  },
  footerTextStyle: {
    textAlign: "center",
    marginTop: 25,
    fontFamily: fonts.LexendMedium,
    fontSize: 18,
  },
});
