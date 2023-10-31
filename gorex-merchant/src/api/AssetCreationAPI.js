import { showToast } from "../utils/common";
import axios from "axios";

const AssetCreationAPI = async (assetCreate) => {
  try {
    const config = {
      method: "post",
      url: "https://login.tracking.me/app/gorex_assets.php",
      headers: {
        // Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data: assetCreate,
    };

    const response = await axios.request(config);
    console.log("AssetCreationAPI : ", JSON.stringify(response.data));

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

export default AssetCreationAPI;
