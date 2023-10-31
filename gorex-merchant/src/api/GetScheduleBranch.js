import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";
import {useTranslation} from "react-i18next";

const GetScheduleBranch = async (partner_id) => {

  const body = {
    params: {
      model: "gorex.opening.hours",
      method: "search_read",
      args: [[["partner_id", "=", partner_id]]],
      kwargs: {"context":{"lang":global.language === "en" ? "en_US" : "ar_001"}, fields: ["day", "start_time", "end_time"] },
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

export default GetScheduleBranch;
