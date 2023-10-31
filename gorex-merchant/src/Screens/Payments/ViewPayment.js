import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Divider } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import { showToast } from "../../utils/common";
import { Edit, RedBoxedCross } from "../../assets";
import GetOrderServices from "../../api/GetOrderServices";
import GetOrderProducts from "../../api/GetOrderProducts";
import { hp, wp } from "../../utils/responsiveSizes";

import Loader from "../../Components/Loader";
import BackHeader from "../../Components/Header/BackHeader";
import analytics from "@react-native-firebase/analytics";
// import crashlytics from "@react-native-firebase/crashlytics";

const ViewPayment = ({ route }) => {
  const order_id = route?.params?.id;
  const check = route?.params?.check;
  const sequence = route?.params?.sequence;

  const { t } = useTranslation();
  const navigation = useNavigation();

  const [loading] = useState(false);
  const [edit, setEdit] = useState();
  const [user, setUser] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceuser, setServiceUser] = useState([]);
  const [updateCart, setUpdateCart] = useState(false);

  useEffect(() => {
    GetOrderProducts({ orderId: order_id, itemType: "product" }).then(
      ({ success, response }) => {
        if (success) {
          setUser(response);
        } else {
          showToast("Error", response, "error");
        }
      }
    );
    // .catch((err) => crashlytics().recordError(err));

    analytics().logScreenView({
      screen_name: "view_payment_screen",
    });
  }, []);

  useEffect(() => {
    // GetOrderServices(order_id).then(({ success, response }) => {
    GetOrderProducts({ orderId: order_id, itemType: "service" }).then(
      ({ success, response }) => {
        if (success) {
          setServiceUser(response);
        } else {
          showToast("Error", response, "error");
        }
      }
    );
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("cart");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {}
  };

  const deleteItem = async (id) => {
    const data = await getData("cart");
    const index = data?.findIndex((product) => product?._id === id);
    data.splice(index, 1);
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem("cart", jsonValue);
    setUpdateCart(!updateCart);
  };

  const deleteService = async (id) => {
    const data = serviceuser;
    const index = data?.findIndex((s) => s?._id === id);
    data.splice(index, 1);
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem("services", jsonValue);
    setUpdateCart(!updateCart);
  };

  return (
    <View style={styles.container}>
      <BackHeader
        title={`${t("order_history.Order #")} ${sequence}`}
        rightTitle={t("order_history.support")}
        RightPress={() => navigation.navigate("GorexSupport", { check })}
      />

      <ScrollView
        style={styles.paddedContent}
        contentContainerStyle={styles.contentContainer}
      >
        {!user?.length ? null : (
          <FlatList
            data={user}
            ListHeaderComponent={() => (
              <Text style={styles.heading}>{t("products")}</Text>
            )}
            renderItem={({ item }) => (
              <View>
                <View style={styles.rowContainer}>
                  <Text style={styles.quantityText}>{item?.quantity} X</Text>
                  <Text style={styles.title}> {item?.product_id[1]}</Text>
                  <View style={styles.rightView}>
                    <Text style={styles.price}>
                      {t("common.SAR")} {item?.quantity * item?.price}
                    </Text>
                  </View>
                </View>
                {edit ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignSelf: "flex-end",
                      justifyContent: "space-between",
                      width: wp(70),
                    }}
                  >
                    <TouchableOpacity>
                      <Image
                        resizeMode="contain"
                        source={Edit}
                        style={styles.del}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteItem(item?._id)}>
                      <RedBoxedCross width={wp(32)} height={wp(32)} />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            )}
          />
        )}
        <Divider></Divider>
        {!serviceuser?.length ? null : (
          <FlatList
            data={serviceuser}
            ListHeaderComponent={() => (
              <Text style={styles.heading}>{t("services")}</Text>
            )}
            renderItem={({ item }) => (
              <View>
                <View style={styles.rowContainer}>
                  <Text style={styles.quantityText}>{item?.quantity} X</Text>
                  <Text style={styles.title}>{item?.product_id[1]}</Text>
                  <View style={styles.rightView}>
                    <Text style={styles.price}>
                      {t("common.SAR")} {item?.quantity * item?.total_price}
                    </Text>
                  </View>
                </View>
                {edit ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignSelf: "flex-end",
                      justifyContent: "space-between",
                      width: wp(70),
                    }}
                  >
                    <TouchableOpacity>
                      <Image
                        resizeMode="contain"
                        source={Edit}
                        style={styles.del}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteService(item?._id)}>
                      <RedBoxedCross width={wp(32)} height={wp(32)} />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            )}
          />
        )}
        <Divider></Divider>
      </ScrollView>
      <Loader visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  paddedContent: {
    flex: 1,
    paddingHorizontal: wp(12),
  },
  title2: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs18,
  },
  type: {
    ...FontSize.rfs13,
    fontFamily: Fonts.LexendRegular,

    marginLeft: wp(5),
    color: "#000000",
  },
  del: { width: wp(30), height: hp(30) },
  heading: {
    marginTop: 20,
    ...FontSize.rfs24,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    color: Colors.BLACK,
    marginBottom: hp(11),
  },
  checkText: {
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    marginBottom: 10,
    color: Colors.BLACK,
  },
  title: {
    ...FontSize.rfs15,
    fontFamily: Fonts.LexendRegular,
    textAlign: "left",
    color: Colors.BLACK,
    fontWeight: "700",
    width: "63%",
  },
  cross: {
    backgroundColor: Colors.BLUE,
    width: 25,
    marginTop: 5,
    height: 25,
    borderRadius: 25 / 2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  rowContainer: {
    marginLeft: wp(5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(11),
  },
  rowContainer2: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    // alignItems: "center",
    marginTop: hp(11),
  },
  cancel: {
    color: Colors.ORANGE,
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs18,
  },
  input: {
    borderBottomColor: Colors.BLUE,
    borderBottomWidth: 1,
    // paddingHorizontal: wp(5),
    paddingVertical: hp(4),

    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs15,
    color: Colors.BLACK,
    paddingLeft: 0,
  },
  textarea: {
    borderColor: Colors.BLUE,
    borderWidth: 1,
    paddingVertical: hp(4),
    minHeight: hp(174),
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs15,
    // paddingLeft: 0,
    textAlignVertical: "top",
    paddingHorizontal: hp(12),
    marginTop: hp(12),
    borderRadius: 8,
    color: Colors.BLACK,
  },
  eyestyling: {
    width: wp(20),
    tintColor: Colors.WHITE,
    // height: hp(30),
  },
  inputtextContainer: {
    marginBottom: hp(11),
  },
  price: {
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendRegular,
    textAlign: "left",
    fontWeight: "700",
    color: Colors.DARKERGREEN,
    marginRight: wp(10),
  },
  rightView: {
    flexDirection: "row",
  },
  quantityText: {
    color: Colors.DARKERGREEN,
    ...FontSize.rfs16,
    fontFamily: Fonts.LexendRegular,
    textAlign: "left",
    fontWeight: "700",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    // paddingVertical: hp(5),
    width: wp(300),
    paddingHorizontal: wp(10),
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingBottom: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  bigTitle: {
    fontFamily: Fonts.SFProDisplaySemiBold,

    ...FontSize.rfs16,
    color: Colors.BLUE,
  },

  description: {
    fontFamily: Fonts.PoppinsMedium,
    marginLeft: 20,
    paddingVertical: 3,
    ...FontSize.rfs14,
    color: Colors.DARK_GREY,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  container2: {
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    borderBottomColor: "#B8B9C133",
    borderBottomWidth: 1,
    height: hp(74),
    flexDirection: "row",
    paddingHorizontal: 9,
  },
  containerProfile: {
    justifyContent: "space-between",
    // alignItems: 'center',
    backgroundColor: Colors.BLUE,
    borderBottomLeftRadius: hp(20),
    borderBottomRightRadius: hp(20),
    height: hp(150),
    paddingTop: hp(20),
    flexDirection: "row",
    paddingHorizontal: 9,
  },
  logo: {
    width: 100,
    resizeMode: "contain",
    height: hp(25),
  },
  menuButton: {
    height: wp(50),
    width: wp(50),

    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(20),
  },
  placeholder: {
    width: wp(60),
  },
  space: {
    marginLeft: wp(30),
  },
});

export default ViewPayment;
