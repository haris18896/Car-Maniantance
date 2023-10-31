import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";
import { useTranslation } from "react-i18next";

const DevicePaymentAPI = ({ data }) => {
  const body = {
    params: {
      model: "gorex.track.device",
      method: "store_device",
      args: [[]],

      kwargs: {
        data: {
          name: data?.name,
          imei_no: data?.imei_no,
          sim_no: data?.sim_no,
          tracking_vehicle_id: data?.tracking_vehicle_id,
          vehicle_id: data?.vehicle_id,
          vehicle_type_id: data?.vehicle_type_id,
          subscription_plan_id: data?.subscription_plan_id,
          partner_id: data?.partner_id,
          date: data?.date,
          valid_till: data?.valid_till,
          status: data?.status,
          card_id: data?.card_id,
        },
      },
    },
  };

  return axiosInstance
    .post(`/dataset/call_kw/`, body)
    .then((response) => {
      console.log("response of payment api : ", response?.data);
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

export default DevicePaymentAPI;
