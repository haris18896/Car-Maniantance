import axiosInstance from "../utils/axiosInstance";
import {showToast} from "../utils/common";


const ChargeCardForTopUp = async (topUpId) => {
    const body = {
        "payment_action": "topup",
        "record_id": topUpId
    };

    return axiosInstance.post(`/payment/api/action`, body).then((response) => {
        return {
            success: response?.data?.result,
            response: response?.data?.result ? response?.data?.result : response?.data?.error?.data?.message,
        };
    })
        .catch((error) => {
            showToast("Error", error, "error");
            return error;
        });
};

export default ChargeCardForTopUp;
