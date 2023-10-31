import React, {
  useRef,
  useState,
  Fragment,
  useEffect,
  useContext,
} from "react";
import {
  Text,
  View,
  Alert,
  Image,
  Linking,
  FlatList,
  Platform,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

// ** Map Components
import MapView from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";

// ** i18n Hook
import { useTranslation } from "react-i18next";

// ** Third Party Packages
import QRCode from "react-native-qrcode-svg";
import RBSheet from "react-native-raw-bottom-sheet";
import LinearGradient from "react-native-linear-gradient";

// ** Utils
import {
  showToast,
  getProfileUpdate,
  setProfileUpdate,
} from "../../utils/common";
import Utilities from "../../utils/UtilityMethods";

import {
  Close,
  MyPin,
  WhiteQR,
  QRWhite,
  discount,
  GorexCoin,
  CloseBlack,
  NavigateIcon,
  offerFestivalBanner,
  GreenWhiteCurrentLocation,
} from "../../assets";

// ** Custom Components
import Loader from "../../Components/Loader";
import BottomBar from "./components/BottomBar";
import MapStyle from "../../Constants/MapStyle";
import { wp } from "../../utils/responsiveSizes";
import RBSheetModal from "../../Components/Modal";
import HomeHeader from "../../Components/Header/HomeHeader";
import ProfileModel from "../../Components/Modal/ProfileModel";

// ** Custom Theme and Styling
import { styles } from "./DashBoardStyles";
import Colors from "../../Constants/Colors";

// ** Analytics
import analytics from "@react-native-firebase/analytics";
import { AppEventsLogger } from "react-native-fbsdk-next";

// ** Store && Actions
import GetOffers from "../../api/GetOffers";
import NearByBranches from "../../api/NearbyBranches";
import GetBranchDetails from "../../api/GetBranchDetails";
import { CommonContext } from "../../contexts/ContextProvider";
import GetServiceCategories from "../../api/GetServiceCategories";

const Dashboard = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  // ** Store
  const { userProfile, setOnDemandOrder, setCurrentLocation } =
    useContext(CommonContext);

  // States
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allBranches, setAllBranches] = useState([]);
  const [offers, setOffers] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [branchService, setBranchService] = useState([]);
  const [QRSheetOpen, setQRSheetOpen] = useState(false);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isShowProfileAlert, setIsShowProfileAlert] = useState(false);
  const [branchDetailsPending, setBranchDetailsPending] = useState(false);

  const mapRef = useRef();
  let bottomSheetRef = React.createRef();

  useEffect(() => {
    if (isBottomSheetOpen) {
      bottomSheetRef.current?.open();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isBottomSheetOpen]);

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "dashboard_screen",
    });
    analytics().setAnalyticsCollectionEnabled(true);
    setOnDemandOrder({});

    AppEventsLogger.logEvent("page_view", {
      screen_name: "dashboard_screen",
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      GetOffers().then(({ success, response }) => {
        setLoading(false);
        if (success) {
          const data = response.filter((item) => item.is_consumable === true);
          setOffers(data);
        } else {
          showToast("Error", response, "error");
        }
      });
    }, 2000);
  }, [navigation]);

  useEffect(() => {
    return navigation.addListener("focus", handleViewSwitch);
  }, [navigation]);

  const handleViewSwitch = async () => {
    let isProfileUpdate = await getProfileUpdate();
    if (!isProfileUpdate && !userProfile?.profile_completed) {
      setIsShowProfileAlert(true);
    } else {
      setIsShowProfileAlert(false);
    }

    await getCurrentLocation();
    await getAllServiceCategories();
  };

  useEffect(() => {
    checkNearByServiceProvidersForRegion();
  }, [currentCoordinates]);

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

  const getAllServiceCategories = () => {
    setLoading(true);
    GetServiceCategories().then(({ success, response }) => {
      if (success) {
        setServiceCategories([
          { id: "GoD", name: t("common.gorexOnDemand") },
          ...response,
        ]);
        // setServiceCategories([{id : "GoD", name: t("common.gorexOnDemand")}]);
        // getAllBranches().then();
        checkNearByServiceProvidersForRegion();
      } else {
        setLoading(false);
        showToast("Error", response, "error");
      }
    });
  };

  const checkNearByServiceProvidersForRegion = () => {
    NearByBranches({ region: currentCoordinates, userId: userProfile.id }).then(
      (response) => {
        if (response.success) {
          setAllBranches(response.response);
        }
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    );
  };

  React.useEffect(() => {
    filterBranchesWith();
  }, [allBranches]);

  const filterBranchesWith = (id = null) => {
    let branches = [...allBranches];
    if (id) {
      let localBranches = [];
      allBranches.map((branch) => {
        if (branch.services.indexOf(id) !== -1) {
          localBranches.push(branch);
        }
      });
      branches = localBranches;
      setFilteredBranches(branches);
    } else {
      setFilteredBranches(allBranches);
    }
    setLoading(false);
  };

  const onPressCurrentLocationButton = () => {
    mapRef?.current?.animateToRegion({
      latitude: currentCoordinates.latitude,
      longitude: currentCoordinates.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setActiveService(null);
    setReload(!reload);
  };

  const onPressProfileAlert_CompleteInfo = () => {
    onPressProfileAlert_Cancel();
    navigation.navigate("ProfileUpdate");
  };

  const onPressProfileAlert_Cancel = () => {
    setProfileUpdate(true).then();
    setIsShowProfileAlert(false);
  };

  const onPressBranch = (branch) => {
    setIsBottomSheetOpen(true);
    setBranchDetailsPending(true);
    GetBranchDetails(branch?.id).then(({ success, response }) => {
      setBranchDetailsPending(false);
      if (success) {
        setBranchService(response?.data);
      } else {
        setBranchService([]);
        showToast("Error", response, "error");
      }
    });
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

  const MapPinModal = () => {
    return (
      <>
        <RBSheet
          ref={bottomSheetRef}
          height={Utilities.hp(35)}
          openDuration={250}
          animationType={"fade"}
          closeOnDragDown={false}
          onClose={() => setIsBottomSheetOpen(false)}
          closeOnPressMask={true}
          customStyles={{
            container: {
              backgroundColor: "transparent",
              border: 0,
              borderTopWidth: 0,
            },
            draggableIcon: {},
          }}
        >
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetHeader}>
              <View style={styles.bottomSheetHeaderLeft}>
                <Text style={styles.bottomSheetHeaderLeftText}>
                  {branchDetailsPending ? null : branchService?.name}
                </Text>
              </View>
              <View>
                <TouchableOpacity onPress={() => setIsBottomSheetOpen(false)}>
                  <Image
                    source={CloseBlack}
                    style={styles.bottomSheetHeaderRightIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {branchDetailsPending ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size={"large"} color={Colors.BLUE} />
              </View>
            ) : (
              <Fragment>
                <FlatList
                  data={branchService?.services}
                  keyExtractor={(item) => item?.id}
                  style={styles.servicesScrollView}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    flexGrow: 1,
                  }}
                  ListEmptyComponent={
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={styles.noDataText}>No data found!</Text>
                    </View>
                  }
                  renderItem={({ item }) => {
                    return (
                      <View style={styles.servicesContainer}>
                        <Image
                          source={{
                            uri: `data:image/gif;base64,${item?.image}`,
                          }}
                          style={styles.serviceIcon}
                        />
                        <Text style={styles.serviceText}>{item?.name}</Text>
                      </View>
                    );
                  }}
                />
                {/*Bottom Button*/}
                {branchService?.latitude && (
                  <View style={styles.bottomSheetBottomButton}>
                    <TouchableOpacity
                      style={[
                        styles.bottomSheetButtonTouchable,
                        { flex: 0.65 },
                      ]}
                      disabled={branchDetailsPending}
                      onPress={() => {
                        const lat = branchService?.latitude;
                        const lng = branchService?.longitude;

                        const scheme = Platform.select({
                          ios: "maps://0,0?q=",
                          android: "geo:0,0?q=",
                        });
                        const latLng = `${lat},${lng}`;
                        const label = branchService?.name;
                        const url = Platform.select({
                          ios: `${scheme}${label}@${latLng}`,
                          android: `${scheme}${latLng}(${label})`,
                        });

                        Linking.openURL(url);
                      }}
                    >
                      <NavigateIcon
                        style={styles.bottomSheetButtonIcon}
                        width={wp(24)}
                        height={wp(24)}
                      />
                      <Text style={styles.bottomSheetButtonText}>
                        {t("common.navigation")}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.bottomSheetButtonTouchable,
                        { flex: 0.35 },
                      ]}
                      disabled={branchDetailsPending}
                      onPress={() => {
                        setIsBottomSheetOpen(false);
                        setTimeout(() => {
                          setQRSheetOpen(true);
                        }, 300);
                      }}
                    >
                      <QRWhite
                        style={styles.bottomSheetButtonIcon}
                        width={wp(24)}
                        height={wp(24)}
                      />
                      <Text style={styles.bottomSheetButtonText}>
                        {t("common.QR")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Fragment>
            )}
          </View>
        </RBSheet>
      </>
    );
  };

  const QRCodeModal = () => {
    return (
      <RBSheetModal
        height={`80%`}
        open={QRSheetOpen}
        backgroundColor={"#17151FB3"}
        onClose={() => setQRSheetOpen(false)}
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
            onPress={() => setQRSheetOpen(false)}
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
          style={styles.GradientStyles}
        >
          <View style={styles.gradientContainer}>
            <QRCode
              size={160}
              value={JSON.stringify({
                profile_id: userProfile?.id,
                profile: true,
              })}
            />
          </View>
          <Text style={styles.scannedServiceProvider}>
            {t("gorexclub.scannedServiceProvider")}
          </Text>
          <View style={styles.imageContainer}>
            <View style={styles.imageWrapper}>
              <Image
                source={discount}
                resizeMode={"contain"}
                style={{
                  width: 25,
                  height: 25,
                }}
              />
              <Text style={styles.getDiscount}>
                {t("gorexclub.GetDiscount")}
              </Text>
            </View>
            <View
              style={{
                width: "13%",
              }}
            />
            <View style={styles.gorexCoin}>
              <Image
                source={GorexCoin}
                resizeMode={"contain"}
                style={{
                  width: 25,
                  height: 25,
                }}
              />
              <Text style={styles.earnCoin}>{t("gorexclub.EarnGoCoins")}</Text>
            </View>
          </View>
        </LinearGradient>
      </RBSheetModal>
    );
  };

  const navigateToGoD = () => {
    navigation.navigate("GoDChooseVehicle", { check: false });
  };

  const showCurrentLocationMarker = () => {
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

  const showBranchLocationMarker = (value, index) => {
    return (
      <MapView.Marker
        key={index}
        coordinate={{
          latitude: parseFloat(Number(value?.lat)),
          longitude: parseFloat(Number(value?.long)),
        }}
        onPress={() => {
          onPressBranch(value);
        }}
      >
        <View style={styles.circle}>
          <View
            style={{
              backgroundColor: Colors.DARKERGREEN,
              borderRadius: wp(20),
              paddingHorizontal: wp(17),
              paddingVertical: wp(8.5),
            }}
          >
            <Text style={styles.branchSize}>{value?.name}</Text>
          </View>
          <View style={styles.triangle} />
        </View>
      </MapView.Marker>
    );
  };

  return (
    <View style={styles.container}>
      {currentCoordinates && (
        <MapView
          ref={mapRef}
          locale={isRTL ? "ar" : "en"}
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
        >
          {showCurrentLocationMarker()}
          {filteredBranches?.map((value, index) =>
            showBranchLocationMarker(value, index)
          )}
        </MapView>
      )}

      <HomeHeader onPress={() => navigation.openDrawer()} />
      {MapPinModal()}
      {QRCodeModal()}

      {offers.length > 0 && (
        <ScrollView
          horizontal={true}
          style={styles.offers}
          contentContainerStyle={{
            alignItems: Platform.OS == "android" ? "flex-start" : "flex-end",
            flexGrow: 1,
          }}
        >
          {offers.map((item, index) => (
            <View key={index} style={styles.offersWrapper}>
              <ImageBackground
                source={offerFestivalBanner}
                style={[
                  styles.offersComponent,
                  {
                    transform: [{ scaleX: isRTL ? -1 : 1 }],
                  },
                ]}
                resizeMode={"cover"}
              >
                <View
                  style={[
                    styles.offersDetails,
                    { transform: [{ scaleX: isRTL ? -1 : 1 }] },
                  ]}
                >
                  <Text style={styles.offerName}>
                    {item?.name.length > 20
                      ? `${item.name.substring(0, 20)}...`
                      : `${item.name}`}
                  </Text>
                  <TouchableOpacity
                    style={styles.offersButton}
                    onPress={() =>
                      navigation.navigate("OfferRedeem", {
                        banner: item?.image,
                        title: item?.name,
                        companyCode: true,
                      })
                    }
                  >
                    <Text style={styles.offersButtonText}>
                      {t("offers.letsGo")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>
      )}

      {/*Current Location Button*/}
      <TouchableOpacity
        style={[styles.content]}
        onPress={onPressCurrentLocationButton}
      >
        <GreenWhiteCurrentLocation width={wp(60)} height={wp(60)} />
      </TouchableOpacity>

      {
        !loading &&
          (serviceCategories.length > 0 ? (
            <BottomBar
              mapRef={mapRef}
              resetFilter={reload}
              setResetFilter={setReload}
              navigateToGoD={navigateToGoD}
              serviceCategories={serviceCategories}
              filterChanged={(id) => {
                filterBranchesWith(id);
              }}
            />
          ) : null)
        // <BottomBarOutRange resetFilter={reload} />
      }

      <ProfileModel
        isShow={isShowProfileAlert}
        onPressCancel={onPressProfileAlert_Cancel}
        onPressButton={onPressProfileAlert_CompleteInfo}
      />

      {loading && <Loader visible={true} />}
    </View>
  );
};

export default Dashboard;
