import { showToast } from "../utils/common";
import axios from "axios";

const AssetActivationAPI = async (dataObj) => {
  try {
    const config = {
      method: "post",
      url: "https://login.tracking.me/app/gorex_asset_activation.php",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data: dataObj,
    };

    const response = await axios.request(config);
    console.log("AssetCreationAPI : ", JSON.stringify(response.data));

    const { success, message } = response.data;

    if (success === "S") {
      return {
        success: true,
        response: message,
      };
    } else {
      return {
        success: false,
        error: message,
      };
    }
  } catch (error) {
    console.log(
      "error : ",
      error.response?.status,
      error.response?.statusText,
      error.response?.data
    );
    showToast("Error", error.message || "An error occurred", "error");
    throw error;
  }
};

export default AssetActivationAPI;
