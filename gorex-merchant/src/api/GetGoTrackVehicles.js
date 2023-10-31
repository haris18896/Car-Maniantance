import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";
import { useTranslation } from "react-i18next";

const GetGoTrackVehicles = (id) => {
  const body = {
    params: {
      model: "gorex.vehicle",
      method: "search_read",
      args: [[["customer", "=", id]]],

      kwargs: {
        fields: [
          "driver",
          "customer",
          "manufacturer",
          "vehicle_model",
          "vehicle_color",
          "vehicle_variant",
          "year_id",
          "name",
          "file",
          "is_primary",
        ],
      },
    },
  };

  return axiosInstance
    .post(`/dataset/call_kw/`, body)
    .then((response) => {
      return {
        success: response?.data?.result,
        response: response?.data?.result
          ? response?.data?.result
          : response?.data?.error?.data?.message,
      };
    })
    .catch((error) => {
      showToast("Error", error, "error");
      return error;
    });
};

export default GetGoTrackVehicles;
