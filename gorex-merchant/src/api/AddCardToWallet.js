import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const AddCardToWallet = async () => {
  const body = {
    params: {
      method: "create",
      model: "customer.card",
      args: [
        {
          number: "19001003003",
          card_holder: 9,
        },
      ],
      kwargs: {"context":{"lang":global.language === "en" ? "en_US" : "ar_001"}},
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

export default AddCardToWallet;
