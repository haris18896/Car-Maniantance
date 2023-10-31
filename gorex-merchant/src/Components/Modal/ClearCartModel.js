import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useTranslation } from "react-i18next";

import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import { ClearCart, Close } from "../../assets";
import Utilities from "../../utils/UtilityMethods";
import { wp } from "../../utils/responsiveSizes";

const ClearCartModel = (props) => {
  const { t } = useTranslation();

  const { modalCart, setmodalCart, onPress, disabled, isLoading, title } =
    props;
  const [edit, setEdit] = useState();
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalCart}
        onRequestClose={() => {setmodalCart(!modalCart);}}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setmodalCart(false)}
            >
              <Image source={Close} style={styles.closeIcon} />
            </TouchableOpacity>
            <Image
              style={{
                width: 60,
                height: 100,
                backgroundColor: Colors.WHITE,
              }}
              source={ClearCart}
              resizeMode="contain"
            />
            <Text
              style={{
                textAlign: "center",
                color: Colors.BLACK,
                paddingVertical: Utilities.hp(3),
                ...FontSize.rfs14,
                fontFamily: Fonts.LexendMedium,
                width: wp(300)
              }}
            >
              {t("placeOrder.areYouSureClearCart")}
            </Text>
            <TouchableOpacity
              onPress={onPress}
              style={{
                backgroundColor: Colors.ORANGE,
                width: "100%",
                height: 60,
                marginTop: 10,
                justifyContent: "center",
                alignSelf: "center",
                alignItems: "center",
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
              }}
            >
              <Text style={styles.bigTitle}>{t("placeOrder.clearCart")}</Text>
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
      alignItems: 'center',
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
  },
  closeButton: {
    marginTop: wp(20),
    marginEnd: wp(20),
    alignSelf: "flex-end",
  },
  closeIcon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
  },
  modalView: {
      width:Utilities.wp(90),
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

export default ClearCartModel;
