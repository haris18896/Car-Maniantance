import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Dashboard from "../Screens/Dashboard/Dashboard";

const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      useLegacyImplementation
      screenOptions={{
        drawerStyle: { backgroundColor: "white" },
        drawerPosition: "right",
      }}
      initialRouteName="Dasboard"
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
