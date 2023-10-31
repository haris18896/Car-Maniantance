import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";

import { useTranslation } from "react-i18next";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";

import { WalletMobile } from "../../assets";
import Colors from "../../Constants/Colors";
import { showToast } from "../../utils/common";
import { hp, wp } from "../../utils/responsiveSizes";

import Loader from "../../Components/Loader";
import BackHeader from "../../Components/Header/BackHeader";
import Footer from "../ProductsAndServices/components/Footer";
import InputWithLabel from "../../Components/Inputs/InputWithLabel";
import analytics from "@react-native-firebase/analytics";

const TopUp = ({ route }) => {
  const comingFromOnDemand = route?.params?.comingFromOnDemand;
  const comingFromNormal = route?.params?.comingFromNormal;

  const { t } = useTranslation();
  const navigation = useNavigation();

  const [url, setUrl] = useState();
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    analytics().logScreenView({
      screen_name: "top_up_screen",
    });
  }, []);

  const onPressTopUpButton = () => {
    if (parseInt(amount) === 0) {
      showToast("Error!", "Amount must be greater then 1", "error");
    } else {
      navigation.navigate("TopUpCard", {
        amount,
        comingFromOnDemand,
        comingFromNormal,
      });
    }
  };

  const getInitialTopUpComponent = () => {
    return (
      <View style={styles.initialComponent}>
        <View style={{ height: hp(84) }} />
        <View style={{ alignItems: "center" }}>
          <Image source={WalletMobile} style={styles.topUpImage} />
        </View>
        <View style={{ height: hp(133) }} />

        <InputWithLabel
          label={t("walletTopUp.enterAmount")}
          value={amount}
          setValue={setAmount}
          maxLength={16}
          keyboardType="numeric"
          returnKeyType="done"
          placeholder={t("walletTopUp.enterAmountPlaceholder")}
        />
      </View>
    );
  };

  const getWebviewForUrwayPaymentView = () => {
    return (
      <WebView
        style={{ marginTop: hp(20) }}
        source={{ uri: url }}
        useWebKit
        scalesPageToFit
        javaScriptEnabled
        startInLoadingState
        originWhitelist={["*"]}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        onShouldStartLoadWithRequest={() => true}
        onError={({ nativeEvent }) =>
          console.log(`WebView Error: ${nativeEvent}`)
        }
      />
    );
  };

  return (
    <View style={styles.screen}>
      <BackHeader title={t("common.Top")} />
      {!url ? getInitialTopUpComponent() : getWebviewForUrwayPaymentView()}
      <Footer
        title={t("payment.Top-up")}
        disabled={!amount || amount < 1}
        onPress={onPressTopUpButton}
      />
      <Loader visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  initialComponent: {
    flex: 1,
    paddingHorizontal: wp(20),
  },
  topUpImage: {
    width: wp(84),
    height: hp(155),
    resizeMode: "contain",
  },
});

export default TopUp;
