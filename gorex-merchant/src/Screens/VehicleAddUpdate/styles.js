import { StyleSheet } from "react-native";
import Colors from "../../Constants/Colors";
import Utilities from "../../utils/UtilityMethods";
import { hp, wp } from "../../utils/responsiveSizes";
import FontSize from "../../Constants/FontSize";
import Fonts from "../../Constants/fonts";
import VehicleInformation from "./index";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  modalTitle: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs20,
    marginBottom: hp(15),
    textAlign: 'left'
  },
  contentSheet: {
    flex: 1,
    paddingHorizontal: Utilities.wp(3),
  },
  sheetContent: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: hp(30),
  },

  addVehicleIstimaraTitleText: {
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendBold,
    paddingVertical: hp(10),
    textAlign: "left",
    color: Colors.BLACK,
  },

  pleaseAddVehicleTitleText: {
    ...FontSize.rfs20,
    paddingVertical: hp(10),
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    color: Colors.BLACK,
  },
  bottomText: {
    marginTop: hp(30),
    textAlign: "center",
    ...FontSize.rfs13,
    fontFamily: Fonts.LexendRegular,
    color: Colors.BLACK,
  },
  modalPickersWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imagePicker: {
    width: wp(350),
    height: hp(200),
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    paddingHorizontal: wp(20),
  },
  title: {
    color: Colors.WHITE,
    fontFamily: Fonts.LexendSemiBold,
    textAlign: "left",
    ...FontSize.rfs14,
  },
  bg: {
    width: wp(180),
    height: hp(100),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  istimaraBGImage: {
    borderRadius: Utilities.wp(3),
  },
  content2: {
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
  optionsContainer: {
    padding: wp(20),
  },
  option: {
    height: hp(50),
    borderBottomWidth: 1,
    borderColor: Colors.BLACK_OPAC,
    justifyContent: "center",
    marginBottom: hp(10),
  },
  disabledText: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs18,
    marginBottom: Utilities.wp(3),
    textAlign: "left",
  },
  text2: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs18,
    fontWeight: "00",
    textAlign: "left",
  },
  inputtextContainer: {
    padding: wp(20),
    justifyContent: "center",
  },
  inputtextContainerSheet: {
    marginTop: Utilities.hp(4),
    paddingHorizontal: Utilities.wp(5),
    justifyContent: "center",
  },
  header2: {
    width: "30%",
    height: 5,
    borderRadius: 5,
    backgroundColor: Colors.GREY,
  },
  btn2: {
    alignItems: "center",
    backgroundColor: Colors.DARKERGREEN,
    borderRadius: 5,
    height: hp(60),
    marginBottom: 10,
    justifyContent: "center",
    width: wp(330),
    alignSelf: "center",
  },
  btn3: {
    backgroundColor: Colors.DARKERGREEN,
    height: hp(60),
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: wp(5),
    paddingHorizontal: wp(10),
  },
  input: {
    borderBottomColor: Colors.BLACK,
    borderBottomWidth: 1,
    paddingVertical: hp(4),
    fontFamily: Fonts.LexendRegular,
    textAlign: "left",
    ...FontSize.rfs14,
    color: Colors.BLACK,
    paddingLeft: 0,
  },
  title2: {
    color: Colors.WHITE,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs16,
  },
  deleteBtn: {
    backgroundColor: Colors.BTN_LIGHT_RED,
    justifyContent: "center",
    borderColor: Colors.RED,
    borderWidth: 2,
    alignItems: "center",
    borderRadius: Utilities.wp(5),
    width: Utilities.wp(25),
    height: Utilities.hp(4),
  },
});

export default styles;
