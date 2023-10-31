import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const CancelOrderId = async (orderId, reason) => {
  const body = {
    cancelation_reason: reason,
    order_id: orderId,
  };
  return axiosInstance
    .post(`/cancel/order`, body)
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

export default CancelOrderId;
