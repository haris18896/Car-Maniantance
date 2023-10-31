import React, {  useState } from "react";
import { useTranslation } from "react-i18next";

import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
} from "react-native";
import BackHeader from "../Components/Header/BackHeader";
import Colors from "../Constants/Colors";
import Fonts from "../Constants/fonts";
import { hp, wp } from "../utils/responsiveSizes";
import moment from "moment";
import { Ring } from "../assets";
import Utilities from "../utils/UtilityMethods";
import FontSize from "../Constants/FontSize";

const NotificationScreen = ({ route }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState();

  return (
    <View style={styles.container}>
      <BackHeader title={t("setting.notifications")} />
      <FlatList
        data={notifications}
        contentContainerStyle={{ paddingBottom: 250 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View
            style={
              index == 0 || index === 1
                ? styles.heighlighted
                : styles.transactionCard
            }
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={Ring}
                  style={{
                    resizeMode: "contain",
                    width: Utilities.wp(10),
                  }}
                />
                <View style={{ width: Utilities.wp(60) }}>
                  <Text style={styles.name}>{item?.name}</Text>
                  <Text style={styles.description}>{item?.description}</Text>
                </View>
              </View>
              <Text style={styles.time}>
                {moment(new Date(item?.created_at)).format("hh:mm A")}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: wp(14),
    flex: 1,
  },
  transactionCard: {
    width: "100%",
    borderRadius: wp(10),
    marginTop: 10,
    flexDirection: "row",
    padding: hp(5),
    margin: 4,
  },
  heighlighted: {
    width: "100%",
    backgroundColor: Colors.LIGHT_GREY,
    borderRadius: wp(10),
    marginTop: 10,
    flexDirection: "row",
    padding: hp(5),
    margin: 4,
  },
  name: {
    fontFamily: Fonts.PoppinsBold,
    ...FontSize.rfs16,
    color: Colors.BLACK,
    margin: Utilities.wp(2),
  },
  description: {
    fontFamily: Fonts.LexendRegular,
    ...FontSize.rfs12,
    color: Colors.GREY,
    paddingLeft: Utilities.wp(3),
  },
  time: {
    fontFamily: Fonts.PoppinsMedium,
    ...FontSize.rfs12,
    color: Colors.MAGENTA,
    marginTop: 10,
    marginRight: Utilities.wp(2),
  },
});

export default NotificationScreen;
