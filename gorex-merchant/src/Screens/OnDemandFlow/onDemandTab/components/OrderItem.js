import React from "react";

// ** Third Party Packages
import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";
import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";

// ** Custom Components
import Colors from "../../../../Constants/Colors";
import { hp, wp } from "../../../../utils/responsiveSizes";
import FontSize from "../../../../Constants/FontSize";
import Fonts from "../../../../Constants/fonts";
import { ClockGray } from "../../../../assets";

function OrderItem(props) {
  const { item, onPress, color, status } = props;
  const { t } = useTranslation();

  // ** Constants
  const updatedColor = color.replace("rgba", "rgba");
  const updatedOpacity = 0.2; // Replace with the desired opacity value (between 0 and 1)
  const updatedColorWithOpacity = updatedColor.replace(
    /\d+(?:\.\d+)?(?=%?\))/,
    String(updatedOpacity)
  );

  return (
    <TouchableOpacity onPress={onPress} style={styles.orderItemContainer}>
      <View style={styles.content}>
        <View style={styles.iconName}>
          <Text style={styles.iconNameText}>
            {item.service_provider[1].split(" ")[0]}
          </Text>
        </View>

        <View style={styles.ContentDetails}>
          <View style={styles.contentStatus}>
            <Text style={styles.name}>{item.service_provider[1]}</Text>
            <View style={styles.badge(updatedColorWithOpacity)}>
              <Text style={styles.badgeText(color)}>{status}</Text>
            </View>
          </View>

          <View style={styles.contentTime}>
            <View style={styles.contentTime}>
              <Image source={ClockGray} style={styles.dateTimeIcon} />
              <Text style={styles.dateTimeText}>{item?.date}</Text>
            </View>

            {item?.slot_id && (
              <View style={styles.contentTime}>
                <Image source={ClockGray} style={styles.dateTimeIcon} />
                <Text style={styles.dateTimeText}>{item?.slot_id[1]}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <LinearGradient
        colors={["#fff", updatedColorWithOpacity]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.linearGradientContainer}
      >
        <View style={styles.footer(color)}>
          <Text style={styles.itemAction(color)}>
            {t("gorexOnDemand.orderDetails")}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default OrderItem;

const styles = StyleSheet.create({
  orderItemContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.LIGHTGREY,
    marginVertical: hp(10),
  },
  content: {
    paddingHorizontal: wp(15),
    paddingTop: wp(15),
    paddingBottom: wp(20),
    flexDirection: "row",
    flexGrow: 1,
  },
  iconName: {
    backgroundColor: "#FF4E00",
    paddingHorizontal: wp(7),
    paddingVertical: hp(20),
    borderRadius: 22,
  },
  ContentDetails: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingLeft: 15,
    maxWidth: "100%",
  },
  contentStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentTime: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  dateTimeText: {
    color: Colors.GREY,
    textAlign: "left",
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendMedium,
    textTransform: "capitalize",
    marginLeft: wp(7),
    marginRight: wp(14),
  },
  iconNameText: {
    color: Colors.WHITE,
    textAlign: "left",
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendBold,
    textTransform: "capitalize",
  },
  name: {
    color: Colors.BLACK,
    textAlign: "left",
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendMedium,
    textTransform: "capitalize",
  },
  badge: (updatedColorWithOpacity) => {
    return {
      borderWidth: 0,
      borderRadius: 15,
      paddingHorizontal: wp(10),
      paddingVertical: wp(5),
      marginLeft: wp(25),
      backgroundColor: updatedColorWithOpacity,
    };
  },
  badgeText: (color) => {
    return {
      ...FontSize.rfs12,
      color: color,
      // color: `rgba(255, 0, 0, 0.5)`,
      textTransform: "uppercase",
      fontFamily: Fonts.LexendMedium,
    };
  },
  linearGradientContainer: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  footer: (Color) => {
    return {
      flex: 1,
      // backgroundColor: Color,
      justifyContent: "flex-end",
      alignItems: "flex-end",
      padding: wp(15),
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    };
  },
  itemAction: (color) => {
    return {
      color: color,
      ...FontSize.rfs16,
      fontFamily: Fonts.LexendMedium,
      textTransform: "uppercase",
    };
  },
  dateTimeIcon: {
    width: wp(18),
    height: hp(18),
  },
});
