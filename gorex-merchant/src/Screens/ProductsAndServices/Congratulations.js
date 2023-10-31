//import liraries
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, Image } from "react-native";
import { Cart, Congrats } from "../../assets";
import FullButton from "../../Components/Buttons/FullButton";
import BackHeader from "../../Components/Header/BackHeader";
import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import { hp, wp } from "../../utils/responsiveSizes";
import FontSize from "../../Constants/FontSize";
import analytics from "@react-native-firebase/analytics";

// create a component
const Congratulations = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const title = route?.params?.title;

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "congratulations_screen",
    });
  }, []);

  return (
    <View style={styles.container}>
      <BackHeader rightIcon={Cart} title={title} />
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.lightText}>{t("congratulations.Many")}</Text>
          <Text style={styles.heavyText}>
            {t("congratulations.Congratulations")}
          </Text>
          <Text style={styles.lightText}>
            {t("congratulations.You have successfully created your Order.")}
          </Text>
          <View style={styles.imageConainer}>
            <Image style={styles.image} source={Congrats} />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <FullButton
            onPress={() => navigation.navigate("Dashboard")}
            title={t("congratulations.Ok")}
          />
        </View>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  content: {
    flex: 1,
    justifyContent: "space-around",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(30),
    paddingHorizontal: hp(30),
  },
  lightText: {
    fontFamily: Fonts.LexendRegular,
    ...FontSize.rfs16,
    color: Colors.BLUE,
    textAlign: "center",
  },
  heavyText: {
    fontFamily: Fonts.LexendSemiBold,
    textAlign: "left",
    ...FontSize.rfs26,
    color: Colors.BLUE,
  },
  imageConainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(32),
  },
  image: {
    width: wp(277),
    height: hp(222),
  },
});

//make this component available to the app
export default Congratulations;
