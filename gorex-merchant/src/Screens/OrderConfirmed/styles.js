import { StyleSheet } from "react-native";
import Colors from "../../Constants/Colors";
import Utilities from "../../utils/UtilityMethods";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.WHITE
    },

    centerContainer:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    image:{
        resizeMode: "contain",
        width: Utilities.wp(25)
    },

    separator:{
        marginBottom: Utilities.wp(5)
    },

    titleText: {
        fontFamily: Fonts.LexendBold,
        ...FontSize.rfs24,
        color: Colors.BLACK
    },

    subTitleView: {
        width: "50%"
    },

    subTitleText:{
        ...FontSize.rfs14,
        textAlign: "center",
        fontFamily: Fonts.LexendRegular,
        color: Colors.GREY
    },
});

export default styles;
