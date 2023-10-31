import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const getPaymentMethod = async ({serviceProviderId}) => {
  const body = {
    params: {
      model: "res.partner",
      method: "get_payment_methods",
      args: [[]],

      kwargs: { service_provider: serviceProviderId },
    },
  };

  return axiosInstance
    .post(`/dataset/call_kw/`, body)
    .then((response) => {
      return {
        // success: response?.data?.result,
        response: response
          ? response?.data?.result
          : response?.data?.error?.data?.message,
      };
    })
    .catch((error) => {
      showToast("Error", error, "error");
      return error;
    });
};

export default getPaymentMethod;
