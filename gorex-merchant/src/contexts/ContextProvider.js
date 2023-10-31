import React, { createContext, useState } from "react";

export const CommonContext = createContext();

const ContextProvider = (props) => {
  const [userProfile, setUserProfile] = useState(null);
  const [partnerId, setPartnerId] = useState(-1);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [inCartOrder, setInCartOrder] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [onDemandOrder, setOnDemandOrder] = useState({});
  const [onDemandProduct, setOnDemandProduct] = useState({});
  const [orderId, setOrderId] = useState(null);
  const [GoTrack, setGoTrack] = useState(null);

  return (
    <CommonContext.Provider
      value={{
        userProfile: userProfile,
        setUserProfile: (userProfile) => {
          setUserProfile(userProfile);
        },

        partnerId: partnerId,
        setPartnerId: (partnerId) => {
          setPartnerId(partnerId);
        },

        selectedBranch: selectedBranch,
        setSelectedBranch: (selectedBranch) => {
          setSelectedBranch(selectedBranch);
        },

        inCartOrder: inCartOrder,
        setInCartOrder: (inCartOrder) => {
          setInCartOrder(inCartOrder);
        },

        currentLocation: currentLocation,
        setCurrentLocation: (currentLocation) => {
          setCurrentLocation(currentLocation);
        },

        onDemandOrder: onDemandOrder,
        setOnDemandOrder: (onDemandOrder) => {
          if (onDemandOrder) {
            setOnDemandOrder(onDemandOrder);
          } else {
            setOnDemandOrder({});
          }
        },
        onDemandProduct: onDemandProduct,
        setOnDemandProduct: (onDemandProduct) => {
          if (onDemandProduct) {
            setOnDemandProduct(onDemandProduct);
          } else {
            setOnDemandProduct({});
          }
        },

        orderId: orderId,
        setOrderId: (orderId) => {
          setOrderId(orderId);
        },

        GoTrack: GoTrack,
        setGoTrack: (GoTrack) => {
          if (GoTrack) {
            setGoTrack(GoTrack);
          } else {
            setGoTrack({});
          }
        },
      }}
    >
      {props.children}
    </CommonContext.Provider>
  );
};

export default ContextProvider;
