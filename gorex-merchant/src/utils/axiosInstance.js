import axios from "axios";

import { getToken, removeToken, setToken } from "./common";
import { getFirstValidationError } from "./getFirstValidationError";

import { defaultConfig } from "./defaultConfig";

const axiosInstance = axios.create({
  ...defaultConfig(),
  //-------- Local
  baseURL: `http://portal.gorex.ai:8069/web`,

  //-------- Live
  // baseURL: `https://partner.gorex.ai/web`,
});
axiosInstance.defaults.timeout = 30000;

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async (error) => {
    const originalRequest = error?.config;
    if (
      error?.response?.status === 401 &&
      !originalRequest?._retry &&
      error?.config?.url !== "/auth/login"
    ) {
      try {
        originalRequest._retry = true;
        const result = await axiosInstance.post(`/auth/refresh`);
        await setToken(result?.data?.data);

        axiosInstance.defaults.headers.common["Authorization"] =
          "Bearer " + result?.accessToken;
        return axiosInstance(originalRequest);
      } catch (err) {
        await removeToken();
      }
    }
    return Promise.reject(getFirstValidationError(error));
  }
);

axiosInstance.interceptors.request.use(
  async (config) => {
    const tokens = await getToken();
    config.headers = {
      Authorization: `Bearer ${
        config?.url === "/auth/refresh"
          ? tokens?.refreshToken
          : tokens?.accessToken
      }`,
    };
    return config;
  },
  async (error) => {
    return Promise.reject(getFirstValidationError(error));
  }
);

// export const setAxiosAuthToken = token => {
//   axiosInstance.defaults.headers['auth-token'] = `${token}`;
// };

export default axiosInstance;
