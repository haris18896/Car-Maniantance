import GetARGS from "./GetARGS";
import GetKWARGS from "./GetKWARGS";

import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const GeneralAPI = async ({ method, model, conditions, endPoint = null }) => {
  const body = {
    params: {
      method,
      model,
      args: GetARGS(method, model, conditions),
      kwargs: GetKWARGS(method, model, conditions),
    },
  };

  return axiosInstance
    .post(endPoint ? endPoint : "/dataset/call_kw/", body)
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

export default GeneralAPI;
