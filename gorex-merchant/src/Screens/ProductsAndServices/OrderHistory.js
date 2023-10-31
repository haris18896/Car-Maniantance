import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, FlatList } from "react-native";
import { MenuBlack } from "../../assets";
import BackHeader from "../../Components/Header/BackHeader";
import NoOrder from "../../Components/NoOrder";
import Colors from "../../Constants/Colors";
import GetOrderHistory from "../../api/GetOrderHistory";
import TabBarOrder from "./components/TabBarOrder";
import { CommonContext } from "../../contexts/ContextProvider";
import { showToast } from "../../utils/common";
import Loader from "../../Components/Loader";
import analytics from "@react-native-firebase/analytics";
import OrderItemCard from "./components/OrderItemCard";

const OrderHistory = ({ navigation }) => {
  const { userProfile } = useContext(CommonContext);

  const [active, setActive] = useState(2);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [incompleteOrders, setIncompleteOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "order_history_screen",
    });
  }, []);

  useEffect(() => {
    return navigation.addListener("focus", handleViewSwitch);
  }, [navigation]);

  const handleViewSwitch = () => {
    fetchHistory();
  };

  const fetchHistory = () => {
    setLoading(true);
    GetOrderHistory({ profileID: userProfile?.id, orderID: null }).then(
      ({ success, response }) => {
        if (success) {
          let completed = response?.filter(
            (order) => order?.status === "complete"
          );
          let incomplete = response?.filter(
            (order) =>
              order?.status !== "complete" && order?.status !== "cancel"
          );
          let cancelled = response?.filter(
            (order) => order?.status === "cancel"
          );

          setCompletedOrders(completed);
          setIncompleteOrders(incomplete);
          setCancelledOrders(cancelled);
          setLoading(false);
        } else {
          showToast("Error", response, "error");
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <BackHeader
        title={t("order_history.Order History")}
        leftIcon={MenuBlack}
        leftPress={() => navigation.openDrawer()}
      />
      <TabBarOrder active={active} setActive={setActive} />
      <View style={styles.paddedContent}>
        <FlatList
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchHistory}
          ListEmptyComponent={() => NoOrder({ active })}
          initialNumToRender={10}
          data={
            active === 1
              ? completedOrders
              : active === 2
              ? incompleteOrders
              : cancelledOrders
          }
          renderItem={({ item }) => (
            <OrderItemCard order={item} active={active} />
          )}
        />
      </View>
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
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
  },
});

export default OrderHistory;
