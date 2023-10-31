import React from "react";
import {View, StyleSheet} from "react-native";

import Colors from "../../Constants/Colors";
import { hp, wp } from "../../utils/responsiveSizes";

const CardWithShadow = ({children, cardStyle}) => {
    return <View style={[styles.card, cardStyle]}>{children}</View>
};

const styles = StyleSheet.create({
    card: {
        width: wp(150),
        borderRadius:hp(10),
        paddingHorizontal:'3%',
        backgroundColor: Colors.WHITE,

        shadowColor: Colors.GREY,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity:  0.2,
        shadowRadius: 6,
        elevation: 6
    },
});

export default CardWithShadow;
