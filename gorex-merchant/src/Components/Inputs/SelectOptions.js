import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Modal,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import { BlackArrowLeft } from "../../assets";
import Colors from "../../Constants/Colors";
import { hp, wp } from "../../utils/responsiveSizes";

const SelectOptions = ({ visible, options, selectOption }) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(visible);
    } else {
      setTimeout(() => {
        setShow(visible);
      }, 100);
    }
  }, [visible]);

  return (
    <Modal transparent visible={show} style={styles.container}>
      <SafeAreaView style={styles.content}>
        <TouchableOpacity
          onPress={() => setShow(false)}
          style={styles.menuButton}
        >
          <BlackArrowLeft width={wp(12)} height={hp(18)} />
        </TouchableOpacity>
        <View style={styles.optionsContainer}>
          {options?.map((item, index) => {
            return (
              <TouchableOpacity
                style={styles.option}
                key={index}
                disabled={index === 0}
                onPress={() => selectOption(item)}
              >
                <Text style={index === 0 ? styles.disabledText : styles.text}>
                  {" "}
                  {item?.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </Modal>
  );
};
SelectOptions.propTypes = {
  visible: PropTypes.bool,
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuButton: {
    height: wp(40),
    width: wp(40),

    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(20),
  },
  content: {
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
  optionsContainer: {
    padding: wp(20),
  },
  option: {
    height: hp(50),
    borderBottomWidth: 1,
    borderColor: Colors.BLACK_OPAC,
    justifyContent: "center",
    marginBottom: hp(15),
  },
  disabledText: {
    color: Colors.GREY,
  },
  text: {
    color: Colors.BLACK,
  },
});

export default SelectOptions;
