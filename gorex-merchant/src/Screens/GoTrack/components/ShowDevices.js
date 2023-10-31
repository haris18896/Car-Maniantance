import React, { memo } from "react";
import { View, Text } from "react-native";

function ShowDevices(props) {
  const {} = props;
  return (
    <View>
      <Text>Hello devices</Text>
    </View>
  );
}

export default memo(ShowDevices);
