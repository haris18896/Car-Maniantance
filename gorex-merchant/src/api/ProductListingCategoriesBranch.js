import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const ProductCategoriesBranch = async () => {
  const body = {
    branch_id: 8,
    category_type: "product",
  };

  return axiosInstance
    .post(`/branch/categories`, body)
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

export default ProductCategoriesBranch;
