import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const NearByBranches = async ({ region, userId }) => {
  const body = {
    customer: userId,
    lat: `${region.latitude}`,
    long: `${region.longitude}`,
  };

  return axiosInstance
    .post(`/nearby/service_providers`, body)
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

export default NearByBranches;
