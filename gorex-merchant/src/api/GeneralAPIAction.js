import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const GeneralAPIAction = async (action, body, actionName = null) => {
  const endPoint = actionName ? actionName : `/${action}/api/action`;

  return axiosInstance.post(endPoint, body)
    .then((response) => {
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

export default GeneralAPIAction;
