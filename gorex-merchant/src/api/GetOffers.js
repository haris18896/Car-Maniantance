import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";
import {useTranslation} from "react-i18next";

const GetOffers = async () => {

  const body = {
    params: {
      model: "offer.management",
      method: "search_read",
      args: [],
      kwargs: {"context":{"lang":global.language === "en" ? "en_US" : "ar_001"}, fields: ["name", "description", "discount", "date", "image", "is_consumable"] },
    },
  };

  return axiosInstance.post(`/dataset/call_kw/`, body).then((response) => {
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

export default GetOffers;
