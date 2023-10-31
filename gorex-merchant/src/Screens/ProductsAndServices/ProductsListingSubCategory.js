import React, {useContext, useEffect, useState} from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import Utilities from "../../utils/UtilityMethods";
import {CommonContext} from "../../contexts/ContextProvider";
import { Cart, NoVehicle, GreenOilChange } from "../../assets";
import GeneralAPIWithEndPoint from "../../api/GeneralAPIWithEndPoint";
import { hp, wp } from "../../utils/responsiveSizes";

import TabBar from "./components/TabBar";
import Loader from "../../Components/Loader";
import SearchBar from "../../Components/Inputs/SearchBar";
import BackHeader from "../../Components/Header/BackHeader";
import FontFamily from "../../Constants/FontFamily";
import FontSize from "../../Constants/FontSize";

const ProductsListingSubCategory = ({ route }) => {
  const { t }             = useTranslation();
  const navigation        = useNavigation();
  const productCategory   = route?.params?.productCategory;
  const {selectedBranch}  = useContext(CommonContext);

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const body = {
      service_provider: selectedBranch?.id,
      categ_id:productCategory.id,
      product_type: "product",
    };

    GeneralAPIWithEndPoint("/branch/products", body).then((response) => {
      setLoading(false);
      setProducts(response);
      setFilteredProducts(response);
    });
  }, []);

  const searchFilterFunction = (text) => {
    if (text.length>0) {
      let localFilteredProducts = products.filter(item => item.name.toLowerCase().includes(text.toLowerCase()));
      setFilteredProducts(localFilteredProducts);
    } else {
      setFilteredProducts(products);
    }
    setSearch(text);
  };

  const onPressProductItem = (item) =>{
    navigation.navigate("ProductDetails", {product: item})
  }

  return (
    <View style={styles.container}>
      <BackHeader title={selectedBranch?.name} rightIcon={Cart} RightPress={() => {navigation.navigate("PaymentMethod");}}/>
      <TabBar active={1} />
      <View style={styles.paddedContent}>
        <SearchBar search={search} onChangeText={(text) => searchFilterFunction(text)}/>
        {!loading && (
          <FlatList
            data={filteredProducts}
            style={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.product} onPress={() => onPressProductItem(item)}>
                <View style={styles.serviceContent}>
                  <View>
                    <Text style={styles.title}>{item?.name}</Text>
                    <Text style={styles.price}>{t("productsAndServices.SAR")}{" "}{item?.price}</Text>
                  </View>
                  {item?.file ?
                    <Image style={styles.productImage} source={{ uri: `data:image/gif;base64,${item?.file}` }}/> :
                    <GreenOilChange width={wp(32)} height={wp(32)} /> }
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View style={styles.img}>
                <Image source={NoVehicle} resizeMode="contain" transitionDuration={1000} style={styles.item}/>
                <Text style={styles.text}>{t("productsAndServices.noProductsAdded")}</Text>
              </View>
            )}
          />
        )}
      </View>
      <Loader visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  serviceContent: {
    width: "100%",
    minHeight: wp(100),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paddedContent: {
    paddingHorizontal: wp(20),
    marginTop: Utilities.hp(2),
    flex: 1,
  },
  columnWrapperStyle: {
    justifyContent: "space-between",
  },
  product: {
    width: '100%',
    minHeight: wp(117),
    borderWidth: 1,
    borderColor: Colors.BORDER_GRAYLIGHTEST,
    marginBottom: 4,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(10),
  },
  list: {
    flex: 1,
    marginTop: hp(20),
  },
  title: {
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontFamily.rfs18,
    color: Colors.DARKBLUE,
    marginTop: 2,
    marginBottom: 30,
  },
  price: {
    fontFamily: Fonts.LexendBold,
    textAlign: "left",
    ...FontFamily.rfs18,
    color: Colors.GREEN,
  },
  img: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  item: {
    height: hp(160),
    resizeMode: "contain",
    width: wp(105),
    marginTop: hp(60),
  },
  text: {
    color: Colors.BLACK,
    fontFamily: Fonts.LexendMedium,
    textAlign: "center",
    ...FontSize.rfs24,
    marginTop: hp(5),
  },
  title2: {
    color: "#B8B9C1",
    width: "70%",
    fontFamily: Fonts.LexendMedium,
    textAlign: "center",
    ...FontSize.rfs16,
    marginTop: hp(10),
  },
  cartIcon: {
    width: wp(24),
    height: hp(26),
  },
  productImage: {
    height: hp(84),
    width: wp(124),
    resizeMode: "stretch",
  },
});

export default ProductsListingSubCategory;
