import React, { memo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

// ** Styles
import { WhiteCross } from "../../../assets";
import Fonts from "../../../Constants/fonts";
import Colors from "../../../Constants/Colors";
import FontSize from "../../../Constants/FontSize";
import { hp, wp } from "../../../utils/responsiveSizes";
import { RoundedSquareFullButton } from "../../../Components";

// ** Third Party Components
import RBSheet from "react-native-raw-bottom-sheet";

function Modal(props) {
  const {
    title,
    height,
    onClose,
    loading,
    addText,
    apiCall,
    confirm,
    pending,
    children,
    reference,
    pressAddNew,
    selectModal,
    confirmTitle,
    confirmDisabled,
    cancelText = false,
  } = props;

  useEffect(() => {
    if (selectModal) {
      reference?.current.open();
      apiCall().then();
    } else {
      reference?.current.close();
    }
  }, [selectModal]);

  return (
    <RBSheet
      height={height}
      ref={reference}
      closeOnDragDown={true}
      closeOnPressBack={true}
      animationType={"fade"}
      onClose={onClose}
      customStyles={{
        container: {
          paddingBottom: wp(20),
          paddingHorizontal: wp(20),
          borderTopLeftRadius: hp(20),
          borderTopRightRadius: hp(20),
        },
        draggableIcon: {
          marginTop: wp(30),
          width: wp(60),
        },
      }}
    >
      {cancelText ? (
        <TouchableOpacity style={styles.modalCancel} onPress={onClose}>
          <Text
            style={{
              color: Colors.BLACK,
              fontFamily: Fonts.LexendMedium,
              ...FontSize.rfs18,
            }}
          >
            {cancelText}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.modalCancel} onPress={onClose}>
          <WhiteCross width={wp(10)} height={wp(10)} />
        </TouchableOpacity>
      )}

      {/* Modal Title */}
      <View style={styles.modalHeading}>
        {title && <Text style={styles.modalTitle}>{title}</Text>}
        {addText && (
          <TouchableOpacity
            onPress={() => pressAddNew()}
            style={styles.modalAddButton}
          >
            <Text style={styles.addButton}>{addText}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={"large"} color={Colors.BLUE} />
        </View>
      ) : (
        children
      )}

      {/* Bottom Button */}
      {confirmTitle && (
        <View style={styles.bottomButton}>
          <RoundedSquareFullButton
            loading={pending}
            title={confirmTitle}
            onPress={() => confirm()}
            disabled={confirmDisabled}
          />
        </View>
      )}
    </RBSheet>
  );
}

export default memo(Modal);

const styles = StyleSheet.create({
  modalCancel: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 999,
    backgroundColor: Colors.BLACK,
    padding: wp(7),
    borderRadius: wp(50),
  },
  modalHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: wp(20),
    paddingBottom: wp(10),
  },
  modalTitle: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs20,
    color: Colors.BLACK,
    textAlign: "left",
  },
  modalAddButton: {
    backgroundColor: "transparent",
  },
  addButton: {
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs16,
    color: Colors.DARKERGREEN,
    textAlign: "left",
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
