import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import { wp } from "../../utils/responsiveSizes";
import { Cross, WhiteClose } from "../../assets";
import Colors from "../../Constants/Colors";
import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";

// ** Custom Components

// ** Third Party Packages

function TrackingHeader(props) {
  const { bg, onClose, title } = props;

  return (
    <View style={styles.trackingHeaderWrapper(bg)}>
      <Text style={styles.trackingTitle}>{title}</Text>
      <Pressable
        onPress={onClose}
        style={{
          alignSelf: "flex-end",
        }}
      >
        <Image
          source={Cross}
          resizeMode={"contain"}
          style={{
            height: 20,
            width: 20,
          }}
        />
      </Pressable>
    </View>
  );
}

export default TrackingHeader;

const styles = StyleSheet.create({
  trackingHeaderWrapper: (bg) => {
    return {
      paddingTop: wp(70),
      paddingBottom: wp(30),
      paddingHorizontal: wp(25),
      backgroundColor: bg,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    };
  },
  closeButton: {
    zIndex: 11,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  trackingTitle: {
    color: Colors.WHITE,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs20,
    textAlign: "left",
  },
});
