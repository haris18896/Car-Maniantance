import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// ** Custom Components
import { hp, wp } from "../../utils/responsiveSizes";

// ** Third Party Packages
import { useTranslation } from "react-i18next";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";

// create a component
const TabBar = ({ active, setActive, itemsList }) => {
  const { t } = useTranslation();
  return (
    <ScrollView
      horizontal={true}
      style={styles.container}
      showsHorizontalScrollIndicator={false}
    >
      {itemsList.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => setActive(index)}
          style={styles.tabBar(active, index, item.color)}
        >
          <Text
            style={[
              styles.tabBarTitleText(active, index, item.color),
              active === index && { color: item.color },
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    height: hp(40),
    marginTop: hp(15),
  },

  tabBar: (active, index, color) => {
    return {
      marginHorizontal: wp(7),
      borderBottomWidth: active === index ? 4 : 2,
      color: active === index ? color : "#D5D5D5",
      borderColor: active === index ? color : "transparent",
    };
  },

  tabBarTitleText: (active, index, color) => {
    return {
      fontFamily: Fonts.LexendMedium,
      ...FontSize.rfs16,
      color: active === index ? "red" : "#D5D5D5",
    };
  },
});

//make this component available to the app
export default TabBar;
