import React, { useContext, useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";

import styles from "./styles";
import { GreyArrowDown, Istimara } from "../../assets";
import Colors from "../../Constants/Colors";
import GeneralAPI from "../../api/GeneralAPI";
import { showToast } from "../../utils/common";
import GeneralPostAPI from "../../api/GeneralPostAPI";
import VehicleForm from "../../Constants/VehicleForm.json";
import { requestLibraryPermission } from "../../utils/permissions";

import Loader from "../../Components/Loader";
import { RoundedSquareFullButton } from "../../Components";
import BackHeader from "../../Components/Header/BackHeader";
import { CommonContext } from "../../contexts/ContextProvider";
import Footer from "../ProductsAndServices/components/Footer";
import VehicleOptions from "../../Components/Inputs/VehicleOptions";
import CustomBottomSheet from "../../Components/BottomSheet/CustomBottomSheet";
import ConfrimVehicleCard from "../ProductsAndServices/components/ConfrimVehicleCard";
import VehicleCard from "../ProductsAndServices/components/VehicleCard";
import VehicleColorsApi from "../../api/vehicleColors";
import analytics from "@react-native-firebase/analytics";
import ModalPicker from "../../Components/modalSelector";

const VehicleInformation = ({ route }) => {
  const { userProfile } = useContext(CommonContext);
  const vehicleToUpdate = route?.params?.vehicleToUpdate;
  const isComingFromGoTrack = route?.params?.isComingFromGoTrack;
  const isComingFromOnDemand = route?.params?.isComingFromOnDemand;
  const isComingFromNewOnDemand = route?.params?.isComingFromNewOnDemand;

  const { t } = useTranslation();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const [showType, setShowType] = useState(false);
  const [showYear, setShowYear] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [showVehicle, setShowVehicle] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showOdometer, setShowOdometer] = useState(false);

  const [colors, setColors] = useState([]);
  const [types, setTypes] = useState([]);
  const [years, setYears] = useState([]);
  const [models, setModels] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [image, setImage] = useState("");
  const [odometer, setOdometer] = useState("");
  const [cardAdded, setCardAdded] = useState(false);
  const [numberPlate, setNumberPlate] = useState("");
  const [IstimaraModal, setIstimaraModal] = useState(false);
  const [numberPlateModal, setNumberPlateModal] = useState(false);
  const [state, setState] = useState({
    fields: [],
    errorMessages: {},
  });

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "add_and_update_screen",
    });
  }, []);

  useEffect(() => {
    navigation.addListener("focus", () => {
      setLoading(true);
      setTimeout(async () => {
        try {
          // Fetch vehicle information
          await Promise.all([
            getVehicles(),
            getModels(),
            getColors(),
            getYears(),
          ]);
        } catch (error) {
          showToast("Error", t("errors.no-internet"), "error");
        } finally {
          setLoading(false);
        }
      }, 3000);
    });
    if (vehicleToUpdate) {
      if (vehicleToUpdate?.file) {
        setImage(vehicleToUpdate?.file);
      }
      setNumberPlate(vehicleToUpdate?.name);
      setOdometer(vehicleToUpdate?.odometer);

      var newFields = VehicleForm?.form;
      newFields[0] = {
        ...newFields[0],
        value: vehicleToUpdate?.manufacturer[0],
      };
      newFields[1] = {
        ...newFields[1],
        value: vehicleToUpdate?.vehicle_model[0],
      };
      newFields[2] = {
        ...newFields[2],
        value: vehicleToUpdate?.vehicle_variant[0],
      };
      newFields[3] = { ...newFields[3], value: vehicleToUpdate?.year_id[0] };

      setState({
        ...state,
        fields: newFields,
        vendor: {
          value: vehicleToUpdate?.manufacturer[0],
          label: vehicleToUpdate?.manufacturer[1],
        },
        model: {
          value: vehicleToUpdate?.vehicle_model[0],
          label: vehicleToUpdate?.vehicle_model[1],
          vehicleID: vehicleToUpdate?.manufacturer[0],
          image: vehicleToUpdate?.image_file,
        },
        type: {
          value: vehicleToUpdate?.vehicle_variant[0],
          label: vehicleToUpdate?.vehicle_variant[1],
          modelID: vehicleToUpdate?.vehicle_model[0],
        },
        year: {
          value: vehicleToUpdate?.year_id[0],
          label: vehicleToUpdate?.year_id[1],
        },
        color: {
          value: vehicleToUpdate?.vehicle_color[0],
          label: vehicleToUpdate?.vehicle_color[1],
        },
      });
      // setCardAdded(true);
    } else {
      setState({ ...state, fields: VehicleForm?.form });
    }
  }, [navigation]);

  const updateVehicle = async () => {
    setLoading(true);
    const args = [
      [vehicleToUpdate?.id],
      {
        customer: userProfile?.id,
        manufacturer: state?.vendor?.value,
        vehicle_model: state?.model?.value,
        vehicle_variant: state?.type?.value,
        vehicle_color: state?.color?.value,
        // odometer: odometer,
        year_id: state?.year?.value,
        name: numberPlate,
        file: image,
      },
    ];
    GeneralPostAPI({
      method: "write",
      model: "gorex.vehicle",
      args,
    }).then(({ success, response }) => {
      setLoading(false);
      if (success) {
        goToSuccessScreen();
      } else {
        showToast("Error", t("errors.no-internet"), "error");
      }
    });
  };

  const addVehicle = async () => {
    setLoading(true);
    const args = [
      {
        customer: userProfile?.id,
        manufacturer: state?.vendor?.value,
        vehicle_model: state?.model?.value,
        // vehicle_variant: state?.type?.value,
        year_id: state?.year?.value,
        name: numberPlate,
        file: image,
        vehicle_color: state?.color?.value,
        // odometer: odometer,
      },
    ];

    GeneralPostAPI({
      method: "create",
      model: "gorex.vehicle",
      args,
    }).then(({ success, response }) => {
      setLoading(false);
      if (success) {
        goToSuccessScreen();
      } else {
        showToast("Error", response, "error");
      }
    });
  };

  const goToSuccessScreen = () => {
    navigation.navigate("SuccessVehicle", {
      isComingFromOnDemand: isComingFromOnDemand,
      vehicleToUpdate: vehicleToUpdate,
      isComingFromGoTrack: isComingFromGoTrack,
      isComingFromNewOnDemand: isComingFromNewOnDemand,
    });
  };

  const getVehicles = () => {
    setLoading(true);
    GeneralAPI({ method: "search_read", model: "gorex.manufacturer" }).then(
      ({ success, response }) => {
        if (success) {
          setLoading(false);
          const vehicles = response.map((vehicle) => {
            return {
              value: vehicle?.id,
              label: vehicle?.name,
              image: vehicle?.image_file,
            };
          });
          setVehicles(vehicles);
        } else {
          setLoading(false);
          showToast("Error", t("errors.no-internet"), "error");
        }
      }
    );
  };

  const getModels = () => {
    GeneralAPI({ method: "search_read", model: "vehicle.model" }).then(
      ({ success, response }) => {
        if (success) {
          const models = response.map((model) => {
            return {
              value: model?.id,
              label: model?.name,
              vehicleID: model?.manufacturer[0],
            };
          });
          setModels(models);
        } else {
          showToast("Error", t("errors.no-internet"), "error");
        }
      }
    );
  };

  const getYears = () => {
    GeneralAPI({ method: "search_read", model: "gorex.year" }).then(
      ({ success, response }) => {
        if (success) {
          const years = response.map((year) => {
            return { value: year?.id, label: year?.year };
          });
          setYears(years);
        } else {
          showToast("Error", t("errors.no-internet"), "error");
        }
      }
    );
  };

  const getColors = () => {
    VehicleColorsApi().then(({ success, response }) => {
      if (success) {
        const data = response.map((color) => {
          return { label: color.name, value: color.id };
        });
        setColors(data);
      } else {
        showToast("Error", t("errors.no-internet"), "error");
      }
    });
  };

  const selectOption = (name, option) => {
    let newFields = state.fields;
    let fieldIndex = newFields.findIndex((_) => _.xmlName === name);
    newFields[fieldIndex] = {
      ...newFields[fieldIndex],
      value: option?.value?.toString(),
    };

    if (name === "vendor") {
      setState({
        ...state,
        model: "",
        [name]: option,
        fields: newFields,
      });
    } else {
      setState({
        ...state,
        [name]: option,
        fields: newFields,
      });
    }
  };

  const selectVehicle = (option) => {
    if (!state.vendor) {
      return Alert.alert(t("common.alert"), t("vehicle.selectVehicle"), [
        { text: t("common.OK") },
      ]);
    }
    setShowVehicle(false);
    setTimeout(() => {
      setShowModel(true);
    }, 800);
  };

  const selectModal = (option) => {
    if (!state.model) {
      return Alert.alert(t("common.alert"), t("vehicle.selectmodel"), [
        { text: t("common.OK") },
      ]);
    }
    setShowModel(false);
    setTimeout(() => {
      setShowYear(true);
    }, 800);
  };

  const selectYear = (option) => {
    if (!state.year) {
      return Alert.alert(t("common.alert"), t("vehicle.selectyear"), [
        { text: t("common.OK") },
      ]);
    }
    setShowYear(false);
    setTimeout(() => {
      setShowColor(true);
    }, 800);
  };

  const selectColor = (option) => {
    if (!state.color) {
      return Alert.alert(t("common.alert"), t("vehicle.selectColor"), [
        { text: t("common.OK") },
      ]);
    }
    setShowColor(false);
    setTimeout(() => {
      setNumberPlateModal(true);
    }, 800);
  };

  const selectNumberPlate = (option) => {
    if (!numberPlate) {
      return Alert.alert(t("common.alert"), t("vehicle.selectnumber"), [
        { text: t("common.OK") },
      ]);
    }
    setNumberPlateModal(false);
  };

  const selectType = (option) => {
    if (!state.type) {
      return Alert.alert(t("common.alert"), t("vehicle.selecttype"), [
        { text: t("common.OK") },
      ]);
    }
    setShowType(false);
    setTimeout(() => {
      setShowYear(true);
    }, 800);
  };

  const handleImagePicker = async () => {
    const granted = await requestLibraryPermission();
    if (granted) {
      await launchImageLibrary(
        {
          mediaType: "photo",
          maxHeight: 600,
          maxWidth: 800,
          includeBase64: true,
        },
        (response) => {
          if (response?.assets?.length > 0 && response?.assets[0]?.base64) {
            setImage(response?.assets[0]?.base64);
          }
        }
      );
    } else {
      showAlert();
    }
  };

  const showAlert = () => {
    Alert.alert(
      "App Permission Required",
      "Please grant permission to access this feature.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Open Settings",
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

  return (
    <View style={styles.container}>
      <BackHeader
        title={
          vehicleToUpdate
            ? t("vehicle.updatevehicle")
            : t("vehicle.Add Vehicle")
        }
      />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {cardAdded ? (
          <ConfrimVehicleCard
            onPress={() => setCardAdded(!cardAdded)}
            vehicle={{
              vendor: state?.vendor?.label,
              model: state?.model?.label,
              type: state?.type?.label,
              year: state?.year?.label,
              plate_number: numberPlate,
              color: state?.color?.label,
              file: vehicles?.find((_) => _?.value === state.vendor?.value)
                ?.image,
            }}
          />
        ) : (
          <View style={styles.buttonContainer}>
            <Text style={styles.pleaseAddVehicleTitleText}>
              {t("vehicle.pleaseaddvehicle")}
            </Text>

            <View style={styles.modalPickersWrapper}>
              <ModalPicker
                width={45}
                label={t("my_vehicles.ChooseVehicle")}
                value={state?.vendor?.label || t("my_vehicles.PleaseSelect")}
                onPress={() => {
                  setShowVehicle(true);
                }}
              />

              <ModalPicker
                width={45}
                label={t("my_vehicles.chooseModal")}
                value={state?.model?.label || t("my_vehicles.PleaseSelect")}
                disabled={!state?.vendor?.value}
                onPress={() => setShowModel(true)}
              />
            </View>

            <View style={styles.modalPickersWrapper}>
              <ModalPicker
                width={45}
                label={t("my_vehicles.chooseYear")}
                value={state?.year?.label || t("my_vehicles.PleaseSelect")}
                onPress={() => setShowYear(true)}
              />

              <ModalPicker
                width={45}
                label={t("my_vehicles.vehicleColor")}
                value={state?.color?.label || t("my_vehicles.PleaseSelect")}
                onPress={() => setShowColor(true)}
              />
            </View>

            <View style={styles.modalPickersWrapper}>
              <ModalPicker
                width={95}
                label={t("my_vehicles.vehiclePlateNumber")}
                value={numberPlate || t("my_vehicles.PleaseAdd")}
                onPress={() => setNumberPlateModal(true)}
              />
            </View>
          </View>
        )}

        <VehicleOptions
          visible={showVehicle}
          xmlName="vendor"
          search={true}
          selectedValue={state?.vendor?.value}
          title={t("vehicle.choosevehicle")}
          options={vehicles}
          onPress={selectVehicle}
          selectOption={selectOption}
          onClose={() => {
            setShowVehicle(false);
          }}
        />

        <VehicleOptions
          visible={showModel}
          options={models.filter(
            (model) => model?.vehicleID === state?.vendor?.value
          )}
          search={true}
          xmlName="model"
          title={t("vehicle.choosemodel")}
          selectedValue={state?.model?.value}
          onPress={selectModal}
          selectOption={selectOption}
          onClose={() => setShowModel(false)}
        />

        <VehicleOptions
          visible={showType}
          options={types.filter(
            (type) => type?.modelID === state?.model?.value
          )}
          search={true}
          xmlName="type"
          title={t("vehicle.choosetype")}
          selectedValue={state?.type?.value}
          onPress={selectType}
          selectOption={selectOption}
          onClose={() => setShowType(false)}
        />

        <VehicleOptions
          visible={showYear}
          options={years}
          xmlName="year"
          search={true}
          title={t("vehicle.chooseyear")}
          selectedValue={state?.year?.value}
          onPress={selectYear}
          selectOption={selectOption}
          onClose={() => setShowYear(false)}
        />

        <VehicleOptions
          visible={showColor}
          options={colors}
          search={true}
          xmlName="color"
          title={t("my_vehicles.color")}
          selectedValue={state?.color?.value}
          onPress={selectColor}
          selectOption={selectOption}
          onClose={() => setShowColor(false)}
        />

        <CustomBottomSheet
          open={numberPlateModal}
          roundedSquareFullButton
          canCancel={true}
          title={t("vehicle.select")}
          onPress={selectNumberPlate}
          onClose={() => setNumberPlateModal(false)}
        >
          <View style={styles.sheetContent}>
            <View style={styles.inputtextContainerSheet}>
              <Text style={styles.disabledText}>
                {t("vehicle.numberPlate")}
              </Text>
              <TextInput
                onChangeText={(text) => setNumberPlate(text)}
                value={numberPlate}
                style={[styles.input]}
                placeholder={t("vehicle.enternumberplate")}
                placeholderTextColor={Colors.BLACK}
              />
            </View>
          </View>
        </CustomBottomSheet>

        <CustomBottomSheet
          height={140}
          removeButton
          onClose={() => setIstimaraModal(false)}
          open={IstimaraModal}
        >
          <View style={styles.contentSheet}>
            <View style={styles.inputtextContainer}>
              <TouchableOpacity
                onPress={handleImagePicker}
                style={styles.imagePicker}
              >
                <Image
                  style={styles.imagePicker}
                  source={
                    image ? { uri: `data:image/gif;base64,${image}` } : Istimara
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
          <Footer
            title={t("vehicle.confirmadd")}
            onPress={() => setIstimaraModal(false)}
          />
        </CustomBottomSheet>

        {/*<View style={styles.buttonContainer}>*/}
        {/*<Text style={styles.addVehicleIstimaraTitleText}>*/}
        {/*  {t("vehicle.istimara")}*/}
        {/*</Text>*/}
        {/*{image ? (*/}
        {/*  <ImageBackground*/}
        {/*    source={*/}
        {/*      image ? { uri: `data:image/gif;base64,${image}` } : Istimara*/}
        {/*    }*/}
        {/*    style={styles.imagePicker}*/}
        {/*    imageStyle={styles.istimaraBGImage}*/}
        {/*  >*/}
        {/*    <TouchableOpacity*/}
        {/*      style={styles.deleteBtn}*/}
        {/*      onPress={() => setImage("")}*/}
        {/*    >*/}
        {/*      <Text style={{ color: "white" }}> {t("vehicle.delete")}</Text>*/}
        {/*    </TouchableOpacity>*/}
        {/*  </ImageBackground>*/}
        {/*) : (*/}
        {/*  <RoundedSquareFullButton*/}
        {/*    title={t("vehicle.+AddIstimara")}*/}
        {/*    onPress={handleImagePicker}*/}
        {/*  />*/}
        {/*)}*/}
        {/*</View>*/}
      </ScrollView>

      {cardAdded ? (
        <Footer
          title={
            vehicleToUpdate
              ? t("vehicle.updatevehicle")
              : t("vehicle.confirmadd")
          }
          disabled={!cardAdded}
          onPress={vehicleToUpdate ? updateVehicle : addVehicle}
        />
      ) : (
        <Footer
          title={t("common.next")}
          disabled={
            !numberPlate ||
            !state?.year?.value ||
            !state?.color?.value ||
            !state?.model?.value ||
            !state?.vendor?.value
          }
          onPress={() => setCardAdded(true)}
        />
      )}

      <Loader visible={loading} />
    </View>
  );
};

export default VehicleInformation;
