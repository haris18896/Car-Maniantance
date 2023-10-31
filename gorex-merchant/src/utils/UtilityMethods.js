import { Dimensions, I18nManager, PixelRatio, Platform } from "react-native";
import RNRestart from "react-native-restart";
import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";

let screenWidth = Dimensions.get("window").width;
let screenHeight = Dimensions.get("window").height;

let androidAppUrl =
  "https://play.google.com/store/apps/details?id=com.softenmedia.hisnulmuslimplus&hl=en";
let iosAppUrl = "https://apps.apple.com/us/app/hisnul-muslim-plus/id1585750523";

/**
 * Helper Functions
 *
 * @class UtilityMethods
 */
class UtilityMethods {
  hp = (height) => {
    const elemHeight = typeof height === "number" ? height : parseFloat(height);
    return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
  };
  wp = (width) => {
    const elemWidth = typeof width === "number" ? width : parseFloat(width);
    return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
  };

  /**
   * Returns true if the given string only contain letters
   *
   * @param {*} str
   * @return {*}
   * @memberof UtilityMethods
   */
  hasOnlyLetters(str) {
    let result = /^[\p{L} ,.'-]+$/u.test(str);
    return result;
  }

  /**
   * Parse JSON string or throw error
   */
  parseJSON = (data) => {
    data = data || "";
    try {
      return JSON.parse(data);
    } catch (error) {
      throw new Error({
        type: "JSON.parse",
        message: error.stack,
        reason: error.message,
      });
    }
  };
  /**
   * Safely parse JSON strings (no errors)
   */
  toJSON = (data) => {
    data = data || "";
    try {
      return JSON.parse(data);
    } catch (error) {
      return {
        type: "JSON.parse",
        message: error.stack,
        reason: error.message,
      };
    }
  };

  /**
   * Check empty object
   */
  checkEmptyObject = (obj) => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  /**
   * Check if the variable is undefined
   */
  isUndefined = (data) => {
    if (data === "undefined") {
      return true;
    }
    return false;
  };

  /**
   * Helper function to convert bytes to size
   *
   * @param {*} bytes
   * @memberof UtilityMethods
   */
  bytesToSize = (bytes) => {
    if (bytes === 0) return "0 B";

    var k = 1024;
    var sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
  };

  /**
   * Helper Function for validating email addresses
   *
   * @param {*} email
   * @memberof UtilityMethods
   */
  isEmailValid = (email) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email);
  };

  /**
   * Helper Function for validating Phone Numbers
   *
   * @param {*} phoneNumber
   * @memberof UtilityMethods
   */
  isPhoneNumberValid = (phoneNumber) => {
    var format = /[ `!@#$%^&*()_\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(phoneNumber) || phoneNumber?.length > 15) {
      return false;
    } else if (phoneNumber?.length < 8) {
      return false;
    }
    return true;
  };

  /**
   * Helper Function for capitalize First Letter of Text
   *
   * @param {*} string
   * @memberof UtilityMethods
   */
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  /**
   * Helper function for validating url
   *
   * @param {*} str
   * @memberof UtilityMethods
   */
  isValidUrl = (str) => {
    let pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  };

  /**
   * Helper Function for generating a random string
   *
   * @param {*} length
   * @return {*}
   * @memberof UtilityMethods
   */
  getRandomString(length) {
    let randomChars = ``;
    ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
    let result = "";
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    return result;
  }

  /**
   * Helper Function for checking notch in ios device
   *
   * @memberof UtilityMethods
   */
  hasNotch = () => {
    let d = Dimensions.get("window");
    const { height, width } = d;
    return (
      // This has to be iOS duh
      Platform.OS === "ios" &&
      // Accounting for the height in either orientation
      (height >= 812 || width >= 812)
    );
  };

  /**
   * Helper Function for ios device is Iphone X
   *
   * @memberof UtilityMethods
   */
  isIphoneX = () => {
    const dimension = Dimensions.get("window");
    return (
      Platform.OS === "ios" &&
      !Platform.isPad &&
      !Platform.isTV &&
      (dimension.height === 780 ||
        dimension.width === 780 ||
        dimension.height === 812 ||
        dimension.width === 812 ||
        dimension.height === 844 ||
        dimension.width === 844 ||
        dimension.height === 896 ||
        dimension.width === 896 ||
        dimension.height === 926 ||
        dimension.width === 926)
    );
  };

  hex2rgba = (hex, alpha = 1) => {
    const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
  };

  getAppUrl = () => {
    return Platform.OS === "ios" ? iosAppUrl : androidAppUrl;
  };

  isIosDevice = () => {
    return Platform.OS === "ios";
  };

  changeLanguage = ({ i18n, lang }) => {
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang).then(() => {
        const isRTL = i18n.language === "ar";
        I18nManager.forceRTL(isRTL);
        setTimeout(() => {
          RNRestart.Restart();
        }, 1);
      });
    }
  };

  onPressNotification = (notification) => {
    console.log("onPressNotification", notification);
  };

  updateFCMToken = () => {};

  addNotificationListener = () => {
    this.updateFCMToken();

    messaging().setBackgroundMessageHandler(async (notification) => {
      this.onPressNotification(notification);
    });

    messaging().onNotificationOpenedApp((notification) => {
      this.onPressNotification(notification);
      this.onPressNotification(notification);
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        const notification = detail.notification;
        this.onPressNotification(notification);
      }
    });

    notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        const notification = detail.notification;
        this.onPressNotification(notification);
      }
    });

    messaging().onMessage((notification) => {
      this.displayNotification(notification);
    });
  };

  displayNotification = async (notification) => {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    // Display a notification
    await notifee.displayNotification({
      title: notification.notification.title,
      body: notification.notification.body,
      android: {
        sound: "default",
        channelId,
        smallIcon: "ic_launcher",
        pressAction: {
          id: "default",
        },
      },
      ios: {
        sound: "default",
        pressAction: {
          id: "default",
        },
      },
    });
  };
}

const Utilities = new UtilityMethods();

export default Utilities;
