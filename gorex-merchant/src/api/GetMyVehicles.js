import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";
import {useTranslation} from "react-i18next";

const GetMyVehicles = (id) => {

  const body = {
    params: {
      model: "gorex.vehicle",
      method: "search_read",
      args: [[["customer", "=",id]]],
      kwargs: {"context":{"lang":global.language === "en" ? "en_US" : "ar_001"},fields: ["vehicle_type","driver","name","customer","manufacturer","policy_number","vehicle_model","validity_policy_no","year_id","fahas","vehicle_color","validity_fahas","fuel_type","odometer","insurance_type",
          "gps","nfc","is_tracking_installed","file","image_file","is_primary","vehicle_variant"]}
    },
  };


  return axiosInstance.post(`/dataset/call_kw/`, body).then((response) => {
    return {
      success: response?.data?.result,
      response: response?.data?.result ? response?.data?.result : response?.data?.error?.data?.message,
    };
  })
      .catch((error) => {
        showToast("Error", error, "error");
        return error;
      });
};

export default GetMyVehicles;
