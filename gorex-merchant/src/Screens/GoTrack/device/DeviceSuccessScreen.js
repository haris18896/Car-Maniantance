import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

// ** Custom Components
import Fonts from "../../../Constants/fonts";
import Colors from "../../../Constants/Colors";
import Loader from "../../../Components/Loader";
import { Successvehicle } from "../../../assets";
import FontSize from "../../../Constants/FontSize";
import Utilities from "../../../utils/UtilityMethods";
import { hp, wp } from "../../../utils/responsiveSizes";
import BackHeader from "../../../Components/Header/BackHeader";

// ** Third Party packages
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import Footer from "../../ProductsAndServices/components/Footer";

// ** Store && Actions
import { CommonContext } from "../../../contexts/ContextProvider";
import AssetActivationAPI from "../../../api/AssetActivationAPI";
import { showToast } from "../../../utils/common";

function DeviceSuccess() {
  // ** Hooks
  const { t } = useTranslation();
  const navigation = useNavigation();

  // ** Context
  const { GoTrack } = useContext(CommonContext);

  // ** States
  const [loading, setLoading] = useState(false);

  // const ActivateDeviceAPI = async () => {
  //   const dataObj = new FormData();
  //   dataObj.append("username", "gorex");
  //   dataObj.append("password", "abcd1234$!");
  //   dataObj.append("vehicle_id", GoTrack?.device?.asset?.vehicleId);
  //   dataObj.append("install_date", `${GoTrack.install_date}`);
  //   dataObj.append("expiry_date", `${GoTrack.expiry_date}`);
  //   dataObj.append("payment_type", GoTrack.plan?.plan);

  //   setLoading(true);
  //   await AssetActivationAPI(dataObj).then(({ success, response, error }) => {
  //     setLoading(false);
  //     if (success) {
  //       navigation.navigate("GoTrackDashboard");
  //     } else {
  //       showToast("Error", error, "error");
  //     }
  //   });
  // };

  return (
    <View style={styles.container}>
      <BackHeader
        title={t("GoTrack.addDevice.addDevice")}
        leftPress={() => navigation.navigate("GoTrackDashboard")}
      />
      <Image
        resizeMode="contain"
        transitionDuration={1000}
        source={Successvehicle}
        style={styles.item}
      />
      <Text style={styles.text}>{t("vehicle.SuccessVehicle")}!</Text>
      <Text style={styles.title}>{t("GoTrack.addDevice.successDes")}</Text>
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
          onPress={() => navigation.navigate("GoTrackDashboard")}
        />
      </View>

      <Loader visible={loading} />
    </View>
  );
}

export default DeviceSuccess;

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
    width: "75%",
    marginTop: hp(10),
  },
});
