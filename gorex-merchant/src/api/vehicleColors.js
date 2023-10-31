import GetARGS from "./GetARGS";
import GetKWARGS from "./GetKWARGS";

import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const VehicleColorsApi = async () => {
  const body = {
    params: {
      model: "vehicle.color",
      method: "search_read",
      args: [[]],
      kwargs: { fields: ["name"] },
    },
  };

  return axiosInstance
    .post("/dataset/call_kw/", body)
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

export default VehicleColorsApi;
