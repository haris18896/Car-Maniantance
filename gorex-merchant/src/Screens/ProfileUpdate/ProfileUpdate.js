import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import styles from "./styles";
import { PK, KSA } from "../../Constants/country";
import UpdateProfile from "../../api/UpdateProfile";
import { hp, wp } from "../../utils/responsiveSizes";
import { CommonContext } from "../../contexts/ContextProvider";
import { showToast } from "../../utils/common";

import Loader from "../../Components/Loader";
import Header from "../../Components/Header/BackHeader";
import Footer from "../ProductsAndServices/components/Footer";
import InputWithLabel from "../../Components/Inputs/InputWithLabel";
import { GetProfile } from "../../api/CallAPI";
import analytics from "@react-native-firebase/analytics";

const ProfileUpdate = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { partnerId, setUserProfile, userProfile } = useContext(CommonContext);

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState(
    userProfile?.phone?.startsWith("+966") ? KSA : PK
  );
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState(null);
  const [address, setAddress] = useState("");
  const [vehicleLicenseNumber, setVehicleLicenseNumber] = useState("");
  const [drivingLicenseExpiry, setDrivingLicenseExpiry] = useState("");

  useEffect(() => {
    updateProfileFields();

    analytics().logScreenView({
      screen_name: "profile_update_screen",
    });
  }, []);

  const updateProfileFields = () => {
    setFirstName(userProfile?.first_name);
    setLastName(userProfile?.last_name);
    setMobileNumber(
      userProfile?.phone?.startsWith("+966")
        ? userProfile?.phone?.slice(4)
        : userProfile?.phone?.slice(3)
    );
    if (userProfile?.email) {
      setEmailAddress(userProfile?.email);
    }
    if (userProfile?.dob) {
      setDob(new Date(userProfile?.dob));
    }
    if (userProfile?.gender) {
      setGender(userProfile?.gender);
    }
    if (userProfile?.address) {
      setAddress(userProfile?.address);
    }
    if (userProfile?.driving_license_number) {
      setVehicleLicenseNumber(userProfile?.driving_license_number);
    }
    if (userProfile?.driving_license_expiry) {
      setDrivingLicenseExpiry(userProfile?.driving_license_expiry);
    }
  };

  const updateProfileData = async () => {
    const profileData = {
      first_name: firstName,
      last_name: lastName,
      phone: `${country?.countryCode}${mobileNumber}`,
      email: emailAddress,
      dob,
      gender,
      address,
      driving_license_number: vehicleLicenseNumber,
      driving_license_expiry: drivingLicenseExpiry,
    };

    setLoading(true);
    UpdateProfile(profileData, userProfile?.id).then(
      ({ success, response }) => {
        setLoading(false);
        if (success) {
          fetchAndUpdateLatestProfile().then();
        } else {
          showToast("Error", response, "error");
        }
      }
    );
  };

  const fetchAndUpdateLatestProfile = async () => {
    GetProfile({ profileID: userProfile.id }).then((getProfileResponse) => {
      if (getProfileResponse?.success) {
        setUserProfile(getProfileResponse?.data[0]);
        navigation.goBack();
      }
    });
  };

  return (
    <View style={styles.screen}>
      <Header title={t("account.account")} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.spacer} />

            <View style={styles.row}>
              <InputWithLabel
                containerStyle={styles.smallInput}
                label={t("signUp.firstName")}
                value={firstName}
                setValue={setFirstName}
                placeholder={t("signUp.firstNamePlaceholder")}
              />

              <InputWithLabel
                containerStyle={styles.smallInput}
                label={t("signUp.lastName")}
                value={lastName}
                setValue={setLastName}
                placeholder={t("signUp.lastNamePlaceholder")}
              />
            </View>

            <View style={styles.spacer} />

            <InputWithLabel
              type="mobile"
              label={t("signUp.mobileNumber")}
              value={mobileNumber}
              setValue={setMobileNumber}
              country={country}
              setCountry={setCountry}
              editable={false}
              keyboardType="number-pad"
              placeholder={t("signUp.mobileNumberPlaceholder")}
            />

            <View style={styles.spacer} />

            <InputWithLabel
              label={t("signUp.email")}
              value={emailAddress}
              setValue={setEmailAddress}
              keyboardType="email-address"
              placeholder={t("signUp.emailPlaceholder")}
            />

            <View style={{ height: hp(20) }} />

            <View style={styles.row}>
              <InputWithLabel
                type="date"
                containerStyle={styles.smallInput}
                label={t("signUp.dob")}
                value={dob}
                setValue={setDob}
                maximumDate={new Date()}
                placeholder={t("signUp.dobPlaceholder")}
              />
              <InputWithLabel
                type="gender"
                containerStyle={styles.smallInput}
                label={t("signUp.gender")}
                value={gender}
                setValue={setGender}
                placeholder={t("signUp.genderPlaceholder")}
              />
            </View>

            <View style={styles.spacer} />

            {/*<InputWithLabel*/}
            {/*    label={t("account.address")}*/}
            {/*    value={address}*/}
            {/*    setValue={setAddress}*/}
            {/*    placeholder={t("account.addressPlaceholder")} />*/}

            {/*<View style={styles.spacer} />*/}

            {/*<InputWithLabel*/}
            {/*    label={t("account.vehicleLicenseNumber")}*/}
            {/*    value={vehicleLicenseNumber}*/}
            {/*    setValue={setVehicleLicenseNumber}*/}
            {/*    placeholder={t("account.vehicleLicenseNumberPlaceholder")} />*/}

            {/*<View style={styles.spacer} />*/}

            {/*<InputWithLabel*/}
            {/*    label={t("account.drivingLicenseExpiry")}*/}
            {/*    value={drivingLicenseExpiry}*/}
            {/*    setValue={setDrivingLicenseExpiry}*/}
            {/*    placeholder={t("account.drivingLicenseExpiryPlaceholder")} />*/}

            {/*<View style={styles.spacer} />*/}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Footer title={t("profile.saveChanges")} onPress={updateProfileData} />
      <Loader visible={loading} />
    </View>
  );
};

export default ProfileUpdate;
