import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const GetOnDemandServiceProviders = ({ service, date, slots, lat, long }) => {
  const body = {
    params: {
      model: "gorex.slot",
      method: "get_service_providers_available_slots",
      args: [[]],

      kwargs: {
        service: service,
        date: date,
        slot_ids: slots,
        latitude: lat,
        longitude: long,
      },
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

export default GetOnDemandServiceProviders;
