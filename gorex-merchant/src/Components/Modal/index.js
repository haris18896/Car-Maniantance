import React, { useRef, useEffect } from "react";

// ** Custom Components
import Utilities from "../../utils/UtilityMethods";

// ** Third Party Packages
import RBSheet from "react-native-raw-bottom-sheet";
import { useTranslation } from "react-i18next";

function RBSheetModal(props) {
  const { children, open, onClose, height, backgroundColor } = props;
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
      height={Utilities.hp(height)}
      ref={refRBSheet}
      // closeOnDragDown={true}
      animationType={"fade"}
      onClose={onClose}
      customStyles={{
        wrapper: {
          backgroundColor: backgroundColor,
        },
        container: {
          // paddingHorizontal: Utilities.wp(5),
          borderTopLeftRadius: Utilities.hp(3),
          borderTopRightRadius: Utilities.hp(3),
        },
        // draggableIcon: {
        //   backgroundColor: "#0000001A",
        //   width: 63,
        //   height: 6,
        // },
      }}
    >
      {children}
    </RBSheet>
  );
}

export default RBSheetModal;
