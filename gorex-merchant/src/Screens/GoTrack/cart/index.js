import React, { useContext, useLayoutEffect, Fragment, useState } from "react";

// ** Third Party Packages
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// ** Custom Components
import {
  Empty,
  ArrowUp,
  ArrowDownGrey,
  CheckBoxChecked,
  CheckBoxUnchecked,
} from "../../../assets";
import Fonts from "../../../Constants/fonts";
import Colors from "../../../Constants/Colors";
import Loader from "../../../Components/Loader";
import FontSize from "../../../Constants/FontSize";
import { showToast } from "../../../utils/common";
import FontFamily from "../../../Constants/FontFamily";
import { hp, wp } from "../../../utils/responsiveSizes";
import BackHeader from "../../../Components/Header/BackHeader";
import Footer from "../../ProductsAndServices/components/Footer";
import MessageWithImage from "../../../Components/MessageWithImage";
import { getSuperModifiedValues, isObjEmpty } from "../../../utils/utils";

// ** Store and Actions
import GetClubedProducts from "../../../api/GetClubedProducts";
import { CommonContext } from "../../../contexts/ContextProvider";

function ProductsList() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { onDemandProduct, setOnDemandProduct } = useContext(CommonContext);

  console.log("products page ...", onDemandProduct?.productProvider);

  // ** States
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getClubedProducts = async () => {
    setExpanded(false);
    setLoading(true);
    await GetClubedProducts().then(({ success, response }) => {
      console.log("response of products api : ", response);
      setLoading(false);
      if (success) {
        setProducts(response);
        if (!isObjEmpty(onDemandProduct?.service)) {
          setSelectedProduct(onDemandProduct?.service);
          setExpanded(onDemandProduct?.expanded_tab);
        }
      } else {
        showToast("Error", response, "error");
      }
    });
  };

  const handleSwitch = () => {
    getClubedProducts().then();
  };

  useLayoutEffect(() => {
    return navigation.addListener("focus", () => handleSwitch());
  }, [navigation]);

  const onPressNext = () => {
    const modifiedOrder = getSuperModifiedValues(
      { product: selectedProduct },
      onDemandProduct
    );

    if (!isObjEmpty(modifiedOrder) && onDemandProduct?.product) {
      setOnDemandProduct({
        productProvider: {},
        expanded_tab: expanded,
        product: selectedProduct,
        address: onDemandProduct?.address ? onDemandProduct?.address : {},
      });

      navigation.push("ProductAddressAndProvider");
    } else {
      setOnDemandProduct({
        product: selectedProduct,
        expanded_tab: expanded,
        productProvider: onDemandProduct?.productProvider
          ? onDemandProduct?.productProvider
          : {},
        address: onDemandProduct?.address ? onDemandProduct?.address : {},
      });
      navigation.push("ProductAddressAndProvider");
    }
  };

  return (
    <View style={styles.Container}>
      <BackHeader title={t("common.products")} />

      <View style={styles.MainWrapper}>
        {loading ? (
          <Loader visible={true} />
        ) : (
          <Fragment>
            {/* Products */}
            <View style={styles.pleaseChooseServiceContainer}>
              <Text style={styles.pleaseChooseService}>
                {t("gorexOnDemand.pleaseChooseProducts")}
              </Text>
            </View>

            <ScrollView
              style={styles.vehicleServiceWrapper}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={() => getClubedProducts()}
                />
              }
              contentContainerStyle={
                Object.keys(products).length === 0 && {
                  flex: 1,
                  justifyContent: "center",
                }
              }
            >
              {Object.keys(products).length === 0 ? (
                <View style={styles.EmptyVehiclesList}>
                  <MessageWithImage
                    imageSource={Empty}
                    message={t("gorexOnDemand.emptyProducts")}
                    description={t("gorexOnDemand.emptyProductsDescription")}
                  />
                </View>
              ) : (
                <View style={styles.accordionWrapper}>
                  {Object.keys(products).map((item, index) => (
                    <Fragment key={index}>
                      <TouchableOpacity
                        style={styles.accordion(expanded === item)}
                        onPress={() =>
                          setExpanded((prevExpanded) =>
                            prevExpanded === item ? null : item
                          )
                        }
                      >
                        <View>
                          <Text style={styles.AccordionTitle}>{item}</Text>
                        </View>
                        {expanded === item ? (
                          <ArrowUp
                            width={10}
                            height={14}
                            style={styles.arrow}
                          />
                        ) : (
                          <ArrowDownGrey
                            width={10}
                            height={14}
                            style={styles.arrow}
                          />
                        )}
                      </TouchableOpacity>

                      {expanded === item && (
                        <View style={styles.accordionDescription(expanded)}>
                          <FlatList
                            data={products[item]}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                              <TouchableOpacity
                                style={styles.accordionItemDetails}
                                onPress={() =>
                                  setSelectedProduct((prevExpanded) =>
                                    prevExpanded === item ? null : item
                                  )
                                }
                              >
                                <View style={styles.checkBoxTitle}>
                                  <Image
                                    style={styles.checkBox}
                                    source={
                                      selectedProduct?.id === item?.id
                                        ? CheckBoxChecked
                                        : CheckBoxUnchecked
                                    }
                                  />

                                  <Text
                                    style={[
                                      styles.title,
                                      {
                                        width:
                                          item.price.toString().length > 0
                                            ? "65%"
                                            : "90%",
                                      },
                                    ]}
                                  >
                                    {item?.name}
                                  </Text>
                                </View>

                                <Text style={styles.subtitle}>
                                  {item?.price.toString()}{" "}
                                  {t("productsAndServices.SAR")}
                                </Text>
                              </TouchableOpacity>
                            )}
                          />
                        </View>
                      )}
                    </Fragment>
                  ))}
                </View>
              )}
            </ScrollView>
          </Fragment>
        )}
      </View>

      <Footer
        title={t("common.next")}
        disabled={!selectedProduct}
        onPress={onPressNext}
      />
    </View>
  );
}

export default ProductsList;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  MainWrapper: {
    flex: 1,
    marginVertical: hp(15),
  },
  chooseVehicleHeader: (vehicles) => {
    return {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      paddingHorizontal: wp(20),
    };
  },
  chooseVehicle: {
    ...FontSize.rfs18,
    ...FontFamily.bold,
    color: Colors.BLACK,
  },
  addNew: {
    ...FontSize.rfs16,
    ...FontFamily.bold,
    color: Colors.DARKERGREEN,
  },
  EmptyVehiclesList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  VehiclesWrapper: {
    flex: 2,
  },
  cardStyle: (showBorder) => {
    return {
      borderColor: Colors.DARKERGREEN,
      borderWidth: showBorder ? 2 : 0,
    };
  },
  vehicleServiceWrapper: {
    flex: 1,
  },

  pleaseChooseServiceContainer: {
    paddingStart: wp(20),
    alignItems: "flex-start",
    marginTop: hp(15),
  },
  pleaseChooseService: {
    ...FontSize.rfs18,
    ...FontFamily.bold,
    color: Colors.BLACK,
  },
  oneServiceOnly: {
    ...FontSize.rfs14,
    ...FontFamily.medium,
    color: Colors.LIGHTGREY,
  },

  accordionWrapper: {
    marginHorizontal: wp(15),
    marginTop: hp(10),
  },
  accordion: (expanded) => {
    return {
      borderWidth: 1,
      borderColor: Colors.LIGHTGREY,
      borderRadius: 10,
      marginTop: hp(10),
      padding: wp(20),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      maxWidth: "100%",
      borderBottomWidth: expanded ? 0 : 1,
      borderBottomLeftRadius: expanded ? 0 : 10,
      borderBottomRightRadius: expanded ? 0 : 10,
    };
  },
  AccordionTitle: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendBold,
    ...FontSize.rfs16,
    textAlign: "left",
  },
  accordionDescription: (expanded) => {
    return {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.LIGHTGREY,
      borderTopWidth: expanded ? 0 : 1,
      borderTopLeftRadius: expanded ? 0 : 10,
      borderTopRightRadius: expanded ? 0 : 10,
    };
  },
  accordionItemDetails: {
    marginVertical: wp(5),
    paddingVertical: wp(15),
    paddingHorizontal: wp(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkBoxTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    width: "80%",
    ...FontSize.rfs16,
    ...FontFamily.medium,
    color: Colors.BLACK,
    textAlign: "left",
  },
  checkBox: {
    width: wp(20),
    height: wp(20),
    resizeMode: "contain",
    marginRight: "5%",
  },
  subtitle: {
    ...FontSize.rfs18,
    ...FontFamily.medium,
    color: Colors.DARKERGREEN,
    textAlign: "right",
  },
});
