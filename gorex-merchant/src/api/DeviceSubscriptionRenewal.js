import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";
import { useTranslation } from "react-i18next";

const DeviceSubscriptionRenewal = ({ id, autoRenewal }) => {
  const body = {
    params: {
      model: "gorex.track.device",
      method: "device_renewal_api",
      args: [[]],

      kwargs: { device_id: id, auto_renew: autoRenewal },
    },
  };

  console.log('bodyData : ', body.params.kwargs)

  return axiosInstance
    .post(`/dataset/call_kw/`, body)
    .then((response) => {
      console.log("response of renewal: ", response?.data);
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

export default DeviceSubscriptionRenewal;
