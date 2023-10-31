import Response from "./Response";
import GetRequest from "./GetRequest";
import PostRequest from "./PostRequest";

import { LOGIN_USER, FCM_TOKEN_END_POINT } from "./EndPoints";
import axiosInstance from "../utils/axiosInstance";
import { showToast } from "../utils/common";

const LoginUser = async ({ phoneNumber, password, agent }) => {
  const body = {
    username_or_phone: phoneNumber,
    password,
    userAgent: agent,
  };

  return await PostRequest({ body, endPoint: LOGIN_USER });
};

export const SaveFCMToken = async ({ fcmtoken, userParentId }) => {
  const body = {
    user_id: userParentId,
    token: fcmtoken,
  };

  return axiosInstance
    .post(`/save/fcm/token`, body)
    .then((res) => {
      return {
        jsonrpc: res?.data?.jsonrpc,
        id: res.data?.id,
      };
    })
    .catch((error) => {
      showToast("Error", error, "error");
      return error;
    });
};

const GetUser = async ({ userID }) => {
  return await GetRequest({
    model: "res.users",
    method: "search_read",
    args: [[["id", "=", userID]]],
    kwargs: {
      context: { lang: global.language === "en" ? "en_US" : "ar_001" },
      fields: ["partner_id", "name", "email", "login"],
    },
  });
};

const GetProfile = async ({ profileID }) => {
  return await GetRequest({
    model: "res.partner",
    method: "search_read",
    args: [[["id", "=", profileID]]],
    kwargs: {
      context: { lang: global.language === "en" ? "en_US" : "ar_001" },
      fields: [
        "id",
        "name",
        "first_name",
        "last_name",
        "phone",
        "email",
        "dob",
        "gender",
        "address",
        "driving_license_number",
        "driving_license_expiry",
        "balance",
        "pakage",
        "profile_completed",
        "parent_partner_id",
      ],
    },
  });
};

const SignIn = async ({ phoneNumber, password, agent }) => {
  return await LoginUser({ phoneNumber, password, agent }).then(
    async (loginUserResponse) => {
      if (loginUserResponse?.success && parseInt(loginUserResponse?.data) > 0) {
        return await GetUser({ userID: loginUserResponse?.data }).then(
          async (getUserResponse) => {
            if (getUserResponse?.success) {
              return await GetProfile({
                profileID: getUserResponse?.data[0]?.partner_id[0],
              }).then((getProfileResponse) => {
                if (getProfileResponse?.success) {
                  return Response(
                    getProfileResponse?.success,
                    {
                      userParentId: getUserResponse?.data[0]?.id,
                      userID: getUserResponse?.data[0]?.partner_id[0],
                      profileData: getProfileResponse?.data[0],
                    },
                    getProfileResponse?.message
                  );
                } else {
                  return getProfileResponse;
                }
              });
            } else {
              return getUserResponse;
            }
          }
        );
      } else {
        return Response(false, null, loginUserResponse?.data);
      }
    }
  );
};

const GetAllBranches = async (branchId) => {
  // let args = [[["is_vendor", "=", 1], ["contected_user_id.active","=",true]]];
  // if (branchId){
  //     args.push(["id","=",branchId])
  // }

  return await GetRequest({
    model: "res.partner",
    method: "search_read",
    args: [[["id", "=", branchId]]],
    kwargs: {
      context: { lang: global.language === "en" ? "en_US" : "ar_001" },
      fields: [
        "name",
        "services",
        "active",
        "longitude",
        "latitude",
        "opening_hours",
        "gorex_country",
        "gorex_city",
        "address",
      ],
    },
  });
};

export {
  // Auth
  SignIn,
  LoginUser,
  GetUser,
  GetProfile,

  // Branches, Products & Services
  GetAllBranches,
};
