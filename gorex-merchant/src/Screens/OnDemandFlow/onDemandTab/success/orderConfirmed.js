import React, { useContext, useEffect } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import Colors from "../../../../Constants/Colors";
import BackHeader from "../../../../Components/Header/BackHeader";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Footer from "../../../ProductsAndServices/components/Footer";
import { OrderConfirmedImage } from "../../../../assets";
import Utilities from "../../../../utils/UtilityMethods";
import Fonts from "../../../../Constants/fonts";
import FontSize from "../../../../Constants/FontSize";
import { CommonContext } from "../../../../contexts/ContextProvider";

// ** Third Party Packages

// ** Custom Components

function OrderPlaced() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { setOnDemandOrder } = useContext(CommonContext);

  return (
    <View style={styles.mainContainer}>
      <BackHeader
        title={t("common.gorexOnDemand")}
        leftPress={() => {
          navigation.navigate("DashboardScreen");
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
            {`${t("orderConfirmed.orderConfirmedDescription")} ${t(
              "orderConfirmed.willLetYouKnowOnceConfirmed"
            )}`}
          </Text>
        </View>
      </View>

      <Footer
        // title={"My Requests"}
        title={t("vehicle.done")}
        onPress={async () => {
          await navigation.navigate("MyGorexOnDemandRequests");
          await setOnDemandOrder({});
          // navigation.navigate("TrackServiceStatus");
        }}
        // title={t("orderConfirmed.trackServiceStatus")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    resizeMode: "contain",
    width: Utilities.wp(25),
  },
  separator: {
    marginBottom: Utilities.wp(5),
  },
  titleText: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs24,
    color: Colors.BLACK,
  },
  subTitleView: {
    width: "70%",
  },
  subTitleText: {
    ...FontSize.rfs14,
    textAlign: "center",
    fontFamily: Fonts.LexendRegular,
    color: Colors.GREY,
  },
});

export default OrderPlaced;
