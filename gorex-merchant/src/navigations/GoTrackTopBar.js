import React, { Fragment } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

// ** Translation
import { useTranslation } from "react-i18next";

// ** Assets
import { Call, MenuBlack } from "../assets";

// ** Styling
import Colors from "../Constants/Colors";
import { wp } from "../utils/responsiveSizes";

// ** Third Party Packages
import GoTrackHeader from "../Components/GoTrack/GoTrackHeader";
import Fonts from "../Constants/fonts";
import FontSize from "../Constants/FontSize";

function GoTrackTopBar({ state, descriptors, navigation, position }) {
  const { t } = useTranslation();

  return (
    <Fragment>
      <GoTrackHeader
        noDivider={true}
        leftIcon={MenuBlack}
        title={t("GoTrack.GoTrack")}
        rightTextColor={Colors.DARKERGREEN}
        leftPress={() => navigation.openDrawer()}
        rightTitle={t("GoTrack.landing.addDevice")}
        RightPress={() => navigation.navigate("AddDevice")}
      />
      <View style={styles.topBarContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.TopButton}
            >
              <View style={styles.buttonLabelView(isFocused)}>
                <Text style={styles.buttonLabel(isFocused)}>{label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Fragment>
  );
}

export default GoTrackTopBar;

const styles = StyleSheet.create({
  topBarContainer: {
    flexDirection: "row",
    // paddingVertical: wp(10),
    paddingHorizontal: wp(20),
    borderBottomWidth: wp(2),
    borderColor: "#17151F",
    backgroundColor: Colors.WHITE,
  },
  TopButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonLabelView: (isFocused) => {
    return {
      paddingVertical: wp(10),
      paddingHorizontal: wp(17),
      borderBottomWidth: wp(3),
      borderBottomColor: isFocused ? "#17151F" : "transparent",
    };
  },
  buttonLabel: (isFocused) => {
    return {
      color: isFocused ? "#17151F" : Colors.GREY_TEXT,
      ...FontSize.rfs16,
      fontFamily: Fonts.LexendMedium,
    };
  },
});
