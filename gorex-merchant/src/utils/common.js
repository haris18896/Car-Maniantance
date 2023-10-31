import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hp } from "./responsiveSizes";
import NetInfo from "@react-native-community/netinfo";

const token = "token";
const partnerId = "partner_id";
const cart = "cart";
const services = "services";
const alreadyLaunched = "AlreadyLaunched";

let isConnected = true;
const unsubscribe = NetInfo.addEventListener((state) => {
  isConnected = state.isConnected;
});

// Unsubscribe
unsubscribe();

export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(cart);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {}
};

export const getServicesData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(services);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {}
};

export const setToken = async (data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(token, jsonValue);
  } catch (e) {}
};

export const getToken = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(token);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {}
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(token);
  } catch (e) {}
};

export const setAlreadyLaunched = async (data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(alreadyLaunched, jsonValue);
  } catch (e) {}
};

export const getAlreadyLaunched = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(alreadyLaunched);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {}
};

///--------------------
export const savePartnerId = async (data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(partnerId, jsonValue);
  } catch (e) {}
};

export const getPartnerId = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(partnerId);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {}
};

export const removePartnerId = async () => {
  try {
    await AsyncStorage.removeItem(partnerId);
  } catch (e) {}
};

export const setCart = async (data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem("cart", jsonValue);
  } catch (e) {}
};

export const getCart = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("cart");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {}
};

export const removeCart = async () => {
  try {
    await AsyncStorage.removeItem("cart");
  } catch (e) {}
};

export const setCountry = async (data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem("country", jsonValue);
  } catch (e) {}
};

export const getCountry = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("country");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {}
};

export const removeCountry = async () => {
  try {
    await AsyncStorage.removeItem("country");
  } catch (e) {}
};

//----------

export const setProfileUpdate = async (data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem("ProfileUpdate", jsonValue);
  } catch (e) {}
};

export const getProfileUpdate = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("ProfileUpdate");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {}
};

export const removeProfileUpdate = async () => {
  try {
    await AsyncStorage.removeItem("ProfileUpdate");
  } catch (e) {}
};

export const showToast = (title = "title", message, type = "success") => {
  Toast.show({
    type: type,
    text1: title,
    text2: message.length
      ? message
      : !isConnected
      ? "Check your internet connection"
      : "message",
    topOffset: Platform.OS === "ios" ? hp(50) : hp(15),
  });
};

export const groupBy = (objectArray, property) => {
  return objectArray.reduce(function (acc, obj) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
