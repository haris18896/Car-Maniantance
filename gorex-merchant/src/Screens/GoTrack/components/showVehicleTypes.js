import React from "react";
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// ** Custom Components
import Colors from "../../../Constants/Colors";
import { hp, wp } from "../../../utils/responsiveSizes";
import MessageWithImage from "../../../Components/MessageWithImage";
import {
  NoVehicle,
  VehiclePlaceholder,
  GreyCheckBoxUnchecked,
  GreenCheckBoxChecked,
} from "../../../assets";

function ShowVehicleTypes(props) {
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
        numColumns={2}
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
            <TouchableOpacity
              style={styles.VehicleTypesWrapper}
              onPress={() => onItemPress({ item })}
            >
              <View style={styles.vehicleType(isSelected)}>
                <Image
                  source={
                    item?.image_file
                      ? { uri: `data:image/gif;base64,${item?.image_file}` }
                      : VehiclePlaceholder
                  }
                  style={styles.vehicleIcon}
                />
                <View style={styles.vehicleCheckBox}>
                  {isSelected ? (
                    <GreenCheckBoxChecked width={wp(18)} height={wp(18)} />
                  ) : (
                    <GreyCheckBoxUnchecked width={wp(18)} height={wp(18)} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
}

export default ShowVehicleTypes;

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
  VehicleTypesWrapper: {
    width: "50%",
  },
  vehicleType: (isSelected) => {
    return {
      position: "relative",
      paddingVertical: hp(36),
      paddingHorizontal: wp(50),
      backgroundColor: Colors.WHITE,
      borderRadius: wp(10),
      borderWidth: 1,
      margin: wp(10),
      shadowColor: Colors.GREY,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity:  0.2,
      shadowRadius: 6,
      elevation: 6,
      borderColor: isSelected ? Colors.DARKERGREEN : Colors.WHITE,
    };
  },
  vehicleIcon: {
    width: wp(90),
    height: wp(50),
  },
  vehicleCheckBox: {
    position: "absolute",
    top: wp(10),
    right: wp(10),
  },
});
