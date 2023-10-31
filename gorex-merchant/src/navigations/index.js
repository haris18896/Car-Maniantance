import React, { Fragment, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import Register from "../Screens/Register";
import OnBoarding from "../Screens/Onboarding";
import SelectAuth from "../Screens/Onboarding/SelectAuth";
import VehicleInformation from "../Screens/VehicleAddUpdate";
import Login from "../Screens/Login/LoginScreen";
import OTP from "../Screens/OTP/OTPScreen";
import Dashboard from "../Screens/Dashboard/Dashboard";
import ServiceProviderDetails from "../Screens/ServiceProvider/ServiceProviderDetails";
import ProductsListing from "../Screens/ProductsAndServices/ProductsListing";
import ProductsListingSubCategory from "../Screens/ProductsAndServices/ProductsListingSubCategory";
import ProductDetails from "../Screens/ProductsAndServices/ProductDetails";
import ServicesListing from "../Screens/ProductsAndServices/ServicesListing";
import ServicesSubCategory from "../Screens/ProductsAndServices/ServicesSubCategory";
import PaymentMethod from "../Screens/ProductsAndServices/PaymentMethod";
import OrderDetails from "../Screens/ProductsAndServices/OrderDetails";
import Congratulations from "../Screens/ProductsAndServices/Congratulations";
import OrderHistory from "../Screens/ProductsAndServices/OrderHistory";
import PaymentHistory from "../Screens/Payments/PaymentHistory";
import TransferScreen from "../Screens/Payments/transfer";
import MyVehicles from "../Screens/MyVehicles";
import AddCard from "../Screens/Payments/AddCard";
import ProfileUpdate from "../Screens/ProfileUpdate/ProfileUpdate";
import TopUp from "../Screens/Payments/Topup";
import Complain from "../Screens/Complain/ComplainScreen";
import ForgotPassword from "../Screens/ForgotPassword/ForgotPassword";
import ResetPassword from "../Screens/ResetPassword/ResetPassword";
import ViewPayment from "../Screens/Payments/ViewPayment";
import Success from "../Screens/Payments/ViewPayment";
import UpdatePassword from "../Screens/UpdatePassword/UpdatePassword";
import OTPScreens from "../Screens/OffersScreen/Offers";
import Setting from "../Screens/Setting";
import Language from "../Screens/Language";
import SuccessVehicle from "../Screens/ProductsAndServices/SuccessVehicle";
import Country from "../Screens/Country";
import OfferData from "../Screens/OfferData";
import OfferDetail from "../Screens/OfferDetail";
import GorexSupport from "../Screens/GorexSupport";
import UpdateVehicle from "../Screens/ProductsAndServices/components/UpdateVehicle";
import PaymentOptions from "../Screens/Payments/PaymentOptions";
import NotificationScreen from "../Screens/NotificationScreen";
import SuccessCard from "../Screens/CardScreens/SuccessCard";
import RejectCard from "../Screens/CardScreens/RejectCard";
import TopUpCard from "../Screens/Payments/TopUpCard";
import TopUpSuccess from "../Screens/Payments/TopUpSuccess";
import OrderConfirmed from "../Screens/OrderConfirmed";
import SideMenu from "../Screens/Dashboard/components/SideMenu";
import GorexClub from "../Screens/GorexClub/GorexClub";
import GorexCards from "../Screens/GorexClub/GorexCards";
import { Splash } from "../Screens/Splash";
import { ForceUpdate } from "../Screens/ForceUpdate";

import {
  GoDPlaceOrder,
  GoDChooseVehicle,
  GoDChooseService,
  GoDOrderConfirmed,
  GoDChooseAddressAndSlot,
} from "../Screens";
import Slots from "../Screens/OnDemandFlow/Slots/Slots";
import WalletSuccess from "../Screens/Payments/walletSucceess";
import OfferRedeem from "../Screens/offer/offerRedeme";
import OfferPromoSuccess from "../Screens/offer/success";
import WelcomeOnDemand from "../Screens/OnDemandFlow/onDemandTab";
import MyGorexOnDemandRequests from "../Screens/OnDemandFlow/onDemandTab/myRequests";
import VehiclesServices from "../Screens/OnDemandFlow/onDemandTab/GodVechiles_Services";
import GoDAddressSlot from "../Screens/OnDemandFlow/onDemandTab/GoDAddress_slot";
import AddNewAddress from "../Screens/OnDemandFlow/onDemandTab/GoDAddress_slot/addNewAddress";
import GoDServiceProvider from "../Screens/OnDemandFlow/onDemandTab/GoDServiceProvider";
import Cart from "../Screens/OnDemandFlow/onDemandTab/cart";
import TrackServiceStatus from "../Screens/OnDemandFlow/onDemandTab/TrackService";
import OrderPlaced from "../Screens/OnDemandFlow/onDemandTab/success/orderConfirmed";
import ExtraService from "../Screens/OnDemandFlow/onDemandTab/ExtraService/ExtraService";
import AddExtraPayment from "../Screens/OnDemandFlow/onDemandTab/AddExtraPayment/AddExtraPayment";
import AddExtraService from "../Screens/OnDemandFlow/onDemandTab/AddExtraService/AddExtraService";

// ** GoTrack
import GoTrackTopBar from "./GoTrackTopBar";
import GoTrackStatus from "../Screens/GoTrack/Status";
import GoTrackTracking from "../Screens/GoTrack/Track";
import GoTrackDashboard from "../Screens/GoTrack/Dashboard";
import AddDevice from "../Screens/GoTrack/device/addDevice";
import Subscription from "../Screens/GoTrack/device/subscription";
import DeviceSuccess from "../Screens/GoTrack/device/DeviceSuccessScreen";
import ProductsList from "../Screens/GoTrack/cart";
import ProductAddressAndProvider from "../Screens/GoTrack/cart/provider_address";
import GoTrackSlots from "../Screens/GoTrack/cart/GoTrackSlots";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const GoTrackTab = createMaterialTopTabNavigator();
function GoTrackTopBarNavigator() {
  const [selectedDevice, setSelectedDevice] = useState({});
  const [confirmDevice, setConfirmDevice] = useState(null);

  return (
    <GoTrackTab.Navigator tabBar={(props) => <GoTrackTopBar {...props} />}>
      <GoTrackTab.Screen name="Dashboard">
        {(props) => (
          <GoTrackDashboard
            {...props}
            selectedDevice={selectedDevice}
            confirmDevice={confirmDevice}
            setSelectedDevice={setSelectedDevice}
            setConfirmDevice={setConfirmDevice}
          />
        )}
      </GoTrackTab.Screen>
      <GoTrackTab.Screen name="Track">
        {(props) => (
          <GoTrackTracking
            {...props}
            selectedDevice={selectedDevice}
            confirmDevice={confirmDevice}
            setSelectedDevice={setSelectedDevice}
            setConfirmDevice={setConfirmDevice}
          />
        )}
      </GoTrackTab.Screen>
      {/*<GoTrackTab.Screen name="Dashboard" component={GoTrackDashboard} />*/}
      {/*<GoTrackTab.Screen name="Track" component={GoTrackTracking} />*/}
      <GoTrackTab.Screen name="Status" component={GoTrackStatus} />
    </GoTrackTab.Navigator>
  );
}

function MainDrawer() {
  return (
    <Drawer.Navigator drawerContent={(props) => <SideMenu {...props} />}>
      <Drawer.Screen name="DashboardScreen" component={Dashboard} />
      <Drawer.Screen name="Setting" component={Setting} />
      <Drawer.Screen name="OfferData" component={OfferData} />
      <Drawer.Screen name="MyVehicles" component={MyVehicles} />
      <Drawer.Screen
        name={"GoTrackDashboard"}
        component={GoTrackTopBarNavigator}
      />
      <Drawer.Screen name="GorexCards" component={GorexCards} />
      <Drawer.Screen name="OrderHistory" component={OrderHistory} />
      <Drawer.Screen name="GorexSupport" component={GorexSupport} />
      <Drawer.Screen name="PaymentHistory" component={PaymentHistory} />
      <Drawer.Screen name={"WelcomeOnDemand"} component={WelcomeOnDemand} />
    </Drawer.Navigator>
  );
}

function Navigation() {
  // const netInfo = useNetInfo();
  // if (netInfo?.isConnected && netInfo?.isInternetReachable)
  // if (netInfo?.isConnected)
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Index"
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen name="SplashScreen" component={Splash} />
        <Stack.Screen name="ForceUpdate" component={ForceUpdate} />
        <Stack.Screen name="Onboarding" component={OnBoarding} />
        <Stack.Screen name="SelectAuth" component={SelectAuth} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="OTPScreens" component={OTPScreens} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetPasswordSuccess" component={Success} />
        <Stack.Screen name="OTP" component={OTP} />
        <Stack.Screen name="Dashboard" component={MainDrawer} />
        <Stack.Screen name="ServicesListing" component={ServicesListing} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen name="Country" component={Country} />
        <Stack.Screen name="UpdateVehicle" component={UpdateVehicle} />
        <Stack.Screen
          name="ProductsListingSubCategory"
          component={ProductsListingSubCategory}
        />
        <Stack.Screen name="ProductsListing" component={ProductsListing} />
        <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
        <Stack.Screen
          name="ServiceProviderDetails"
          component={ServiceProviderDetails}
        />
        <Stack.Screen
          name="VehicleInformation"
          component={VehicleInformation}
        />
        <Stack.Screen name="Congratulations" component={Congratulations} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
        <Stack.Screen
          name="ServicesSubCategory"
          component={ServicesSubCategory}
        />
        <Stack.Screen name="ProfileUpdate" component={ProfileUpdate} />
        <Stack.Screen name="AddCard" component={AddCard} />
        <Stack.Screen name="TopUp" component={TopUp} />
        <Stack.Screen name="Complain" component={Complain} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="ViewPayment" component={ViewPayment} />
        <Stack.Screen name={"WalletSuccess"} component={WalletSuccess} />
        <Stack.Screen name={"TransferScreen"} component={TransferScreen} />
        <Stack.Screen name="Language" component={Language} />
        <Stack.Screen name="SuccessVehicle" component={SuccessVehicle} />
        <Stack.Screen name="OfferDetail" component={OfferDetail} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen name="OrderConfirmed" component={OrderConfirmed} />
        <Stack.Screen name="PaymentOptions" component={PaymentOptions} />
        <Stack.Screen name="SuccessCard" component={SuccessCard} />
        <Stack.Screen name="RejectCard" component={RejectCard} />
        <Stack.Screen name="TopUpCard" component={TopUpCard} />
        <Stack.Screen name="TopUpSuccess" component={TopUpSuccess} />
        <Stack.Screen name="GorexClub" component={GorexClub} />
        <Stack.Screen name="GoDPlaceOrder" component={GoDPlaceOrder} />
        <Stack.Screen name="GoDChooseVehicle" component={GoDChooseVehicle} />
        <Stack.Screen name="GoDChooseService" component={GoDChooseService} />
        <Stack.Screen name="GoDOrderConfirmed" component={GoDOrderConfirmed} />
        <Stack.Screen
          name="GoDChooseAddressAndSlot"
          component={GoDChooseAddressAndSlot}
        />
        <Stack.Screen name="Slots" component={Slots} />
        <Stack.Screen name={"OfferRedeem"} component={OfferRedeem} />
        <Stack.Screen
          name={"OfferPromoSuccess"}
          component={OfferPromoSuccess}
        />
        <Stack.Screen
          name={"MyGorexOnDemandRequests"}
          component={MyGorexOnDemandRequests}
        />
        <Stack.Screen name={"VehiclesServices"} component={VehiclesServices} />
        <Stack.Screen name={"GoDAddressSlot"} component={GoDAddressSlot} />
        <Stack.Screen name={"AddNewAddress"} component={AddNewAddress} />
        <Stack.Screen
          name={"GoDServiceProvider"}
          component={GoDServiceProvider}
        />
        <Stack.Screen name={"Cart"} component={Cart} />
        <Stack.Screen name={"OrderPlaced"} component={OrderPlaced} />
        <Stack.Screen
          name={"TrackServiceStatus"}
          component={TrackServiceStatus}
        />
        <Stack.Screen name={"ExtraService"} component={ExtraService} />
        <Stack.Screen name={"AddExtraPayment"} component={AddExtraPayment} />
        <Stack.Screen name={"AddExtraService"} component={AddExtraService} />

        {/* GoTrack */}
        <Stack.Screen name={"AddDevice"} component={AddDevice} />
        <Stack.Screen name={"Subscription"} component={Subscription} />
        <Stack.Screen name={"DeviceSuccess"} component={DeviceSuccess} />
        <Stack.Screen name={"ProductsList"} component={ProductsList} />
        <Stack.Screen
          name={"ProductAddressAndProvider"}
          component={ProductAddressAndProvider}
        />
        <Stack.Screen name={"GoTrackSlots"} component={GoTrackSlots} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  // return <NoInternet />;
}

export default Navigation;
