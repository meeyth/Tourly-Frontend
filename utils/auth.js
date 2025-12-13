import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

export const getMyUserId = async () => {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) return null;

  const decoded = jwtDecode(token);
  return decoded?._id;
};
