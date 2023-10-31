import React, { useContext, useEffect, useLayoutEffect } from "react";

// ** Native components
import {
  SafeAreaView,
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

// ** Styling
import Colors from "../../../Constants/Colors";

// ** Custom Components
import { hp, wp } from "../../../utils/responsiveSizes";
import {
  onDemandSticker,
  MenuBlack,
  ClockCounterBlack,
  RightArrow,
} from "../../../assets";
import BackHeader from "../../../Components/Header/BackHeader";

// ** Third Party components
import { useTranslation } from "react-i18next";
import Fonts from "../../../Constants/fonts";
import FontSize from "../../../Constants/FontSize";
import Utilities from "../../../utils/UtilityMethods";
import { RoundedSquareFullButton } from "../../../Components";
import { CommonContext } from "../../../contexts/ContextProvider";
import { useNavigation } from "@react-navigation/native";

function WelcomeOnDemand() {
  const { t } = useTranslation();
  const { setOnDemandOrder } = useContext(CommonContext);
  const navigation = useNavigation();

  // useEffect(() => {
  //   try {
  //     const onDemandOrder = async () => {
  //       await setOnDemandOrder({});
  //     };
  //     return onDemandOrder();
  //   } catch (error) {
  //     console.log("error useEffect ", error);
  //   }
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader
        leftIcon={MenuBlack}
        leftPress={() => navigation.openDrawer()}
        noDivider={true}
        noTitle={true}
      />

      <View style={styles.wrapper}>
        <View style={styles.imageContainer}>
          <Image
            source={onDemandSticker}
            alt={"welcome_on_demand"}
            style={styles.welcomeOnDemandImage}
            resizeMode={"contain"}
          />
        </View>

        <View style={styles.TextContainer}>
          <Text style={styles.welcome}>welcome to</Text>
          <Text style={styles.GonD}>Gorex on Demand</Text>
        </View>

        <TouchableOpacity
          style={styles.RequestContainer}
          onPress={() =>
            navigation.navigate("MyGorexOnDemandRequests", { map: false })
          }
        >
          <View style={styles.RequestWrapper}>
            <View style={styles.RequestWrapperView}>
              <ClockCounterBlack
                color={"black"}
                width={wp(22)}
                height={hp(22)}
              />
              <Text style={styles.MyRequest}>My Requests</Text>
            </View>
            <View>
              <RightArrow color={"black"} width={wp(22)} height={hp(22)} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.requestService}>
        <RoundedSquareFullButton
          title={t("gorexOnDemand.requestService")}
          onPress={() => navigation.navigate("VehiclesServices")}
        />
      </View>
    </SafeAreaView>
  );
}

export default WelcomeOnDemand;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  wrapper: {
    flex: 1,
    justifyContent: "flex-start",
  },
  paddedContent: {
    alignItems: "center",
    flex: 1,
  },
  imageContainer: {
    alignSelf: "center",
  },
  welcomeOnDemandImage: {
    height: hp(320),
    width: wp(340),
  },
  TextContainer: {
    marginHorizontal: wp(30),
  },
  welcome: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs18,
    marginTop: Utilities.hp(0.5),
  },
  GonD: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontSize.rfs24,
    marginTop: Utilities.hp(0.2),
    marginBottom: hp(40),
  },

  RequestContainer: {
    backgroundColor: Colors.LIGHT_GREY,
    paddingVertical: hp(5),
  },
  RequestWrapper: {
    backgroundColor: Colors.WHITE,
    paddingVertical: hp(25),
    paddingHorizontal: wp(20),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  RequestWrapperView: {
    flexDirection: "row",
    alignItems: "center",
  },
  MyRequest: {
    color: Colors.BLACK,
    marginLeft: wp(10),
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs16,
  },
  requestService: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(40),
  },
});
