import { showToast } from "../utils/common";
import {useTranslation} from "react-i18next";
import axiosInstance from "../utils/axiosInstance";

const GetProductDetail = async () => {

  const body = {
    params: {
      model: "product.template",
      method: "search_read",
      args: [[["partner_id", "=", 8]]],
      kwargs: {"context":{"lang":global.language === "en" ? "en_US" : "ar_001"}, fields: ["price", "product_type", "name", "image_128"] },
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

export default GetProductDetail;
