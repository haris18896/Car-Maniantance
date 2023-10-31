import {useNavigation, CommonActions, useIsFocused,} from "@react-navigation/native";
import React, {useContext, useEffect, useState} from "react";
import {View, StyleSheet, Text, Image, TouchableOpacity, Alert, FlatList,} from "react-native";
import { Divider } from "react-native-paper";

import {Arrowar, Arrowen, ArrowOrange, BlackArrowLeft, BlackArrowRight, ForwardBlack, MenuBlack} from "../assets";
import BackHeader from "../Components/Header/BackHeader";
import Colors from "../Constants/Colors";
import Fonts from "../Constants/fonts";
import { KSA } from "../Constants/country";
import {
  removeProfile,
  removeUser,
  getCountry,
  setCart,
  removeCart,
  removeParentUserId,
  removePartnerId,
} from "../utils/common";
import { hp, rfs, wp } from "../utils/responsiveSizes";
import Utilities from "../utils/UtilityMethods";
import Footer from "./ProductsAndServices/components/Footer";
import {useTranslation} from "react-i18next";
import {CommonContext} from "../contexts/ContextProvider";
import axiosInstance from "../utils/axiosInstance";
import FontSize from "../Constants/FontSize";

const Setting = () => {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { i18n } = useTranslation();
  const {userProfile, setUserProfile, setPartnerId, setSelectedBranch, setInCartOrder} = useContext(CommonContext);
  const [country, setCountry] = useState(null);
  const isRTL = i18n.language === "ar";


  const settingsItems = [
    {
      title: t("setting.account"),
      showIncomplete:!userProfile?.profile_completed,
    },
    {
      title: t("setting.update"),
      showIncomplete:false,
    },
    {
      title: t("setting.language"),
      showIncomplete:false,
    },
    {
      title: t("setting.country"),
      showIncomplete:false,
    },
    {
      title: t("setting.notifications"),
      showIncomplete:false,
    },
  ]

  useEffect(() => {
    fetchCountry().then();
  }, [isFocused]);

  const fetchCountry = async () => {
    const country = await getCountry();
    if (country) {
      setCountry(country);
    } else {
      setCountry(KSA);
    }
  };

  const renderRowItem = (item, index) =>{
    return (
        <>
          <TouchableOpacity style={styles.row} onPress={() => {onPressRowItem(index)}}>
            <Text style={styles.rowTitle}>{item.title}</Text>
            {item.showIncomplete && (
                <View style={styles.incompleteButton}>
                  <Text style={styles.incompleteButtonText}>{t("setting.incomplete")}</Text>
                </View>
            )}
            <Image source={isRTL?Arrowen:Arrowar} style={styles.rowDisclosureIcon}/>
          </TouchableOpacity>

          <Divider/>
        </>
    )
  }

  const onPressRowItem = (index) =>{
    switch (index){
      case 0:{
        navigation.navigate("ProfileUpdate");
        return;
      }case 1:{
        navigation.navigate("UpdatePassword")
        return;
      }case 2:{
        navigation.navigate("Language");
        return;
      }case 3:{
        navigation.navigate("Country", { country })
        return;
      }case 4:{
        navigation.navigate("NotificationScreen")
        return;
      }
    }
  }

  const deleteAccount = () =>{
    let body = {
      "params":{
        "model":"res.users",
        "method": "write",
        "args":[[userProfile?.id],{"active": false}],
        "kwargs": {}
      }
    }

    axiosInstance.put( "/dataset/call_kw/", body).then((response) => {

    });
  }

  const onPressDeleteAccount = () =>{
    Alert.alert(
        t("setting.confirm"),
        t("setting.suredelete"),
        [
          {
            text: t("setting.delete"),
            style: "destructive",
            onPress: async () => {await logoutAction()},
          },
          {
            text: t("setting.cancel"),
            onPress: () => {},
          },
        ]
    );
  }

  const onPressLogoutButton = () =>{

    Alert.alert(
        "Confirm",
        "Are you sure you want to logout?",
        [
          {
            text: "Logout",
            style: "destructive",
            onPress: async () => {await logoutAction()}
          },
          {
            text: "No",
            onPress: () => {},
          },
        ]
    );

  }

  const logoutAction = async () => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
    navigation.dispatch(resetAction);

    setTimeout(async()=>{
      setPartnerId(0);
      setUserProfile(null);
      setInCartOrder(null);
      setSelectedBranch(null);

      await removePartnerId()
      await removeCart();
    },1000)
  };

  return (
      <View style={styles.mainContainer}>
        <BackHeader leftPress={() => navigation.openDrawer()} leftIcon={MenuBlack} title={t("setting.settings")}/>

        <View style={styles.flatListView}>
          <FlatList
              data={settingsItems}
              renderItem={({ item, index }) => {
                return renderRowItem(item, index);
              }}
          />
        </View>


        <View style={{flex:0.1, justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity style={styles.buttonContainer} onPress={onPressDeleteAccount}>
            <Text style={styles.deleteAccountButton}> {t("menu.Delete Account")}</Text>
          </TouchableOpacity>
        </View>

        {/*<Footer title={t("menu.Logout")} buttonStyle={{backgroundColor: Colors.ORANGE}} onPress={onPressLogoutButton}/>*/}
      </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },

  flatListView: {
    flex: 0.9,
  },

  row: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: Utilities.wp(90),
    height: Utilities.hp(8),
    paddingVertical: hp(15),
  },

  rowTitle: {
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    color: Colors.BLACK,
    width: "70%",
  },

  incompleteButton: {
    marginLeft: -50,
    paddingVertical: Utilities.hp(1),
    paddingHorizontal: 15,
    backgroundColor: Colors.LIGHT_RED,
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: Colors.RED,
  },
  incompleteButtonText: {
    color: Colors.RED,
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendMedium,
  },

  rowDisclosureIcon:{
    tintColor: "black",
    height:Utilities.wp(10.5),
    width:Utilities.wp(2.5),
    resizeMode:'contain',
  },

  buttonContainer: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteAccountButton: {
    ...FontSize.rfs16,
    color: Colors.RED,
    fontFamily: Fonts.LexendBold,
    textDecorationLine: "underline",
  },
});

export default Setting;
