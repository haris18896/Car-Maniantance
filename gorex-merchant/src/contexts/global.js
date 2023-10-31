// globals.js

let PLACE_ORDER_NOW = false;

export function setPlaceOrderNow(placeOrderNow) {
  PLACE_ORDER_NOW = placeOrderNow;
}

export function getPlaceOrderNow() {
  return PLACE_ORDER_NOW;
}
