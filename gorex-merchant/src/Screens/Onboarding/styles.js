// define your styles
import { StyleSheet } from "react-native";
import Utilities from "../../utils/UtilityMethods";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import Colors from "../../Constants/Colors";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const styles = StyleSheet.create({
  skipButton: {
    alignSelf: "flex-end",
    paddingTop: 30,
    width: wp(150),
  },

  skipButtonText: {
    color: "white",
    justifyContent: "flex-end",
    textAlign: "right",
    ...FontSize.rfs14,
    marginRight: Utilities.hp(2),
    fontFamily: Fonts.LexendRegular,
    marginTop:
      Utilities.isIosDevice() && Utilities.hasNotch()
        ? Utilities.hp(2)
        : Utilities.wp(0),
  },

  swiperContainer: {
    flex: 1,
  },

  paddedContent: {
    justifyContent: "center",
    alignItems: "center",
  },

  paymentContainer: {
    width: "100%",
    alignSelf: "center",
    paddingVertical: Utilities.hp(1),
  },

  image: {
    resizeMode: "contain",
    width: Utilities.wp(70),
    height: Utilities.hp(65),
    alignSelf: "center",
    marginTop: Utilities.wp(3),
  },

  titleText: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "center",
    alignSelf: "center",
    alignItems: "center",
    ...FontSize.rfs18,
    color: Colors.DARKERGREEN,
    marginTop: Utilities.wp(2),
  },
  subtitleText: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs24,
    color: Colors.WHITE,
    textAlign: "center",
    alignSelf: "center",
    alignItems: "center",
    marginTop: Utilities.hp(1),
  },

  nextButtonView: {
    flex: 0.07,
    position: "absolute",
    alignItems: "flex-end",
    bottom: hp(2.5),
    right: wp(4),
    width: wp(30),
  },

  nextButton: {
    flexDirection: "row",
    width: wp(14),
    justifyContent: "space-between",
  },

  nextButtonText: {
    color: "white",
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendRegular,
  },

  nextButtonArrow: {
    alignItems: "center",
    paddingTop: hp(0.5),
  },

  row: {
    flexDirection: "row",
    height: Utilities.hp(6),
    paddingLeft: Utilities.wp(50),
  },
});

export default styles;
