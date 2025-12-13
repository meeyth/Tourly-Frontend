import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Add_Post = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // ---------------- PICK IMAGES ----------------
  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission required", "Gallery access needed");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets?.length) {
        setImages(result.assets);
      }
    } catch (error) {
      console.log("Image picker error:", error);
      Alert.alert("Error", "Could not open image picker");
    }
  };

  // ---------------- SUBMIT POST ----------------
  const handleSubmit = async () => {
  if (!title || !city || !country || images.length === 0) {
    return Alert.alert("Error", "All fields & images required");
  }

  try {
    setLoading(true);

    const token = await AsyncStorage.getItem("accessToken");

    if (!token) {
      Alert.alert("Auth error", "Token missing, please login again");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location[city]", city);
    formData.append("location[country]", country);

    images.forEach((img, index) => {
      formData.append("images", {
        uri: img.uri,
        name: `post_${index}.jpg`,
        type: "image/jpeg",
      });
    });

    const response = await fetch(
      "https://tourly-backend-3fa2.onrender.com/api/v1/posts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    );

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || "Upload failed");
    }

    Alert.alert("Success", "Post created!");

    // ------------------- RESET FORM -------------------
    setTitle("");
    setDescription("");
    setCity("");
    setCountry("");
    setImages([]);

    // optionally navigate back
    router.back();

  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    Alert.alert("Upload Error", error.message);
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
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text className="text-2xl font-bold text-center mb-6">
            Add New Post
          </Text>

          <TextInput
            className="bg-white p-3 rounded-xl border border-white mb-4"
            placeholder="Post Title"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            className="bg-white p-3 rounded-xl border border-white mb-4 h-28"
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <TextInput
            className="bg-white p-3 rounded-xl border border-white mb-4"
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />

          <TextInput
            className="bg-white p-3 rounded-xl border border-white mb-4"
            placeholder="Country"
            value={country}
            onChangeText={setCountry}
          />

          <TouchableOpacity
            className="bg-blue-600 p-3 rounded-xl items-center mb-4"
            onPress={pickImage}
          >
            <Text className="text-white font-semibold">
              {images.length ? "Change Images" : "Upload Images"}
            </Text>
          </TouchableOpacity>

          {images.map((img, idx) => (
            <Image
              key={idx}
              source={{ uri: img.uri }}
              className="w-full h-52 rounded-xl mb-4"
            />
          ))}

          <TouchableOpacity
            className={`p-4 rounded-xl items-center ${
              loading ? "bg-gray-400" : "bg-green-600"
            }`}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text className="text-white font-bold text-lg">
              {loading ? "Uploading..." : "Submit Post"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Add_Post;
