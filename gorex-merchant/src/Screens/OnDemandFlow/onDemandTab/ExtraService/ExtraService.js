import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
} from "react-native";
import React, {
  Fragment,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useNavigation } from "@react-navigation/native";

import Utilities from "../../../../utils/UtilityMethods";
import Colors from "../../../../Constants/Colors";
import { useTranslation } from "react-i18next";
import Lottie from "lottie-react-native";
import {
  ArrowDownGrey,
  ArrowUp,
  CheckBoxChecked,
  CheckBoxUnchecked,
  ClockCounterBlack,
  CloseBlack,
  Cross,
  GreenOrderHistory,
  LocationIcon,
  RatingStar,
  carrepair,
  queue,
} from "../../../../assets";
import fonts from "../../../../Constants/fonts";
import FontSize from "../../../../Constants/FontSize";
import RBSheetModal from "../../../../Components/Modal";
import { hp, wp } from "../../../../utils/responsiveSizes";
import FontFamily from "../../../../Constants/FontFamily";
import { FlatList } from "react-native";
import GetClubedServices from "../../../../api/ClubedServices";
import { isObjEmpty } from "../../../../utils/utils";
import { showToast } from "../../../../utils/common";
import { CommonContext } from "../../../../contexts/ContextProvider";
import LinearGradient from "react-native-linear-gradient";

const ExtraService = ({ route }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const ExtraServiceModal = route?.params?.ExtraServiceModal;
  const isRTL = i18n.language === "ar";
  const animationRef = useRef(null);
  const [serviceModal, setServiceModal] = useState(false);
  const [chooseServiceModal, setChooseServiceModal] = useState(
    ExtraServiceModal == true ? true : false
  );
  const [services, setServices] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const { onDemandOrder } = useContext(CommonContext);
  const addedExtraService = route?.params?.addedExtraService;

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

  useLayoutEffect(() => {
    getClubedServices();
    setSelectedService({});
  }, [navigation]);

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={[Colors.LIGHT_GREEN, Colors.WHITE]}
      style={{
        flex: 1,
      }}
    >
      <SafeAreaView
        style={{
          flexGrow: 1,
        }}
      >
        <View style={styles.mainWrapper}>
          <TouchableOpacity
            style={[
              styles.closeIconButton,
              { alignItems: !!isRTL ? "flex-end" : "flex-start" },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Image source={Cross} style={styles.close} />
          </TouchableOpacity>
          <View style={styles.animationWrapper}>
            <View style={styles.animation}>
              <Lottie
                ref={animationRef}
                source={carrepair}
                autoPlay
                loop
                resizeMode="contain"
                style={styles.carLottieStyle}
              />
            </View>
            <Text style={styles.progressText}>
              {t("gorexOnDemand.currentlyProgress.")}
            </Text>
            <Text style={styles.sitTextStyle}>
              {t("gorexOnDemand.SitRelax")}
            </Text>
            {addedExtraService == true ? (
              <View style={styles.addedServiceContainer}>
                <Image
                  source={queue}
                  resizeMode={"contain"}
                  style={styles.queueImage}
                />
                <Text style={styles.extraQueueStyle}>
                  {t("gorexOnDemand.serviceQueue")}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setServiceModal(true);
                }}
                style={styles.AddServiceButton}
              >
                <Text style={styles.extraServiceText}>
                  {t("gorexOnDemand.Add Extra Service")}?
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {serviceModal && (
            <RBSheetModal
              height={60}
              open={serviceModal}
              onClose={() => setServiceModal(false)}
              backgroundColor={"#0000001A"}
            >
              <View style={styles.modalContainer}>
                <View style={styles.draggableContainer} />
                <View style={styles.modalView}>
                  <TouchableOpacity onPress={() => setServiceModal(false)}>
                    <Image
                      source={CloseBlack}
                      style={[styles.close, { marginLeft: "100%" }]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.lottieContainer}></View>
              <View style={styles.modalContentContainer}>
                <Text style={styles.NeedTextStyle}>
                  {t("gorexOnDemand.Need too add extra services")}?
                </Text>
                <Text style={styles.clickTextStyle}>
                  {t("gorexOnDemand.customizeServiceOrder.")}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setChooseServiceModal(true);
                    setServiceModal(false);
                  }}
                  style={styles.modalButtonContainer}
                >
                  <Text style={styles.modalButtonText}>
                    {t("gorexOnDemand.Add Extra Service")}
                  </Text>
                </TouchableOpacity>
              </View>
            </RBSheetModal>
          )}

          {chooseServiceModal && (
            <RBSheetModal
              height={85}
              open={chooseServiceModal}
              onClose={() => setChooseServiceModal(false)}
              backgroundColor={"#0000001A"}
            >
              <View style={styles.modalContainer}>
                <View style={styles.draggableContainer} />
                <View style={styles.modalView}>
                  <TouchableOpacity
                    onPress={() => setChooseServiceModal(false)}
                  >
                    <Image
                      source={CloseBlack}
                      style={[styles.close, { marginLeft: "100%" }]}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.secondModalContentContianer}>
                  <View style={styles.eliteContainer}>
                    <Text style={styles.eliteTextStyle}>
                      {t("gorexclub.Elite")}
                    </Text>
                  </View>
                  <View style={styles.modalTextContainer}>
                    <Text style={styles.autoServiceText}>
                      {t("gorexOnDemand.Elite Auto Service")}
                    </Text>
                    <View style={styles.footerContainer}>
                      <View style={styles.footerItems}>
                        <RatingStar width={13} height={13} />
                        <Text style={styles.footerItemText}>4.4</Text>
                      </View>
                      <View style={styles.footerItems}>
                        <LocationIcon width={13} height={13} />
                        <Text style={styles.footerItemText}>0.3 KM</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Text style={styles.chooseServiceText}>
                  {t("gorexOnDemand.Please Choose Service")}
                </Text>

                <View
                  style={[
                    styles.accordionWrapper,
                    { height: Platform.OS == "ios" ? "60%" : "60%" },
                  ]}
                >
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
                              </TouchableOpacity>
                            )}
                          />
                        </View>
                      )}
                    </Fragment>
                  ))}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setChooseServiceModal(false);
                    navigation.navigate("AddExtraPayment", {
                      selectedService: selectedService,
                    });
                  }}
                  style={styles.secondModalButtonStyle}
                  disabled={!selectedService}
                >
                  <Text style={styles.modalExtraServiceText}>
                    {t("gorexOnDemand.Add Extra Service")}
                  </Text>
                  <Text style={styles.srTextStyle}>
                    100 {t("gorexOnDemand.SR")}
                  </Text>
                </TouchableOpacity>
              </View>
            </RBSheetModal>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ExtraService;

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    margin: Utilities.wp(5),
  },
  modalView: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: Utilities.wp(8),
    // marginTop: Utilities.wp(2),
  },
  close: {
    width: Utilities.wp(6),
    height: Utilities.wp(6),
    marginLeft: "96%",
    tintColor: "black",
  },
  modalContainer: {
    // backgroundColor: "#4AD594",
    width: "100%",
  },
  draggableContainer: {
    backgroundColor: "#0000001A",
    width: 63,
    height: 6,
    alignSelf: "center",
    marginTop: Utilities.wp(5),
  },
  animationWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    height: Utilities.wp(60),
    width: Utilities.wp(70),
  },
  lottieStyle: {
    width: 40,
  },
  carLottieStyle: {
    width: Utilities.wp("50"),
    height: Utilities.wp("50"),
    alignSelf: "center",
  },
  progressText: {
    textAlign: "center",
    fontFamily: fonts.LexendBold,
    ...FontSize.rfs24,
    marginTop: 30,
    marginBottom: 20,
    color: Colors.BLACK,
  },
  footerItems: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginRight: wp(20),
  },
  footerItemText: {
    marginLeft: wp(5),
    fontFamily: fonts.LexendRegular,
    ...FontSize.rfs14,
    color: Colors.BLACK,
    textAlign: "left",
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
      maxWidth: "95%",
      borderBottomWidth: expanded ? 0 : 1,
      borderBottomLeftRadius: expanded ? 0 : 10,
      borderBottomRightRadius: expanded ? 0 : 10,
      marginHorizontal: 10,
    };
  },
  AccordionTitle: {
    color: Colors.BLACK,
    fontFamily: fonts.LexendBold,
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
      marginHorizontal: 10,
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
  sitTextStyle: {
    fontFamily: fonts.LexendRegular,
    fontSize: 18,
    color: Colors.LIGHTGREY,
    textAlign: "center",
  },
  addedServiceContainer: {
    width: "85%",
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    top: 50,
    backgroundColor: Colors.LIGHT_GREEN,
    borderRadius: 22,
    paddingHorizontal: 15,
  },
  queueImage: {
    height: 24,
    width: 24,
    tintColor: Colors.DARKERGREEN,
  },
  extraQueueStyle: {
    fontFamily: fonts.LexendMedium,
    color: Colors.DARKERGREEN,
    ...FontSize.rfs12,
    marginLeft: 10,
  },
  AddServiceButton: {
    width: "70%",
    backgroundColor: Colors.BLACK,
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    top: 50,
  },
  extraServiceText: {
    color: Colors.WHITE,
    fontFamily: fonts.LexendMedium,
    fontSize: 17,
  },
  lottieContainer: {
    width: "100%",
    height: "42%",
  },
  modalContentContainer: {
    width: "100%",
    height: "49%",
    alignItems: "center",
  },
  NeedTextStyle: {
    fontFamily: fonts.LexendBold,
    fontSize: 22,
    color: Colors.BLACK,
    marginBottom: 15,
  },
  clickTextStyle: {
    fontFamily: fonts.LexendRegular,
    fontSize: 18,
    color: Colors.LIGHTGREY,
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtonContainer: {
    backgroundColor: Colors.BLACK,
    width: "85%",
    borderRadius: 6,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginTop: 10,
  },
  modalButtonText: {
    color: Colors.WHITE,
    fontFamily: fonts.LexendBold,
    fontSize: 18,
  },
  secondModalContentContianer: {
    width: "100%",
    padding: 5,
    marginTop: 20,
    flexDirection: "row",
  },
  eliteContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#FF4E00",
    borderColor: "#F2F2F2",
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  eliteTextStyle: {
    fontFamily: fonts.LexendMedium,
    fontSize: 18,
    color: "#FFFFFF",
  },
  modalTextContainer: {
    width: "80%",
    padding: 5,
    marginHorizontal: 5,
  },
  autoServiceText: {
    fontFamily: fonts.LexendBold,
    fontSize: 15,
    color: Colors.BLACK,
  },
  footerContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  chooseServiceText: {
    fontFamily: fonts.LexendMedium,
    fontSize: 20,
    color: Colors.BLACK,
    marginHorizontal: 25,
    marginTop: 20,
  },
  secondModalButtonStyle: {
    backgroundColor: Colors.BLACK,
    width: "90%",
    borderRadius: 6,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
  },
  modalExtraServiceText: {
    color: Colors.WHITE,
    fontFamily: fonts.LexendBold,
    fontSize: 18,
  },
  srTextStyle: {
    color: Colors.WHITE,
    fontFamily: fonts.LexendBold,
    fontSize: 18,
  },
});
