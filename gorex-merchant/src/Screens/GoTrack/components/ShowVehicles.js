import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import MessageWithImage from "../../../Components/MessageWithImage";
import { NoVehicle } from "../../../assets";
import VehicleCard from "../../OnDemandFlow/onDemandTab/components/VechileCard";
import Colors from "../../../Constants/Colors";

function ShowVehicles(props) {
  const {
    data,
    loading,
    selected,
    refreshing,
    onItemPress,
    noVehicleTitle,
    noVehicleDescription,
  } = props;
  return (
    <>
      <FlatList
        data={data}
        horizontal={true}
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
            <MessageWithImage
              imageSource={NoVehicle}
              message={noVehicleTitle}
              description={noVehicleDescription}
            />
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = item?.id === selected?.id;
          return (
            <TouchableOpacity onPress={() => onItemPress({ item })}>
              <>
                <VehicleCard
                  cardStyle={styles.cardStyle(isSelected)}
                  vehicle={item}
                  selected={item?.id === selected?.id}
                  isComingFromGoTrack={true}
                  isComingFromNewOnDemand={false}
                />
              </>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
}

export default ShowVehicles;

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
});
