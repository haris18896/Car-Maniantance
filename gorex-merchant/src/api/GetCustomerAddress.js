import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const GetCustomerAddress = async (userId) => {
    const body = {
        params: {
            method: "search_read",
            model: "customer.address",
            args: [[["partner_id", "=",userId]]],
            kwargs: {"context":{"lang":global.language === "en" ? "en_US" : "ar_001"},"fields": ["id","name","address","latitude","longitude"]}
        },
    };

    return axiosInstance.post(`dataset/call_kw/`, body).then((response) => {
        return {
            success: response?.data?.result,
            response: response?.data?.result ? response?.data?.result : response?.data?.error?.data?.message,
        };
    }).catch((error) => {
        showToast("Error", error, "error");
        return error;
    });
};

export default GetCustomerAddress;
