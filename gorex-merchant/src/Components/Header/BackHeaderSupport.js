import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Platform,
  StatusBar,
} from "react-native";
import { AppLogo, SupportImage, WhiteGreenMenu } from "../../assets";
import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import { hp, wp } from "../../utils/responsiveSizes";
import Utilities from "../../utils/UtilityMethods";

const BackHeaderSupport = ({
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
    <View style={styles.root}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={leftPress ? leftPress : () => navigation.goBack()}
        >
          <WhiteGreenMenu width={wp(34.4)} height={hp(20.3)} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>

        {title ? (
          <Text style={styles.title}>{title}</Text>
        ) : (
          <AppLogo height={hp(50)} width={wp(200)} />
        )}

        <View style={{ width: 10 }} />
      </View>

      <Image
        source={SupportImage}
        style={{
          width: "100%",
          height: 200,
          position: "absolute",
          alignSelf: "center",
          bottom: -80,
        }}
        resizeMode={"contain"}
      />

      <View style={{ height: 200, marginTop: 100 }} />
      {children}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  root: {
    height: Utilities.hp(35),
    backgroundColor: "#362380",
    borderBottomLeftRadius: wp(20),
    borderBottomRightRadius: wp(20),
  },
  container: {
    alignItems: "center",
    width: "100%",
    height: Platform.OS === "android" ? Utilities.hp(8) : Utilities.hp(18),
    flexDirection: "row",
  },
  containerProfile: {
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
    width: Utilities.wp(15),
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
    width: Utilities.wp(70),
    color: Colors.WHITE,
    fontFamily: Fonts.LexendBold,
    textAlign: "center",
    ...FontSize.rfs18,
  },
});

//make this component available to the app
export default BackHeaderSupport;
