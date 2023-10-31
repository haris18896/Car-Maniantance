import React, { useState, useRef, useMemo, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// ** Third Party Packages
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

// ** Components
import Loader from "../../../Components/Loader";
import { GreyDownArrow, NoTopUpCard } from "../../../assets";
import BackHeader from "../../../Components/Header/BackHeader";
import Footer from "../../ProductsAndServices/components/Footer";

// ** Custom Styling
import Fonts from "../../../Constants/fonts";
import Colors from "../../../Constants/Colors";
import FontSize from "../../../Constants/FontSize";
import Utilities from "../../../utils/UtilityMethods";
import { hp, wp } from "../../../utils/responsiveSizes";
import { CommonContext } from "../../../contexts/ContextProvider";
import GetWallet from "../../../api/GetWallet";
import { showToast } from "../../../utils/common";
import GetSubSubscriptionPlans from "../../../api/GetSubscriptionPlans";
import Modal from "../components/Modal";
import ShowPlans from "../components/ShowPlans";
import ShowCards from "../components/ShowCards";
import DevicePaymentAPI from "../../../api/DevicePaymentAPI";
import WebView from "react-native-webview";
import { GetProfile } from "../../../api/CallAPI";
import { setPlaceOrderNow } from "../../../contexts/global";

function Subscription() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  // ** Context
  const { userProfile, setUserProfile, GoTrack, setGoTrack } =
    useContext(CommonContext);

  // Ref
  const SubscriptionRef = useRef(null);
  const walletRef = useRef(null);

  // ** States
  const [url, setUrl] = useState(null);
  const [plans, setPlans] = useState([]);
  const [wallet, setWallet] = useState([]);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [selectedCard, setSelectedCard] = useState({});
  const [cardModal, setCardModal] = useState(false);
  const [subscriptionModal, setSubscriptionModal] = useState(false);

  // ** Get Cards
  const getCustomerCards = async () => {
    setLoading(true);
    await GetWallet(userProfile?.id).then(({ success, response }) => {
      setLoading(false);
      if (success) {
        setWallet(response);
      } else {
        showToast("Error", response, "error");
      }
    });
  };

  const getSubscriptions = async () => {
    setLoading(true);
    await GetSubSubscriptionPlans().then(({ success, response }) => {
      setLoading(false);
      if (success) {
        setPlans(response);
      } else {
        showToast("Error", response, "error");
      }
    });
  };

  const paymentData = useMemo(() => {
    return {
      name: GoTrack?.device?.device_name,
      imei_no: GoTrack?.device?.imei_no,
      sim_no: GoTrack?.device?.sim_no || "",
      tracking_vehicle_id: GoTrack?.device?.asset?.id,
      vehicle_id: GoTrack?.device?.vehicle?.id,
      vehicle_type_id: GoTrack?.device?.vehicle_type?.id,
      subscription_plan_id: selectedPlan?.id,
      partner_id: userProfile?.id,
      date: moment().format().split("T")[0],
      valid_till: moment()
        .add(1, selectedPlan?.plan === "monthly" ? "month" : "year")
        .format()
        .split("T")[0],
      status: "expired",
      card_id: selectedCard?.id,
    };
  }, [GoTrack, selectedCard, selectedPlan]);

  const AddCustomerDevice = async () => {
    setPending(true);
    await DevicePaymentAPI({ data: paymentData }).then(
      ({ success, response, error }) => {
        setPending(false);
        setCardModal(false);
        if (success) {
          setGoTrack({
            ...GoTrack,
            install_date: moment().format().split("T")[0],
            expiry_date: moment()
              .add(1, selectedPlan?.plan === "monthly" ? "month" : "year")
              .format()
              .split("T")[0],
            plan: selectedPlan,
            card: selectedCard,
          });
          setUrl(response?.data);
          // navigation.navigate("DeviceSuccess");
        } else {
          showToast("Error", response, "error");
        }
      }
    );
  };

  const fetchAndUpdateLatestProfile = async () => {
    const { id } = userProfile;
    const getProfileResponse = await GetProfile({ profileID: id });
    if (getProfileResponse?.success) {
      setUserProfile(getProfileResponse?.data[0]);
      navigation.navigate("DeviceSuccess");
    } else {
      return navigation.goBack();
    }
  };

  const renderWebViewForUrwayPayment = () => {
    return (
      <WebView
        onShouldStartLoadWithRequest={(request) => true}
        javaScriptEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={["*"]}
        useWebKit
        startInLoadingState
        scalesPageToFit
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error: ", nativeEvent);
        }}
        onNavigationStateChange={(state) => {
          if (state?.url?.includes("ResponseCode=000")) {
            fetchAndUpdateLatestProfile().then();
          } else if (state?.url?.includes("ResponseCode=337")) {
            showToast(
              t("errors.error"),
              t("payment.TransactionLimitExceeded"),
              "error"
            );
          } else if (state?.url?.includes("ResponseCode=001")) {
            showToast("Error", "Pending for Authorisation", "error");
          }
        }}
        source={{
          uri: url.toString(),
        }}
        style={{ marginTop: 20 }}
      />
    );
  };

  return (
    <>
      {url ? (
        renderWebViewForUrwayPayment()
      ) : (
        <View style={styles.container}>
          <BackHeader title={t("GoTrack.addDevice.addDevice")} />

          <ScrollView contentContainerStyle={styles.addDeviceWrapper}>
            <View style={styles.Heading}>
              <Text style={styles.title}>
                {t("GoTrack.addDevice.subscription")}
              </Text>
              {/*<Text style={styles.description}>*/}
              {/*  {t("GoTrack.addDevice.addDeviceDescription")}*/}
              {/*</Text>*/}
            </View>

            <View style={styles.InputWrapper}>
              <Text style={styles.inputHeading}>
                {t("GoTrack.addDevice.subscriptionPlan")}
              </Text>

              <TouchableOpacity
                onPress={() => setSubscriptionModal(true)}
                style={styles.inputValueWrapper}
              >
                <Text style={styles.inputSelector}>
                  {selectedPlan?.plan
                    ? `${selectedPlan?.plan} - ${selectedPlan?.amount} ${t(
                        "SAR"
                      )}`
                    : t("GoTrack.addDevice.pleaseSelect")}
                </Text>
                <GreyDownArrow width={wp(14)} height={wp(14)} />
              </TouchableOpacity>
            </View>
          </ScrollView>

          <Modal
            pending={pending}
            loading={loading}
            reference={walletRef}
            selectModal={cardModal}
            height={Utilities.hp(70)}
            addText={t("GoTrack.addDevice.addNew")}
            confirmDisabled={!selectedCard?.id || pending}
            title={t("GoTrack.addDevice.paymentOptions")}
            apiCall={() => getCustomerCards()}
            confirmTitle={t("GoTrack.addDevice.select_Pay")}
            onClose={() => setCardModal(false)}
            pressAddNew={() => {
              setCardModal(false);
              navigation.navigate("AddCard");
            }}
            confirm={() => {
              AddCustomerDevice().then();
            }}
          >
            <ShowCards
              data={wallet}
              loading={loading}
              selected={selectedCard}
              emptyImage={NoTopUpCard}
              emptyTitle={t("creditcard.nocard")}
              emptyDescription={t("creditcard.account")}
              refreshing={() => getCustomerCards()}
              onItemPress={({ item }) => {
                setSelectedCard((prev) => (prev === item ? null : item));
              }}
            />
          </Modal>

          {/* Plans */}
          <Modal
            loading={loading}
            reference={SubscriptionRef}
            selectModal={subscriptionModal}
            height={Utilities.hp(20)}
            confirmDisabled={!selectedPlan?.id}
            apiCall={() => getSubscriptions()}
            onClose={() => {
              setSubscriptionModal(false);
            }}
          >
            <ShowPlans
              data={plans}
              loading={loading}
              selected={selectedPlan}
              emptyTitle={t("GoTrack.addDevice.noPlans")}
              refreshing={() => getSubscriptions()}
              emptyDescription={t("GoTrack.addDevice.noPlansDescription")}
              onItemPress={({ item }) => {
                setSubscriptionModal(false);
                setSelectedPlan((prev) => (prev === item ? null : item));
              }}
            />
          </Modal>

          <Footer
            disabled={!selectedPlan?.amount}
            title={t("GoTrack.addDevice.confirm_pay")}
            onPress={() => setCardModal(true)}
          />
        </View>
      )}
    </>
  );
}

export default Subscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  addDeviceWrapper: {
    paddingHorizontal: wp(20),
    flexGrow: 1,
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
  InputWrapper: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  inputHeading: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs16,
    color: Colors.BLACK,
    textAlign: "left",
    marginBottom: wp(10),
  },
  inputValueWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: `#F2F2F2`,
    borderRadius: wp(25),
    paddingVertical: hp(12),
    paddingHorizontal: wp(20),
    marginBottom: wp(20),
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputSelector: {
    fontFamily: Fonts.LexendRegular,
    ...FontSize.rfs16,
    textAlign: "left",
    color: Colors.BLACK,
    textTransform: "capitalize",
  },
  endEndorsement: {
    width: wp(20),
    height: hp(20),
  },
  modalCancel: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 999,
  },
  cancelText: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs18,
    textAlign: "left",
  },
  statusSelectView: {
    marginVertical: hp(20),
    flex: 1,
  },
  selectStatusButton: {
    marginVertical: hp(5),
    paddingVertical: hp(10),
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  planTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  planText: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs18,
    color: Colors.BLACK,
    textAlign: "left",
    marginLeft: wp(10),
    textTransform: "capitalize",
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
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
