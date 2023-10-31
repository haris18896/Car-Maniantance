import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";
import { useTranslation } from "react-i18next";

const GetVehicleVariantTypes = () => {
  const body = {
    params: {
      model: "vehicle.type",
      method: "search_read",
      args: [[]],
      kwargs: { fields: ["id", "name", "image_file"] },
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

export default GetVehicleVariantTypes;
