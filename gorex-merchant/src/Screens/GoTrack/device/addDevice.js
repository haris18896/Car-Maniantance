import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Linking,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
  Platform,
} from "react-native";

// ** Custom Theme && Styling
import Fonts from "../../../Constants/fonts";
import Colors from "../../../Constants/Colors";
import FontSize from "../../../Constants/FontSize";
import { hp, wp } from "../../../utils/responsiveSizes";
import { CartGreen, Cross, IMEIBarcode } from "../../../assets";

// ** Custom Components
import ModalComponent from "../components/Modal";
import { showToast } from "../../../utils/common";
import ShowVehicles from "../components/ShowVehicles";
import Utilities from "../../../utils/UtilityMethods";
import ShowVehicleTypes from "../components/showVehicleTypes";
import InputField from "../../../Components/Inputs/inputField";
import BackHeader from "../../../Components/Header/BackHeader";
import Footer from "../../ProductsAndServices/components/Footer";
import SelectorField from "../../../Components/Inputs/SelectorField";
import obdConnectionLottie from "../../../assets/lottie/lottieConnectionOBD.json";

// ** Third Party Packages
import Modal from "react-native-modal";
import LottieView from "lottie-react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

// ** Store && Actions
import { CommonContext } from "../../../contexts/ContextProvider";
import GetGoTrackVehicles from "../../../api/GetGoTrackVehicles";
import GetVehicleVariantTypes from "../../../api/GetVehicleVariantTypes";
import DeviceConnectionAPI from "../../../api/DeviceConnectionAPI";
import AssetCreationAPI from "../../../api/AssetCreationAPI";
import queryString from "query-string";
import axios from "axios";
import { encode as base64Encode } from "base-64";
import { RNCamera } from "react-native-camera";
import fonts from "../../../Constants/fonts";

function AddDevice() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  // ** Context
  const { userProfile, setGoTrack } = useContext(CommonContext);

  // ** Refs
  const cameraRef = useRef();
  const lottieRef = useRef(null);
  const VehicleTypeRef = useRef();
  const VehicleModalRef = useRef();

  // ** States
  const [imei, setImei] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isOpenCamera, setIsOpenCamera] = useState(false);
  const [vehicleConfirm, setVehicleConfirm] = useState({});
  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [vehicleTypeConfirm, setVehicleTypeConfirm] = useState({});
  const [selectedVehicleType, setSelectedVehicleType] = useState({});
  const [selectVehicleType, setSelectVehicleType] = useState(false);
  const [selectVehicleModal, setSelectVehicleModal] = useState(false);

  const assetCreationBody = useMemo(() => {
    return {
      imei_no: imei,
      username: "gorex",
      password: "abcd1234$!",
      driver_phone: userProfile?.phone,
      driver_email: userProfile?.email,
      plate_number: vehicleConfirm?.name,
      vehicle_type_name: vehicleTypeConfirm?.name,
      vehicle_year_name: vehicleConfirm?.year_id?.[1],
      vehicle_manufacturer_name: vehicleConfirm?.manufacturer?.[1],
      driver_name: `${userProfile?.first_name} ${userProfile?.last_name}`,
    };
  }, [imei, vehicleConfirm, vehicleTypeConfirm]);

  // ** Get Vehicles List
  const getVehicles = async () => {
    setLoading(true);
    await GetGoTrackVehicles(userProfile?.id).then(({ success, response }) => {
      setLoading(false);
      if (success) {
        setVehicles(response);
      } else {
        showToast("Error", response, "error");
      }
    });
  };

  // ** Get Vehicle Types
  const getVehicleTypes = async () => {
    setLoading(true);
    await GetVehicleVariantTypes().then(({ success, response }) => {
      setLoading(false);
      if (success) {
        setVehicleTypes(response);
      } else {
        showToast("Error", response, "error");
      }
    });
  };

  // const connect = async () => {
  //   setLoading(true);
  //   const connectDevice = new FormData();
  //   connectDevice.append("username", "ahmad@yopmail.com");
  //   connectDevice.append("password", "admin");
  //   connectDevice.append("imei_no", imei);

  //   let assetCreate = new FormData();
  //   assetCreate.append("imei_no", imei);
  //   assetCreate.append("username", username);
  //   assetCreate.append("password", password);
  //   assetCreate.append("driver_phone", userProfile?.phone);
  //   assetCreate.append("driver_email", userProfile?.email);
  //   assetCreate.append("plate_number", vehicleConfirm?.name);
  //   assetCreate.append("vehicle_type_name", vehicleTypeConfirm?.name);
  //   assetCreate.append("vehicle_year_name", vehicleConfirm?.year_id?.[1]);
  //   assetCreate.append(
  //     "vehicle_manufacturer_name",
  //     vehicleConfirm?.manufacturer?.[1]
  //   );
  //   assetCreate.append(
  //     "driver_name",
  //     `${userProfile?.first_name} ${userProfile?.last_name}`
  //   );

  //   await DeviceConnectionAPI(formData).then(({ success, error }) => {
  //     setIsConnected(false);
  //     console.log("Device connection");
  //     AssetCreationAPI(assetCreate).then(({ success, response, error }) => {
  //       console.log("Asset creation");
  //       setIsConnected(false);
  //       if (success) {
  //       setGoTrack({
  //         device: {
  //           imei_no: imei,
  //           username: "gorex",
  //           password: "abcd1234$!",
  //           device_name: deviceName,
  //           vehicle: vehicleConfirm,
  //           asset: response,
  //           vehicle_type: {
  //             id: vehicleTypeConfirm?.id,
  //             name: vehicleTypeConfirm?.name,
  //           },
  //         },
  //       });
  //       navigation.navigate("Subscription");
  //       } else {
  //         setIsConnected(false);
  //         showToast("Error", error, "error");
  //       }
  //     });
  //   });
  // };

  const connect = async () => {
    setLoading(true);
    const username = "ahmad@yopmail.com";
    const password = "admin";

    const basicAuthHeader = "Basic " + base64Encode(`${username}:${password}`);

    const formData = queryString.stringify({
      email: username,
      password: password,
    });

    setIsConnected(true);

    try {
      // Send the first request to create a session
      const sessionConfig = {
        method: "post",
        url: "http://144.24.209.247:9090/api/session",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: formData,
      };

      const sessionResponse = await axios.request(sessionConfig);

      if (sessionResponse.status === 200) {
        let assetCreate = {
          id: parseInt(imei, 10),
          name: deviceName,
          uniqueId: imei,
          status: "online",
          disabled: false,
          lastUpdate: new Date(),
          positionId: 0,
          groupId: 0,
          phone: userProfile?.phone,
          model: "",
          contact: userProfile?.phone,
          category: "",
          attributes: {},
        };
        // Send the second request to create a device
        const deviceConfig = {
          method: "post",
          url: "http://144.24.209.247:9090/api/devices",
          headers: {
            Authorization: basicAuthHeader,
            "Content-Type": "application/json",
          },
          data: assetCreate,
        };

        const deviceResponse = await axios.request(deviceConfig);

        if (deviceResponse.status === 200) {
          setIsConnected(false);
          setGoTrack({
            device: {
              imei_no: imei,
              username: username,
              password: password,
              device_name: deviceName,
              vehicle: vehicleConfirm,
              asset: deviceResponse.data,
              vehicle_type: {
                id: vehicleTypeConfirm?.id,
                name: vehicleTypeConfirm?.name,
              },
            },
          });
          navigation.navigate("Subscription");
        } else {
          setIsConnected(false);
          showToast("Error", "Couldn't create device", "error");
        }
      } else {
        setIsConnected(false);
        showToast("Error", "Couldn't create session", "error");
      }
    } catch (error) {
      setIsConnected(false);
      console.error("Request failed with error:", error.response?.data);
      showToast("Error", error.response?.data, "error");
    }
  };

  const barcodeScanned = async (barcode) => {
    setLoading(true);
    const barcodeData = JSON.parse(barcode?.data);
    if (barcodeData) {
      setLoading(false);
      setIsOpenCamera(false);
      setImei(barcodeData?.toString());
    } else {
      setLoading(false);
      setIsOpenCamera(false);
    }
  };
  return (
    <View style={styles.container}>
      <BackHeader
        title={t("GoTrack.addDevice.addDevice")}
        rightIcon={CartGreen}
        leftPress={() => navigation.navigate("GoTrackDashboard")}
        // RightPress={() => navigation.navigate("ProductsList")}
        RightPress={() =>
          navigation.navigate("VehiclesServices", { product_flow: true })
        }
      />

      <ScrollView style={styles.addDeviceWrapper}>
        <View style={styles.Heading}>
          <Text style={styles.title}>{t("GoTrack.addDevice.addDevice")}</Text>
          <Text style={styles.description}>
            {t("GoTrack.addDevice.addDeviceDescription")}
          </Text>
        </View>

        {/* device name input */}
        <InputField
          label={t("GoTrack.addDevice.deviceName")}
          placeholder={t("GoTrack.addDevice.enterDeviceName")}
          value={deviceName}
          placeholderColor={Colors.BLACK}
          onChangeText={setDeviceName}
          selectionColor={Colors.DARKERGREEN}
        />

        {/* IMEI input */}
        <InputField
          label={t("GoTrack.addDevice.imeiNumber")}
          placeholder={t("GoTrack.addDevice.enterImei")}
          value={imei || ""}
          placeholderColor={Colors.BLACK}
          onChangeText={(text) => setImei(text)}
          img={IMEIBarcode}
          selectionColor={Colors.DARKERGREEN}
          onPressBarCode={() => {
            setIsOpenCamera(true);
          }}
        />

        {/* Assign Vehicle */}
        <SelectorField
          title={t("GoTrack.addDevice.assignVehicle")}
          placeholder={t("GoTrack.addDevice.selectNewCar")}
          onPress={() => setSelectVehicleModal(true)}
          value={
            vehicleConfirm?.manufacturer
              ? vehicleConfirm?.manufacturer[1]
              : false
          }
        />

        {/* Vehicle Type */}
        <SelectorField
          title={t("GoTrack.addDevice.vehicleType")}
          placeholder={t("GoTrack.addDevice.selectType")}
          onPress={() => setSelectVehicleType(true)}
          value={vehicleTypeConfirm?.name ? vehicleTypeConfirm?.name : false}
        />
      </ScrollView>

      {/* Select Vehicle */}
      <ModalComponent
        loading={loading}
        reference={VehicleModalRef}
        selectModal={selectVehicleModal}
        height={Utilities.hp(50)}
        apiCall={() => getVehicles()}
        addText={t("GoTrack.addDevice.addNew")}
        title={t("GoTrack.addDevice.chooseVehicle")}
        confirmTitle={t("GoTrack.addDevice.select_confirm")}
        onClose={() => setSelectVehicleModal(false)}
        confirmDisabled={!selectedVehicle?.id}
        pressAddNew={() => {
          setSelectVehicleModal(false);
          navigation.navigate("VehicleInformation", {
            isComingFromGoTrack: true,
          });
        }}
        confirm={() => {
          setSelectVehicleModal(false);
          setVehicleConfirm(selectedVehicle);
          setTimeout(() => {
            setSelectVehicleType(true);
          }, 300);
        }}
      >
        <ShowVehicles
          data={vehicles}
          loading={loading}
          selected={selectedVehicle}
          refreshing={() => getVehicles()}
          noVehicleTitle={t("gorexOnDemand.noVehicleAdded")}
          noVehicleDescriptio={t("gorexOnDemand.noVehicleDescription")}
          onItemPress={({ item }) =>
            setSelectedVehicle((prev) => (prev === item ? null : item))
          }
        />
      </ModalComponent>

      {/* Select Vehicle Type */}
      <ModalComponent
        loading={loading}
        reference={VehicleTypeRef}
        selectModal={selectVehicleType}
        height={Utilities.hp(80)}
        apiCall={() => getVehicleTypes()}
        title={t("GoTrack.addDevice.chooseVehicleType")}
        confirmTitle={t("GoTrack.addDevice.select_confirm")}
        onClose={() => setSelectVehicleType(false)}
        confirmDisabled={!selectedVehicleType?.id}
        confirm={() => {
          setSelectVehicleType(false);
          setVehicleTypeConfirm(selectedVehicleType);
        }}
        pressAddNew={() =>
          navigation.navigate("VehicleInformation", {
            isComingFromGoTrack: true,
          })
        }
      >
        <ShowVehicleTypes
          data={vehicleTypes}
          loading={loading}
          selected={selectedVehicleType}
          refreshing={() => getVehicleTypes()}
          noVehicleTitle={t("GoTrack.addDevice.noVehicleTypesAdded")}
          noVehicleDescription={t("GoTrack.addDevice.noVehicleTypeDescription")}
          onItemPress={({ item }) => {
            setSelectedVehicleType((prev) => (prev === item ? null : item));
          }}
        />
      </ModalComponent>

      <Footer
        onPress={() => setIsConnected(true)}
        title={t("GoTrack.addDevice.connect")}
        disabled={
          vehicleTypeConfirm?.id &&
          vehicleConfirm?.id &&
          imei &&
          deviceName &&
          userProfile?.id
            ? false
            : true
        }
      />

      <Modal
        isVisible={isConnected}
        style={styles.modalContainer}
        onModalShow={() => connect().then()}
        onBackButtonPress={() => setIsConnected(false)}
      >
        <LottieView
          ref={lottieRef}
          source={obdConnectionLottie}
          autoPlay
          loop
          resizeMode={"contain"}
          style={styles.lottie}
        />

        <Text style={styles.connectionText}>
          {t("GoTrack.addDevice.connectingOBD")}
        </Text>
      </Modal>
      <Modal
        isVisible={isOpenCamera}
        style={styles.modalContainer2}
        onModalShow={() => barcodeScanned().then()}
        onBackButtonPress={() => setIsOpenCamera(false)}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            right: Utilities.wp("7"),
            top:
              Platform.OS === "android"
                ? Utilities.wp("10")
                : Utilities.wp("22"),
            marginLeft: Utilities.wp("2"),
            width: wp("25"),
          }}
          onPress={() => {
            setIsOpenCamera(false);
          }}
        >
          <Image
            source={Cross}
            resizeMode={"contain"}
            style={{
              width: 23,
              height: 23,
              tintColor: "#000",
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RNCamera
            ref={cameraRef}
            style={styles.camera}
            onBarCodeRead={(barcode) => barcodeScanned(barcode)}
            captureAudio={false}
          />

          <Text
            style={[
              styles.connectionText,
              {
                marginTop: 20,
                color: "#000",
              },
            ]}
          >
            {t(
              "GoTrack.addDevice.Please position the QR code in \n the frame."
            )}
          </Text>
        </View>
      </Modal>
    </View>
  );
}

export default AddDevice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  addDeviceWrapper: {
    paddingHorizontal: wp(20),
    flex: 1,
  },
  Heading: {
    paddingVertical: wp(20),
  },
  title: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs18,
    color: Colors.BLACK,
    textAlign: "left",
    marginBottom: wp(5),
  },
  description: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs14,
    textAlign: "left",
    color: Colors.GREY_TEXT,
  },
  modalCancel: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 999,
    backgroundColor: Colors.BLACK,
    padding: wp(7),
    borderRadius: wp(50),
  },
  modalHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: wp(20),
    paddingBottom: wp(10),
  },
  modalTitle: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs20,
    color: Colors.BLACK,
    textAlign: "left",
  },
  modalAddButton: {
    backgroundColor: "transparent",
  },
  addButton: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs16,
    color: Colors.DARKERGREEN,
    textAlign: "left",
  },
  EmptyVehiclesList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardStyle: (showBorder) => {
    return {
      borderColor: Colors.DARKERGREEN,
      borderWidth: showBorder ? 2 : 0,
    };
  },
  bottomButton: {
    marginBottom: wp(30),
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  VehicleTypesWrapper: {
    width: "50%",
  },
  vehicleType: (isSelected) => {
    return {
      position: "relative",
      paddingVertical: hp(36),
      paddingHorizontal: wp(50),
      backgroundColor: Colors.WHITE,
      borderRadius: wp(10),
      borderWidth: 1,
      margin: wp(10),
      elevation: 2,
      shadowColor: Colors.GREY,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      borderColor: isSelected ? Colors.DARKERGREEN : Colors.WHITE,
    };
  },
  vehicleIcon: {
    width: wp(90),
    height: wp(50),
  },
  vehicleCheckBox: {
    position: "absolute",
    top: wp(10),
    right: wp(10),
  },
  modalContainer: {
    backgroundColor: "#000",
    padding: 20,
    margin: 0,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  modalContainer2: {
    backgroundColor: "#FFF",
    padding: 20,
    margin: 0,
    flex: 1,
    position: "relative",
  },
  lottie: {
    position: "absolute",
    // top: hp(170),
    // left: wp(40),
    width: wp(280),
    height: hp(280),
  },
  connectionText: {
    position: "absolute",
    bottom: wp(80),
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs16,
    color: Colors.GREY,
    textAlign: "center",
    marginVertical: hp(20),
  },
  camera: {
    flex: 0.67,
    width: "90%",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: wp("10"),
  },
});
