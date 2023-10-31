import { showToast } from "../utils/common";
import axios from "axios";

const GetGoTrackMapDataAPI = async (dataObj) => {
  try {
    const config = {
      method: "post",
      url: "https://login.tracking.me/app/gorex_dashboard.php",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data: dataObj,
    };

    const response = await axios.request(config);
    const { success, message, data } = response.data;

    if (success === "S") {
      return {
        success: true,
        response: data,
      };
    } else {
      return {
        success: false,
        error: message,
      };
    }
  } catch (error) {
    showToast("Error", error.message || "An error occurred", "error");
    throw error;
  }
};

export default GetGoTrackMapDataAPI;
