import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";

export default function Index() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/images/background.png")}
      className="flex-1"
      resizeMode="cover"
    >
      {/* Top content */}
<View className="absolute top-32 left-10 right-6">
  <Text className="text-[#82c5fb] text-5xl font-bold tracking-wide">
    Tourly
  </Text>
  <Text className="text-[#82c5fb] text-lg font-bold mt-1">
    Discover • Plan • Explore
  </Text>
</View>
      <View className="absolute top-64 left-0 right-0 items-center">
        <LottieView
          source={require("@/assets/animations/earth.json")}
          autoPlay
          loop
          speed={0.6}
          style={{ width: 250, height: 250 }}
        />
      </View>

      {/* Gradient + Content */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.65)"]}
        className="flex-1 justify-end px-6 pb-10"
      >
        <Text className="text-white text-3xl font-bold mb-3">
          Explore and discover new places
        </Text>

        <Text className="text-gray-200 text-base mb-6">
          Browse a lot of interesting tourist places and choose something
          just prepared for you.
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/SignIn")}
          className="bg-[#82c5fb] py-4 rounded-xl items-center mb-4"
        >
          <Text className="text-white font-semibold text-lg">
            Sign in
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/SignUp")}
          className="items-center mb-16"
        >
          <Text className="text-white underline">
            Create an account
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </ImageBackground>
  );
}
