import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const CreateOrder = async (args) => {
  const body = {
    params: {
      method: "create",
      model: "gorex.order",
      args: [args],
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

export default CreateOrder;

const ApplePay = ({ orderId }) => {
  const body = {
    payment_action: "order", // topup or order
    record_id: orderId, // topupId or orderId
  };

  return axiosInstance
    .post(`/apple/pay/api`, body)
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
export { ApplePay };

const CreateExtraService = ({ orderId, productId, paymentId }) => {
  const body = {
    params: {
      model: "gorex.order",
      method: "create_extra_service_order",
      args: [[]],

      kwargs: {
        order_id: orderId,
        product_id: productId,
        payment_method_id: paymentId,
      },
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
export { CreateExtraService };
