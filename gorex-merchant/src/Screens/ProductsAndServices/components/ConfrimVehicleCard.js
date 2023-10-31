import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Colors from "../../../Constants/Colors";
import Fonts from "../../../Constants/fonts";
import { hp, wp } from "../../../utils/responsiveSizes";
import { useTranslation } from "react-i18next";
import { EditPencil, VehiclePlaceholder } from "../../../assets";
import Utilities from "../../../utils/UtilityMethods";
import { mediaUrl } from "../../../utils/defaultConfig";
import FontSize from "../../../Constants/FontSize";

const ConfrimVehicleCard = ({ vehicle, getAllVehicles, onPress }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>

      <View style={styles.header}>
        {vehicle?.file ? (
          <Image
            style={styles.image}
            source={{ uri: `data:image/gif;base64,${vehicle?.file}` }}
          />
        ) : (
          <Image
            style={[
              styles.image,
              { tintColor: Colors.GREY, resizeMode: "contain" },
            ]}
            source={VehiclePlaceholder}
          />
        )}
        <Text style={styles.title}>{vehicle?.vendor}</Text>
      </View>
      <TouchableOpacity onPress={onPress} style={styles.inputtextContainer}>
        <Image
          resizeMode="contain"
          style={{ width: Utilities.wp(3), marginRight: Utilities.wp(2) }}
          source={EditPencil}
        />
        <Text style={styles.disabledText}>{t("vehicle.edit")}</Text>
      </TouchableOpacity>
      </View>

      <View style={styles.paddedContent}>
        <View style={styles.row}>
          <View style={{ width: "40%" }}>
            <Text style={styles.heading}>{t("vehicle.model")}</Text>
          </View>
          <View style={{ width: "60%" }}>
            <Text style={styles.value}>{vehicle?.model}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={{ width: "40%" }}>
            <Text style={styles.heading}>{t("vehicle.year")}</Text>
          </View>
          <View style={{ width: "60%" }}>
            <Text style={styles.value}>{vehicle?.year}</Text>
          </View>
        </View>
        {/*<View style={styles.row}>*/}
        {/*  <View style={{width:'20%'}}>*/}
        {/*    <Text style={styles.heading}>{t("vehicle.type")}</Text>*/}
        {/*  </View>*/}
        {/*  <View style={{width:'80%'}}>*/}
        {/*    <Text style={[styles.value]}>{vehicle?.vendor +'/'+vehicle?.type}</Text>*/}
        {/*  </View>*/}
        {/*</View>*/}
        <View style={styles.row}>
          <View style={{ width: "40%" }}>
            <Text style={styles.heading}>{t("vehicle.numberPlate")}</Text>
          </View>
          <View style={{ width: "60%" }}>
            <Text style={[styles.value]}>{vehicle?.plate_number}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ width: "40%" }}>
            <Text style={styles.heading}>{t("my_vehicles.color")}</Text>
          </View>
          <View style={{ width: "60%" }}>
            <Text style={[styles.value]}>{vehicle?.color}</Text>
          </View>
        </View>

        {/*<View style={styles.row}>*/}
        {/*  <View style={{width:'40%'}}>*/}
        {/*    <Text style={styles.heading}>{t("vehicle.numberPlate")}</Text>*/}
        {/*  </View>*/}
        {/*  <View style={{width:'20%'}}>*/}
        {/*    <Text style={[styles.value]}>{vehicle?.name}</Text>*/}
        {/*  </View>*/}
        {/*  <View style={{width:'40%'}}>*/}
        {/*    {!profile.parent_partner_id && getPrimaryButton(vehicle)}*/}
        {/*  </View>*/}
        {/*</View>*/}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: Utilities.wp(4),
    paddingVertical: Utilities.hp(2),
    margin: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 6,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs24,
    marginLeft: wp(10),
  },
  paddedContent: {
    padding: wp(6),
  },
  heading: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs16,
    color: Colors.BLACK,
    textAlign: "left",
  },
  value: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs16,
    color: Colors.BLACK_OPAC,
    textAlign: "left",
  },
  valuePlate: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs16,
    color: Colors.BLACK_OPAC,
    marginLeft: 20,
    width: wp(65),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(10),
  },
  content: {
    backgroundColor: Colors.WHITE,
    position: "absolute",
    bottom: 0,
    height: 180,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 6,
    width: "100%",
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
    ...FontSize.rfs16,
    paddingVertical: 10,
    paddingEnd: Utilities.wp(3),
    textAlign: "left",
  },
  text2: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs18,
    fontWeight: "300",
    textAlign: "left",
  },
  inputtextContainer: {
    paddingHorizontal: 5,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    right: wp(16),
  },
  header2: {
    width: "30%",
    height: 5,
    borderRadius: 5,
    backgroundColor: Colors.GREY,
  },
  btn2: {
    alignItems: "center",
    backgroundColor: Colors.ORANGE,
    borderRadius: 5,
    height: hp(60),
    marginBottom: hp(10),
    justifyContent: "center",
    width: wp(330),
    alignSelf: "center",
  },
  input: {
    borderBottomColor: Colors.BLACK,
    borderBottomWidth: 1,
    paddingVertical: hp(4),
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs15,
    color: Colors.BLACK,
    paddingLeft: 0,
  },
  title2: {
    color: Colors.WHITE,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs16,
  },
  image: {
    width: Utilities.wp(12),
    height: Utilities.wp(12),
    resizeMode: "contain",
  },
});

export default ConfrimVehicleCard;
