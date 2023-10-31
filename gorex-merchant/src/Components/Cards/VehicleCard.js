import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import { EditPencil, ToyotaLogo, VehiclePlaceholder } from "../../assets";
import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import FontFamily from "../../Constants/FontFamily";
import { hp, wp } from "../../utils/responsiveSizes";

import CardWithShadow from "../../Components/Cards/CardWithShadow";
import Utilities from "../../utils/UtilityMethods";
import Fonts from "../../Constants/fonts";
import CommonAPI from "../../api/CommonAPI";
import { showToast } from "../../utils/common";
import GeneralPostAPI from "../../api/GeneralPostAPI";
import CustomBottomSheet from "../BottomSheet/CustomBottomSheet";
import Loader from "../Loader";

const VehicleCard = ({
  vehicle,
  cardStyle,
  isComingFromOnDemand = false,
  onPressPrimaryButton,
  onPressDeleteVehicleButton,
}) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const isRTL = i18n.language === "ar";

  const onPressEditOrOptionButton = () => {
    if (isComingFromOnDemand) {
      navigation.navigate("VehicleInformation", {
        vehicleToUpdate: vehicle,
        isComingFromOnDemand: isComingFromOnDemand,
      });
    } else {
      setEditModal(true);
    }
  };

  const updateVehicle = () => {
    setEditModal(false);
    navigation.navigate("VehicleInformation", { vehicleToUpdate: vehicle });
  };

  return (
    <CardWithShadow cardStyle={[styles.cardStyle, cardStyle]}>
      <View style={{ flexDirection: "row" }}>
        <Image
          style={styles.manufacturerImage({
            vehicle: !!vehicle?.image_file,
            isRTL,
          })}
          source={
            vehicle?.image_file
              ? { uri: `data:image/gif;base64,${vehicle?.image_file}` }
              : VehiclePlaceholder
          }
        />
        <View style={{ width: wp(15) }} />
        <View style={styles.manufacturerRow}>
          <Text style={[styles.manufacturer]}>{vehicle?.manufacturer[1]}</Text>

          <TouchableOpacity
            style={{ width: "20%", alignItems: "flex-end" }}
            onPress={onPressEditOrOptionButton}
          >
            <Text
              style={[
                styles.edit,
                isComingFromOnDemand && { textDecorationLine: "underline" },
              ]}
            >
              {isComingFromOnDemand ? t("common.edit") : "..."}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: hp(40) }} />

      <View style={{ flexDirection: "row" }}>
        <View
          style={{ alignItems: "flex-start", width: "30%", borderWidth: 0 }}
        >
          <Text style={styles.key}>{t("vehicle.model")}</Text>
          <Text style={styles.key}>{t("vehicle.year")}</Text>
          <Text style={styles.key}>{t("vehicle.numberPlate")}</Text>
          <Text style={styles.key}>{t("my_vehicles.color")}</Text>
        </View>

        <View
          style={{ alignItems: "flex-start", width: "34%", borderWidth: 0}}
        >
          <Text style={styles.value}>{vehicle?.vehicle_model[1]}</Text>
          <Text style={styles.value}>{vehicle?.year_id[1]}</Text>
          <Text style={styles.value}>{vehicle?.name}</Text>
          <Text style={styles.value}>
            {vehicle?.vehicle_color && vehicle.vehicle_color[1]}
          </Text>
        </View>

        {!isComingFromOnDemand && (
          <View
            style={{ justifyContent: "flex-end", width: "38%", borderWidth: 0 }}
          >
            <TouchableOpacity
              onPress={() => {
                onPressPrimaryButton(vehicle);
              }}
              disabled={vehicle?.is_primary}
              style={{
                width: Utilities.wp(30),
                height: 30,
                borderRadius: Utilities.wp(1),
                borderWidth: 2,
                borderColor: Colors.BLACK,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                marginTop: -8,
              }}
            >
              <View
                style={[
                  styles.makePrimary,
                  vehicle?.is_primary && styles.isPrimaryView,
                ]}
              >
                <Text
                  style={[
                    styles.makePrimaryText,
                    vehicle?.is_primary && styles.primaryText,
                  ]}
                >
                  {vehicle?.is_primary
                    ? t("vehicle.primary")
                    : t("vehicle.makeprimary")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <CustomBottomSheet
        height={hp(Platform.OS === "android" ? 65 : 50)}
        buttonStyle={styles.btn2}
        onClose={() => {
          setEditModal(false);
        }}
        deleteVehicle
        buttonText={t("vehicle.deletevehicle")}
        open={editModal}
        onSelect={() => {
          setEditModal(false);
          onPressDeleteVehicleButton(vehicle);
        }}
      >
        <View style={styles.contentSheet}>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.inputtextContainer}
              onPress={updateVehicle}
            >
              <Image
                style={{
                  width: wp(20),
                  height: hp(20),
                  marginTop: Utilities.wp(-2),
                }}
                resizeMode="contain"
                source={EditPencil}
              />
              <Text
                style={[styles.disabledText, { marginTop: Utilities.wp(-2) }]}
              >
                {t("vehicle.updatevehicle")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomBottomSheet>

      <Loader visible={loading} />
    </CardWithShadow>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    width: wp(388),
    alignSelf: "center",

    marginVertical: hp(10),
    paddingVertical: hp(20),
    marginHorizontal: wp(10),
    paddingHorizontal: wp(20),
  },
  manufacturerImage: ({ vehicle, isRTL }) => {
    return {
      tintColor: !vehicle && Colors.GREY,
      transform: [{ scaleX: !vehicle && isRTL ? -1 : 1 }],
      width: wp(48),
      height: hp(25),
      resizeMode: "contain",
    };
  },
  manufacturerRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  manufacturer: {
    ...FontSize.rfs20,
    ...FontFamily.bold,
    color: Colors.BLACK,
  },
  edit: {
    ...FontSize.rfs18,
    ...FontFamily.bold,
    color: Colors.BLACK,
  },
  key: {
    ...FontSize.rfs14,
    ...FontFamily.bold,
    color: Colors.DARK_BLACK,
    marginBottom: hp(10),
  },
  value: {
    ...FontSize.rfs14,
    ...FontFamily.bold,
    color: Colors.LIGHTGREY,
    textAlign: "left",
    marginBottom: hp(10),
    marginLeft: hp(10),
  },

  makePrimary: {
    width: Utilities.wp(30),
    height: 30,
    borderWidth: 2,
    borderRadius: Utilities.wp(1),
    padding: Utilities.wp(0.07),
    borderColor: Colors.BLACK,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  isPrimaryView: {
    backgroundColor: Colors.LIGHT_GREEN,
    borderColor: Colors.DARKERGREEN,
  },

  makePrimaryText: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs14,
  },

  primaryText: {
    color: Colors.DARKERGREEN,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs14,
  },

  btn2: {
    alignItems: "center",
    backgroundColor: Colors.ORANGE,
    borderRadius: 5,
    height: hp(60),
    marginBottom: hp(10),
    justifyContent: "center",
    width: wp(330),
    alignSelf: "center",
  },

  contentSheet: {
    flex: 1,
  },

  optionsContainer: {
    padding: wp(20),
  },

  inputtextContainer: {
    paddingHorizontal: 5,
    alignItems: "center",
    marginTop: Utilities.hp(5),
    flexDirection: "row",
  },
  disabledText: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs18,
    textAlign: "left",
  },
});

export default VehicleCard;
