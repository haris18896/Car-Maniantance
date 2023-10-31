import { StyleSheet } from "react-native";
import Colors from "../../../Constants/Colors";

import FontSize from "../../../Constants/FontSize";
import { hp, wp } from "../../../utils/responsiveSizes";

export default styles = StyleSheet.create({
  picker: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  countryCode: (screen) => {
    return {
      ...FontSize.rfs16,
      fontFamily: fonts.LexendRegular,
      color: screen === "Login" ? Colors.WHITE : Colors.DARK_BLACK,
    };
  },
  arrow: {
    width: wp(9),
    height: hp(6),
  },
});
