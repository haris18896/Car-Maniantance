import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import Colors from "../../../Constants/Colors";
import {hp, rfs, wp} from "../../../utils/responsiveSizes";
import Fonts from "../../../Constants/fonts";
import {EditPencil, VehiclePlaceholder} from "../../../assets";
import { showToast } from "../../../utils/common";
import Utilities from "../../../utils/UtilityMethods";
import { mediaUrl } from "../../../utils/defaultConfig";
import CustomBottomSheet from "../../../Components/BottomSheet/CustomBottomSheet";
import GeneralPostAPI from "../../../api/GeneralPostAPI";
import CommonAPI from "../../../api/CommonAPI";
import FontSize from "../../../Constants/FontSize";

const VehicleCard = ({ profile, vehicle, setLoading, getAllVehicles }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [editModal, setEditModal] = useState(false);

  const makeVehiclePrimary = () => {
    setLoading(true);
    CommonAPI({body:{vehicle_id:vehicle?.id},endPoint:'/set/primary/vehicle'}).then(({ success, response }) => {
      if (success) {
        getAllVehicles();
      } else {
        setLoading(false);
        showToast("Error", response, "error");
      }
    });
  };

  const deleteVehicle = () => {
    setLoading(true);
    GeneralPostAPI({
      method: "unlink",
      model: "gorex.vehicle",
      args: [[vehicle?.id]],
    }).then(({ success, response }) => {
      if (success) {
        setEditModal(false);
        getAllVehicles();
      } else {
        setLoading(false);
        showToast("Error", response, "error");
      }
    });
  };

  const updateVehicle = () => {
    setEditModal(false);
    navigation.navigate("VehicleInformation", { vehicleToUpdate: vehicle });
  };

  const getPrimaryButton = (vehicle) =>{
    return (
        <TouchableOpacity
            onPress={makeVehiclePrimary}
            disabled={vehicle?.is_primary}
            style={{
              width: Utilities.wp(30),
              height: 30,
              borderRadius: Utilities.wp(1),
              borderWidth: 2,
              borderColor: Colors.BLACK,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginTop: -8,
            }}
        >

          <View style={[styles.makePrimary, vehicle?.is_primary&&styles.isPrimaryView]}>
            <Text style={[styles.makePrimaryText, vehicle?.is_primary&&styles.primaryText]}>{vehicle?.is_primary?t("vehicle.primary"):t("vehicle.makeprimary")}</Text>
          </View>
        </TouchableOpacity>
    )
  }


  return (
      <View style={{ ...styles.container, flex: 1 }}>
        <View style={styles.header}>
          {vehicle?.image_file?
              <Image style={styles.image} source={{ uri:`data:image/gif;base64,${vehicle?.image_file}`}}/> :
              <Image style={[styles.image, {tintColor:Colors.GREY}]} source={VehiclePlaceholder}/>
          }
          <Text style={styles.title}>{vehicle?.manufacturer[1]}</Text>
        </View>
        {!profile.parent_partner_id && (
            <TouchableOpacity style={{position: "absolute", right: 10, top: 15, width: Utilities.wp(8)}} onPress={() => setEditModal(true)}>
              <Text style={{ ...styles.title, ...FontSize.rfs18 }}>...</Text>
            </TouchableOpacity>
        )}
        <View style={styles.paddedContent}>
          <View style={styles.row}>
            <View style={{width:'20%'}}>
              <Text style={styles.heading}>{t("vehicle.model")}</Text>
            </View>
            <View style={{width:'80%',}}>
              <Text style={styles.value}>{vehicle?.vehicle_model[1]}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={{width:'20%'}}>
              <Text style={styles.heading}>{t("vehicle.year")}</Text>
            </View>
            <View style={{width:'80%'}}>
              <Text style={styles.value}>{vehicle?.year_id[1]}</Text>
            </View>
          </View>
          {/*<View style={styles.row}>*/}
          {/*  <View style={{width:'20%'}}>*/}
          {/*    <Text style={styles.heading}>{t("vehicle.type")}</Text>*/}
          {/*  </View>*/}
          {/*  <View style={{width:'80%'}}>*/}
          {/*    <Text style={[styles.value]}>{vehicle?.vehicle_variant[1]}</Text>*/}
          {/*  </View>*/}
          {/*  /!*<View style={{width:'40%'}}>*!/*/}
          {/*  /!*  {!profile.parent_partner_id && getPrimaryButton(vehicle)}*!/*/}
          {/*  /!*</View>*!/*/}
          {/*</View>*/}

          <View style={styles.row}>
            <View style={{width:'20%'}}>
              <Text style={styles.heading}>{t("vehicle.numberPlate")}</Text>
            </View>
            <View style={{width:'40%'}}>
              <Text style={[styles.value]}>{vehicle?.name}</Text>
            </View>
            <View style={{width:'40%'}}>
              {!profile.parent_partner_id && getPrimaryButton(vehicle)}
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

        <CustomBottomSheet
            height={hp(50)}
            buttonStyle={styles.btn2}
            onClose={() => {setEditModal(false);}}
            deleteVehicle
            buttonText={t("vehicle.deletevehicle")}
            open={editModal}
            onSelect={() => {
              Alert.alert(
                  t("setting.confirm"),
                  t("vehicle.deleteVehiclePrompt"),
                  [
                    {
                      text: t("setting.delete"),
                      style: "destructive",
                      onPress: deleteVehicle,
                    },
                    {
                      text: t("setting.cancel"),
                      onPress: () => {},
                    },
                  ]
              );
            }}
        >
          <View style={styles.contentSheet}>
            <View style={styles.optionsContainer}>
              <TouchableOpacity style={styles.inputtextContainer} onPress={updateVehicle}>
                <Image style={{width: wp(20), height: hp(20), marginTop: Utilities.wp(-2),}} resizeMode="contain" source={EditPencil}/>
                <Text style={[styles.disabledText, { marginTop: Utilities.wp(-2) }]}>{t("vehicle.updatevehicle")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CustomBottomSheet>
      </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: Utilities.wp(4),
    margin: 8,
    shadowColor: Colors.GREY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 6,

  },
  title: {
    color: Colors.BLACK,
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendBold,
    paddingHorizontal: wp(10),
    textAlign: "left",
  },
  paddedContent: {
    padding: wp(10),
  },
  heading: {
    fontFamily: Fonts.LexendBold,
    color: Colors.BLACK,
    ...FontSize.rfs16,
    textAlign:'left'
  },
  value: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs12,
    color: Colors.LIGHTGREY,
    textAlign:'left',
    // borderWidth: 1
  },
  optionsContainer2: {
    padding: wp(20),
  },
  row: {
    flexDirection: "row",
    alignItems:'center',
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
  contentSheet: {
    flex: 1,
  },
  optionsContainer: {
    padding: wp(20),
  },
  input2: {
    borderBottomColor: Colors.BLACK,
    borderBottomWidth: 1,
    paddingVertical: hp(4),
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs15,
    color: Colors.BLACK,
    paddingLeft: 0,
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
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs18,
    textAlign: "left",
  },



  makePrimary: {
    width: Utilities.wp(30),
    height: 30,
    borderWidth: 2,
    borderRadius: Utilities.wp(1),
    padding: Utilities.wp(0.07),
    borderColor: Colors.BLACK,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  isPrimaryView: {
    backgroundColor: Colors.LIGHT_GREEN,
    borderColor: Colors.DARKERGREEN,
  },

  makePrimaryText: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs14,
  },

  primaryText: {
    color: Colors.DARKERGREEN,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs14,
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
    alignItems: "center",
    marginTop: Utilities.hp(5),
    flexDirection: "row",
  },
  header2: {
    width: "30%",
    height: 5,
    borderRadius: 5,
    backgroundColor: Colors.GREY,
  },
  inputtextContainer2: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  content2: {
    flex: 1,
    backgroundColor: Colors.WHITE,
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
    width: Utilities.wp(18),
    height: Utilities.hp(10),
    resizeMode:'contain'
  },
  sheetContent: {
    flex: 1,
  },
  inputtextContainerSheet: {
    marginTop: Utilities.hp(4),
    paddingHorizontal: Utilities.wp(5),
    justifyContent: "center",
  },
});

export default VehicleCard;
