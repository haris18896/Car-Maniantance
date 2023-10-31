import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Colors from "../../../../Constants/Colors";
import BackHeader from "../../../../Components/Header/BackHeader";
import { OrderConfirmedImage } from "../../../../assets";
import fonts from "../../../../Constants/fonts";
import FontSize from "../../../../Constants/FontSize";
import Footer from "../../../ProductsAndServices/components/Footer";
import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";

const AddExtraService = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <BackHeader title={t("common.gorexOnDemand")} />
      <View style={styles.contentContainer}>
        <Image
          source={OrderConfirmedImage}
          resizeMode={"contain"}
          style={styles.confirmedImageStyle}
        />
        <Text style={styles.extraServiceStyle}>
          {t("gorexOnDemand.servicesAdded")}
        </Text>
        <Text style={styles.subTitleStyle}>
          {t("gorexOnDemand.extraServiceCompleted")}
        </Text>
      </View>
      <Footer
        title={t("orderConfirmed.trackServiceStatus")}
        // disabled={!paymentMethod}
        // onPress={onPressPlaceOrder}
        onPress={() => {
          navigation.navigate("ExtraService", { addedExtraService: true });
        }}
      />
    </View>
  );
};

export default AddExtraService;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmedImageStyle: {
    height: "20%",
    width: "20%",
    marginBottom: 30,
  },
  extraServiceStyle: {
    fontFamily: fonts.LexendBold,
    ...FontSize.rfs22,
    color: Colors.BLACK,
    textAlign: "center",
    marginBottom: 18,
  },
  subTitleStyle: {
    fontFamily: fonts.LexendRegular,
    ...FontSize.rfs14,
    color: Colors.DARK_GREY,
    textAlign: "center",
  },
});
