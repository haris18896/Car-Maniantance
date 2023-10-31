import React, {memo} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

// ** Custom Styles && Theme
import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import { wp, hp } from "../../utils/responsiveSizes";
import { RightArrow, VehiclePlaceHolderBlack } from "../../assets";

// ** Third Party Packages
import moment from "moment";

function VehicleStatusCard({ vehicle, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.vehicleContainer}>
      <View style={styles.vehicleWrapper}>
        <View style={styles.imageContainer(vehicle?.status)}>
          <Image
            source={VehiclePlaceHolderBlack}
            style={styles.vehicleImage(vehicle?.status)}
          />
        </View>

        <View style={styles.vehicleDetails}>
          <View style={styles.vehicleNameWrapper}>
            <Text style={styles.vehicleName}>{vehicle?.name}</Text>
            <Text style={styles.vehicleStatus(vehicle?.status)}>
              {vehicle?.status}
            </Text>
          </View>

          <View style={styles.details}>
            <Text style={styles.detailHeading}>From:</Text>
            <Text style={styles.detailValue}>
              {moment(`${vehicle?.date}`).format("MMM DD, YYYY")}
            </Text>
          </View>

          <View style={styles.details}>
            <Text style={styles.detailHeading}>To:</Text>
            <Text style={styles.detailValue}>
              {moment(vehicle?.valid_till).format("MMM DD, YYYY")}
            </Text>
          </View>

          <View style={styles.details}>
            <Text style={styles.detailHeading}>IMEI:</Text>
            <Text style={styles.detailValue}>{vehicle?.imei_no}</Text>
          </View>
        </View>

        <RightArrow width={wp(14)} height={wp(14)} />
      </View>
    </TouchableOpacity>
  );
}

export default memo(VehicleStatusCard);

const styles = StyleSheet.create({
  vehicleContainer: {
    backgroundColor: Colors.WHITE,
    padding: wp(20),
    marginVertical: wp(10),
    borderRadius: wp(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  vehicleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  imageContainer: (status) => {
    return {
      width: wp(50),
      height: wp(50),
      alignItems: "center",
      justifyContent: "center",
      borderRadius: wp(50),
      backgroundColor:
        status.toLowerCase() === "active"
          ? Colors.LIGHT_GREEN
          : Colors.LIGHT_RED,
      borderColor:
        status.toLowerCase() === "active" ? Colors.GREEN : Colors.RED,
      borderWidth: wp(1),
    };
  },
  vehicleImage: (status) => {
    return {
      width: wp(20),
      height: hp(20),
      tintColor: status.toLowerCase() === "active" ? Colors.GREEN : Colors.RED,
    };
  },
  vehicleDetails: {
    marginHorizontal: wp(15),
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexGrow: 1,
  },
  vehicleArrowRight: {
    width: wp(20),
    height: wp(20),
    zIndex: 1000,
  },
  vehicleNameWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: wp(10),
  },
  vehicleName: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs16,
    textAlign: "left",
    color: Colors.BLACK,
  },
  vehicleStatus: (status) => {
    return {
      fontFamily: Fonts.LexendSemiBold,
      ...FontSize.rfs14,
      textAlign: "left",
      color: status.toLowerCase() === "active" ? Colors.GREEN : Colors.RED,
      marginLeft: wp(15),
      paddingHorizontal: wp(15),
      paddingVertical: wp(2),
      borderRadius: wp(5),
      borderWidth: wp(1),
      backgroundColor:
        status.toLowerCase() === "active"
          ? Colors.LIGHT_GREEN
          : Colors.LIGHT_RED,
      borderColor:
        status.toLowerCase() === "active" ? Colors.GREEN : Colors.RED,
    };
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: wp(3),
  },
  detailHeading: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs12,
    textAlign: "left",
    marginRight: wp(10),
    width: wp(40),
    color: Colors.BLACK,
  },
  detailValue: {
    color: Colors.GREY_TEXT,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs12,
  },
});
