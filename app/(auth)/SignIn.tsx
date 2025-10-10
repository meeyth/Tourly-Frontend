import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "expo-router";
import { usePostUserLoginMutation } from "@/features/auth/loginApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [loginUser, { isLoading }] = usePostUserLoginMutation();

  // ✅ Auto-login if token exists
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) router.replace("/(tabs)/home");
    })();
  }, []);

  const onLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return Alert.alert("Error", "Please enter valid email and password");
    }

    try {
      const response = await loginUser({ email, password }).unwrap();
      const token = response?.data?.accessToken;

      if (token) {
        await AsyncStorage.setItem("accessToken", token);
        console.log("🔐 Token saved:", token);
      }

      Alert.alert("Success", "User signed in successfully!");
      router.replace("/(tabs)/home");
    } catch (error:any) {
      const message = error?.data?.message || "Invalid credentials";
      Alert.alert("Error", message);
      console.error("❌ Login error:", error);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/background.png")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 bg-black/20 justify-center">
        <View className="bg-white rounded-2xl p-6 shadow-lg mx-5 min-h-[350px] justify-between">
          <Text className="text-2xl font-semibold text-gray-800">
            Welcome <Text className="text-[#82c5fb]">Back</Text>!
          </Text>
          <Text className="text-gray-500 text-base mb-5">
            Continue your journey of adventures.
          </Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            className="border border-[#82c5fb] h-[50px] px-4 my-3 rounded-lg mb-3"
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="border border-[#82c5fb] h-[50px] px-4 my-3 rounded-lg"
          />

          <TouchableOpacity className="mt-2 mb-4">
            <Text className="text-right text-sm text-gray-500">
              Forgot password?
            </Text>
          </TouchableOpacity>

          <CustomButton title="Sign In" onPress={onLogin} isLoading={isLoading} />

          <View className="flex-row justify-center mt-4">
            <Text className="text-sm text-gray-500">
              Don’t have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/SignUp")}>
              <Text className="text-[#82c5fb] font-bold text-sm">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default SignIn;
