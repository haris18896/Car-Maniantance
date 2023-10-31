import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const ValidateOfferCoupon = async ({ driver_id, coupon }) => {
  const body = {
    params: {
      model: "gorex.order",
      method: "check_offer_coupon_validity",
      args: [[]],

      kwargs: { driver: driver_id, code: coupon },
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
    .catch((err) => {
      showToast("Error", err, "error");
      return err;
    });
};

export default ValidateOfferCoupon;
