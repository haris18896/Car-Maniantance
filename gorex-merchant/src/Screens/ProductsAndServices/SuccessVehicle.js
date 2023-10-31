import React, { useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { Successvehicle } from "../../assets";
import BackHeader from "../../Components/Header/BackHeader";

import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import { hp, wp } from "../../utils/responsiveSizes";
import Utilities from "../../utils/UtilityMethods";
import Footer from "../ProductsAndServices/components/Footer";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import analytics from "@react-native-firebase/analytics";

const SuccessVehicle = ({ route }) => {
  const isComingFromGoTrack = route?.params?.isComingFromGoTrack;
  const isComingFromOnDemand = route?.params?.isComingFromOnDemand;
  const isComingFromNewOnDemand = route?.params?.isComingFromNewOnDemand;

  console.log("isComingFromGoTrack in Success : ", isComingFromGoTrack);

  const { vehicleToUpdate } = route?.params;

  const { t } = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "vehicle_success_screen",
    });
  }, []);

  return (
    <View style={styles.container}>
      <BackHeader
        title={
          vehicleToUpdate
            ? t("vehicle.updatevehicle")
            : t("vehicle.Add Vehicle")
        }
        leftPress={() => {
          // navigation.navigate("MyVehicles");
          if (isComingFromNewOnDemand) {
            navigation?.push("VehiclesServices");
          } else if (isComingFromOnDemand) {
            navigation?.replace("GoDChooseVehicle", { offerTitle: false });
          } else if (isComingFromGoTrack) {
            navigation?.navigate("AddDevice");
          } else {
            navigation.navigate("MyVehicles");
          }
        }}
      />
      <Image
        resizeMode="contain"
        transitionDuration={1000}
        source={Successvehicle}
        style={styles.item}
      />
      <Text style={styles.text}>{t("vehicle.SuccessVehicle")}!</Text>
      <Text style={styles.title}>
        {vehicleToUpdate
          ? t("vehicle.vehicleUpdate")
          : t("vehicle.youhavenovehicle")}
      </Text>
      <View
        style={{
          justifyContent: "center",
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <Footer
          title={t("vehicle.done")}
          onPress={() => {
            // navigation.push(
            //   isComingFromNewOnDemand
            //     ? "VehiclesServices"
            //     : isComingFromOnDemand
            //     ? "GoDChooseVehicle"
            //     : "MyVehicles"
            // )
            if (isComingFromNewOnDemand) {
              navigation?.push("VehiclesServices");
            } else if (isComingFromOnDemand) {
              navigation?.replace("GoDChooseVehicle", { offerTitle: false });
            } else if (isComingFromGoTrack) {
              navigation?.navigate("AddDevice");
            } else {
              navigation.navigate("MyVehicles");
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  item: {
    height: Utilities.wp(30),
    resizeMode: "contain",
    alignSelf: "center",
    alignItems: "center",
    width: wp(105),
    marginTop: Utilities.wp(40),
  },
  text: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendMedium,
    textAlign: "center",
    ...FontSize.rfs24,
  },
  title: {
    color: "#B8B9C1",
    alignSelf: "center",
    fontFamily: Fonts.LexendMedium,
    textAlign: "center",
    ...FontSize.rfs14,
    marginTop: hp(10),
  },
});

export default SuccessVehicle;
