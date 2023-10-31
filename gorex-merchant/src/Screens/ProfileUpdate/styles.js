import {StyleSheet} from "react-native";
import Colors from "../../Constants/Colors";
import {hp, wp} from "../../utils/responsiveSizes";
import FontSize from "../../Constants/FontSize";
import FontFamily from "../../Constants/FontFamily";

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    content: {
        flex: 1,
        paddingHorizontal: wp(20),
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
