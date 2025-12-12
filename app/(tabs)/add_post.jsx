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
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Pick Image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]); // keep full object
    }
  };

  // Submit Post (FormData → Backend)
  const handleSubmit = async () => {
    if (!title || !city || !country || !image) {
      return Alert.alert("Error", "Please fill all fields and add image");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("city", city);
      formData.append("country", country);

      formData.append("image", {
        uri: image.uri,
        type: image.mimeType || "image/jpeg",
        name: image.fileName || "post.jpg",
      });

      const token = await AsyncStorage.getItem("accessToken");

      const response = await fetch(
        "https://tourly-backend-3fa2.onrender.com/api/v1/posts",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // ❗ DO NOT SET Content-Type manually → RN handles it
          },
          body: formData,
        }
      );

      // Read raw response text first (avoids 'Already read' errors),
      // then attempt to parse JSON. If parsing fails, keep the raw text.
      const rawText = await response.text();
      let data;
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch (parseErr) {
        console.log("Backend returned non-JSON response:", rawText);
        data = { message: rawText };
      }

      if (!response.ok) {
        console.log("Backend error (status:", response.status, "):", data);
        return Alert.alert("Error", data.message || "Something went wrong");
      }

      Alert.alert("Success", "Post created successfully!");
      router.back();

      // reset
      setTitle("");
      setDescription("");
      setCity("");
      setCountry("");
      setImage(null);
    } catch (err) {
      console.log("Upload error:", err);
      Alert.alert("Error", err.message || "Upload failed");
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
      <SafeAreaView className="flex-1 w-full">
        <ScrollView contentContainerStyle={{ padding: 20 }}>

          <Text className="text-2xl font-bold text-center mb-6">Add New Post</Text>

          <TextInput
            className="bg-white p-3 rounded-xl border border-gray-300 mb-4"
            placeholder="Post Title"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            className="bg-white p-3 rounded-xl border border-gray-300 mb-4 h-28"
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          <TextInput
            className="bg-white p-3 rounded-xl border border-gray-300 mb-4"
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />

          <TextInput
            className="bg-white p-3 rounded-xl border border-gray-300 mb-4"
            placeholder="Country"
            value={country}
            onChangeText={setCountry}
          />

          {/* Image Upload Button */}
          <TouchableOpacity
            className="bg-blue-600 p-3 rounded-xl items-center mb-4"
            onPress={pickImage}
          >
            <Text className="text-white font-semibold">
              {image ? "Change Image" : "Upload Image"}
            </Text>
          </TouchableOpacity>

          {image && (
            <Image
              source={{ uri: image.uri }}
              className="w-full h-52 rounded-xl mb-4"
            />
          )}

          {/* Submit */}
          <TouchableOpacity
            className="bg-green-600 p-4 rounded-xl items-center"
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
