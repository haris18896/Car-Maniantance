import moment from "moment";
import {showToast} from "../utils/common";
import {useTranslation} from "react-i18next";
import axiosInstance from "../utils/axiosInstance";

const UpdateProfile = async (profileData, userID) => {

    const updatedProfileData = {
        "name": `${profileData?.first_name} ${profileData?.last_name}`,
        "first_name": profileData?.first_name,
        "last_name": profileData?.last_name,
        "phone": profileData?.phone,
        "email": profileData?.email,
        "dob": moment(profileData?.dob).format("YYYY-MM-DD"),
        "gender": profileData?.gender,
        "address": profileData?.address,
        "driving_license_number": profileData?.driving_license_number,
        "driving_license_expiry": profileData?.driving_license_expiry,
    };

    let body = {
        "params":{
            "model":"res.partner",
            "method": "write",
            "args":[[ userID ], updatedProfileData ],
            "kwargs": {"context":{"lang":global.language === "en" ? "en_US" : "ar_001"}}
        }
    }

    return axiosInstance.put( "/dataset/call_kw/", body).then((response) => {
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

export default UpdateProfile;
