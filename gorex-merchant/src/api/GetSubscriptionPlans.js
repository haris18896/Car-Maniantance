import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const GetSubSubscriptionPlans = () => {
  const body = {
    params: {
      model: "gorex.device.subscription.plan",
      method: "search_read",
      args: [[]],

      kwargs: { fields: ["plan", "amount"] },
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

export default GetSubSubscriptionPlans;
