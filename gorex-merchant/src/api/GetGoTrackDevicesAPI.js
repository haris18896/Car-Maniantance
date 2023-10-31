import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";
import { useTranslation } from "react-i18next";

const GetGoTrackDevicesAPI = (id) => {
  const body = {
    params: {
      model: "gorex.track.device",
      method: "search_read",
      args: [[["partner_id", "=", id]]],

      kwargs: {
        fields: [
          "name",
          "imei_no",
          "partner_id",
          "tracking_vehicle_id",
          "date",
          "valid_till",
          "status",
          "vehicle_type_id",
          "subscription_plan_id",
          "auto_renew",
          "vehicle_id",
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

export default GetGoTrackDevicesAPI;
