import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useTranslation } from "react-i18next";
import RBSheet from "react-native-raw-bottom-sheet";

import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import { hp, wp } from "../../utils/responsiveSizes";
import FontSize from "../../Constants/FontSize";
import Utilities from "../../utils/UtilityMethods";
import { RoundedSquareFullButton } from "..";

const CustomBottomSheet = ({
  children,
  open,
  deleteVehicle = false,
  onClose = new Function(),
  onSelect = new Function(),
  canCancel = true,
  buttonStyle = {},
  buttonText = "Select",
  removeButton = false,
  height = 51,
  title,
  onPress,
  roundedSquareFullButton,
}) => {
  let refRBSheet = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      refRBSheet.current.open();
    } else {
      refRBSheet.current.close();
    }
  }, [open]);

  return (
    <RBSheet
      height={Utilities.wp(Utilities.hasNotch() ? height + 4 : height)}
      ref={refRBSheet}
      closeOnDragDown={true}
      animationType={"fade"}
      onClose={onClose}
      customStyles={{
        wrapper: {},
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        draggableIcon: {
          backgroundColor: "#000",
        },
      }}
    >
      {canCancel && (
        <TouchableOpacity
          style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}
          onPress={() => {
            onClose();
          }}
        >
          <Text
            style={{
              color: Colors.BLACK,
              fontFamily: Fonts.LexendMedium,
              ...FontSize.rfs18,
            }}
          >
            {t("vehicle.cancel")}
          </Text>
        </TouchableOpacity>
      )}

      {children}
      {deleteVehicle && (
        <View style={{ height: hp(100) }}>
          <TouchableOpacity
            style={[styles.btn, buttonStyle]}
            onPress={onSelect}
          >
            <Text style={styles.titless}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      )}
      {!deleteVehicle && !removeButton && !roundedSquareFullButton && (
        <TouchableOpacity style={[styles.btn, buttonStyle]} onPress={onSelect}>
          <Text style={styles.titless}>{t("vehicle.done")}</Text>
        </TouchableOpacity>
      )}
      {roundedSquareFullButton && (
        <>
          <View style={{ marginStart: wp(20) }}>
            <RoundedSquareFullButton title={title} onPress={onPress} />
          </View>
          <View style={{ height: hp(20) }} />
        </>
      )}
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: hp(18),
  },

  btn: {
    alignItems: "center",
    backgroundColor: Colors.DARKERGREEN,
    borderRadius: 5,
    height: Utilities.wp(13),

    marginBottom: 10,
    justifyContent: "center",
    width: wp(330),
    alignSelf: "center",
  },
  titless: {
    color: Colors.WHITE,
    fontFamily: Fonts.LexendBold,
    fontWeight: "bold",
    textAlign: "left",
    ...FontSize.rfs18,
  },
});

export default CustomBottomSheet;
