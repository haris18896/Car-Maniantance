import React, {useContext, useEffect, useState} from "react";
import {View, StyleSheet, FlatList, Image, Text, TouchableOpacity,} from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import Fonts from "../../Constants/fonts";
import TabBar from "./components/TabBar";
import FontSize from "../../Constants/FontSize";
import Colors from "../../Constants/Colors";
import Loader from "../../Components/Loader";
import BackHeader from "../../Components/Header/BackHeader";
import { Cart, NoVehicle, GreenOilChange } from "../../assets";
import GeneralAPIWithEndPoint from "../../api/GeneralAPIWithEndPoint";
import { hp, wp } from "../../utils/responsiveSizes";
import {CommonContext} from "../../contexts/ContextProvider";


const ProductsListing = ({ route }) => {
  const { t }             = useTranslation();
  const navigation        = useNavigation();
  const {selectedBranch, inCartOrder}  = useContext(CommonContext);

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const body = {
      branch_id: selectedBranch?.id,
      category_type: "product",
    };
    GeneralAPIWithEndPoint("/branch/categories", body).then((response) => {
      setLoading(false);
      const categories = [];
      response.forEach((category) => {
        if (category?.id) {
          categories.push(category);
        }
      });
      setCategories(categories);
    });
  }, []);


  const getEmptyListComponent = () =>{
    return (
        <View style={styles.img}>
          <Image style={styles.item} resizeMode="contain" source={NoVehicle} transitionDuration={1000}/>
          <Text style={styles.text}>{t("productsAndServices.noProductsAdded")}</Text>
        </View>
    )
  }

  const getProductCategoryItem = (item) =>{
    return (
        <TouchableOpacity style={{width:'50%', height:hp(220), justifyContent:'center', alignItems:'center'}} onPress={() => {onPressProductItem(item)}}>
          <View style={styles.product} >
            {item?.file ?
                <Image style={{width: 100, height: 100,}} resizeMode="contain" source={{ uri: `data:image/gif;base64,${item?.file}` }}/> :
                <GreenOilChange width={wp(32)} height={wp(32)} /> }
            <Text style={styles.title}>{item?.name}</Text>
          </View>

        </TouchableOpacity>
    );
  }

  const onPressProductItem = (item) =>{
    navigation.navigate("ProductsListingSubCategory", {productCategory: item,})
  }

  const onPressCartButton = () =>{
    if (inCartOrder?.services?.length > 0){
      navigation.navigate("Slots", {isOnDemand:false});
    }else {
      navigation.navigate("PaymentMethod");
    }
  }



  return (
      <View style={styles.container}>
        <BackHeader rightIcon={Cart} title={selectedBranch?.name} RightPress={onPressCartButton}/>
        <TabBar active={1} />
        {!loading && (
            <FlatList
                data={categories}
                numColumns={2}
                contentContainerStyle={styles.listContentContainerStyle}
                renderItem={({ item }) => {return (getProductCategoryItem(item))}}
                ListEmptyComponent={() => (getEmptyListComponent())}
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

  product: {
    alignItems: "center",
    justifyContent: "center",
    width: '90%',
    height: '94%',
    backgroundColor: Colors.BLACK,
    borderRadius: 10,
  },

  listContentContainerStyle: {
    paddingTop: hp(6),
  },


  productImage: {
    height: wp(90),
    width: wp(90),
  },

  title: {
    fontFamily: Fonts.LexendMedium,
    textAlign: "left",
    ...FontSize.rfs14,
    color: Colors.WHITE,
    marginTop: 10,
  },
  img: {
    alignItems: "center",
    flex: 1,
    // alignSelf: "center",
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
  }
});

export default ProductsListing;
