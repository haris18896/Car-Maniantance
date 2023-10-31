import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const OfferCreateAPI = async ({ driver_id, vehicle_id, coupon }) => {
  const body = {
    params: {
      model: "gorex.order",
      method: "create_offer_order",
      args: [[]],

      kwargs: { driver: driver_id, vehicle_id: vehicle_id, code: coupon },
    },
  };

  return axiosInstance
    .post(`/dataset/call_kw/`, body)
    .then((response) => {
      return {
        success: response?.data?.result.status,
        response: response?.data?.result?.data
          ? response?.data?.result?.data
          : response?.data?.error?.message,
      };
    })
    .catch((error) => {
      showToast("Error", error, "error");
      return error;
    });
};

export default OfferCreateAPI;
