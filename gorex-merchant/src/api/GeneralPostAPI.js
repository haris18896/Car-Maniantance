import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const GeneralPostAPI = async ({ method, model, args, endPoint = null }) => {
  const body = {
    params: {
      method,
      model,
      args,
      kwargs: {"context":{"lang":global.language === "en" ? "en_US" : "ar_001"}},
    },
  };

  return axiosInstance.post(endPoint ? endPoint : "/dataset/call_kw/", body).then((response) => {
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

export default GeneralPostAPI;
