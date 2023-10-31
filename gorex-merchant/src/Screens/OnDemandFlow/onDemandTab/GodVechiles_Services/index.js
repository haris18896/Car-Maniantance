import React, {
  useContext,
  useLayoutEffect,
  Fragment,
  useState,
  useEffect,
} from "react";

// ** Third Party Packages
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// ** Custom Components
import {
  Empty,
  ArrowUp,
  NoVehicle,
  ArrowDownGrey,
  CheckBoxChecked,
  CheckBoxUnchecked,
} from "../../../../assets";
import Fonts from "../../../../Constants/fonts";
import Colors from "../../../../Constants/Colors";
import Loader from "../../../../Components/Loader";
import VehicleCard from "../components/VechileCard";
import FontSize from "../../../../Constants/FontSize";
import { showToast } from "../../../../utils/common";
import FontFamily from "../../../../Constants/FontFamily";
import GetMyVehicles from "../../../../api/GetMyVehicles";
import { hp, wp } from "../../../../utils/responsiveSizes";
import BackHeader from "../../../../Components/Header/BackHeader";
import Footer from "../../../ProductsAndServices/components/Footer";
import { CommonContext } from "../../../../contexts/ContextProvider";
import MessageWithImage from "../../../../Components/MessageWithImage";
import GetClubedServices from "../../../../api/ClubedServices";
import { getSuperModifiedValues, isObjEmpty } from "../../../../utils/utils";

function VehiclesServices({ route }) {
  const product_flow = route?.params?.product_flow;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { userProfile, onDemandOrder, setOnDemandOrder } =
    useContext(CommonContext);

  // ** States
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const getVehicles = async () => {
    setLoading(true);
    setRefreshing(true);
    await GetMyVehicles(userProfile?.id).then(({ success, response }) => {
      setLoading(false);
      setRefreshing(false);
      if (success) {
        setVehicles(response);
        if (!isObjEmpty(onDemandOrder?.vehicle)) {
          setSelectedVehicle(onDemandOrder?.vehicle);
        }
      } else {
        showToast("Error", response, "error");
      }
    });
  };

  const getClubedServices = async () => {
    setExpanded(false);
    await GetClubedServices().then(({ success, response }) => {
      if (success) {
        setServices(response);
        if (!isObjEmpty(onDemandOrder?.service)) {
          setSelectedService(onDemandOrder?.service);
          setExpanded(onDemandOrder?.expanded_tab);
        }
      } else {
        showToast("Error", response, "error");
        // crashlytics().recordError(response)
      }
    });
  };

  const handleSwitch = () => {
    getVehicles().then();
    getClubedServices().then();
  };

  useLayoutEffect(() => {
    return navigation.addListener("focus", () => handleSwitch());
  }, [navigation]);

  const showVehicles = () => {
    return (
      <>
        <FlatList
          data={vehicles}
          showsVerticalScrollIndicator={false}
          onRefresh={getVehicles}
          refreshing={refreshing}
          contentContainerStyle={
            vehicles.length === 0 && {
              flex: 1,
              justifyContent: "center",
            }
          }
          ListEmptyComponent={
            <View style={styles.EmptyVehiclesList}>
              <MessageWithImage
                imageSource={NoVehicle}
                message={t("gorexOnDemand.noVehicleAdded")}
                description={t("gorexOnDemand.noVehicleDescription")}
              />
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedVehicle((prevExpanded) =>
                  prevExpanded === item ? null : item
                );
              }}
            >
              <>
                <VehicleCard
                  cardStyle={styles.cardStyle(item?.id === selectedVehicle?.id)}
                  vehicle={item}
                  isComingFromNewOnDemand={true}
                />
              </>
            </TouchableOpacity>
          )}
        />
      </>
    );
  };

  const onPressNext = () => {
    const modifiedOrder = getSuperModifiedValues(
      { service: selectedService },
      onDemandOrder
    );

    if (
      !isObjEmpty(modifiedOrder) &&
      onDemandOrder?.service &&
      onDemandOrder?.vehicle
    ) {
      setOnDemandOrder({
        date: null,
        slot: null,
        slotsList: [],
        serviceProvider: {},
        expanded_tab: expanded,
        service: selectedService,
        vehicle: selectedVehicle,
        address: onDemandOrder?.address ? onDemandOrder?.address : {},
      });

      navigation.push("GoDAddressSlot");
    } else {
      setOnDemandOrder({
        vehicle: selectedVehicle,
        service: selectedService,
        expanded_tab: expanded,
        serviceProvider: onDemandOrder?.serviceProvider
          ? onDemandOrder?.serviceProvider
          : {},
        address: onDemandOrder?.address ? onDemandOrder?.address : {},
        date: onDemandOrder?.date ? onDemandOrder?.date : null,
        slot: onDemandOrder?.slot ? onDemandOrder?.slot : null,
        slotsList: onDemandOrder?.slotsList ? onDemandOrder?.slotsList : [],
      });
      navigation.push("GoDAddressSlot");
    }
  };

  return (
    <View style={styles.Container}>
      <BackHeader
        title={t("common.gorexOnDemand")}
        leftPress={async () => {
          await setOnDemandOrder({});
          if (product_flow) {
            navigation.navigate("AddDevice");
          } else {
            navigation.navigate("WelcomeOnDemand");
          }
        }}
      />

      <View style={styles.MainWrapper}>
        {loading ? (
          <Loader visible={true} />
        ) : (
          <Fragment>
            <View style={styles.chooseVehicleHeader(vehicles)}>
              <Text style={styles.chooseVehicle}>
                {t("gorexOnDemand.pleaseChooseYourVehicle")}
              </Text>
              {vehicles.length <= 0 && !loading && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.push("VehicleInformation", {
                      isComingFromOnDemand: false,
                      isComingFromNewOnDemand: true,
                    })
                  }
                >
                  <Text style={styles.addNew}>{t("gorexOnDemand.addNew")}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Vehicles list */}
            <View style={styles.VehiclesWrapper}>{showVehicles()}</View>

            {/* Services */}
            <View style={styles.pleaseChooseServiceContainer}>
              <Text style={styles.pleaseChooseService}>
                {t("gorexOnDemand.pleaseChooseService")}
              </Text>
            </View>

            <ScrollView
              style={styles.vehicleServiceWrapper}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={() => getClubedServices()}
                />
              }
              contentContainerStyle={
                Object.keys(services).length === 0 && {
                  flex: 1,
                  justifyContent: "center",
                }
              }
            >
              {Object.keys(services).length === 0 ? (
                <View style={styles.EmptyVehiclesList}>
                  <MessageWithImage
                    imageSource={Empty}
                    message={t("gorexOnDemand.emptyServices")}
                    description={t("gorexOnDemand.emptyServicesDescription")}
                  />
                </View>
              ) : (
                <View style={styles.accordionWrapper}>
                  {Object.keys(services).map((item, index) => (
                    <Fragment key={index}>
                      <TouchableOpacity
                        style={styles.accordion(expanded === item)}
                        onPress={() =>
                          setExpanded((prevExpanded) =>
                            prevExpanded === item ? null : item
                          )
                        }
                      >
                        <View>
                          <Text style={styles.AccordionTitle}>{item}</Text>
                        </View>
                        {expanded === item ? (
                          <ArrowUp
                            width={10}
                            height={14}
                            style={styles.arrow}
                          />
                        ) : (
                          <ArrowDownGrey
                            width={10}
                            height={14}
                            style={styles.arrow}
                          />
                        )}
                      </TouchableOpacity>

                      {expanded === item && (
                        <View style={styles.accordionDescription(expanded)}>
                          <FlatList
                            data={services[item]}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                              <TouchableOpacity
                                style={styles.accordionItemDetails}
                                onPress={() =>
                                  setSelectedService((prevExpanded) =>
                                    prevExpanded === item ? null : item
                                  )
                                }
                              >
                                <View style={styles.checkBoxTitle}>
                                  <Image
                                    style={styles.checkBox}
                                    source={
                                      selectedService?.id === item?.id
                                        ? CheckBoxChecked
                                        : CheckBoxUnchecked
                                    }
                                  />

                                  <Text
                                    style={[
                                      styles.title,
                                      {
                                        width:
                                          item.price.toString().length > 0
                                            ? "65%"
                                            : "90%",
                                      },
                                    ]}
                                  >
                                    {item?.name}
                                  </Text>
                                </View>

                                {/*<Text style={styles.subtitle}>*/}
                                {/*  {item?.price.toString()}{" "}*/}
                                {/*  {t("productsAndServices.SAR")}*/}
                                {/*</Text>*/}
                              </TouchableOpacity>
                            )}
                          />
                        </View>
                      )}
                    </Fragment>
                  ))}
                </View>
              )}
            </ScrollView>
          </Fragment>
        )}
      </View>

      <Footer
        title={t("common.next")}
        disabled={!selectedVehicle || !selectedService}
        onPress={onPressNext}
        // onPress={() => navigation.navigate("GoDAddressSlot")}
      />
    </View>
  );
}

export default VehiclesServices;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  MainWrapper: {
    flex: 1,
    marginVertical: hp(15),
  },
  chooseVehicleHeader: (vehicles) => {
    return {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      paddingHorizontal: wp(20),
    };
  },
  chooseVehicle: {
    ...FontSize.rfs18,
    ...FontFamily.bold,
    color: Colors.BLACK,
  },
  addNew: {
    ...FontSize.rfs16,
    ...FontFamily.bold,
    color: Colors.DARKERGREEN,
  },
  EmptyVehiclesList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  VehiclesWrapper: {
    flex: 2,
  },
  cardStyle: (showBorder) => {
    return {
      borderColor: Colors.DARKERGREEN,
      borderWidth: showBorder ? 2 : 0,
    };
  },
  vehicleServiceWrapper: {
    flex: 1,
  },

  pleaseChooseServiceContainer: {
    paddingStart: wp(20),
    alignItems: "flex-start",
    marginTop: hp(15),
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

  accordionWrapper: {
    marginHorizontal: wp(15),
    marginTop: hp(10),
  },
  accordion: (expanded) => {
    return {
      borderWidth: 1,
      borderColor: Colors.LIGHTGREY,
      borderRadius: 10,
      marginTop: hp(10),
      padding: wp(20),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      maxWidth: "100%",
      borderBottomWidth: expanded ? 0 : 1,
      borderBottomLeftRadius: expanded ? 0 : 10,
      borderBottomRightRadius: expanded ? 0 : 10,
    };
  },
  AccordionTitle: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs16,
    textAlign: "left",
  },
  accordionDescription: (expanded) => {
    return {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.LIGHTGREY,
      borderTopWidth: expanded ? 0 : 1,
      borderTopLeftRadius: expanded ? 0 : 10,
      borderTopRightRadius: expanded ? 0 : 10,
    };
  },
  accordionItemDetails: {
    marginVertical: wp(5),
    paddingVertical: wp(15),
    paddingHorizontal: wp(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkBoxTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    width: "80%",
    ...FontSize.rfs16,
    ...FontFamily.medium,
    color: Colors.BLACK,
    textAlign: "left",
  },
  checkBox: {
    width: wp(20),
    height: wp(20),
    resizeMode: "contain",
    marginRight: "5%",
  },
  subtitle: {
    ...FontSize.rfs18,
    ...FontFamily.medium,
    color: Colors.DARKERGREEN,
    textAlign: "right",
  },
});
