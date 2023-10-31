import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import MessageWithImage from "../../../Components/MessageWithImage";
import { ClockBold, NoTopUpCard, NoVehicle } from "../../../assets";
import VehicleCard from "../../OnDemandFlow/onDemandTab/components/VechileCard";
import Colors from "../../../Constants/Colors";
import { hp, wp } from "../../../utils/responsiveSizes";
import { useTranslation } from "react-i18next";
import Fonts from "../../../Constants/fonts";
import FontSize from "../../../Constants/FontSize";

function ShowPlans(props) {
  const {
    data,
    loading,
    selected,
    refreshing,
    emptyTitle,
    onItemPress,
    emptyDescription,
  } = props;

  const { t } = useTranslation();

  return (
    <>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        onRefresh={refreshing}
        refreshing={loading}
        contentContainerStyle={
          data.length === 0 && {
            flex: 1,
            justifyContent: "center",
          }
        }
        ListEmptyComponent={
          <View style={styles.EmptyVehiclesList}>
            <Text style={styles.emptyTitle}>{emptyTitle}</Text>
            <Text style={styles.emptyDescription}>{emptyDescription}</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = item?.id === selected?.id;
          return (
            <TouchableOpacity
              style={styles.selectStatusButton}
              onPress={() => onItemPress({ item })}
            >
              <View style={styles.planTitleWrapper}>
                <ClockBold width={wp(24)} height={hp(24)} />
                <Text style={styles.planText}>{item.plan}</Text>
              </View>

              <View style={styles.planTitleWrapper}>
                <Text style={styles.planText}>
                  {item.amount} {t("SAR")}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
}

export default ShowPlans;

const styles = StyleSheet.create({
  EmptyVehiclesList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardStyle: (isSelected) => {
    return {
      borderColor: Colors.DARKERGREEN,
      borderWidth: isSelected ? 2 : 0,
    };
  },
  selectStatusButton: {
    marginVertical: hp(5),
    paddingVertical: hp(0),
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  planTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  planText: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs18,
    color: Colors.BLACK,
    textAlign: "left",
    marginLeft: wp(10),
    textTransform: "capitalize",
  },
  emptyTitle: {
    fontFamily: Fonts.LexendSemiBold,
    ...FontSize.rfs18,
    color: Colors.BLACK,
    textAlign: "center",
  },
  emptyDescription: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs18,
    color: Colors.GREY,
    textAlign: "center",
  },
});
