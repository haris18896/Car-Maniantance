import { Alert } from "react-native";
import Geolocation from "@react-native-community/geolocation";

const getCurrentLocationLatLong = async () => {
  Geolocation.getCurrentPosition(
    (location) => {
      return {
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
      };
    },
    (error) => {
      if (error.code === 2) {
        Alert.alert("Alert!", "Please enable your location to use maps");
      }
    }
  );
};

export default getCurrentLocationLatLong;
