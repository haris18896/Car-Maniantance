import React, {useContext, useEffect, useState} from "react";
import {View, StyleSheet, FlatList, Text, Alert} from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import { Cart } from "../../assets";
import Fonts from "../../Constants/fonts";
import Colors from "../../Constants/Colors";
import FontSize from "../../Constants/FontSize";
import {setCart, showToast} from "../../utils/common";
import { hp, wp } from "../../utils/responsiveSizes";

import TabBar from "./components/TabBar";
import Loader from "../../Components/Loader";
import CheckBox from "../../Components/Inputs/CheckBox";
import BackHeader from "../../Components/Header/BackHeader";
import GeneralAPIWithEndPoint from "../../api/GeneralAPIWithEndPoint";
import {CommonContext} from "../../contexts/ContextProvider";
import Footer from "./components/Footer";

const ServicesSubCategory = ({ route }) => {
  const {selectedBranch, inCartOrder, setInCartOrder}  = useContext(CommonContext);
  const category = route?.params?.category;

  const { t } = useTranslation();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [servicesPrice, setServicesPrice] = useState(0);

  useEffect(() => {
    const body = {
      service_provider: selectedBranch.id,
      categ_id:category.id,
      category_type: "service",
    };
    GeneralAPIWithEndPoint("/branch/products", body).then((response) => {
      setLoading(false);
      checkIfServiceIsAlreadyAddedInCart(response);

    });
  }, []);


  const checkIfServiceIsAlreadyAddedInCart = (localServices) =>{

    if (inCartOrder){
      setServicesPrice(inCartOrder.totalPrice)

      let tempServices  = [];
      localServices.map((serviceItem)=>{
        let serviceInCart = inCartOrder.services.filter(item => item.id === serviceItem.id);

        if (serviceInCart.length > 0){
          tempServices.push(serviceItem);
        }
      });
      setSelectedServices(tempServices);
    }

    setServices(localServices);
  }

  const isServiceSelected = (item) =>{
    let index = selectedServices.findIndex((selectedService) => selectedService.id === item.id)
    return index > -1 ;
  }

  const serviceChecked = async (checked, service) => {

    let newPrice  = servicesPrice;

    if (checked){
      if (selectedServices.length > 0){
        const oldService  = selectedServices[0];
        newPrice          = servicesPrice - oldService.price;
      }

      newPrice          = newPrice + service.price;
      setServicesPrice(newPrice);
      setSelectedServices([service]);
    }else{
      const oldService  = selectedServices[0];
      newPrice          = servicesPrice - oldService.price;
      setServicesPrice(newPrice);
      setSelectedServices([]);
    }



    // let updatedSelectedServices = [];
    // const index = updatedSelectedServices.findIndex((selectedService) => selectedService.id === service.id);
    //
    // if (index === -1){
    //   updatedSelectedServices.push(service);
    // }else {
    //   updatedSelectedServices.splice(index, 1);
    //
    // }
    //
    //
    // let currentPrice  = newPrice;
    // if (checked){
    //   currentPrice    = currentPrice + service.price;
    // }else {
    //   currentPrice    = currentPrice - service.price;
    // }
    //
    // setServicesPrice(currentPrice);
    // setSelectedServices(updatedSelectedServices);
  };

  const addToCart = () => {
    let cartBranch    = null;
    let cartServices  = [];
    let cartProducts  = [];
    let cartTotal     = 0;

    if (inCartOrder){
      cartBranch        = inCartOrder.branch;
      cartProducts      = [...inCartOrder.products];

      let tempServices  = [];
      selectedServices.map((selectedService)=>{
        let serviceInCart = inCartOrder.services.filter(item => item.id === selectedServices.id);
        if (serviceInCart.length <= 0){
          tempServices.push(selectedService);
        }
      });

      cartServices  = [...inCartOrder.services, ...tempServices];
      let cartPrice = 0;
      cartServices.map((cartService) =>{
        cartPrice = cartPrice + cartService.price;
      });
      cartProducts.map((cartProduct) =>{
        cartPrice = cartPrice + (cartProduct.product.price * cartProduct.quantity);
      });

      cartTotal = cartPrice;
    }else {
      cartBranch    = selectedBranch;
      cartServices  = [...selectedServices];
      cartProducts  = [];
      cartTotal     = servicesPrice;
    }



    let order = {
      branch:cartBranch,
      services:cartServices,
      products:cartProducts,
      totalPrice:cartTotal,
      date:null,
      slot:null,
    }

    setInCartOrder(order)
    setCart(order).then()

  };

  const onPressCartIcon = () =>{
    // navigation.navigate("PaymentMethod");
    if (inCartOrder?.services?.length > 0){
      navigation.navigate("Slots", {isOnDemand:false});
    }else {
      navigation.navigate("PaymentMethod");
    }
  }

  const onPressBottomButton = () =>{
    if (inCartOrder && services.length <= 0){
      navigation.navigate("PaymentMethod");
      // if (inCartOrder.services.length <= 0){
      //   navigation.navigate("PaymentMethod");
      // }else {
      //   navigation.navigate("Slots", {isOnDemand:false});
      // }
    }else if (inCartOrder && services.length > 0){
      if (inCartOrder.branch.id === selectedBranch.id){
        addToCart();
        // navigation.navigate("PaymentMethod");
        if (services.length > 0){
          navigation.navigate("Slots", {isOnDemand:false});
        }else {
          navigation.navigate("PaymentMethod");
        }
      }else {
        Alert.alert("Clear the previous cart to make an order from different branch");
      }
    }else if (services.length > 0){
      addToCart();
      // navigation.navigate("PaymentMethod");
        navigation.navigate("Slots", {isOnDemand:false});
      // if (services.length > 0){
      // }else {
      //   navigation.navigate("PaymentMethod");
      // }
    }
  }

  const getBottomButtonTitle = () =>{
    let title  = t("service.addcart");
    if (inCartOrder && services.length > 0){
      title = t("productsAndServices.updateCart");
    }else if (inCartOrder && services.length <= 0){
      title = t("productsAndServices.viewCart")
    }
    return title;
  }


  return (
      <View style={styles.container}>
        <BackHeader title={selectedBranch.name} rightIcon={Cart} RightPress={() => {onPressCartIcon()}}/>
        <TabBar active={2} />
        <View style={styles.paddedContent}>
          <View style={[styles.servicesContainer]}>
            <Text style={{...FontSize.rfs18, color: "black", fontFamily: Fonts.LexendBold,}}>{t("productsAndServices.chooseServiceType")}</Text>
            <FlatList
                style={{ marginTop: 15 }}
                data={services}
                renderItem={({ item }) => (
                    <CheckBox item={item} isChecked={isServiceSelected(item)} serviceChecked={serviceChecked} />
                )}
            />
          </View>
        </View>


        <Footer title={getBottomButtonTitle()}
                rightTitle={t("common.SAR") + " " + servicesPrice}
                onPress={()=>{onPressBottomButton()}} />

        <Loader visible={loading} />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  paddedContent: {
    paddingHorizontal: wp(14),
    flex: 1,
  },
  servicesContainer: {
    marginTop: hp(30),
    marginBottom: hp(20),
    maxHeight: hp(350),
  },
  cartIcon: {
    width: wp(24),
    height: hp(26),
  }
});

export default ServicesSubCategory;
