import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const GetOnDemandUniqueDatesSlots = (service) => {
  const body = {
    params: {
      model: "gorex.slot",
      method: "get_unique_dates_slots",
      args: [[]],

      kwargs: { service: service },
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

export default GetOnDemandUniqueDatesSlots;
