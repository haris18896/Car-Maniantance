import React from "react";

import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Platform,
  Linking,
} from "react-native";
import BackHeader from "../Components/Header/BackHeader";
import Colors from "../Constants/Colors";
import Fonts from "../Constants/fonts";
import Utilities from "../utils/UtilityMethods";
import FontSize from "../Constants/FontSize";
import { hp, wp } from "../utils/responsiveSizes";
import Footer from "./ProductsAndServices/components/Footer";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import OfferRedeem from "./offer/offerRedeme";

const OfferDetail = ({ route }) => {
  const offer = route?.params?.offer;
  const title = route?.params?.title;

  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <BackHeader title={title} />
      <View style={{ height: hp(10) }} />
      <View style={{ paddingHorizontal: wp(14), flex: 1 }}>
        <View
          style={{
            shadowColor: "#171717",
            shadowOffset: { width: 3, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <Image
            style={styles.image}
            source={{ uri: `data:image/gif;base64,${offer?.image}` }}
          />
        </View>
        <Text style={styles.orderNumber}>{offer?.name}</Text>
        <ScrollView contentContainerStyle={{ paddingBottom: hp(20) }}>
          <Text style={styles.description}>{offer?.description}</Text>
        </ScrollView>
      </View>

      {offer?.is_consumable && (
        <Footer
          title={t("offers.RedeemOffer")}
          onPress={() =>
            navigation.navigate("OfferRedeem", {
              banner: offer?.image,
              title: title,
              companyCode: false,
            })
          }
          // onPress={() =>
          //   navigation.navigate("GoDChooseVehicle", {
          //     offerTitle: title,
          //     offer: true
          //   })
          // }
          // onPress={() => navigation.navigate("OfferRedeem", { title })}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    flex: 1,
  },

  orderNumber: {
    paddingTop: wp(30),
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs20,
    color: Colors.BLACK,
  },
  description: {
    paddingVertical: wp(10),
    fontFamily: Fonts.LexendRegular,
    ...FontSize.rfs16,
    color: Colors.BLACK,
  },

  image: {
    width: Utilities.wp(93),
    height: Utilities.hp(30),
    borderRadius: wp(10),
  },
});

export default OfferDetail;
