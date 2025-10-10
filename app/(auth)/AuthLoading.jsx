
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const AuthLoading = () => {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        console.log("token",token);
        // Token exists → go to home
        router.replace("/(tabs)/home");
      } else {
        // No token → go to SignIn
        console.log("token",token);

        router.replace("/SignIn");
      }
    };
    checkToken();
  }, []);

  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#82c5fb" />
    </View>
  );
};

export default AuthLoading;
