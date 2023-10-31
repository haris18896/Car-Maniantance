import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const GetClubedProducts = (id) => {
  const body = {
    params: {
      model: "product.template",
      method: "get_clubed_products_with_cat",
      args: [[]],
      kwargs: {},
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

export default GetClubedProducts;
