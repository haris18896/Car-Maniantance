import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";
import { useTranslation } from "react-i18next";

const GetServiceProviderSlots = async ({ serviceProvider, service }) => {
  const body = {
    params: {
      model: "gorex.slot",
      method: "get_available_dates_slots",
      args: [[]],

      kwargs: {
        service_provider: serviceProvider.id,
        service: service.id
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

// const GetServiceProviderSlots = async ({ serviceProvider, service, date }) => {
//   const body = {
//     params: {
//       model: "gorex.slot",
//       method: "get_available_slots",
//       args: [[]],
//
//       kwargs: {
//         service_provider: serviceProvider.id,
//         service: service.id,
//         date: date,
//       },
//     },
//   };
//
//   return axiosInstance
//     .post(`/dataset/call_kw/`, body)
//     .then((response) => {
//       return {
//         success: response?.data?.result,
//         response: response?.data?.result
//           ? response?.data?.result
//           : response?.data?.error?.data?.message,
//       };
//     })
//     .catch((error) => {
//       showToast("Error", error, "error");
//       return error;
//     });
// };

export default GetServiceProviderSlots;
