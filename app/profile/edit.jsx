import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function EditProfile() {
  const router = useRouter();

  const INITIAL_USERNAME = "John Doe";
  const EMAIL = "johndoe@gmail.com";

  const [username, setUsername] = useState(INITIAL_USERNAME);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const usernameChanged = username !== INITIAL_USERNAME;
  const passwordTouched = oldPassword.length > 0 || newPassword.length > 0;

  const hasChanges = usernameChanged || passwordTouched;

  const handleSave = () => {
    if (!hasChanges) return;

    if (!username.trim()) {
      Alert.alert("Validation", "Username cannot be empty");
      return;
    }
    if (passwordTouched) {
      if (!oldPassword || !newPassword) {
        Alert.alert(
          "Password",
          "Please enter both old and new password"
        );
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert(
          "Weak Password",
          "New password must be at least 6 characters"
        );
        return;
      }
    }
    Alert.alert("Success", "Profile updated successfully");
    router.back();
  };

  return (
    <LinearGradient
      colors={["#acd9f6", "#ffffff"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 0.35 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <View className="px-5 pt-6 flex-row items-center justify-between">
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
          <Text className="text-sm font-medium text-slate-800 mb-2">
            Username
          </Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            className="bg-white rounded-xl px-4 py-3 border border-slate-200 mb-5"
            placeholder="Enter username"
          />

          <Text className="text-sm font-medium text-slate-800 mb-2">
            Email (Not Editable)
          </Text>
          <View className="bg-slate-100 rounded-xl px-4 py-3 border border-slate-200 mb-5">
            <Text className="text-slate-600">
              {EMAIL}
            </Text>
          </View>

          <Text className="text-sm font-medium text-slate-800 mb-2">
            Old Password
          </Text>
          <TextInput
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
            className="bg-white rounded-xl px-4 py-3 border border-slate-200 mb-5"
            placeholder="Enter old password"
          />


          <Text className="text-sm font-medium text-slate-800 mb-2">
            New Password
          </Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            className="bg-white rounded-xl px-4 py-3 border border-slate-200 mb-8"
            placeholder="Enter new password"
          />

          <TouchableOpacity
            onPress={handleSave}
            disabled={!hasChanges}
            className={`rounded-2xl py-4 items-center ${
              hasChanges
                ? "bg-[#82c5fb]"
                : "bg-slate-300"
            }`}
          >
            <Text
              className={`font-bold text-lg ${
                hasChanges ? "text-white" : "text-slate-500"
              }`}
            >
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
