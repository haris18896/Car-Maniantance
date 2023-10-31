import React, { useState } from "react";

// ** Third party packages
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { hp, wp } from "../../../../../utils/responsiveSizes";
import Colors from "../../../../../Constants/Colors";
import {
  CheckBoxChecked,
  CheckBoxUnchecked,
  ClockBlack,
  ClockGray,
  LocationIcon,
  RatingStar,
  UnCheckBox,
} from "../../../../../assets";
import Fonts from "../../../../../Constants/fonts";
import FontSize from "../../../../../Constants/FontSize";
import FontFamily from "../../../../../Constants/FontFamily";

// ** Custom Components

function ServiceProviderCard(props) {
  const { item, checked, onPress, timeSlot, setTimeSlot } = props;
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress} style={styles.serviceCardContainer(checked)}>
      <View style={styles.content}>
        <View style={styles.details}>
          <View style={styles.iconName}>
            <Text style={styles.iconNameText}>
              {item?.service_provider_name.split(" ")[0]}
            </Text>
          </View>

          <View style={styles.cardName}>
            <Text style={styles.name}>{item?.service_provider_name}</Text>
            <Text style={styles.subtitle}>
              {item?.service_price.toString()} {t("productsAndServices.SAR")}
            </Text>
          </View>
        </View>

        <View style={styles.cardBox}>
          <Image
            style={styles.checkBox}
            source={checked ? CheckBoxChecked : UnCheckBox}
          />
        </View>
      </View>

      <View style={styles.timeSlots}>
        <View style={styles.slotDescription}>
          <Text style={styles.name}>{t("gorexOnDemand.selectTimeSlot")}</Text>
          <Text style={styles.chooseOne}>({t("gorexOnDemand.onlyOne")})</Text>
        </View>

        <View style={styles.slots}>
          {JSON.parse(item.timeSlots).map((data, index) => (
            <Pressable
              key={index}
              disabled={!checked}
              onPress={() => setTimeSlot(data.slot_id)}
              style={styles.slotItems(data.slot_id, timeSlot)}
            >
              <Image source={ClockGray} style={styles.clock} />
              <Text style={styles.time(data.slot_id, timeSlot)}>
                {data.time}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        {item?.rating && (
          <View style={styles.footerItems}>
            <RatingStar width={13} height={13} />
            <Text style={styles.footerItemText}>{item?.rating || ""}</Text>
          </View>
        )}

        {item?.distance && (
          <View style={styles.footerItems}>
            <LocationIcon width={13} height={13} />
            <Text style={styles.footerItemText}>
              {item?.distance.toFixed(1) || ""} km
            </Text>
          </View>
        )}

        {item?.duration && (
          <View style={styles.footerItems}>
            {/*<ClockGray width={13} height={13} />*/}
            <Image source={ClockGray} style={styles.clock} />
            <Text style={styles.footerItemText}>
              {item?.duration || ""} {t("minutes")}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default ServiceProviderCard;

const styles = StyleSheet.create({
  serviceCardContainer: (checked) => {
    return {
      backgroundColor: Colors.WHITE,
      marginHorizontal: wp(20),
      marginVertical: wp(10),
      borderWidth: 4,
      borderRadius: 10,
      borderColor: checked ? Colors.DARKERGREEN : "#E6E6E63B",
    };
  },
  content: {
    padding: wp(20),
    backgroundColor: "#E6E6E63B",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  details: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  cardBox: {
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  footer: {
    paddingHorizontal: wp(20),
    paddingVertical: wp(15),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: Colors.LIGHTGREY,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  footerItems: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginRight: wp(20),
  },
  footerItemText: {
    marginLeft: wp(5),
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs14,
    color: Colors.BLACK,
    textAlign: "left",
  },
  iconName: {
    backgroundColor: "#FF4E00",
    width: wp(60),
    height: hp(60),
    overflow: "hidden",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: hp(10),
  },
  iconNameText: {
    color: Colors.WHITE,
    textAlign: "left",
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendBold,
    textTransform: "capitalize",
  },
  checkBox: {
    width: wp(20),
    height: wp(20),
    resizeMode: "contain",
    marginRight: "5%",
  },
  cardName: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  name: {
    color: Colors.BLACK,
    textAlign: "left",
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendMedium,
    textTransform: "capitalize",
  },
  subtitle: {
    ...FontSize.rfs18,
    ...FontFamily.medium,
    color: Colors.DARKERGREEN,
    textAlign: "right",
    marginTop: wp(3),
  },
  timeSlots: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: wp(20),
    backgroundColor: "#E6E6E63B",
    paddingBottom: wp(20),
  },
  slots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  slotItems: (slot, checked) => {
    return {
      flexDirection: "row",
      marginRight: wp(12),
      justifyContent: "flex-start",
      backgroundColor:
        slot === checked ? Colors.DARKERGREEN : Colors.LIGHT_GREY,
      paddingHorizontal: wp(8),
      alignItems: "center",
      paddingVertical: wp(4),
      borderRadius: 20,
    };
  },
  chooseOne: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs14,
    color: Colors.LIGHTGREY,
    marginLeft: wp(5),
    textTransform: "capitalize",
  },
  clock: {
    width: wp(13),
    height: hp(13),
  },
  time: (slot, checked) => {
    return {
      fontFamily: Fonts.LexendMedium,
      marginLeft: wp(5),
      ...FontSize.rfs12,
      color: slot === checked ? Colors.WHITE : Colors.BLACK,
    };
  },
  slotDescription: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: wp(5),
  },
});
