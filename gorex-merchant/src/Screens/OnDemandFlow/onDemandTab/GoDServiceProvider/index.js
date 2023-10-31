import React, { useContext, useEffect, useState } from "react";

// ** Third Party Packages
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, FlatList, Text } from "react-native";

import Loader from "../../../../Components/Loader";
import Colors from "../../../../Constants/Colors";
import FontSize from "../../../../Constants/FontSize";
import FontFamily from "../../../../Constants/FontFamily";
import { hp, wp } from "../../../../utils/responsiveSizes";
import ServiceProviderCard from "../components/ServiceProvider";
import BackHeader from "../../../../Components/Header/BackHeader";
import Footer from "../../../ProductsAndServices/components/Footer";
import { CommonContext } from "../../../../contexts/ContextProvider";
import GetOnDemandServiceProviders from "../../../../api/GetOnDemandServiceProviders";
import MessageWithImage from "../../../../Components/MessageWithImage";
import { NoAddress } from "../../../../assets";
import { getSuperModifiedValues, isObjEmpty } from "../../../../utils/utils";

// ** Custom Components

function GoDServiceProvider({ route }) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { onDemandOrder, setOnDemandOrder } = useContext(CommonContext);

  // ** States
  const [loading, setLoading] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [providers, setProviders] = useState([]);
  const [timeSlot, setTimeSlot] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const getServiceProviders = async () => {
    const service = onDemandOrder?.service?.id;
    const lat = onDemandOrder?.address?.latitude;
    const long = onDemandOrder?.address?.longitude;
    const date = moment.unix(onDemandOrder?.date).format("YYYY-MM-DD");
    const slots = onDemandOrder?.slotsList && onDemandOrder?.slotsList.map((item) => {
      return item.id;
    });
    setLoading(true);
    setRefreshing(true);
    await GetOnDemandServiceProviders({ service, date, slots, lat, long }).then(
      (response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.success) {
          let result = [];
          for (const providerId in response.response) {
            const services = response.response[providerId];
            const timeSlots = services.map((service) => {
              return {
                slot_id: service.id,
                time: `${service.start_time} - ${service.end_time}`,
              };
            });

            const timeStringify = JSON.stringify(timeSlots);

            const data = {
              service_id: services[0]?.service_id,
              service_provider_id: services[0]?.service_provider_id,
              service_provider_name: services[0]?.service_provider_name,
              service_price: services[0]?.service_price,
              rating: services[0]?.rating,
              distance: services[0]?.distance,
              duration: services[0]?.duration,
              is_COD: services[0]?.is_cod_active,
              timeSlots: timeStringify,
            };
            result.push(data);
          }

          setProviders(result);
          if (!isObjEmpty(onDemandOrder?.serviceProvider)) {
            setSelectedProvider(onDemandOrder?.serviceProvider);
          } else setSelectedProvider(result[0]);

          const timeSlotsList = result[0].timeSlots;
          const timeSlotParsed = JSON.parse(timeSlotsList);

          if (onDemandOrder?.slot) {
            setTimeSlot(onDemandOrder?.slot);
          } else {
            setTimeSlot(timeSlotParsed[0]?.slot_id);
          }
        }
      }
    );
  };

  useEffect(() => {
    getServiceProviders();
  }, []);

  const onPressNext = () => {
    const modifiedOrder = getSuperModifiedValues(
      { slot: timeSlot, serviceProvider: selectedProvider },
      onDemandOrder
    );

    if (
      onDemandOrder?.slot &&
      !isObjEmpty(modifiedOrder) &&
      !isObjEmpty(onDemandOrder?.service)
    ) {
      setOnDemandOrder({
        slot: timeSlot,
        date: onDemandOrder?.date,
        serviceProvider: selectedProvider,
        slotsList: onDemandOrder?.slotsList,
        address: onDemandOrder?.address,
        vehicle: onDemandOrder?.vehicle,
        service: onDemandOrder?.service,
        expanded_tab: onDemandOrder?.expanded_tab,
      });

      navigation.push("Cart", { COD: selectedProvider?.is_COD });
    } else {
      setOnDemandOrder({
        slot: timeSlot,
        date: onDemandOrder?.date,
        serviceProvider: selectedProvider,
        slotsList: onDemandOrder?.slotsList,
        address: onDemandOrder?.address,
        vehicle: onDemandOrder?.vehicle,
        service: onDemandOrder?.service,
        expanded_tab: onDemandOrder?.expanded_tab,
      });
      navigation.push("Cart", { COD: selectedProvider?.is_COD });
    }
  };

  return (
    <View style={styles.container}>
      <BackHeader
        title={t("common.gorexOnDemand")}
        leftPress={() => navigation.push("GoDAddressSlot")}
      />

      <View style={styles.mainWrapper}>
        <View style={styles.selectServiceProvider}>
          <Text style={styles.selectProvider}>
            {t("gorexOnDemand.pleaseSelectServiceProvider")}
          </Text>
        </View>

        {loading ? (
          <Loader visible={true} />
        ) : (
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={providers}
            onRefresh={getServiceProviders}
            refreshing={refreshing}
            contentContainerStyle={
              providers.length === 0 && { flex: 1, justifyContent: "center" }
            }
            ListEmptyComponent={
              <View>
                <View style={{ height: hp(60) }} />
                <MessageWithImage
                  width={100}
                  height={75}
                  imageSource={NoAddress}
                  message={t("gorexOnDemand.emptyList")}
                  description={t("gorexOnDemand.noProviderFound")}
                />
                <View style={{ height: hp(60) }} />
              </View>
            }
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <ServiceProviderCard
                item={item}
                key={index}
                timeSlot={timeSlot}
                setTimeSlot={setTimeSlot}
                selectedProvider={selectedProvider}
                onPress={async () => {
                  await setSelectedProvider(item);
                  const timeSlotsList = await item.timeSlots;
                  const timeSlotParsed = await JSON.parse(timeSlotsList);
                  setTimeSlot(timeSlotParsed[0]?.slot_id);
                }}
                checked={
                  selectedProvider?.service_provider_id ===
                  item.service_provider_id
                }
              />
            )}
          />
        )}
      </View>

      <Footer
        title={t("common.next")}
        disabled={!selectedProvider || !timeSlot}
        onPress={onPressNext}
      />
    </View>
  );
}

export default GoDServiceProvider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  mainWrapper: {
    flex: 1,
  },
  selectServiceProvider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(20),
    marginVertical: hp(15),
  },
  selectProvider: {
    ...FontSize.rfs18,
    ...FontFamily.bold,
    color: Colors.BLACK,
    textAlign: "left",
  },
});
