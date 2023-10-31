import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  StyleSheet,
  RefreshControl,
} from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import Colors from "../../../Constants/Colors";
import FontSize from "../../../Constants/FontSize";
import FontFamily from "../../../Constants/FontFamily";
import { hp, wp } from "../../../utils/responsiveSizes";

import Divider from "../../../Components/Divider";
import BackHeader from "../../../Components/Header/BackHeader";
import CheckBoxCard from "../../../Components/Cards/CheckBoxCard";
import Footer from "../../ProductsAndServices/components/Footer";
import GetMyVehicles from "../../../api/GetMyVehicles";
import { showToast } from "../../../utils/common";
import GetOnDemandServices from "../../../api/GetOnDemandServices";
import { CommonContext } from "../../../contexts/ContextProvider";
import Loader from "../../../Components/Loader";
import analytics from "@react-native-firebase/analytics";
// import crashlytics from "@react-native-firebase/crashlytics";

const GoDChooseService = ({ route }) => {
  // const selectedVehicle   = route?.params?.selectedVehicle;
  // const isVehicleRunning  = route?.params?.isVehicleRunning;
  const { userProfile, onDemandOrder, setOnDemandOrder } =
    useContext(CommonContext);
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const check = route?.params?.check || false;

  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(
    onDemandOrder && onDemandOrder.service ? onDemandOrder.service : null
  );
  const [notes, setNotes] = useState("");

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "GonD_services_screen",
    });
  }, []);

  useEffect(() => {
    return navigation.addListener("focus", handleViewSwitch);
  }, [navigation]);

  const handleViewSwitch = () => {
    getOnDemandServices().then();
  };

  const getOnDemandServices = async () => {
    setLoading(true);
    GetOnDemandServices().then(({ success, response }) => {
      setLoading(false);
      if (success) {
        setServices(response);
      } else {
        showToast("Error", response, "error");
        // crashlytics().recordError(response)
      }
    });
  };

  const onPressService = (item) => {
    setSelectedService(item);
    onDemandOrder.address = {}
    onDemandOrder.serviceProvider = {}
    // const alreadySelected = selectedServices?.some(selectedService => selectedService?.id === item?.id);
    // if (alreadySelected) {
    //     const updatedServices = selectedServices?.filter(selectedService => selectedService?.id !== item?.id);
    //     setSelectedServices([...updatedServices]);
    // } else {
    //     setSelectedServices([...selectedServices, item]);
    // }
  };

  const onPressNext = () => {
    onDemandOrder.service = selectedService;
    onDemandOrder.notes = notes;

    // if (onDemandOrder && onDemandOrder.address){
    //     navigation.navigate("GoDPlaceOrder", {onDemandOrder:onDemandOrder});
    // }else {
    // }
    navigation.navigate("GoDChooseAddressAndSlot");
  };

  return (
    <View style={styles.screen}>
      <View style={styles.contentContainer}>
        <BackHeader
          title={t("common.gorexOnDemand")}
          leftPress={() =>
            navigation.navigate("GoDChooseVehicle", { check: false })
          }
        />
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => getOnDemandServices()}
            />
          }
        >
          <View style={{ height: hp(20) }} />
          <View style={styles.pleaseChooseServiceContainer}>
            <Text style={styles.pleaseChooseService}>
              {t("gorexOnDemand.pleaseChooseService")}
            </Text>
            {/* <View style={{ height: hp(5) }} />
                        <Text style={styles.oneServiceOnly}>{t("gorexOnDemand.oneServiceOnly")}</Text> */}
          </View>

          <View style={{ height: hp(15) }} />

          <FlatList
            data={services}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CheckBoxCard
                description={item.description}
                title={item?.name}
                subTitle={item?.price.toString()}
                checked={selectedService?.id === item?.id}
                onPress={() => onPressService(item)}
              />
            )}
          />

          <View style={{ height: hp(15) }} />

          <View style={{ marginHorizontal: wp(20) }}>
            <Divider />
            <View style={{ height: hp(30) }} />
            <TextInput
              style={styles.leaveNote(isRTL)}
              multiline={true}
              value={notes}
              onChangeText={(value) => setNotes(value)}
              placeholder={t("common.leaveNote")}
              placeholderTextColor={Colors.LIGHTGREY}
            />
            <View style={{ height: hp(30) }} />
            <Divider />
            <View style={{ height: hp(30) }} />
          </View>
        </ScrollView>
      </View>
      <Footer
        title={t("common.next")}
        disabled={!selectedService}
        onPress={onPressNext}
      />
      <Loader visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  contentContainer: {
    flex: 1,
  },
  pleaseChooseServiceContainer: {
    paddingStart: wp(20),
    alignItems: "flex-start",
  },
  pleaseChooseService: {
    ...FontSize.rfs18,
    ...FontFamily.bold,
    color: Colors.BLACK,
  },
  oneServiceOnly: {
    ...FontSize.rfs14,
    ...FontFamily.medium,
    color: Colors.LIGHTGREY,
  },

  leaveNote: (isRTL) => {
    return {
      paddingVertical: 0,
      textAlign: isRTL ? "right" : "left",

      ...FontSize.rfs16,
      ...FontFamily.medium,
      color: Colors.BLACK,
    };
  },
});

export default GoDChooseService;
