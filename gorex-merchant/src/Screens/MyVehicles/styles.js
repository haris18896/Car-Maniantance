import { StyleSheet } from "react-native";
import Colors from "../../Constants/Colors";
import { hp, wp } from "../../utils/responsiveSizes";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  plusButton: {
    height: hp(40),
    width: hp(40),
    borderRadius: 7,
    backgroundColor: Colors.LIGHT_BLUE,
    position: "absolute",
    bottom: hp(20),
    right: hp(20),
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: {
    width: wp(21),
    height: wp(21),
  }
});

export default styles;
