import React, { useContext, useState, useEffect } from "react";

// ** Third Party Packages
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Text, FlatList } from "react-native";

// ** Custom Components
import Colors from "../../../../Constants/Colors";
import { FilterIcon } from "../../../../assets";
import Loader from "../../../../Components/Loader";
import TabBar from "../../../../Components/TabBar";
import { showToast } from "../../../../utils/common";
import GetOrderHistory from "../../../../api/GetOrderHistory";
import BackHeader from "../../../../Components/Header/BackHeader";
import { CommonContext } from "../../../../contexts/ContextProvider";
import { hp, wp } from "../../../../utils/responsiveSizes";
import OrderItem from "../components/OrderItem";
import EmptyList from "../../../../Components/empty";

function MyGorexOnDemandRequests({ navigation }) {
  const { userProfile, setOnDemandOrder } = useContext(CommonContext);
  const { t } = useTranslation();

  // ** States
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [inProgressOrders, setInProgressOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);

  // Tabs List
  const tabs = [
    {
      name: t("gorexOnDemand.pending"),
      color: Colors.DARKBLUE,
    },
    {
      name: t("gorexOnDemand.confirmed"),
      color: Colors.DARKBLUE,
    },
    {
      name: t("gorexOnDemand.inProgress"),
      color: Colors.DARKBLUE,
    },
    {
      name: t("gorexOnDemand.completed"),
      color: Colors.DARKBLUE,
    },
    {
      name: t("gorexOnDemand.cancelled"),
      color: Colors.DARKBLUE,
    },
  ];

  const getOrderHistory = () => {
    setLoading(true);
    GetOrderHistory({ profileID: userProfile?.id, orderID: null }).then(
      ({ success, response }) => {
        setLoading(false);
        if (success) {
          let pending = response?.filter(
            (order) => order?.status === "order_placed"
          );
          let confirmed = response?.filter(
            (order) => order?.status === "order_accepted"
          );
          let in_progress = response?.filter(
            (order) => order?.status === "in_progress"
          );
          let complete = response?.filter(
            (order) => order?.status === "complete"
          );
          let cancelled = response?.filter(
            (order) => order?.status === "cancel"
          );

          setPendingOrders(pending);
          setConfirmedOrders(confirmed);
          setInProgressOrders(in_progress);
          setCompletedOrders(complete);
          setCancelledOrders(cancelled);
        } else {
          showToast("Error", response, "error");
        }
      }
    );
  };

  useEffect(() => {
    return navigation.addListener("focus", getOrderHistory);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <BackHeader
        title={t("gorexOnDemand.myRequest")}
        rightIcon={FilterIcon}
        RightPress={() => console.log("filter data....")}
        leftPress={async () => {
          await setOnDemandOrder({})
          navigation.navigate("WelcomeOnDemand")
        }}
      />
      <View style={styles.tabBarWrapper}>
        <TabBar active={active} setActive={setActive} itemsList={tabs} />
      </View>

      <View style={styles.content}>
        {pendingOrders.length > 0 ||
        completedOrders.length > 0 ||
        inProgressOrders.length > 0 ||
        completedOrders.length > 0 ||
        cancelledOrders.length > 0 ? (
          <FlatList
            data={
              active === 0
                ? pendingOrders
                : active === 1
                ? confirmedOrders
                : active === 2
                ? inProgressOrders
                : active === 3
                ? completedOrders
                : active === 4 && cancelledOrders
            }
            // ListEmptyComponent={EmptyList}
            onRefresh={() => getOrderHistory()}
            refreshing={loading}
            contentContainerStyle={styles.flatListConatiner}
            renderItem={({ item }) => (
              <OrderItem
                item={item}
                onPress={() => console.log("item : ", item)}
                color={
                  (item.color =
                    item?.status === "order_placed"
                      ? Colors.ORANGE
                      : item?.status === "cancel"
                      ? Colors.RED
                      : Colors.DARKERGREEN)
                }
                status={
                  (item.newStatus =
                    item?.status === "order_placed"
                      ? "pending"
                      : item.status === "order_accepted"
                      ? "Confirmed"
                      : item?.status === "in_progress"
                      ? "In Progress"
                      : item.status === "complete"
                      ? "Completed"
                      : item?.status === "cancel" && "Cancelled")
                }
              />
            )}
          />
        ) : (
          <EmptyList />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  tabBarWrapper: {
    paddingHorizontal: wp(15),
    borderBottomWidth: 2,
    borderColor: Colors.LIGHT_GREY,
  },
  content: {
    flex: 1,
    marginVertical: hp(1),
    paddingHorizontal: wp(15),
  },
});

export default MyGorexOnDemandRequests;
