import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";

import { useNavigation } from "@react-navigation/native";

import Colors from "../../Constants/Colors";
import { showToast } from "../../utils/common";
import { hp, wp } from "../../utils/responsiveSizes";
import { getComplain, registerComplain } from "./ComplainActions";

import Loader from "../../Components/Loader";
import FormElement from "../../Components/FormEelement";
import Header from "../../Components/Header/BackHeader";
import FullButton from "../../Components/Buttons/FullButton";

const Complain = ({ route }) => {
  const order = route?.params?.order;

  // const dispatch = useDispatch();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    fields: [],
    errorMessages: {},
  });

  useEffect(() => {
    // setLoading(true);
    // dispatch(getComplain()).then((res) => {
    //   setTimeout(() => {
    //     setLoading(false);
    //   }, 2000);
    //   setState({
    //     ...state,
    //     fields: res?.payload,
    //   });
    // });
  }, []);

  const handleChange = (name, index, value) => {
    const { fields, errorMessages } = state;
    const field = fields[index];
    const { fieldType, xmlName } = field;
    if (name === xmlName) {
      switch (fieldType) {
        case "checkbox":
          field["value"] = value;
          break;
        case "select":
          field["value"] = value;
          break;
        default:
          field["value"] = value;
          break;
      }
    }
    if (errorMessages[name]) delete errorMessages[name];
    setState({
      ...state,
      fields,
      [name]: value,
    });
  };
  const addComplain = () => {
    setLoading(true);
    let data = {};

    if (validations()) {
      let fields = state?.fields?.map((field) => {
        data[field?.xmlName] = field?.value;

        if (field?.value === "" && field?.isRequired) {
          if (field?.xmlName !== "matter") {
            field["error"] = true;
            field["errorMessage"] = "Field is Requried!";
          }
        } else {
          field["error"] = false;
        }
        return field;
      });
      setState({
        ...state,
        fields,
      });
      data.order = order;

      dispatch(registerComplain(data)).then((res) => {
        setLoading(false);
        if (res?.payload?._id) {
          showToast("Success", "Complain is registered!", "success");
          navigation.goBack();
        }
      });
    } else {
      setLoading(false);
    }
  };
  function validations() {
    return true;
  }
  return (
    <View style={styles.container}>
      <Header title={"Complaint"} />
      <ScrollView style={styles.content}>
        {state?.fields && state?.fields?.length > 0
          ? state?.fields?.map((field, i) => (
              <FormElement
                index={i}
                key={i}
                field={field}
                currentField={{ [field?.xmlName]: state[field?.xmlName] }}
                errorMessages={state.errorMessages}
                handleChange={handleChange}
              />
            ))
          : null}
        <View style={styles.buttonContainer}>
          <FullButton
            type={"cancel"}
            onPress={() => {
              addComplain();
              // navigation.navigate('VehicleInformation')
            }}
            title={"Submit"}
          />
        </View>
      </ScrollView>
      <Loader visible={loading} />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(22),
    marginTop: hp(10),
  },
  buttonContainer: {
    marginTop: hp(30),
  },
});

//make this component available to the app
export default Complain;
