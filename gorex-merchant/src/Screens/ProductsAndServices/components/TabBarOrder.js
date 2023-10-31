import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../../Constants/Colors";
import Fonts from "../../../Constants/fonts";
import { hp, wp } from "../../../utils/responsiveSizes";
import Utilities from "../../../utils/UtilityMethods";
import FontSize from "../../../Constants/FontSize";

// create a component
const TabBarOrder = ({ active, setActive }) => {
  const { t } = useTranslation();

  const borderColor = () =>{
    let color = Colors.ORANGE;
    if (active === 1){
      color = Colors.DARKERGREEN;
    }else if (active === 3){
      color = Colors.RED;
    }
    return color;
  }



  return (
    <View style={[styles.container, {borderColor:borderColor()}]}>
      <TouchableOpacity style={[styles.tabContainer, active ===1&&{borderBottomWidth:3.5,borderColor:borderColor() }]} onPress={() => setActive(1)}>
        <Text style={[styles.text, active ===1&&{color:borderColor()}]}>{t("order_history.Completed")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.tabContainer, active ===2&&{borderBottomWidth:3.5, borderColor:borderColor()}]} onPress={() => setActive(2)}>
        <Text style={[styles.text, active ===2&&{color:borderColor()}]}>{t("order_history.Incompleted")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.tabContainer, active ===3&&{borderBottomWidth:3.5, borderColor:borderColor()}]} onPress={() => setActive(3)}>
        <Text style={[styles.text, active ===3&&{color:borderColor()}]}>{t("order_history.Cancelled")}</Text>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    height: Utilities.hp(6),
    flexDirection: "row",
    borderBottomWidth:1.5
  },

  tabContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "33.33%",
  },

  text: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs16,
    color: "#B8B9C1",
  },
});

//make this component available to the app
export default TabBarOrder;
