//import liraries

import PropTypes from "prop-types";

import React, { useEffect, useState } from "react";
import { StyleSheet, Modal, View, ActivityIndicator } from "react-native";
import Colors from "../Constants/Colors";
import { hp } from "../utils/responsiveSizes";

const Loader = ({ visible }) => {
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
      <View style={styles.content}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={"large"} color={Colors.BLUE} />
        </View>
      </View>
    </Modal>
  );
};
Loader.propTypes = {
  visible: PropTypes.bool,
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: "center",
    backgroundColor: Colors.BLACK_OPAC,
    flex: 1,
    justifyContent: "center",
  },
  loaderContainer: {
    alignItems: "center",
    borderRadius: hp(5),
    height: hp(150),
    justifyContent: "center",
    width: hp(150),
  },
});

export default Loader;
