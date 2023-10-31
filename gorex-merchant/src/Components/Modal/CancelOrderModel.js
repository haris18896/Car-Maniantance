import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  ClearCart,
  Close,
} from "../../assets";
import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";

import Utilities from "../../utils/UtilityMethods";
import {wp} from "../../utils/responsiveSizes";

const CancelOrderModel = (props) => {
  const { modalCart, setmodalCart, onPress, disabled, isLoading, title } =
    props;
  const [edit, setEdit] = useState();
  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalCart}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setmodalCart(!modalCart);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                padding: 10,
              }}
              onPress={() => setmodalCart(false)}
            >
              <Image
                source={Close}
                style={{ margin: 10, width:wp(20), height:wp(20) }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Image
              // resizeMode="conatin"
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
              }}
            >
              Are you sure that you want to{"\n"} cancel your order?
            </Text>
            <TouchableOpacity
              onPress={onPress}
              style={{
                backgroundColor: Colors.RED,
                width: "100%",
                height: 70,
                justifyContent: "center",
                alignSelf: "center",
                alignItems: "center",
                marginTop: 10,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
              }}
            >
              <Text style={styles.bigTitle}>Cancel Order</Text>
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
    height: "30%",
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

export default CancelOrderModel;
