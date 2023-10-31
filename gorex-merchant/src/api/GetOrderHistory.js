import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";
import {useTranslation} from "react-i18next";

const GetOrderHistory = async ({profileID, orderID= null}) => {

  let args = [["driver", "=", profileID]];
  if (orderID){
    args.push(["id", "=", orderID])
  }

  const body = {
    params: {
      model: "gorex.order",
      method: "search_read",
      args: [args],
      kwargs: {"context":{"lang":global.language === "en" ? "en_US" : "ar_001"}, fields: ["date","customer", "slot_id",  "service_provider","sub_total", "payment_method", "status", "order_lines", "cancelation_reason", "create_date", "net_amount", "vehicle_id","sequence_no", "on_demand", "schedule_date"],},

    },
  };

  return axiosInstance.post(`/dataset/call_kw/`, body).then((response) => {
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

export default GetOrderHistory;
