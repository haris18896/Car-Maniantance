import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
} from "react-native";

// ** Custom Components
import Fonts from "../../../Constants/fonts";
import { useTranslation } from "react-i18next";
import Colors from "../../../Constants/Colors";
import {
  TimeCancelled,
  TimeClockSvg,
  TimeComplete,
  TimePending,
} from "../../../assets";
import FontSize from "../../../Constants/FontSize";
import { hp, wp } from "../../../utils/responsiveSizes";

// ** Third Party Packages
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

function OrderItemCard(props) {
  const { order, active } = props;
  const navigation = useNavigation();
  const { t } = useTranslation();
  const onPressOrder = () => {
    navigation.navigate("OrderDetails", {
      order_id: order.id,
      branch_id: order.service_provider[0],
      isOnDemand: false,
    });
  };

  const dataList = [
    {
      label: t("order_history.orderId"),
      value: order?.sequence_no,
    },
    {
      label: t("order_history.Payment Method"),
      value:
        order?.payment_method === "direct_payment"
          ? t("order_history.cash")
          : order?.payment_method === "wallet_pay"
          ? t("order_history.wallet_pay")
          : order?.payment_method === "credit_card" &&
            t("order_history.credit_card"),
    },
    {
      label: t("order_history.orderamount"),
      value: `${t("common.SAR")} ${order?.sub_total}`,
    },
    {
      label: t("order_history.viewOrder"),
      view: t("order_history.view"),
    },
  ];

  return (
    <View style={[styles.container(active)]}>
      <View style={styles.orderItemWrapper}>
        <View style={styles.contentWrapper}>
          <View style={styles.row}>
            <Text style={styles.mainHeading}>{order?.service_provider[1]}</Text>
          </View>

          {dataList.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.title}>{item?.label}</Text>
              {item.value ? (
                <Text style={styles.value}>{item?.value}</Text>
              ) : (
                item.view && (
                  <TouchableOpacity
                    onPress={onPressOrder}
                    style={styles.itemNavigate}
                  >
                    <Text style={styles.viewOrder}>{item.view}</Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          ))}
          <View style={styles.row}>
            <View style={styles.dateWrapper}>
              {active === 1 ? (
                <TimeComplete width={16} height={16} />
              ) : active === 2 ? (
                <TimePending width={16} height={16} />
              ) : (
                active === 3 && <TimeCancelled width={16} height={16} />
              )}

              <Text style={[styles.value, { marginLeft: wp(8) }]}>
                {order?.on_demand
                  ? order.date === moment().format("YYYY-MM-DD")
                    ? `${t("today")} ${
                        order?.slot_id ? order?.slot_id[1].split("-")[0] : ""
                      }`
                    : `${moment(order?.date).format("DD/MM/YYYY")} ${
                        order?.slot_id ? order?.slot_id[1].split("-")[0] : ""
                      }`
                  : moment(order?.create_date).format("DD/MM/YYYY")}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.statusWrapper(Platform.OS)}>
          <View style={styles.circle_1(active)} />
          <Text
            style={[
              styles.status,
              {
                color:
                  active === 1
                    ? Colors.DARKERGREEN
                    : active === 2
                    ? Colors.ORANGE
                    : Colors.RED,
              },
            ]}
          >
            {order?.status === "cancel"
              ? t("order_history.Cancelled")
              : order?.status === "complete"
              ? t("order_history.Completed")
              : t("order_history.Incompleted")}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default OrderItemCard;

const styles = StyleSheet.create({
  container: (active) => {
    return {
      width: wp(400),
      backgroundColor: Colors.BOX_GRAY,
      marginTop: hp(15),
      borderLeftWidth: 12,
      borderRadius: 10,
      shadowColor: Colors.GREY,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 2,
      borderLeftColor:
        active === 1
          ? Colors.DARKERGREEN
          : active === 2
          ? Colors.ORANGE
          : Colors.RED,
    };
  },
  orderItemWrapper: {
    paddingRight: wp(20),
    paddingVertical: wp(25),
    position: "relative",
  },
  contentWrapper: {
    paddingLeft: wp(120),
    // marginBottom: wp(20),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(12),
  },
  mainHeading: {
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs18,
    color: Colors.BLACK,
  },

  title: {
    color: Colors.BLACK,
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
  },
  value: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs14,
    color: "#B8B9C1",
  },
  itemNavigate: {
    borderBottomWidth: 1,
    borderBottomColor: "#4AD594",
  },
  viewOrder: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs14,
    color: "#4AD594",
  },
  dateWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle_1: (active) => {
    return {
      marginRight: wp(10),
      width: wp(18),
      height: wp(18),
      borderRadius: 40,
      outline: 1,
      borderWidth: 3,
      borderColor: Colors.WHITE,
      backgroundColor:
        active === 1
          ? Colors.DARKERGREEN
          : active === 2
          ? Colors.ORANGE
          : active === 3 && Colors.RED,
    };
  },
  status: {
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs14,
  },
  statusWrapper: (platform) => {
    return {
      position: "absolute",
      bottom: platform === "android" ? 34 : 38,
      left: -6,
      flexDirection: "row",
      alignItems: "center",
    };
  },
});
