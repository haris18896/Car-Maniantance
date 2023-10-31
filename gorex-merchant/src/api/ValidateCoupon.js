import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const ValidateCoupon = async ({body}) => {
    return axiosInstance.post(`/coupon/validity`, body).then((response) => {
        return {
            success: response?.data?.result.length>0,
            response: response?.data?.result,
        };
    })
        .catch((error) => {
            showToast("Error", error, "error");
            return error;
        });
};

export default ValidateCoupon;
