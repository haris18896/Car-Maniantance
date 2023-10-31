import {Platform} from 'react-native';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';

export const requestLibraryPermission = async () => {
  try {
    let granted;
    if (Platform.OS === 'ios') {
      granted = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (!granted) {
        granted = await request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
      }
    } else {
      granted = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    }
    return granted === RESULTS.GRANTED || granted === RESULTS.LIMITED;
  } catch (err) {
    return false;
  }
};
