import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";

import Fonts from "../../../Constants/fonts";
import Colors from "../../../Constants/Colors";
import { Linear } from "../../../Constants/Linear";
import FontSize from "../../../Constants/FontSize";
import Utilities from "../../../utils/UtilityMethods";
import FontFamily from "../../../Constants/FontFamily";
import { hp, rfs, wp } from "../../../utils/responsiveSizes";
import { Services, GreenGorexIcon } from "../../../assets";

const BottomBar = ({
  mapRef,
  serviceCategories,
  filterChanged,
  resetFilter,
  setResetFilter,
  navigateToGoD,
}) => {
  const { t, i18n } = useTranslation();
  const [active, setActive] = useState(1);

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    setActive(null);
  }, [resetFilter]);

  if (!serviceCategories?.length) {
    return null;
  }

  const onPressRowItem = (item) => {
    if (item?.id === "GoD") {
      navigateToGoD();
    } else if (active === item?.id) {
      setActive(-1);
      setResetFilter(!resetFilter);
      filterChanged();
    } else {
      setActive(item?.id);
      filterChanged(item?.id);
    }
  };

  const returnRowItem = (item, index) => {
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button(active === item?.id)}
          onPress={() => {
            onPressRowItem(item);
          }}
          activeOpacity={0.5}
        >
          <View
            style={{
              paddingLeft: wp(20),
              paddingRight: wp(20),
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Image
              style={styles.serviceCategoryIcon}
              source={item?.id === "GoD" ? GreenGorexIcon : Services}
            />

            {/*{index > 0 && (*/}
            {/*  <View*/}
            {/*    style={{*/}
            {/*      backgroundColor: Colors.ORANGE,*/}
            {/*      width: wp(60),*/}
            {/*      height: hp(26),*/}
            {/*      borderRadius: wp(6),*/}
            {/*      justifyContent: "center",*/}
            {/*      alignItems: "center",*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <Text*/}
            {/*      style={{*/}
            {/*        fontSize: rfs(14),*/}
            {/*        ...FontFamily.medium,*/}
            {/*        color: Colors.WHITE,*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      {t("common.coming_soon")}*/}
            {/*    </Text>*/}
            {/*  </View>*/}
            {/*)}*/}
          </View>
          <View style={styles.titleContainer(active === item?.id)}>
            <Text
              style={[
                styles.buttonText(active === item?.id),
                {
                  alignSelf: "flex-start",
                  textAlign: "left",
                },
              ]}
              numberOfLines={2}
            >
              {item?.name}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={
        !Utilities.isIosDevice()
          ? [
              "rgba(0,0,0,0.1)",
              "rgba(0,0,0,0.2)",
              "rgba(0,0,0,0.3)",
              "rgba(0,0,0,0.4)",
              "rgba(0,0,0,0.5)",
              "rgba(0,0,0,0.6)",
              "rgba(0,0,0,0.7)",
              "rgba(0,0,0,0.8)",
              "rgba(0,0,0,0.9)",
              "rgba(0,0,0,1)",
            ]
          : Linear
          ? Linear
          : []
      }
      style={styles.container}
    >
      <Text style={styles.heading}> {t("dashboard.near")}</Text>

      <FlatList
        horizontal
        scrollEnabled={true}
        data={serviceCategories}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => returnRowItem(item, index)}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingLeft: Utilities.wp(4),
    paddingBottom: Utilities.wp(7),
    alignItems: "flex-start",
  },

  buttonContainer: {
    marginRight: wp(16),
  },
  button: (active) => {
    return {
      width: wp(150),
      height: hp(129),
      paddingTop: hp(20),
      borderRadius: wp(10),
      justifyContent: "space-between",

      borderWidth: active ? hp(1) : 0,
      backgroundColor: active ? "transparent" : Colors.WHITE,
      borderColor: active ? Colors.DARKERGREEN : Colors.BORDER_GRAYLIGHTEST,
    };
  },
  titleContainer: (active) => {
    return {
      height: hp(63),
      paddingLeft: wp(20),
      paddingRight: wp(5),
      paddingTop: wp(5),
      backgroundColor: active ? Colors.DARKERGREEN : "transparent",
      borderBottomLeftRadius: wp(9),
      borderBottomRightRadius: wp(9),
    };
  },
  buttonText: (active) => {
    return {
      ...FontSize.rfs16,
      ...FontFamily.medium,
      color: active ? Colors.WHITE : Colors.BLACK,
      // textAlign: 'right'
      // alignSelf: "flex-end",
      // width: "100%",
      // alignContent: 'flex-end',
      // height: "100%",
    };
  },
  heading: {
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendSemiBold,
    textAlign: "left",
    color: Colors.WHITE,
    marginBottom: Utilities.wp(3.5),
  },
  serviceCategoryIcon: {
    width: wp(32),
    height: wp(32),
    resizeMode: "contain",
  },
});

export default BottomBar;
