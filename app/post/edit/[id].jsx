import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditPost() {
  const router = useRouter();
  const { post } = useLocalSearchParams();

  if (!post) return null;

  const parsedPost = JSON.parse(post);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(parsedPost.title || "");
    setDescription(parsedPost.description || "");
    setCity(parsedPost.location?.city || "");
    setCountry(parsedPost.location?.country || "");
  }, []);

  const handleUpdate = async () => {
    if (!title.trim() || !city.trim() || !country.trim()) {
      Alert.alert("Validation", "Title, city and country are required");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");

      const res = await fetch(
        `https://tourly-backend-3fa2.onrender.com/api/v1/posts/${parsedPost._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            location: { city, country },
          }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Update failed");
      }

      Alert.alert("Success", "Post updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
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
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View className="px-5 pt-6 flex-row justify-between items-center">
            <Text className="text-2xl font-extrabold text-slate-900">
              Edit Post
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-blue-500 font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* IMAGE PREVIEW */}
          {parsedPost.images?.length > 0 && (
            <Image
              source={{ uri: parsedPost.images[0] }}
              className="w-[90%] h-56 rounded-xl mx-auto mt-6"
              resizeMode="cover"
            />
          )}

          {/* FORM */}
          <View className="px-5 mt-8">
            <Text className="font-semibold mb-2">Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 mb-5"
            />

            <Text className="font-semibold mb-2">City</Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 mb-5"
            />

            <Text className="font-semibold mb-2">Country</Text>
            <TextInput
              value={country}
              onChangeText={setCountry}
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 mb-5"
            />

            <Text className="font-semibold mb-2">Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 mb-8 h-32 text-start"
            />

            {/* SAVE BUTTON */}
            <TouchableOpacity
              onPress={handleUpdate}
              disabled={loading}
              className="bg-[#82c5fb] rounded-2xl py-4 items-center"
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
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
