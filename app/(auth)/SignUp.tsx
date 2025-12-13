import {
  View,
  Text,
  Image,
  TextInput,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "@/components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { usePostUserRegisterMutation } from "@/features/auth/registerApi";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const router = useRouter();
  const [registerUser, { isLoading }] = usePostUserRegisterMutation();

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      return Alert.alert("Permission Required", "Gallery access is needed.");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const onSignup = async () => {
    if (!username || !email || !password) {
      return Alert.alert("Error", "All fields are required");
    }

    if (!avatar) {
      return Alert.alert("Error", "Please upload a profile picture");
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("avatar", {
        uri: avatar,
        name: "avatar.jpg",
        type: "image/jpeg",
      } as any);

      const response = await registerUser(formData).unwrap();
      console.log("✅ Registration successful:", response);

      const token = response?.data?.accessToken;
      if (token) {
        await AsyncStorage.setItem("accessToken", token);
      }

      Alert.alert("Success", "Account created successfully!");
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("❌ Registration error:", error);
      Alert.alert("Error", error?.data?.message || "Something went wrong");
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/background.png")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 bg-black/20 justify-center">
        <View className="bg-white rounded-2xl p-6 mx-5 min-h-[450px] justify-between">
          <Text className="text-2xl font-semibold text-gray-800">
            <Text className="text-[#82c5fb]">Adventure</Text> Awaits
          </Text>

          <TouchableOpacity onPress={pickImage} className="self-center mb-5">
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                className="w-24 h-24 rounded-full border-2 border-[#82c5fb]"
              />
            ) : (
              <View className="w-24 h-24 rounded-full border-2 border-dashed border-[#82c5fb] items-center justify-center">
                <Text className="text-gray-400 text-sm">Upload</Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            className="border border-[#82c5fb] h-[50px] px-4 my-3 rounded-lg"
          />

          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            className="border border-[#82c5fb] h-[50px] px-4 my-3 rounded-lg"
          />

          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="border border-[#82c5fb] h-[50px] px-4 my-3 rounded-lg"
          />

          <CustomButton
            title="Sign Up"
            onPress={onSignup}
            isLoading={isLoading}
          />

          <View className="flex-row justify-center mt-4">
            <Text className="text-sm text-gray-500">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/SignIn")}>
              <Text className="text-[#82c5fb] font-bold text-sm">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default SignUp;
