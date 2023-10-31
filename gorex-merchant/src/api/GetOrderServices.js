import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";
import {useTranslation} from "react-i18next";

const GetServicesOrder = async (orderId) => {

  const body = {
    params: {
      model: "order.product",
      method: "search_read",
      args: [[
        ["order_id", "=", orderId],
        ["product_id.product_type", "=", "service"]
      ]],
      kwargs: {"context":{"lang":global.language === "en" ? "en_US" : "ar_001"}, fields: ["product_id", "quantity", "price", "total_price"] }
    }
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

export default GetServicesOrder;
