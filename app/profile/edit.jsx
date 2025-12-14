import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UPDATE_API =
  "https://tourly-backend-3fa2.onrender.com/api/v1/users/update";

export default function EditProfile() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [initialUsername, setInitialUsername] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Load profile data
  useEffect(() => {
  fetchProfile();
}, []);

const fetchProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");

    const res = await fetch(
      "https://tourly-backend-3fa2.onrender.com/api/v1/users/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await res.json();

    if (!res.ok) throw new Error(json.message);

    setUsername(json.data.profile.username);
    setEmail(json.data.profile.email); // read-only
    setAvatar(json.data.profile.avatar);
    setInitialUsername(json.data.profile.username);
  } catch (err) {
    Alert.alert("Error", err.message);
  }
};


  const hasChanges = username !== initialUsername || avatar;

  // 📸 Pick new avatar
  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  // 💾 Save profile
  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert("Validation", "Username cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");

      const formData = new FormData();
      formData.append("username", username);

      if (avatar?.startsWith("file")) {
        formData.append("avatar", {
          uri: avatar,
          name: "avatar.jpg",
          type: "image/jpeg",
        });
      }

      const res = await fetch(UPDATE_API, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      // Update local profile cache
      await AsyncStorage.setItem(
        "profile",
        JSON.stringify(json.data)
      );

      Alert.alert("Success", "Profile updated");
      router.back();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#acd9f6", "#ffffff"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 0.35 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-5 pt-6 flex-row justify-between items-center">
          <Text className="text-2xl font-extrabold text-slate-900">
            Edit Profile
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-blue-500 font-semibold">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>

        <View className="px-5 mt-8">
          {/* Avatar */}
          <TouchableOpacity
            onPress={pickAvatar}
            className="items-center mb-6"
          >
            <Image
              source={{
                uri:
                  avatar ||
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png",
              }}
              className="w-28 h-28 rounded-full border-4 border-white"
            />
            <Text className="mt-2 text-blue-500 font-medium">
              Change Avatar
            </Text>
          </TouchableOpacity>

          {/* Username */}
          <Text className="text-sm font-medium text-slate-800 mb-2">
            Username
          </Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            className="bg-white rounded-xl px-4 py-3 border border-slate-200 mb-5"
          />

          {/* Email (read-only) */}
          <Text className="text-sm font-medium text-slate-800 mb-2">
            Email
          </Text>
          <TextInput
            value={email}
            editable={false}
            className="bg-slate-100 rounded-xl px-4 py-3 border border-slate-200 mb-8 text-slate-600"
          />

          {/* Save */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={!hasChanges || loading}
            className={`rounded-2xl py-4 items-center ${
              hasChanges ? "bg-[#82c5fb]" : "bg-slate-300"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
