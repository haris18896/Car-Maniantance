import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import Navigation from "./src/navigations";
import { BackHandler } from "react-native";
import { StyleSheet, StatusBar } from "react-native";
import ContextProvider from "./src/contexts/ContextProvider";
import KeyboardProvider from "./src/contexts/KeyboardProvider";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { NotificationsProvider } from "./src/contexts/NotificationsContext";
import Colors from "./src/Constants/Colors";
import NetInfo from "@react-native-community/netinfo";

import { Settings } from "react-native-fbsdk-next";

// import GoogleTagManager from "react-native-google-tag-manager";
// import crashlytics from "@react-native-firebase/crashlytics";

import "./src/i18n";
import { showToast } from "./src/utils/common";
import { useTranslation } from "react-i18next";

async function facebookSDK() {
  await Settings.setAppID("2010716229275621");
  await Settings.initializeSDK();
}

const App = () => {
  const { t } = useTranslation();
  let containerId = "";
  if (Platform.OS === "ios") {
    containerId = "GTM-NVKSF2K";
  } else if (Platform.OS === "android") {
    containerId = "GTM-MXCB94C";
  }

  useEffect(() => {
    // crashlytics().log('App mounted.');

    // GoogleTagManager.openContainerWithId(`${containerId}`).then(() =>
    //   console.log("gtm response")
    // );
    const backAction = () => {
      return true; // Do nothing when the back button is pressed
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  let isConnected = true;

  useEffect(() => {
    facebookSDK();
    const unsubscribe = NetInfo.addEventListener((state) => {
      isConnected = state.isConnected;
    });

    // Unsubscribe
    unsubscribe();
  }, [isConnected]);

  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          height: "auto",
          borderLeftColor: Colors.DARKERGREEN,
          elevation: 7,
          padding: 10,
          shadowOpacity: 0.2,
          shadowRadius: 2,
          shadowOffset: { width: 0, height: 2 },
          shadowColor: "#000",
        }}
        text1Style={{
          textAlign: "left",
        }}
        text2Style={{
            textAlign: "left",
        }}
        text1NumberOfLines={10}
        text2NumberOfLines={10}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          height: "auto",
          borderLeftColor: Colors.RED,
          padding: 10,
          elevation: 7,
          shadowOpacity: 0.2,
          shadowRadius: 2,
          shadowOffset: { width: 0, height: 2 },
          shadowColor: "#000",
        }}
        text1Style={{
            textAlign: "left",
        }}
        text2Style={{
            textAlign: "left",
        }}
        text1NumberOfLines={10}
        text2NumberOfLines={10}
        text1={!isConnected ? `${t("errors.error")}` : props.text1}
        text2={!isConnected ? `${t("errors.no-internet")}` : props.text2}
      />
    ),
  };
  return (
    <NotificationsProvider>
      <ContextProvider>
        <KeyboardProvider>
          <StatusBar barStyle={"light-content"} />
          <Navigation />
          <Toast config={toastConfig} />
        </KeyboardProvider>
      </ContextProvider>
    </NotificationsProvider>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    // backgroundColor: Colors.BLUE,
    flex: 1,
  },

  uperSafeArea: {
    // backgroundColor: Colors.BLUE,
    flex: 0,
  },
});

//make this component available to the app
export default App;
