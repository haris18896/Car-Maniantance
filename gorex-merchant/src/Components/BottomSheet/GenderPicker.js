import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useTranslation } from "react-i18next";
import BottomSheet from "react-native-raw-bottom-sheet";

import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import FontFamily from "../../Constants/FontFamily";
import { hp, wp } from "../../utils/responsiveSizes";
import { CheckBoxChecked, CheckBoxUnchecked } from "../../assets";

import { RoundedSquareFullButton } from "../../Components";

const GenderPicker = ({show, setShow, value, setValue}) => {
  let refBottomSheet = useRef();
  const { t } = useTranslation();
  const [gender, setGender] = useState(null);

  useEffect(() => {
    setGender(value);
    if (show) {
      refBottomSheet.current.open();
    } else {
      refBottomSheet.current.close();
    }
  }, [show])

  return (
    <BottomSheet
      height={hp(250)}
      onClose={() => setShow(false)}
      ref={refBottomSheet}
      animationType="fade"
      customStyles={{container: {paddingHorizontal: wp(20)}}}
      closeOnDragDown={true} >

      <TouchableOpacity style={{alignItems: 'flex-end'}} onPress={() => setShow(false)}>
          <Text style={styles.cancel}>{t("common.cancel")}</Text>
      </TouchableOpacity>
      <View style={{height: hp(20)}} />

      <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => setGender('male')}>
        <Image style={styles.checkBox} source={gender === null ? CheckBoxUnchecked : gender === 'male' ? CheckBoxChecked : CheckBoxUnchecked } />
        <View style={{width: wp(20)}} />
        <Text style={styles.label}>{t("common.male")}</Text>
      </TouchableOpacity>

      <View style={{height: hp(20)}} />

      <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => setGender('female')}>
        <Image style={styles.checkBox} source={gender === null ? CheckBoxUnchecked : gender === 'female' ? CheckBoxChecked : CheckBoxUnchecked } />
        <View style={{width: wp(20)}} />
        <Text style={styles.label}>{t("common.female")}</Text>
      </TouchableOpacity>

      <View style={{height: hp(20)}} />
      <RoundedSquareFullButton
        title={t("common.select")}
        onPress={() => {
          setValue(gender);
          setShow(false);
        }} />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  cancel: {
    ...FontSize.rfs18,
    ...FontFamily.medium,
    color: Colors.BLACK,
  },
  checkBox: {
    width: wp(20),
    height: wp(20),
    resizeMode: 'contain',
  },
  label: {
    ...FontSize.rfs18,
    ...FontFamily.medium,
    color: Colors.BLACK,
  },
});

export default GenderPicker;
