import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

// ** Third party Packages
import { useTranslation } from "react-i18next";

// ** Custom Components
import Colors from "../../Constants/Colors";
import Footer from "../ProductsAndServices/components/Footer";
import BackHeader from "../../Components/Header/BackHeader";
import { wp } from "../../utils/responsiveSizes";
import { useNavigation } from "@react-navigation/native";
import { successOffers } from "../../assets";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";

function OfferPromoSuccess({ route }) {
  const { title } = route?.params;
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <BackHeader title={title} />

      <View style={styles.mainWrapper}>
        <Image source={successOffers} style={styles.successOffersImage} />
        <Text style={styles.congrats}>{t("offers.congrats")}!</Text>
        <Text style={styles.successDescription}>
          {t("offers.offerSuccessDescription")}
        </Text>
      </View>

      <Footer
        // disabled={!isValidCoupon}
        title={t("offers.done")}
        onPress={() => navigation.navigate("DashboardScreen")}
      />
    </View>
  );
}

export default OfferPromoSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  mainWrapper: {
    flex: 1,
    margin: wp(25),
    justifyContent: "center",
    alignItems: "center",
  },
  successOffersImage: {
    width: wp(130),
    height: wp(132),
    marginBottom: wp(25),
  },
  congrats: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs24,
    color: Colors.BLACK,
    textAlign: "center",
    marginBottom: wp(20),
  },
  successDescription: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs18,
    color: Colors.GREY,
    textAlign: "center",
    width: "80%",
  },
});
