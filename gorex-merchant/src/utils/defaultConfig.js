import {I18nManager} from "react-native";

const isRTL = I18nManager.isRTL;
export const defaultConfig = () => {
  return {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": isRTL ? "ar" : "en",
    },
  };
};


export const mediaUrl = "https://api2.gorex.ai/media/images/";
