import Response from "./Response";
import { GET_REQUEST } from "./EndPoints";
import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const GetRequest = async ({ method, model, args, kwargs }) => {
  const body = {
    params: {
      method,
      model,
      args,
      kwargs,
    },
  };

  return axiosInstance.post(GET_REQUEST, body).then((response) => {
        return Response(!!response?.data?.result, response?.data?.result, response?.data?.error?.data?.message,);
    }).catch((error) => {
      showToast("Error", error, "error");
      return error;
    });
};

export default GetRequest;
