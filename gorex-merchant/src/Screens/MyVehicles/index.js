import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image, Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import styles from "./styles";
import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import Loader from "../../Components/Loader";
import { showToast } from "../../utils/common";
import FontSize from "../../Constants/FontSize";
import { hp, wp } from "../../utils/responsiveSizes";
import GetMyVehicles from "../../api/GetMyVehicles";
import BackHeader from "../../Components/Header/BackHeader";
import { CommonContext } from "../../contexts/ContextProvider";
import { MenuBlack, NoVehicle, RoundPlus } from "../../assets";
import Footer from "../ProductsAndServices/components/Footer";
// import VehicleCard from "../ProductsAndServices/components/VehicleCard";
import VehicleCard from "../../Components/Cards/VehicleCard";
import CommonAPI from "../../api/CommonAPI";
import GeneralPostAPI from "../../api/GeneralPostAPI";
import analytics from "@react-native-firebase/analytics";

const MyVehicles = () => {
  const { userProfile } = useContext(CommonContext);

  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "my_vehicles",
    });
  }, [navigation]);

  useEffect(() => {
    return navigation.addListener("focus", handleViewSwitch);
  }, [navigation]);

  const handleViewSwitch = () => {
    getVehicles();
  };

  const getVehicles = () => {
    setLoading(true);
    GetMyVehicles(userProfile?.id).then(({ success, response }) => {
      setLoading(false);
      if (success) {
        setVehicles(response);
      } else {
        showToast("Error", response, "error");
      }
    });
  };

  const onPressMakeVehiclePrimary = (vehicle) => {
    setLoading(true);
    CommonAPI({
      body: { vehicle_id: vehicle?.id },
      endPoint: "/set/primary/vehicle",
    }).then(({ success, response }) => {
      if (success) {
        getVehicles();
      } else {
        setLoading(false);
        showToast("Error", response, "error");
      }
    });
  };

  const onPressDeleteVehicle = (vehicle) => {
    Alert.alert(t("setting.confirm"), t("vehicle.deleteVehiclePrompt"), [
      {
        text: t("setting.delete"),
        style: "destructive",
        onPress: () => {
          deleteVehicle(vehicle);
        },
      },
      {
        text: t("setting.cancel"),
        onPress: () => {},
      },
    ]);
  };

  const deleteVehicle = (vehicle) => {
    setLoading(true);
    GeneralPostAPI({
      method: "unlink",
      model: "gorex.vehicle",
      args: [[vehicle?.id]],
    }).then(({ success, response }) => {
      if (success) {
        getVehicles();
      } else {
        setLoading(false);
        showToast("Error", response, "error");
      }
    });
  };

  const getEmptyListView = () => {
    return (
      <View style={emptyScreenStyles.container}>
        <Image
          resizeMode="contain"
          transitionDuration={1000}
          source={NoVehicle}
          style={emptyScreenStyles.item}
        />
        <Text style={emptyScreenStyles.text}> {t("vehicle.novehicle")}</Text>
        <Text style={emptyScreenStyles.title}>
          {t("vehicle.novehicleaccount")}
        </Text>
      </View>
    );
  };

  const data = useMemo(() => {
    let array = [];
    if (searchQuery === "") {
      array = [...vehicles];
    } else {
      array = vehicles.filter((item) =>
        item?.manufacturer?.[1]
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
    return array;
  }, [searchQuery, vehicles, navigation]);

  return (
    <View style={styles.container}>
      <BackHeader
        title={t("my_vehicles.My Vehicles")}
        leftIcon={MenuBlack}
        leftPress={() => navigation.openDrawer()}
        rightIcon={!userProfile?.parent_partner_id && RoundPlus}
        RightPress={() =>
          navigation.navigate("VehicleInformation", {
            isComingFromOnDemand: false,
          })
        }
      />

      <View style={emptyScreenStyles.searchBarContainer(Platform.OS)}>
        <TextInput
          style={emptyScreenStyles.searchInput(isRTL)}
          placeholder={t("service.search")}
          value={searchQuery}
          placeholderTextColor={Colors.GREY}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      {!loading && vehicles.length <= 0 ? (
        getEmptyListView()
      ) : (
        <FlatList
          data={data}
          refreshing={loading}
          onRefresh={() => {
            getVehicles();
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (!item) return;
            return (
              <VehicleCard
                vehicle={item}
                isComingFromOnDemand={false}
                onPressPrimaryButton={onPressMakeVehiclePrimary}
                onPressDeleteVehicleButton={onPressDeleteVehicle}
              />
            );
          }}
        />
      )}

      {!userProfile?.parent_partner_id ? (
        <Footer
          title={t("vehicle.Add Vehicle")}
          onPress={() => navigation.navigate("VehicleInformation")}
        />
      ) : null}
      <Loader visible={loading} />
    </View>
  );
};

const emptyScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    height: hp(160),
    width: wp(105),
    resizeMode: "contain",
  },
  text: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendMedium,
    textAlign: "center",
    ...FontSize.rfs24,
    marginTop: hp(5),
  },
  title: {
    color: "#B8B9C1",
    width: "70%",
    fontFamily: Fonts.LexendMedium,
    textAlign: "center",
    ...FontSize.rfs16,
    marginTop: hp(10),
  },
  searchBarContainer: (Platform) => {
    return {
      backgroundColor: Colors.LIGHT_GREY,
      margin: 15,
      paddingVertical: Platform === "ios" ? 10 : 0,
      paddingHorizontal: 15,
      borderRadius: 50,
      textAlign: "left",
      height: 40,
    };
  },
  searchInput: (isRTL) => {
    return {
      ...FontSize.rfs14,
      color: Colors.BLACK,
      textAlign: isRTL ? "right" : "left",
      fontFamily: Fonts.LexendMedium,
    };
  },
});

export default MyVehicles;
