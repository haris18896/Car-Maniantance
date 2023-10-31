import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const AddCardCustomer = async (id) => {
  const body = {
    customer:id
  };

  return axiosInstance.post(`add/card/action/api`, body).then((response) => {
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

export default AddCardCustomer;
