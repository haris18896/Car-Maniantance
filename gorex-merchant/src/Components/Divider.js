import React from "react";
import {View, StyleSheet} from "react-native";

import Colors from "../Constants/Colors";
import { hp} from "../utils/responsiveSizes";

const Divider = () => {
    return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
    divider: {
        height: hp(1),
        backgroundColor: Colors.LIGHT_GREY,
    },
});

export default Divider;
