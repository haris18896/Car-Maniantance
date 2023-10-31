import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import Colors from "../../../Constants/Colors";
import { OrderConfirmedImage } from "../../../assets";
import { hp, wp } from "../../../utils/responsiveSizes";

import BackHeader from "../../../Components/Header/BackHeader";
import MessageWithImage from "../../../Components/MessageWithImage";
import Footer from "../../ProductsAndServices/components/Footer";
import analytics from "@react-native-firebase/analytics";

const GoDOrderConfirmed = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "order_confirmed_screen",
    });
  }, []);

  return (
    <View style={styles.screen}>
      <BackHeader title={t("common.gorexOnDemand")} />
      <View style={styles.contentContainer}>
        <MessageWithImage
          imageSource={OrderConfirmedImage}
          imageStyle={styles.imageStyle}
          message={t("orderConfirmed.orderConfirmed")}
          description={t("orderConfirmed.orderConfirmedDescription")}
        />
      </View>
      <Footer
        title={t("common.done")}
        onPress={() => navigation.navigate("Dashboard")}
      />
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
    justifyContent: "center",
  },
  imageStyle: {
    width: wp(75),
    height: hp(108),
  },
});

export default GoDOrderConfirmed;
