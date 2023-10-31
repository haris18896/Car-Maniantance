import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";
import {useTranslation} from "react-i18next";


const ChangeLanguage = async (userId) => {
    const body = {
        "params": {
            "model": "res.partner",
            "method": "change_language_api",
            "args": [[]],
            "kwargs": {"profile_id":userId, "lang":global.language === "en" ? "en_US" : "ar_001"}
        }
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

export default ChangeLanguage;
