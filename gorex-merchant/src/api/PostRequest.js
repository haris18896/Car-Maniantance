import Response from "./Response";
import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const PostRequest = async ({ endPoint, body }) => {
  return axiosInstance
    .post(endPoint, body)
    .then((response) => {
      return Response(
        !!response?.data?.result,
        response?.data?.result,
        response?.data?.error?.data?.message
      );
    })
    .catch((error) => {
      showToast("Error", error, "error");
      return error;
    });
};

export default PostRequest;
