import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

// ** Custom Components
import { showToast } from "../../../utils/common";
import Loader from "../../../Components/Loader";
import Utilities from "../../../utils/UtilityMethods";
import { RoundedSquareFullButton } from "../../../Components";
import MessageWithImage from "../../../Components/MessageWithImage";
import VehicleStatusCard from "../../../Components/VehicleStatusCard";

// ** Custom Theme && Styles
import {
  BlackArrowDown,
  GreenCheckBoxChecked,
  GreyCheckBoxUnchecked,
  NoTopUpCard,
  NoVehicle,
} from "../../../assets";
import Fonts from "../../../Constants/fonts";
import Colors from "../../../Constants/Colors";
import FontSize from "../../../Constants/FontSize";
import { hp, wp } from "../../../utils/responsiveSizes";

// ** Third Party Packages
import { useTranslation } from "react-i18next";
import RBSheet from "react-native-raw-bottom-sheet";
import { useNavigation } from "@react-navigation/native";

// ** Store && Action
import { CommonContext } from "../../../contexts/ContextProvider";
import GetGoTrackDevicesAPI from "../../../api/GetGoTrackDevicesAPI";
import DeviceSubscriptionRenewal from "../../../api/DeviceSubscriptionRenewal";
import Modal from "../components/Modal";
import ShowCards from "../components/ShowCards";
import GetWallet from "../../../api/GetWallet";
import DevicePaymentAPI from "../../../api/DevicePaymentAPI";
import moment from "moment";
import WebView from "react-native-webview";
import { GetProfile } from "../../../api/CallAPI";

const statusList = [
  {
    id: 1,
    status: "All",
  },
  {
    id: 2,
    status: "Active",
  },
  {
    id: 3,
    status: "Expired",
  },
];

function GoTrackStatus() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  // ** Context
  const { userProfile, GoTrack, setUserProfile } = useContext(CommonContext);

  // ** Refs
  const StatusRef = useRef();
  const VehicleRef = useRef();
  const uraWayRef = useRef();
  const walletRef = useRef(null);

  // ** Status
  const [url, setUrl] = useState(null);
  const [wallet, setWallet] = useState([]);
  const [urWayModal, setUrWayModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [cardModal, setCardModal] = useState(false);
  const [devicesData, setDevicesData] = useState([]);
  const [status, setStatus] = useState(statusList[0]);
  const [autoRenewal, setAutoRenewal] = useState(null);
  const [selectedCard, setSelectedCard] = useState({});
  const [statusModal, setStatusModal] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceDetailModal, setDeviceDetailModal] = useState(false);

  const devicesListApi = async () => {
    setLoading(true);
    await GetGoTrackDevicesAPI(userProfile?.id).then(
      ({ success, response, error }) => {
        setLoading(false);
        if (success) {
          setDevicesData(response);
          setDeviceDetailModal(false);
        } else {
          showToast("Error", error, "error");
        }
      }
    );
  };

  const deviceRenewal = async () => {
    setLoading(true);
    await DeviceSubscriptionRenewal({
      id: selectedDevice?.id,
      autoRenewal,
    }).then(({ success, response, error }) => {
      if (success) {
        setLoading(false);
        setDeviceDetailModal(false);
        setTimeout(() => {
          setCardModal(true);
        }, 300);
      } else {
        setCardModal(false);
        setDeviceDetailModal(false);
        showToast("Error", error, "error");
      }
    });
  };
  // ** Get Cards
  const getCustomerCards = async () => {
    setWalletLoading(true);
    await GetWallet(userProfile?.id).then(({ success, response }) => {
      setWalletLoading(false);
      if (success) {
        setWallet(response);
        // devicesListApi().then();
      } else {
        showToast("Error", response, "error");
      }
    });
  };

  const paymentData = useMemo(() => {
    return {
      name: selectedDevice?.name,
      imei_no: selectedDevice?.imei_no,
      sim_no: GoTrack?.device?.sim_no || "",
      tracking_vehicle_id: selectedDevice?.tracking_vehicle_id,
      vehicle_id: selectedDevice?.vehicle_id?.[0] || "",
      vehicle_type_id: selectedDevice?.vehicle_type_id?.[0],
      subscription_plan_id: selectedDevice?.subscription_plan_id?.[0],
      partner_id: userProfile?.id,
      date: moment(selectedDevice?.date).format().split("T")?.[0],
      valid_till: moment()
        .add(
          1,
          selectedDevice?.subscription_plan_id?.[1] === "monthly"
            ? "month"
            : "year"
        )
        .format()
        .split("T")?.[0],
      status: "expired",
      card_id: selectedCard?.id,
    };
  }, [GoTrack, selectedCard, selectedDevice]);

  const AddCustomerDevice = async () => {
    setPending(true);
    await DevicePaymentAPI({ data: paymentData }).then(
      ({ success, response, error }) => {
        setPending(false);
        if (success) {
          // setGoTrack({
          //   install_date: moment(selectedDevice?.date).format().split("T")[0],
          //   expiry_date: moment(selectedDevice?.valid_till)
          //     .add(
          //       1,
          //       selectedDevice?.subscription_plan_id === "monthly"
          //         ? "month"
          //         : "year"
          //     )
          //     .format()
          //     .split("T")[0],
          //   plan: selectedDevice?.subscription_plan_id,
          //   card: selectedCard,
          // });
          setUrl(response?.data);
          setCardModal(false);
          setTimeout(() => {
            setUrWayModal(true);
          }, 300);

          // navigation.navigate("DeviceSuccess");
        } else {
          showToast("Error", response, "error");
        }
      }
    );
  };

  const devicesList = useMemo(() => {
    if (confirmStatus?.status === "Active") {
      return devicesData.filter((item) => item.status === "active");
    } else if (confirmStatus?.status === "Expired") {
      return devicesData.filter((item) => item.status === "expired");
    } else {
      return devicesData;
    }
  }, [devicesData, confirmStatus]);

  // ** Call devices list
  useEffect(() => {
    return navigation.addListener("focus", devicesListApi);
  }, [navigation]);

  //**  RBSheet
  useEffect(() => {
    if (statusModal) {
      StatusRef?.current.open();
    } else {
      StatusRef?.current.close();
    }
  }, [statusModal]);

  useEffect(() => {
    if (deviceDetailModal) {
      VehicleRef?.current.open();
    } else {
      VehicleRef?.current.close();
    }
  }, [deviceDetailModal]);

  useEffect(() => {
    if (urWayModal) {
      uraWayRef?.current.open();
    } else {
      uraWayRef?.current.close();
    }
  }, [urWayModal]);

  const handleStatusPress = useCallback(() => {
    setStatusModal(true);
  }, []);

  // ** Vehicle Details
  const vehicleDetails = useCallback((item) => {
    return [
      {
        id: 1,
        name: "Device Name",
        value: item?.name,
      },
      {
        id: 2,
        name: "IMEI",
        value: item?.imei_no,
      },
      {
        id: 3,
        name: "Associated Vehicle",
        value: item?.name,
      },
      {
        id: 4,
        name: "Vehicle Type",
        value: item?.vehicle_type_id?.[1],
      },
      {
        id: 5,
        name: "Subscription Plan",
        value: item?.subscription_plan_id?.[1],
      },
      {
        id: 6,
        name: "Subscription Period",
        value:
          moment(item?.date).format("MMM DD, YYYY") +
          " " +
          "to" +
          " " +
          moment(item?.valid_till).format("MMM DD, YYYY"),
      },
      {
        id: 7,
        name: "Status",
        value: item?.status,
      },
      {
        id: 8,
        button: t("GoTrack.status.autoRenewal"),
        renew: item?.auto_renew,
      },
    ];
  }, []);

  const fetchAndUpdateLatestProfile = async () => {
    const { id } = userProfile;
    const getProfileResponse = await GetProfile({ profileID: id });
    if (getProfileResponse?.success) {
      setUserProfile(getProfileResponse?.data[0]);
      navigation.navigate("DeviceSuccess");
    } else {
      return navigation.goBack();
    }
  };

  const renderWebViewForUrwayPayment = () => {
    return (
      <WebView
        onShouldStartLoadWithRequest={(request) => true}
        javaScriptEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={["*"]}
        useWebKit
        startInLoadingState
        scalesPageToFit
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error: ", nativeEvent);
        }}
        onNavigationStateChange={(state) => {
          if (state?.url?.includes("ResponseCode=000")) {
            fetchAndUpdateLatestProfile().then();
          } else if (state?.url?.includes("ResponseCode=337")) {
            showToast(
              t("errors.error"),
              t("payment.TransactionLimitExceeded"),
              "error"
            );
          } else if (state?.url?.includes("ResponseCode=001")) {
            showToast("Error", "Pending for Authorisation", "error");
          }
        }}
        source={{
          uri: url.toString(),
        }}
        style={{ marginTop: 20 }}
      />
    );
  };

  // ** Get Vehicle Information
  const handleVehiclePress = useCallback((item) => {
    setDeviceDetailModal(true);
    setSelectedDevice(item);
  }, []);

  return (
    <View style={styles.container}>
      {/* Vehicle Status Filter */}
      <View style={styles.statusSelector}>
        <TouchableOpacity
          onPress={handleStatusPress}
          style={styles.statusDropDown}
        >
          <Text style={styles.statusName}>{status?.status}</Text>
          <BlackArrowDown
            style={{ marginLeft: wp(10) }}
            width={wp(14)}
            height={wp(14)}
          />
        </TouchableOpacity>
      </View>

      {/* Vehicles list */}
      <FlatList
        data={devicesList}
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
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <VehicleStatusCard
              vehicle={item}
              onPress={() => {
                handleVehiclePress(item);
                setAutoRenewal(item?.auto_renew);
              }}
            />
          );
        }}
      />

      {/* Vehicle Status DropDown */}
      <RBSheet
        height={Utilities.hp(60)}
        ref={StatusRef}
        closeOnDragDown={true}
        animationType={"fade"}
        onClose={() => setStatusModal(false)}
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
          onPress={() => setStatusModal(false)}
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

        <View style={styles.statusSelectView}>
          <FlatList
            data={statusList}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.selectStatusButton}
                onPress={() => setStatus(item)}
              >
                {item.status === status.status ? (
                  <GreenCheckBoxChecked width={wp(20)} height={hp(20)} />
                ) : (
                  <GreyCheckBoxUnchecked width={wp(20)} height={hp(20)} />
                )}
                <Text style={styles.selectedStatusName}>{item.status}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.bottomButton}>
          <RoundedSquareFullButton
            title={t("GoTrack.status.apply")}
            onPress={() => {
              setConfirmStatus(status);
              setStatusModal(false);
            }}
          />
        </View>
      </RBSheet>

      {/* Vehicle Detail Modal */}

      <RBSheet
        height={Utilities.hp(65)}
        ref={VehicleRef}
        closeOnDragDown={true}
        animationType={"fade"}
        onClose={() => setDeviceDetailModal(false)}
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
          onPress={() => setDeviceDetailModal(false)}
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

        <View style={styles.statusSelectView}>
          <FlatList
            data={vehicleDetails(selectedDevice)}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.selectVehicleAttribute}>
                <Text style={styles.selectedVehicleName}>{item?.name}</Text>
                <Text style={styles.selectedVehicleValue(item?.value)}>
                  {item?.value}
                </Text>
                {item?.button && (
                  <TouchableOpacity
                    style={styles.selectVehicleAutoButton}
                    onPress={() => setAutoRenewal(!autoRenewal)}
                  >
                    {autoRenewal ? (
                      <GreenCheckBoxChecked width={wp(24)} height={wp(24)} />
                    ) : (
                      <GreyCheckBoxUnchecked width={wp(24)} height={hp(24)} />
                    )}
                    <Text
                      style={[
                        styles.selectedVehicleName,
                        { marginLeft: wp(10) },
                      ]}
                    >
                      {item?.button}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        </View>

        <View style={styles.bottomButton}>
          <RoundedSquareFullButton
            disabled={
              loading || selectedDevice?.status === "active" ? true : false
            }
            loading={loading}
            title={t("GoTrack.status.renew")}
            onPress={() => {
              deviceRenewal().then();
            }}
          />
        </View>
      </RBSheet>
      <Modal
        pending={pending}
        loading={walletLoading}
        reference={walletRef}
        selectModal={cardModal}
        height={Utilities.hp(70)}
        addText={t("GoTrack.addDevice.addNew")}
        confirmDisabled={!selectedCard?.id || pending}
        title={t("GoTrack.addDevice.paymentOptions")}
        apiCall={() => getCustomerCards()}
        confirmTitle={t("GoTrack.addDevice.select_Pay")}
        onClose={() => setCardModal(false)}
        pressAddNew={() => {
          setCardModal(false);
          navigation.navigate("AddCard");
        }}
        confirm={() => {
          AddCustomerDevice().then();
        }}
      >
        <ShowCards
          data={wallet}
          loading={walletLoading}
          selected={selectedCard}
          emptyImage={NoTopUpCard}
          emptyTitle={t("creditcard.nocard")}
          emptyDescription={t("creditcard.account")}
          refreshing={() => getCustomerCards()}
          onItemPress={({ item }) => {
            setSelectedCard((prev) => (prev === item ? null : item));
          }}
        />
      </Modal>

      <RBSheet
        height={Utilities.hp(65)}
        ref={uraWayRef}
        closeOnDragDown={true}
        animationType={"fade"}
        onClose={() => setUrWayModal(false)}
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
        <View
          style={{
            flex: 1,
          }}
        >
          {url && renderWebViewForUrwayPayment()}
        </View>
      </RBSheet>
      <Loader visible={loading} />
    </View>
  );
}

export default GoTrackStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B0B3BA19",
    paddingHorizontal: wp(20),
    paddingTop: wp(20),
  },
  EmptyVehiclesList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statusSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: wp(10),
  },
  statusDropDown: {
    width: wp(124),
    backgroundColor: Colors.WHITE,
    paddingHorizontal: wp(20),
    paddingVertical: wp(10),
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: wp(7),
    elevation: 1,
    shadowColor: Colors.GREY,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  statusName: {
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
  statusSelectView: {
    marginVertical: hp(20),
    flex: 1,
  },
  bottomButton: {
    marginBottom: wp(30),
  },
  selectStatusButton: {
    marginVertical: hp(5),
    paddingVertical: hp(10),
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  selectedStatusName: {
    textAlign: "left",
    color: Colors.BLACK,
    fontFamily: Fonts.LexendRegular,
    ...FontSize.rfs16,
    marginLeft: wp(20),
  },
  selectVehicleAttribute: {
    marginBottom: wp(15),
  },
  selectVehicleAutoButton: {
    flexDirection: "row",
  },
  selectedVehicleName: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs16,
    color: Colors.BLACK,
    textAlign: "left",
  },
  selectedVehicleValue: (status) => {
    return {
      fontFamily: Fonts.LexendMedium,
      ...FontSize.rfs14,
      color:
        status?.toLowerCase() === "active"
          ? Colors.GREEN
          : status?.toLowerCase() === "expired"
          ? Colors.RED
          : Colors.GREY_TEXT,
      textAlign: "left",
    };
  },
});
