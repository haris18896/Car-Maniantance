import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import FontFamily from "../../Constants/FontFamily";
import { hp, wp } from "../../utils/responsiveSizes";
import { Address, CouponDel, Edit, CheckBoxChecked } from "../../assets";

const AddressCard = ({ index, address, selectedAddress, onPress, onPressDelete, onPressUpdate }) => {
    return (
        <TouchableOpacity style={[styles.addressContainer, selectedAddress?.id === address.id &&{borderColor: Colors.DARKERGREEN}]} onPress={() => onPress(address, index)}>

            {selectedAddress?.id === address.id && (<Image style={styles.checkBox} source={CheckBoxChecked} />)}

            {/* Address Name */}
            <View style={styles.homeContainer}>
                <Image style={styles.homeImage} source={Address} />
                <View style={{ width: wp(10) }} />
                <Text style={styles.home}>{address.name}</Text>
            </View>

            {/* Address */}
            <View style={{alignItems: 'flex-start'}}>
                <Text style={styles.address}>{address.address}</Text>
            </View>

            <View style={styles.addressCardActionContainer}>
                {/* Edit */}
                <TouchableOpacity onPress={() => onPressUpdate(address)}>
                    <Image style={styles.addressCardAction} source={Edit} />
                </TouchableOpacity>
                <View style={{width: wp(10)}} />

                {/* Delete */}
                <TouchableOpacity onPress={() => onPressDelete(address)}>
                    <Image style={styles.addressCardAction} source={CouponDel} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    addressContainer: {
        width: wp(350),
        height: hp(150),

        padding: wp(10),
        marginLeft: wp(20),

        justifyContent:'space-between',

        borderWidth: 3,
        borderRadius: 10,
        borderColor: Colors.LIGHTGREY,
    },
    checkBox: {
        position: 'absolute',
        top: hp(10),
        end: hp(10),

        width: hp(20),
        height: hp(20),
        resizeMode: "contain"
    },
    homeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    homeImage: {
        width: wp(18),
        height: hp(20),
        resizeMode: 'contain',
    },
    home: {
        ...FontSize.rfs18,
        ...FontFamily.medium,
        color: Colors.BLACK,
    address: {
        ...FontSize.rfs14,
        ...FontFamily.medium,
        color: Colors.DARK_BLACK,
    },
    addressCardAction: {
        width: wp(32),
        height: wp(32),
        resizeMode: 'contain',
    },
    addressCardActionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    },
    address: {
        ...FontSize.rfs14,
        ...FontFamily.medium,
        color: Colors.DARK_BLACK,
    },
    addressCardAction: {
        width: wp(25),
        height: wp(25),
        resizeMode: 'contain',
    },
    addressCardActionContainer: {
        flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'flex-end',
    },
});

export default AddressCard;
