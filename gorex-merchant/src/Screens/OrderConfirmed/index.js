import React, { useContext, useEffect } from "react";
import { Text, View, Image } from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import styles from "./styles";
import { OrderConfirmedImage } from "../../assets";
import BackHeader from "../../Components/Header/BackHeader";
import { CommonContext } from "../../contexts/ContextProvider";
import Footer from "../ProductsAndServices/components/Footer";
import { GetProfile } from "../../api/CallAPI";
import analytics from "@react-native-firebase/analytics";
// import crashlytics from "@react-native-firebase/crashlytics";

const OrderConfirmed = (props) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { selectedBranch, setUserProfile, userProfile, setOnDemandOrder } =
    useContext(CommonContext);

  useEffect(() => {
    //This is to update the wallet as order has been placed now so wallet amount should be update
    fetchAndUpdateLatestProfile().then();

    analytics().logScreenView({
      screen_name: "order_confirm_screen",
    });
  }, []);

  const fetchAndUpdateLatestProfile = async () => {
    GetProfile({ profileID: userProfile.id })
      .then((getProfileResponse) => {
        if (getProfileResponse?.success) {
          setUserProfile(getProfileResponse?.data[0]);
        }
      })
      // .catch((err) => crashlytics().recordError(err));
  };

  return (
    <View style={styles.mainContainer}>
      <BackHeader
        title={selectedBranch.name}
        leftPress={() => {
          navigation.navigate("Dashboard");
          setOnDemandOrder({});
        }}
      />
      <View style={styles.centerContainer}>
        <Image style={styles.image} source={OrderConfirmedImage} />

        <View style={styles.separator} />

        <Text style={styles.titleText}>
          {t("orderConfirmed.orderConfirmed")}
        </Text>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitleText}>
            {t("orderConfirmed.orderConfirmedDescription")}
          </Text>
        </View>
      </View>

      <Footer
        title={t("orderConfirmed.viewOrder")}
        onPress={() => {
          navigation.navigate("OrderDetails", {
            branch_id: selectedBranch.id,
            order_id: props?.route?.params?.order_id,
            isOnDemand: true,
          });
        }}
      />
    </View>
  );
};

export default OrderConfirmed;
