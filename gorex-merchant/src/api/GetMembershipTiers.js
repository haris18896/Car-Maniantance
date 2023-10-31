import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";
import {useTranslation} from "react-i18next";

const GetMembershipTiers = (id) => {

    const body = {
        "params": {
            "model": "promo.points",
            "method": "search_read",
            "args": [[["gorex_coupon_id.name", "=","MEMBERSHIP"],["gorex_coupon_id.active", "=",true]]],
            "kwargs": {"context":{"lang":global.language === "en" ? "en_US" : "ar_001"},"fields": ["target_name","from_target","to_target","points"]}
        }
    };
    return axiosInstance.post(`/dataset/call_kw/`, body).then((response) => {
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

export default GetMembershipTiers;
