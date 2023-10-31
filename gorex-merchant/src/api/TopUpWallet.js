import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";
import {useTranslation} from "react-i18next";

const TopUpWallet = async () => {

  const body = {
    params: {
      method: "create",
      model: "wallet.topup",
      args: [
        {
          customer: 1,
          amount: 10,
          card_number: 1,
          date: "2023-01-01",
          status: "draft",
        },
      ],
      kwargs: {"context":{"lang":global.language === "en" ? "en_US" : "ar_001"},},
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

export default TopUpWallet;
