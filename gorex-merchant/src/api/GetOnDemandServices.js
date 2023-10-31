import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";
import { useTranslation } from "react-i18next";

const GetOnDemandServices = async () => {
  const body = {
    params: {
      model: "product.template",
      method: "search_read",
      args: [[["on_demand", "=", true]]],
      kwargs: {
        context: { lang: global.language === "en" ? "en_US" : "ar_001" },
        fields: ["name", "price", "description"],
        order: "categ_id, price DESC",
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

export default GetOnDemandServices;
