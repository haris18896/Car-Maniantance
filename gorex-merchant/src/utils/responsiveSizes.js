import { PixelRatio, Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const WidthRatio = SCREEN_WIDTH / 428;
const HeightRatio = SCREEN_HEIGHT / 926;

const wp = (width) => {
  return PixelRatio.roundToNearestPixel(width * WidthRatio);
};

const hp = (height) => {
  return PixelRatio.roundToNearestPixel(height * HeightRatio);
};

const rfs = (fontSize) => {
  return hp(fontSize);
};

// const normalize = (size) => {
//   const newSize = size * scale;
//   if (Platform.OS === 'ios') {
//     return Math.round(PixelRatio.roundToNearestPixel(newSize));
//   } else {
//     return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
//   }
// };

// const responsiveVerticalSize = (size) => {
//   const screenHeight = Dimensions.get('window').height;
//   // Convert string input to decimal number
//   const elemHeight = parseFloat(size);
//   return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
// };

// const responsiveHorizontalSize = (size) => {
//   const screenWidth = Dimensions.get('window').width;
//   // Convert string input to decimal number
//   const elemHeight = parseFloat(size);
//   return PixelRatio.roundToNearestPixel((screenWidth * elemHeight) / 100);
// };

export {
  hp,
  wp,
  rfs,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  // normalize,
  // responsiveVerticalSize,
  // responsiveHorizontalSize,
};
