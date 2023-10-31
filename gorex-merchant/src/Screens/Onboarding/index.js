import LinearGradientComp from "../../Components/Background/LinearGradientComp";
import {View, Image, Text, TouchableOpacity,} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp,} from "react-native-responsive-screen";
import Utilities from "../../utils/UtilityMethods";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import FontSize from "../../Constants/FontSize";
import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import Swiper from "react-native-swiper";
import styles from "./styles";

import {OnBoarding1, OnBoarding2, OnBoarding3, OnBoarding4, OnBoarding5,  WhiteArrowLeft, WhiteArrowRight,} from "../../assets";
import {setAlreadyLaunched} from "../../utils/common";

// create a component
const OnBoarding = () => {
    const navigation = useNavigation();

    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar";

    const [currentIndex, setCurrentIndex] = useState(0);
    const swiperRef = useRef(null);


    const getOnBoardingScreen = (image, imageOnTop, title, subTitle) => {
        return (
            <View style={styles.swiperContainer}>
                <View style={styles.paddedContent}>
                    <View style={styles.paymentContainer}>
                        {imageOnTop && <Image style={styles.image} source={image}/>}
                        <Text style={styles.titleText}>{title}</Text>
                        <Text style={styles.subtitleText}>{subTitle}</Text>
                        {!imageOnTop && <Image style={styles.image} source={image}/>}
                    </View>
                </View>
            </View>
        )
    }

    const onPressNextButton = () => {
        if (currentIndex !== 4){
            if (!!swiperRef) {
                swiperRef.current.scrollBy(1);
            }
        }else {
            onPressSkipButton();
        }
    };


    const onPressSkipButton = () =>{
        setAlreadyLaunched(1).then();
        navigation.navigate("Login", { customer: true });
    }


    return (
        <LinearGradientComp>

            <TouchableOpacity style={styles.skipButton} onPress={onPressSkipButton} disabled={currentIndex===4}>
                <Text style={styles.skipButtonText}>{currentIndex !== 4 ? t("Next.skip") : " "}</Text>
            </TouchableOpacity>

            <Swiper loop={false} ref={swiperRef} dotColor={Colors.WHITE} activeDotStyle={{ width: "8%" }} activeDotColor={Colors.DARKERGREEN} onIndexChanged={(index) => {setCurrentIndex(index);}}>
                {getOnBoardingScreen(OnBoarding1, true, t("onBoardingText1.solution"), t("onBoardingText1.Automobile"))}
                {getOnBoardingScreen(OnBoarding2, false, t("onBoardingText2.business"), t("onBoardingText2.productive"))}
                {getOnBoardingScreen(OnBoarding3, true, t("onBoardingText3.connecting"), t("onBoardingText3.catering"))}
                {getOnBoardingScreen(OnBoarding4, false, t("onBoardingText4.management"), t("onBoardingText4.accessible"))}
                {getOnBoardingScreen(OnBoarding5, true, t("onBoardingText5.bringing"), t("onBoardingText5.roof"))}
            </Swiper>

            <View style={styles.nextButtonView}>
                <TouchableOpacity style={styles.nextButton} onPress={onPressNextButton}>
                    <Text style={styles.nextButtonText}>{currentIndex !== 4 ? t("Next.next") : t("Next.finish")}</Text>
                    <View style={styles.nextButtonArrow}>{isRTL ?
                        (<WhiteArrowLeft height={wp(3)} width={wp(3)} />) :
                        (<WhiteArrowRight height={wp(3)} width={wp(3)} />)}
                    </View>
                </TouchableOpacity>
            </View>

        </LinearGradientComp>
    );
};

//make this component available to the app
export default OnBoarding;
