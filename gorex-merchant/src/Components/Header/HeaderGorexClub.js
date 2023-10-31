//import liraries
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  ImageBackground,
} from "react-native";
import {
  ClubText,
  GorexClubBg,
} from "../../assets";
import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import { hp, wp } from "../../utils/responsiveSizes";
import Utilities from "../../utils/UtilityMethods";

// create a component
const HeaderGorexClub = ({
  rightIcon,
  title,
  profile,
  RightTitle,
  RightPress,
  leftIcon,
  children,
  leftPress,
}) => {
  const navigation = useNavigation();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  return (
    <ImageBackground source={GorexClubBg} style={styles.root}>
      <View style={profile ? styles.containerProfile : styles.container}>
        <TouchableOpacity
          onPress={leftPress ? leftPress : () => navigation.goBack()}
          style={styles.menuButton}
        >
          <Image style={styles.logo} source={leftIcon} />
        </TouchableOpacity>
        <View style={{ width: 10 }} />
      </View>
      <Image
        source={ClubText}
        style={{
          width: "50%",
          height: 200,
          position: "absolute",
          alignSelf: "center",
        }}
        resizeMode={"contain"}
      />
      <View style={{ height: 100, marginTop: 80 }} />
      {children}
    </ImageBackground>
  );
};

// define your styles
const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: Utilities.hp(35),
    borderBottomLeftRadius: wp(20),
    borderBottomRightRadius: wp(20),
  },
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: hp(100),
    flexDirection: "row",
  },
  containerProfile: {
    justifyContent: "space-between",
    // alignItems: 'center',
    backgroundColor: Colors.BLUE,
    borderBottomLeftRadius: hp(20),
    borderBottomRightRadius: hp(20),
    height: hp(150),
    paddingTop: hp(20),
    flexDirection: "row",
    paddingHorizontal: 9,
  },
  arrow: {
    width: wp(15),
    height: wp(15),
  },
  logo: {
    width: Utilities.wp(7),
    marginLeft: 30,
    resizeMode: "contain",
    height: hp(25),
  },
  menuButton: {
    width: Utilities.hp(2),
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    width: wp(60),
  },
  space: {
    marginLeft: wp(30),
  },
  title: {
    color: Colors.WHITE,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs18,
  },
});

//make this component available to the app
export default HeaderGorexClub;
