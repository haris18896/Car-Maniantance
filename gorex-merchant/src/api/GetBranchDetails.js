import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const GetBranchDetails = (id) => {
  const body = {
    params: {
      model: "res.partner",
      method: "get_branch_detail",
      args: [[]],

      kwargs: { branch: id },
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

export default GetBranchDetails;
