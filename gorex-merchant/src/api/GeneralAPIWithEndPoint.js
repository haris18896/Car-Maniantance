import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const GeneralAPIWithEndPoint = async (endPoint, body) => {

  return axiosInstance.post(endPoint, body).then((response) => {
      return response?.data?.result;
    })
    .catch((error) => {
      showToast("Error", error, "error");
      return error;
    });
};

export default GeneralAPIWithEndPoint;
