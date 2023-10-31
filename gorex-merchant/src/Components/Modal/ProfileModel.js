import React, { useState } from "react";
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    Pressable,
    View,
    Image,
    TouchableOpacity,
} from "react-native";
import {
    Close,
    IncompleteProfile,
} from "../../assets";
import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";

import Utilities from "../../utils/UtilityMethods";
import {useTranslation} from "react-i18next";
import i18n from "i18next";

const isRTL = i18n.language === "ar";

const ProfileModel = (props) => {
    const { t, i18n } = useTranslation();
    const { isShow, onPressCancel, onPressButton, disabled, isLoading, title } = props;
    return (
        <Modal animationType="none" transparent={true} visible={isShow} onRequestClose={onPressCancel}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.crossButton} onPress={onPressCancel}>
                        <Image source={Close} style={styles.crossButtonImage}/>
                    </TouchableOpacity>
                    <Image style={styles.incompleteImage} source={IncompleteProfile} resizeMode="contain"/>
                    <Text style={styles.titleText}>{t("incompleteProfile.title")}</Text>
                    <Text style={styles.detailText}>{t("incompleteProfile.detail1")} {"\n"} {t("incompleteProfile.detail2")}</Text>
                    <TouchableOpacity style={styles.completeInfo} onPress={onPressButton}>
                        <Text style={styles.completeInfoButtonTitle}>{t("incompleteProfile.buttonTitle")}</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        width: "100%",
        height: "100%",
        alignSelf: "center",
    },

    modalView: {
        margin: 20,
        width: "90%",
        height: "40%",
        alignItems: "center",
        paddingVertical: Utilities.hp(3),
        borderRadius: 20,


        backgroundColor: Colors.WHITE,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },

    crossButton: {
        alignItems: "flex-end",
        paddingRight:Utilities.wp(3),
        width:'100%',
    },

    crossButtonImage:{
        height: Utilities.hp(3),
        width:Utilities.hp(4),
        resizeMode:'contain',
    },

    incompleteImage:{
        height: Utilities.hp(10),
    },

    titleText :{
        textAlign: "center",
        color: Colors.BLACK,
        paddingVertical: Utilities.hp(2),
        ...FontSize.rfs20,
        // fontFamily:isRTL?Fonts.ArabicNormal:Fonts.LexendSemiBold,
        fontFamily:Fonts.LexendSemiBold,
    },

    detailText :{
        textAlign: "center",
        color: Colors.LIGHTGREY,
        ...FontSize.rfs16,
        fontFamily:Fonts.LexendMedium,
        // fontFamily:isRTL?Fonts.ArabicBold:Fonts.LexendMedium,
        marginTop: -10,
    },

    completeInfo:{
        backgroundColor: Colors.DARKERGREEN,
        width: "100%",
        height: 60,
        marginTop: 10,
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        bottom: 0,
        position: "absolute",
    },

    completeInfoButtonTitle: {
        fontFamily:Fonts.LexendMedium,
        // fontFamily:isRTL?Fonts.ArabicBold:Fonts.LexendMedium,
        color: Colors.WHITE,
        ...FontSize.rfs18,
        fontWeight:'500'
    },
});

export default ProfileModel;
