import React, { createContext, useContext, useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { Platform } from "react-native";
import Utilities from "../utils/UtilityMethods";

export const KeyboardContext = createContext();

export const useKeyboard = () => {
  return useContext(KeyboardContext);
};

const KeyboardProvider = (props) => {
  const [isKeyboardOpened, setIsKeyboardOpened] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    let hideSubscriptionKey =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidShow";
    let showSubscriptionKey =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    let showSubscription = Keyboard.addListener(showSubscriptionKey, (e) => {
      setIsKeyboardOpened(true);
      setKeyboardHeight(
        Utilities.hasNotch()
          ? e.endCoordinates.height - 35
          : e.endCoordinates.height
      );
    });
    let hideSubscription = Keyboard.addListener(hideSubscriptionKey, () => {
      setIsKeyboardOpened(false);
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <KeyboardContext.Provider
      value={{
        isKeyboardOpened,
        keyboardHeight,
      }}
    >
      {props.children}
    </KeyboardContext.Provider>
  );
};

export default KeyboardProvider;
