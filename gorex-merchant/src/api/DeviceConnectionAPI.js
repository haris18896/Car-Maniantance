import { showToast } from "../utils/common";
import axios from "axios";

const DeviceConnectionAPI = async (connectDevice) => {
  try {
    const config = {
      method: "post",
      url: "https://login.tracking.me/app/gorex_connection.php",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data: connectDevice,
    };

    const response = await axios.request(config);
    const { success, message, data } = response.data;

    if (success === "S") {
      return {
        success: true,
        response: message,
      };
    } else {
      return {
        success: false,
        error: data,
      };
    }
  } catch (error) {
    console.log("error : ", error.response);
    showToast("Error", error.message || "An error occurred", "error");
    throw error;
  }
};

export default DeviceConnectionAPI;
