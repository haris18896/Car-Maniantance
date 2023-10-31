import React, { useMemo, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";

import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import RBSheet from "react-native-raw-bottom-sheet";

import { Mark, ToyotaLogo } from "../../assets";
import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import Utilities from "../../utils/UtilityMethods";
import { hp, wp } from "../../utils/responsiveSizes";
import { RoundedSquareFullButton } from "../../Components";

const VehicleOptions = ({
  visible,
  options,
  search,
  selectOption,
  selectedValue,
  xmlName,
  onPress,
  children,
  onClose = new Function(),
  title = "",
}) => {
  const { t, i18n } = useTranslation();
  let refRBSheet = useRef();
  const isRTL = i18n.language === "ar";

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (visible) {
      refRBSheet.current.open();
    } else {
      refRBSheet.current.close();
    }
  }, [visible]);

  const data = useMemo(() => {
    let array = [];
    if (searchQuery === "") {
      array = [...options];
    } else {
      array = options.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return array;
  }, [searchQuery, options]);

  return (
    <RBSheet
      height={Utilities.hp(90)}
      ref={refRBSheet}
      closeOnDragDown={true}
      animationType={"fade"}
      onClose={onClose}
      customStyles={{
        wrapper: {},
        container: {
          paddingHorizontal: wp(20),
          borderTopLeftRadius: hp(20),
          borderTopRightRadius: hp(20),
        },
        draggableIcon: {
          backgroundColor: "#000",
        },
      }}
    >
      <TouchableOpacity
        style={{ position: "absolute", top: 20, right: 20, zIndex: 999 }}
        onPress={onClose}
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

      <Text style={styles.disabledText}>{title}</Text>

      {search && (
        <View style={styles.searchBarContainer(Platform.OS)}>
          <TextInput
            style={styles.searchInput(isRTL)}
            placeholder={t("service.search")}
            value={searchQuery}
            placeholderTextColor={Colors.GREY}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Utilities.wp(8) }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 20,
          }}
        />
        {data?.map((item, index) => {
          return (
            <TouchableOpacity
              style={[styles.option]}
              key={index}
              onPress={() => {
                selectOption(xmlName, item);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {item.image && (
                    <Image
                      style={styles.image}
                      source={{ uri: `data:image/gif;base64,${item?.image}` }}
                    />
                  )}
                  <Text style={styles.text}>{item?.label}</Text>
                </View>

                <Image
                  style={{
                    width: Utilities.wp(4.2),
                    resizeMode: "contain",
                    tintColor:
                      item.value === selectedValue
                        ? Colors.DARKERGREEN
                        : Colors.LIGHT_GREY,
                  }}
                  source={Mark}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {children}
      <RoundedSquareFullButton title={t("vehicle.select")} onPress={onPress} />
      <View style={{ height: hp(30) }} />
    </RBSheet>
  );
};

VehicleOptions.propTypes = {
  visible: PropTypes.bool,
  search: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
  searchBarContainer: (Platform) => {
    return {
      backgroundColor: Colors.LIGHT_GREY,
      marginVertical: 15,
      paddingVertical: Platform === "ios" ? 10 : 0,
      paddingHorizontal: 15,
      borderRadius: 50,
      textAlign: "left",
      height: 40,
    };
  },
  searchInput: (isRTL) => {
    return {
      ...FontSize.rfs14,
      color: Colors.BLACK,
      textAlign: isRTL ? "right" : "left",
      fontFamily: Fonts.LexendMedium,
    };
  },
  option: {
    height: Utilities.hp(7),
    borderBottomWidth: 0.3,
    borderColor: Colors.GREY_PLACEHOLDER,
    justifyContent: "center",
    marginBottom: hp(10),
  },
  disabledText: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs18,
    textAlign: "left",
  },
  text: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs14,
    textAlign: "left",
    marginLeft: wp(10),
  },
  header: {
    width: "30%",
    height: 5,
    borderRadius: 5,
    backgroundColor: Colors.GREY,
  },
  btn: {
    alignItems: "center",
    backgroundColor: Colors.DARKERGREEN,
    borderRadius: 5,
    height: hp(60),
    marginBottom: 10,
    justifyContent: "center",
    width: wp(330),
    alignSelf: "center",
  },
  title: {
    color: Colors.WHITE,
    fontFamily: Fonts.LexendBold,

    textAlign: "left",
    ...FontSize.rfs16,
  },
  image: {
    width: Utilities.wp(10),
    height: Utilities.hp(8),
    resizeMode: "contain",
  },
});

export default VehicleOptions;
