import React from "react";
import {Text, View, Image, Modal, StyleSheet, TouchableOpacity,} from "react-native";

import { Close } from "../../assets";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import Colors from "../../Constants/Colors";
import { useTranslation } from "react-i18next";
import { wp } from "../../utils/responsiveSizes";
import Utilities from "../../utils/UtilityMethods";

const WalletModel = (props) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { show, image, text, buttonTitle, onPressClose, onPressBottomButton } = props;

  return (
    <View style={styles.container}>
      <Modal animationType="fade" transparent={true} visible={show} onRequestClose={onPressClose}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={{alignSelf: "flex-end", padding: 10,}} onPress={onPressClose}>
              <Image source={Close} style={{width: Utilities.wp(5), height: Utilities.hp(5),}} resizeMode="contain" />
            </TouchableOpacity>
            <Image source={image} style={{width: Utilities.wp(14), height: Utilities.hp(14),}} resizeMode="contain"/>
            <Text
              style={{
                textAlign: "center",
                color: Colors.BLACK,
                paddingVertical: Utilities.hp(3),
                ...FontSize.rfs14,
                fontFamily: Fonts.LexendMedium,
                width: isRTL ? wp(272) : wp(222),
              }}
            >{text}</Text>
            <TouchableOpacity
              onPress={onPressBottomButton}
              style={{
                backgroundColor: Colors.DARKERGREEN,
                width: "100%",
                height: 60,
                marginTop: 10,
                justifyContent: "center",
                alignSelf: "center",
                alignItems: "center",
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
              }}>
              <Text style={styles.bigTitle}>{buttonTitle}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  container: {
    flex: 1,
  },

  modalView: {
    margin: 20,
    // alignItems: "center",
    // justifyContent: "center",
    width: "90%",
    backgroundColor: Colors.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    borderRadius: 20,
    alignItems: "center",
  },
  bigTitle: {
    fontFamily: Fonts.LexendMedium,
    color: Colors.WHITE,
    ...FontSize.rfs18,
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default WalletModel;
