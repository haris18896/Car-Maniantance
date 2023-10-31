import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const CouponDetail = async (couponCode) => {
  const body = {
    params: {
      model: "gorex.customer.coupon",
      method: "search_read",
      args: [[["sequence_code", "=", couponCode]]],

      kwargs: {"context":{"lang":global.language === "en" ? "en_US" : "ar_001"},
        fields: [
          "id",
          "customer",
          "sequence_code",
          "product_ids",
          "date",
          "expire_date",
          "amount",
          "discount",
          "quantity",
          "status",
          "display_name",
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

export default CouponDetail;
