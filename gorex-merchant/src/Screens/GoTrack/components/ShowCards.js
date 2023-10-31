import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";

// ** Custom Components
import MessageWithImage from "../../../Components/MessageWithImage";

// ** Style components
import Colors from "../../../Constants/Colors";
import { Mada, Master, Visa, WhiteCheckBox } from "../../../assets";
import { wp, hp } from "../../../utils/responsiveSizes";
import FontSize from "../../../Constants/FontSize";
import Fonts from "../../../Constants/fonts";

function ShowCards(props) {
  const {
    data,
    loading,
    selected,
    refreshing,
    emptyImage,
    emptyTitle,
    onItemPress,
    emptyDescription,
  } = props;

  return (
    <>
      <FlatList
        data={data}
        horizontal={true}
        showsVerticalScrollIndicator={false}
        onRefresh={refreshing}
        refreshing={loading}
        contentContainerStyle={
          data.length === 0 && {
            flex: 1,
            justifyContent: "center",
          }
        }
        ListEmptyComponent={
          <View style={styles.EmptyVehiclesList}>
            <MessageWithImage
              imageSource={emptyImage}
              message={emptyTitle}
              description={emptyDescription}
            />
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = item?.id === selected?.id;
          let cardBrandImage = Visa;
          if (item.card_brand && item.card_brand.toLowerCase() === "mada") {
            cardBrandImage = Mada;
          } else if (
            item.card_brand &&
            item.card_brand.toLowerCase() === "master"
          ) {
            cardBrandImage = Master;
          }

          return (
            <TouchableOpacity onPress={() => onItemPress({ item })}>
              <View style={styles.cardStyle(isSelected)}>
                {isSelected && <View style={styles.checked} />}
                {isSelected && (
                  <Image source={WhiteCheckBox} style={styles.checkedIcon} />
                )}
                <View style={styles.imageWrapper}>
                  <Image source={cardBrandImage} style={styles.cardIcon} />
                </View>

                <View style={styles.numberContainer}>
                  <Text style={styles.xText}>
                    {item.number.substring(0, 4)}
                  </Text>
                  <Text style={styles.xText}>
                    {item.number.substring(4, 8)}
                  </Text>
                  <Text style={styles.xText}>
                    {item.number.substring(8, 12)}
                  </Text>
                  <Text style={styles.xText}>
                    {item.number.substring(12, 16)}
                  </Text>
                </View>

                <View style={styles.holderWrapper}>
                  <View style={styles.cardHolder}>
                    <Text style={styles.cardHolderText}>Card Holder</Text>
                    <Text style={styles.cardHolderValue}>
                      {item?.card_holder[1]}
                    </Text>
                  </View>
                  {/*<View style={styles.cardHolder}>*/}
                  {/*  <Text style={styles.cardHolderText}>Expires</Text>*/}
                  {/*  <Text style={styles.cardHolderValue}>02/24</Text>*/}
                  {/*</View>*/}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
}

export default ShowCards;

const styles = StyleSheet.create({
  EmptyVehiclesList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  cardStyle: (isSelected) => {
    return {
      position: "relative",
      overflow: "hidden",
      shadowColor: Colors.GREY,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 6,
      margin: wp(10),
      borderRadius: wp(5),
      padding: wp(20),
      borderColor: isSelected ? Colors.DARKERGREEN : Colors.LIGHT_GREY,
      borderWidth: 2,
    };
  },
  imageWrapper: {
    marginBottom: hp(34),
  },
  cardIcon: {
    height: hp(20),
    width: wp(50),
    resizeMode: "contain",
  },
  xText: {
    ...FontSize.rfs18,
    fontFamily: Fonts.LexendMedium,
    color: Colors.GREY_PLACEHOLDER,
    marginRight: wp(18),
  },
  numberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: hp(12),
  },
  holderWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(50),
  },
  cardHolder: {
    flexDirection: "column",
  },
  cardHolderText: {
    ...FontSize.rfs14,
    fontFamily: Fonts.LexendMedium,
    color: Colors.BLACK,
    textAlign: "left",
  },
  cardHolderValue: {
    ...FontSize.rfs16,
    fontFamily: Fonts.LexendBold,
    color: Colors.BLACK,
    textAlign: "left",
  },
  checked: {
    position: "absolute",
    top: 0,
    right: 0,
    width: wp(125),
    height: hp(100),
    backgroundColor: Colors.DARKERGREEN,
    overflow: "hidden",
    zIndex: 1,
    transform: [{ rotate: "40deg" }, { translateX: 8 }, { translateY: -80 }],
  },
  checkedIcon: {
    width: wp(20),
    height: hp(20),
    position: "absolute",
    top: wp(10),
    right: wp(10),
    zIndex: 2,
  },
});
