import {StyleSheet} from "react-native";
import Colors from "../../Constants/Colors";
import {hp, wp} from "../../utils/responsiveSizes";
import FontSize from "../../Constants/FontSize";
import FontFamily from "../../Constants/FontFamily";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },

    headerTitleText:{
        ...FontFamily.bold
    },

    content: {
        flex: 1,
        marginHorizontal: wp(20),
    },
    signUpButton: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: "auto",
        marginBottom: hp(20),
    },
    signUpText: {
        ...FontSize.rfs14,
        ...FontFamily.medium,
        color: Colors.BLACK,
        textAlign: "center",
        marginTop: hp(20),
    },
    singUpLink: {
        ...FontSize.rfs14,
        ...FontFamily.bold,
        color: Colors.DARKERGREEN,
        textAlign: "center",
        marginTop: hp(2),
        textDecorationLine: "underline",
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    smallInput: {
        width: wp(186),
    },


    spacer:{
        height: hp(20)
    },
});

export default styles;
