import { StyleSheet } from "react-native";

// ** Responsive Sizes
import { hp, wp } from "../../utils/responsiveSizes";

// ** Theme
import fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import FontFamily from "../../Constants/FontFamily";
import Utilities from "../../utils/UtilityMethods";
import Fonts from "../../Constants/fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    position: "absolute",
    bottom: hp(200),
    right: wp(20),
  },
  offers: {
    marginHorizontal: wp(10),
    width: "100%",
    height: hp(100),
    position: "absolute",
    top: hp(150),
    left: wp(0),
  },
  offersWrapper: {
    width: wp(385),
    borderRadius: wp(15),
  },
  offersComponent: {
    width: "100%",
    marginHorizontal: wp(10),
    height: "100%",
    borderRadius: wp(15),
    resizeMode: "cover",
  },
  offersDetails: {
    width: "100%",
    backgroundColor: "transparent",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    height: "100%",
    borderRadius: wp(15),
  },
  offerName: {
    // backgroundColor: "red",
    marginHorizontal: wp(20),
    color: "white",
    fontFamily: fonts.LexendBold,
    ...FontSize.rfs20,
    marginTop: wp(10),
    textAlign: "left",
  },
  offersButton: {
    marginHorizontal: wp(20),
    marginVertical: wp(10),
    paddingVertical: wp(8),
    paddingHorizontal: wp(35),
    borderRadius: wp(30),
    backgroundColor: Colors.BLACK,
  },
  offersButtonText: {
    color: Colors.WHITE,
    fontFamily: fonts.LexendBold,
    ...FontSize.rfs18,
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    bottom: hp(0),
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 15,
    left: "45%",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: Colors.DARKERGREEN,
    transform: [{ rotate: "-180deg" }],
  },
  branchSize: {
    ...FontFamily.medium,
    color: Colors.WHITE,
    textAlign: "center",
  },
  bottomSheetContainer: {
    flex: 1,
    backgroundColor: "white",
    marginHorizontal: Utilities.wp(4),
    marginVertical: Utilities.wp(4),
    borderRadius: Utilities.wp(8),
    paddingHorizontal: Utilities.wp(6),
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Utilities.wp(6),
    alignItems: "center",
  },
  bottomSheetHeaderLeft: {
    flex: 1,
  },
  bottomSheetHeaderLeftText: {
    fontFamily: fonts.LexendBold,
    ...FontSize.rfs20,
    color: Colors.BLACK,
    textAlign: "left",
    marginRight: Utilities.wp(3),
  },
  bottomSheetHeaderRightIcon: {
    width: 24,
    height: 24,
  },
  servicesScrollView: {
    marginBottom: Utilities.wp(6),
  },
  servicesContentContainer: {
    height: "100%",
    flex: 1,
  },
  servicesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: Utilities.wp(3),
  },
  serviceIcon: {
    width: 26,
    height: 26,
    marginRight: Utilities.wp(3),
  },
  serviceText: {
    fontFamily: fonts.LexendBold,
    ...FontSize.rfs14,
    color: Colors.BLACK,
    textAlign: "left",
  },
  bottomSheetBottomButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Utilities.wp(6),
  },
  bottomSheetButtonTouchable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Utilities.wp(5),
    backgroundColor: Colors.DARKERGREEN,
    borderRadius: Utilities.wp(1),
    paddingVertical: Utilities.wp(4),
    paddingHorizontal: Utilities.wp(3),
    position: "relative",
  },
  bottomSheetButtonIcon: {
    position: "absolute",
    left: Utilities.wp(3),
  },
  bottomSheetButtonText: {
    fontFamily: fonts.LexendBold,
    ...FontSize.rfs18,
    color: Colors.WHITE,
    textAlign: "center",
    marginLeft: Utilities.wp(3),
  },
  modalView: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: Utilities.wp(8),
    justifyContent: "space-between",
  },
  modalHeader: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  modalDataDescription: {
    height: 40,
    width: 40,
    borderRadius: 40,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  modalNameAlphabet: {
    fontFamily: fonts.LexendMedium,
    fontSize: 15,
    color: "black",
  },
  modalTier: {
    fontFamily: fonts.LexendMedium,
    fontSize: 15,
    color: "black",
    marginBottom: 3,
    textAlign: "left",
  },
  modalUserName: {
    fontFamily: fonts.LexendBold,
    fontSize: 17,
    color: "black",
    marginBottom: 4,
    textAlign: "left",
  },
  modalId: {
    fontFamily: fonts.LexendMedium,
    fontSize: 15,
    color: "black",
    textAlign: "left",
  },
  close: {
    width: Utilities.wp(5),
    height: Utilities.wp(5),
  },
  GradientStyles: {
    width: "100%",
    height: "90%",
    alignItems: "center",
    marginTop: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  gradientContainer: {
    height: 198,
    width: 198,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 120,
  },
  scannedServiceProvider: {
    fontFamily: fonts.LexendBold,
    fontSize: 20,
    color: "white",
    marginTop: 40,
    marginBottom: 5,
    textAlign: "center",
    paddingHorizontal: 5,
  },
  imageContainer: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    marginTop: 30,
  },
  imageWrapper: {
    flexDirection: "row",
    width: "40%",
    alignItems: "center",
    marginLeft: 1,
  },
  getDiscount: {
    fontFamily: fonts.LexendRegular,
    fontSize: 16,
    color: Colors.WHITE,
    marginLeft: 10,
    width: "100%",
  },
  gorexCoin: {
    flexDirection: "row",
    width: "40%",
    alignItems: "center",
  },
  earnCoin: {
    fontFamily: fonts.LexendRegular,
    fontSize: 16,
    color: Colors.WHITE,
    marginLeft: 10,
    width: "100%",
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: wp(20),
  },
  noDataText: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs14,
    textAlign: "center",
  },
});
