import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";

import moment from "moment";
import { Divider } from "react-native-paper";
import { useTranslation } from "react-i18next";

import Fonts from "../../Constants/fonts";
import FontSize from "../../Constants/FontSize";
import Colors from "../../Constants/Colors";
import { GreenOilChange } from "../../assets";
import Utilities from "../../utils/UtilityMethods";
import { hp, wp } from "../../utils/responsiveSizes";
import { showToast, capitalize } from "../../utils/common";
import GetScheduleBranch from "../../api/GetScheduleBranch";

import Loader from "../../Components/Loader";
import BackHeader from "../../Components/Header/BackHeader";
import Footer from "../ProductsAndServices/components/Footer";
import GeneralAPIWithEndPoint from "../../api/GeneralAPIWithEndPoint";
import { CommonContext } from "../../contexts/ContextProvider";
import analytics from "@react-native-firebase/analytics";

const ServiceProviderDetails = ({ route }) => {
  const { selectedBranch } = useContext(CommonContext);

  const { t } = useTranslation();
  const navigation = useNavigation();

  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServicesForBranch();
    fetchScheduleForBranch();

    analytics().logScreenView({
      screen_name: "service_provider_screen",
    });
  }, []);

  const fetchScheduleForBranch = () => {
    GetScheduleBranch(selectedBranch?.id).then(({ success, response }) => {
      if (success) {
        setSchedule(response);
      } else {
        showToast("Error", response, "error");
      }
    });
  };

  const fetchServicesForBranch = () => {
    const body = {
      branch_id: selectedBranch?.id,
      category_type: "service",
    };
    GeneralAPIWithEndPoint("/branch/categories", body).then((response) => {
      setLoading(false);
      setServices(response);
    });
  };

  const getServicesRowItem = (item) => {
    return (
      <View style={styles.buttonContainer}>
        {item?.file && (
          <Image
            style={{ width: wp(32), height: wp(32), marginEnd: wp(10) }}
            source={{ uri: `data:image/gif;base64,${item?.file}` }}
          />
        )}
        {!item?.file && <GreenOilChange width={wp(32)} height={wp(32)} />}
        <Text numberOfLines={3} style={styles.serviceTitle}>
          {item?.name}
        </Text>
      </View>
    );
  };

  const getTimeScheduleRow = (item, index) => {
    let timeDuration = "Closed";
    if (item?.start_time && item?.end_time) {
      timeDuration = item?.start_time + " - " + item?.end_time;
    }
    let today = moment().format("dddd");

    return (
      <View
        key={item}
        style={[
          styles.hoursRow,
          index % 2 === 0 && styles.hoursRowColored,
          item?.day.toLowerCase() === today.toLowerCase() &&
            styles.todayHoursRowColored,
        ]}
      >
        <Text style={styles.day}>{capitalize(item?.day)}</Text>
        <Text
          style={[
            styles.time,
            item?.day.toLowerCase() === today.toLowerCase() &&
              styles.todayTimeColored,
          ]}
        >
          {timeDuration}
        </Text>
      </View>
    );
  };

  const onPressBottomButton = () => {
    navigation.navigate("ProductsListing");
  };

  return (
    <View style={styles.container}>
      <BackHeader title={selectedBranch?.name} />

      <View style={styles.paddedContent}>
        <Text style={[styles.bigTitle]}>{t("service.location")}</Text>

        <View style={styles.row}>
          <View>
            <Text style={[styles.smallTitle, styles.uniform]}>
              {t("serviceProviderDetails.address")}
            </Text>
            <Text style={[styles.description, styles.value]}>
              {selectedBranch?.address.length > 0
                ? selectedBranch?.address
                : "No Address"}
            </Text>
          </View>

          <View>
            <Text style={[styles.smallTitle, styles.uniform]}>
              {t("serviceProviderDetails.city")}
            </Text>
            <Text style={[styles.description, styles.value]}>
              {selectedBranch?.gorex_city[1]}
            </Text>
          </View>
        </View>

        <Divider />

        <Text style={[styles.bigTitle, { marginBottom: Utilities.hp(2) }]}>
          {t("service.services")}
        </Text>

        {services.length > 0 && (
          <FlatList
            data={services}
            numColumns={2}
            renderItem={({ item }) => getServicesRowItem(item)}
          />
        )}

        {!loading && services.length <= 0 && (
          <Text style={{ ...styles.description, alignSelf: "center" }}>
            No Services Available
          </Text>
        )}

        <Divider />
        <Text style={[styles.bigTitle, styles.openingHeader]}>
          {t("branch.Opening Hours")}
        </Text>
      </View>

      <View style={{ height: "48%" }}>
        {schedule?.length === 0 ? null : (
          <FlatList
            contentContainerStyle={{ paddingTop: hp(20) }}
            data={schedule}
            ListEmptyComponent={() => (
              <Text style={{ ...styles.description, alignSelf: "center" }}>
                No opening/closing hours are added
              </Text>
            )}
            renderItem={({ item, index }) => {
              return getTimeScheduleRow(item, index);
            }}
          />
        )}
      </View>

      {!loading && (
        <Footer
          title={t("serviceProviderDetails.browse")}
          onPress={onPressBottomButton}
        />
      )}

      <Loader visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  image: {
    width: "100%",
    height: wp(300),
    marginTop: wp(60),
    position: "absolute",
  },
  direction: {
    position: "absolute",
    top: hp(10),
    right: hp(20),
  },
  text: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendMedium,
    textAlign: "center",
    marginTop: hp(10),
  },
  directionImage: {
    width: hp(35),
    height: hp(35),
  },
  serviceTitle: {
    fontFamily: Fonts.LexendMedium,
    ...FontSize.rfs14,
    maxWidth: "80%",
  },

  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: hp(20),
  },
  content: {
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
    marginTop: wp(50),
    paddingTop: wp(20),
  },

  paddedContent: {
    paddingHorizontal: wp(20),
  },
  bigTitle: {
    fontFamily: Fonts.LexendSemiBold,
    alignItems: "flex-start",
    ...FontSize.rfs20,
    color: Colors.BLACK,
    paddingTop: hp(15),
  },
  smallTitle: {
    fontFamily: Fonts.LexendRegular,
    textAlign: "left",
    ...FontSize.rfs14,
    color: Colors.BLACK,
  },
  uniform: {
    width: Utilities.wp(40),
    paddingVertical: hp(10),
  },
  description: {
    fontFamily: Fonts.LexendRegular,
    marginLeft: -1,
    ...FontSize.rfs16,
    color: Colors.LIGHTGREY,
    marginBottom: Utilities.hp(2),
  },
  details: {
    marginTop: 7,
  },
  value: {
    paddingVertical: Utilities.hp(-1),
    marginHorizontal: Utilities.hp(2),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: wp(9),
  },
  openingHeader: {
    marginVertical: Utilities.wp(1.2),
  },
  hoursRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: hp(40),
    paddingHorizontal: Utilities.wp(5),
  },
  hoursRowColored: {
    backgroundColor: Colors.LIGHT_WHITE,
  },
  todayHoursRowColored: {
    backgroundColor: Colors.LIGHT_ORANGE,
  },
  day: {
    fontFamily: Fonts.LexendRegular,
    textAlign: "left",
    ...FontSize.rfs14,
    color: Colors.BLACK,
  },
  time: {
    fontFamily: Fonts.LexendRegular,
    ...FontSize.rfs14,
    color: Colors.LIGHTGREY,
    letterSpacing: 0,
  },
  todayTimeColored: {
    color: Colors.ORANGE,
  },
  closed: {
    fontFamily: Fonts.LexendRegular,
    textAlign: "center",
    ...FontSize.rfs14,
    color: Colors.RED,
    width: Utilities.hp(22),
  },
});

export default ServiceProviderDetails;
