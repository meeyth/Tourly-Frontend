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
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Add_Post = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [images, setImages] = useState([]); // ✅ array
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Pick Image(s)
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Gallery access needed");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // replace current images with selected ones
      setImages(result.assets);
    }
  };

  const removeImage = (index) => {
    if (!Array.isArray(images)) return;
    setImages((prev) => prev.filter((_, i) => i !== index));
  };




  // Submit Post
  const handleSubmit = async () => {
    if (!title || !city || !country || !Array.isArray(images) || images.length === 0) {
      return Alert.alert("Error", "All fields and at least one image required");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);

      // ✅ backend expects location object
      formData.append("location[city]", city);
      formData.append("location[country]", country);

      // ✅ images[] for multer.array("images")
      images.forEach((img, index) => {
        formData.append("images", {
          uri: img.uri,
          name: `post_${index}.jpg`,
          type: "image/jpeg",
        });
      });

      const token = await AsyncStorage.getItem("accessToken");

      const response = await fetch(
        "https://tourly-backend-3fa2.onrender.com/api/v1/posts",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // DO NOT SET Content-Type
          },
          body: formData,
        }
      );

      const text = await response.text();
      const data = JSON.parse(text);

      if (!response.ok) {
        return Alert.alert("Error", data.message || "Upload failed");
      }

      Alert.alert("Success", "Post created successfully!");
      router.back();

      // reset
      setTitle("");
      setDescription("");
      setCity("");
      setCountry("");
      setImages([]);
    } catch (err) {
      console.log("Upload error:", err);
      Alert.alert("Error", err.message || "Something went wrong");
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

          <Text className="text-2xl font-bold text-center mb-6">
            Add New Post
          </Text>

          <TextInput
            className="bg-white p-3 rounded-xl border mb-4"
            placeholder="Post Title"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            className="bg-white p-3 rounded-xl border mb-4 h-28"
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <TextInput
            className="bg-white p-3 rounded-xl border mb-4"
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />

          <TextInput
            className="bg-white p-3 rounded-xl border mb-4"
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

          {Array.isArray(images) && images.map((img, idx) => (
            <View key={idx} className="mb-4 relative">
              <Image
                source={{ uri: img.uri }}
                className="w-full h-52 rounded-xl"
              />
              <TouchableOpacity
                className="absolute top-2 right-2 bg-white p-1 rounded-full"
                onPress={() => removeImage(idx)}
                activeOpacity={0.8}
              >
                <MaterialIcons name="close" size={22} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))}

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
