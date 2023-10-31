import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { hp, wp } from "../../../../../utils/responsiveSizes";
import Colors from "../../../../../Constants/Colors";
import {
  Call,
  CheckBoxChecked,
  GrayCall,
  LocationIcon,
  Message,
  RatingStar,
  Services,
  UnCheckBox,
  Watch,
} from "../../../../../assets";
import FontSize from "../../../../../Constants/FontSize";
import Fonts from "../../../../../Constants/fonts";
import FontFamily from "../../../../../Constants/FontFamily";

// ** Third Party Packages

// ** Custom Components

function TrackingFooterComponent(props) {
  const {
    title,
    serviceProvider,
    date,
    timeSlots,
    serviceName,
    rating,
    distance,
    onPressMessage,
    onPressCall,
  } = props;

  return (
    <View style={styles.footer}>
      <View style={styles.dashWrapper}>
        <View style={styles.Dash} />
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.content}>
        <View style={styles.details}>
          <View style={styles.iconName}>
            <Text style={styles.iconNameText}>
              {serviceProvider.split(" ")[0]}
            </Text>
          </View>

          <View style={styles.cardName}>
            <Text style={styles.name}>{serviceProvider}</Text>
            <View style={styles.serviceDetails}>
              <View style={styles.footerItems}>
                <RatingStar width={13} height={13} />
                <Text style={styles.footerItemText}>{rating}</Text>
              </View>

              <View style={styles.footerItems}>
                <LocationIcon width={13} height={13} />
                <Text style={styles.footerItemText}>{distance}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.cardBox}>
          <Pressable onPress={onPressMessage} style={styles.icon}>
            <Image
              source={Message}
              resizeMode={"contain"}
              style={{
                width: 40,
                height: 40,
              }}
            />
          </Pressable>
          <Pressable onPress={onPressCall} style={styles.icon}>
            <Image
              source={Call}
              resizeMode={"contain"}
              style={{
                width: 40,
                height: 40,
              }}
            />
          </Pressable>
        </View>
      </View>
      <View style={styles.carWashContainer}>
        <Image
          source={Services}
          style={styles.serviceImageStyle}
          resizeMode={"contain"}
        />
        <Text style={styles.carWashTextStyle}>{serviceName}</Text>
      </View>
      <View style={styles.dateTimeContainer}>
        <View style={styles.dateContainer}>
          <Image
            source={Watch}
            style={styles.watchImageStyle}
            resizeMode={"contain"}
          />
          <Text style={styles.dateTextStyle}>{date}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Image
            source={Watch}
            style={styles.watchImageStyle}
            resizeMode={"contain"}
          />
          <Text style={styles.timeTextStyle}>{timeSlots}</Text>
        </View>
      </View>
    </View>
  );
}

export default TrackingFooterComponent;

const styles = StyleSheet.create({
  footer: {
    padding: wp(20),
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  dashWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  Dash: {
    width: wp(80),
    height: wp(4),
    borderRadius: 5,
    backgroundColor: Colors.LIGHTGREY,
    marginBottom: wp(20),
  },
  icon: {
    marginLeft: wp(10),
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
  content: {
    padding: wp(10),
    // backgroundColor: "#E6E6E63B",
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
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
  title: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs20,
    textAlign: "left",
    color: Colors.BLACK,
    paddingLeft: wp(10),
    marginBottom: wp(10),
  },
  cardName: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  serviceDetails: {
    flexDirection: "row",
    alignItems: "center",
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
  carWashContainer: {
    backgroundColor: "#000000",
    width: "80%",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginHorizontal: 12,
  },
  serviceImageStyle: {
    height: 15,
    width: 15,
    tintColor: "white",
  },
  carWashTextStyle: {
    color: "white",
    fontFamily: Fonts.LexendMedium,
    marginLeft: 5,
    fontSize: 13,
  },
  dateTimeContainer: {
    width: "100%",
    flexDirection: "row",
    marginHorizontal: 12,
  },
  dateContainer: {
    backgroundColor: "black",
    // padding: 3,
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: "row",
    borderRadius: 13,
    alignItems: "center",
  },
  watchImageStyle: {
    height: 10,
    width: 10,
    tintColor: "white",
    alignSelf: "center",
  },
  dateTextStyle: {
    color: "white",
    fontFamily: Fonts.LexendMedium,
    marginLeft: 5,
  },
  timeContainer: {
    backgroundColor: "black",
    paddingHorizontal: 10,
    paddingVertical: 5,
    // padding: 3,
    flexDirection: "row",
    borderRadius: 13,
    marginHorizontal: 15,
    alignItems: "center",
  },
  timeTextStyle: {
    color: "white",
    fontFamily: Fonts.LexendMedium,
    marginLeft: 5,
  },
});
