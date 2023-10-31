import axios from "axios";
import { showToast } from "../utils/common";

const GetAddressFromCoordinates = async (coordinates) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=AIzaSyAC8v-kKXGvsLJ5j70V332XFxa-m-WKjzE`,
    headers: {},
  };

  return axios
    .request(config)
    .then((response) => {
      return {
        success: response?.data,
        response: response?.data?.results
          ? response?.data?.results
          : response?.error_message,
      };
    })
    .catch((error) => {
      showToast("Error", error.message, "error");
      return {
        success: false,
        response: [],
      };
    });
};

export default GetAddressFromCoordinates;
