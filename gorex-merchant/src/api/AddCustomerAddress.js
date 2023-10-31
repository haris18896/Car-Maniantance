import { showToast } from "../utils/common";
import axiosInstance from "../utils/axiosInstance";

const AddCustomerAddress = async ({ partnerID, addressName, address, longitude, latitude }) => {
    const body = {
        params: {
            method: "create",
            model: "customer.address",
            args: [
                {
                    partner_id: partnerID,
                    name: addressName,
                    address,
                    latitude,
                    longitude
                },
            ],
            kwargs: {},
        },
    };

    return axiosInstance.post(`dataset/call_kw/`, body).then((response) => {
        return {
        success: response?.data?.result,
        response: response?.data?.result
            ? response?.data?.result
            : response?.data?.error?.data?.message,
        };
    }).catch((error) => {
        showToast("Error", error, "error");
        return error;
    });
};

export default AddCustomerAddress;
