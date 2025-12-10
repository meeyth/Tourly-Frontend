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

const CLOUD_NAME = "YOUR_CLOUD_NAME";
const UPLOAD_PRESET = "YOUR_UPLOAD_PRESET";

const Add_Post = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Cloudinary Upload
  const uploadToCloudinary = async (localUri) => {
    const data = new FormData();
    data.append("file", {
      uri: localUri,
      type: "image/jpeg",
      name: "upload.jpg",
    });
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );

    const uploadData = await res.json();
    return uploadData.secure_url;
  };

  // Submit Post
  const handleSubmit = async () => {
    if (!title || !city || !country) {
      return Alert.alert("Missing Fields", "Please fill all required fields.");
    }

    try {
      setLoading(true);

      let uploadedImageUrl = null;
      if (image) uploadedImageUrl = await uploadToCloudinary(image);

      const token = await AsyncStorage.getItem("authToken");

      const postData = {
        title,
        description,
        location: { city, country },
        images: uploadedImageUrl ? [uploadedImageUrl] : [],
      };

      const response = await fetch("https://tourly-backend-3fa2.onrender.com/api/v1/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json);
        Alert.alert("Error", json.message || "Failed to create post");
        return;
      }

      Alert.alert("Success", "Post created successfully!");

      setTitle("");
      setDescription("");
      setCity("");
      setCountry("");
      setImage(null);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
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
          <Text className="text-2xl font-bold text-center mb-5">
            Add New Post
          </Text>

          <TextInput
            className="bg-white p-3 rounded-xl border border-gray-300 mb-4"
            placeholder="Post Title"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            className="bg-white p-3 rounded-xl border border-gray-300 mb-4 h-28"
            placeholder="Description"
            multiline
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />

          <Text className="text-lg font-semibold mt-2 mb-2">Location</Text>

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

          <TouchableOpacity
            className="bg-blue-600 p-3 rounded-xl items-center mb-4"
            onPress={pickImage}
          >
            <Text className="text-white font-semibold">
              {image ? "Change Image" : "Select an Image"}
            </Text>
          </TouchableOpacity>

          {image && (
            <Image
              source={{ uri: image }}
              className="w-full h-52 rounded-xl mb-4"
            />
          )}

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
