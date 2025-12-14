import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function PostDetails() {
  const router = useRouter();
  const { post } = useLocalSearchParams();

  // ------------------ Hooks ------------------
  const [userId, setUserId] = useState(null);
  const [parsedPost, setParsedPost] = useState(null);
  const [likes, setLikes] = useState([]);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // ------------------ Load User ID ------------------
  useEffect(() => {
    AsyncStorage.getItem("userId").then((id) => {
      if (!id) return;
      try {
        setUserId(JSON.parse(id));
      } catch {
        setUserId(id);
      }
    });
  }, []);

  // ------------------ Parse Post ------------------
  useEffect(() => {
    if (post) {
      const postData = JSON.parse(post);
      setParsedPost(postData);
      setLikes(postData.likes || []);
    }
  }, [post]);

  if (!parsedPost) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text>Post not found</Text>
      </SafeAreaView>
    );
  }

  const isOwner =
    userId &&
    parsedPost.createdBy &&
    String(parsedPost.createdBy._id) === String(userId);

  const openViewer = (index) => {
    setActiveIndex(index);
    setViewerVisible(true);
  };

  // ------------------ Like Button ------------------
  const handleLike = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return;

      const res = await fetch(
        `https://tourly-backend-3fa2.onrender.com/api/v1/posts/${parsedPost._id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      // Update local likes
      setLikes(json.data.likes || []);
    } catch (err) {
      Alert.alert("Error", err.message || "Like failed");
    }
  };

  const normalizedUserId = userId ? String(userId).replace(/"/g, "") : null;
  const isLiked =
    !!normalizedUserId &&
    likes.some((like) =>
      typeof like === "object" ? String(like._id) === normalizedUserId : String(like) === normalizedUserId
    );

  // ------------------ Delete Post ------------------
  const handleDelete = async () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("accessToken");

            const res = await fetch(
              `https://tourly-backend-3fa2.onrender.com/api/v1/posts/${parsedPost._id}`,
              {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            const json = await res.json();
            if (!res.ok) throw new Error(json.message);

            Alert.alert("Success", "Post deleted successfully");
            router.back();
          } catch (error) {
            Alert.alert("Error", error.message || "Delete failed");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== USER INFO (TOP) ===== */}
        <View className="flex-row items-center justify-between px-5 py-4">
          <View className="flex-row items-center">
            <Image
              source={{
                uri: parsedPost.createdBy?.avatar || "https://ui-avatars.com/api/?name=User",
              }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View>
              <Text className="font-semibold text-base text-slate-900">
                {parsedPost.createdBy?.username || "Unknown User"}
              </Text>
              <Text className="text-xs text-slate-500">Post creator</Text>
            </View>
          </View>

          {/* ✏️ EDIT + 🗑 DELETE */}
          {isOwner && (
            <View className="flex-row m-1 items-center space-x-2">
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: `/post/edit/${parsedPost._id}`,
                    params: { post: JSON.stringify(parsedPost) },
                  })
                }
                className="bg-[#82c5fb] px-4 py-2 rounded-full mr-1"
              >
                <Text className="text-white font-semibold">Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                className="bg-red-500 px-4 py-2 rounded-full"
              >
                <Text className="text-white font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ===== POST IMAGE ===== */}
        <TouchableOpacity activeOpacity={0.9} onPress={() => openViewer(0)}>
          <Image
            source={{ uri: parsedPost.images?.[0] }}
            className="w-full h-[420px]"
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* ===== CONTENT ===== */}
        <View className="px-5 pt-5 pb-6">
          <Text className="text-2xl font-extrabold text-slate-900">{parsedPost.title}</Text>

          <View className="flex-row items-center mt-2">
            <Ionicons name="location-outline" size={16} color="#3b82f6" />
            <Text className="ml-1 text-slate-600">
              {parsedPost.location?.city}, {parsedPost.location?.country}
            </Text>
          </View>

          {/* LIKE ROW */}
          <View className="flex-row items-center mt-2">
            <TouchableOpacity onPress={handleLike} className="flex-row items-center">
              <Ionicons name={isLiked ? "heart" : "heart-outline"} size={20} color={isLiked ? "#ef4444" : "#555"} />
              <Text className="ml-1 text-slate-600">{likes.length || 0} likes</Text>
            </TouchableOpacity>
          </View>

          <View className="h-[1px] bg-slate-200 my-5" />

          <Text className="text-lg font-bold text-slate-900 mb-1">Description</Text>
          <Text className="text-slate-700 leading-6">{parsedPost.description || "No description available."}</Text>

          {/* MORE PHOTOS */}
          {parsedPost.images?.length > 1 && (
            <View className="mt-6">
              <Text className="text-lg font-bold text-slate-900 mb-3">More Photos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                {parsedPost.images.slice(1).map((img, index) => (
                  <TouchableOpacity key={index} activeOpacity={0.85} onPress={() => openViewer(index + 1)}>
                    <Image source={{ uri: img }} className="w-44 h-32 rounded-xl mr-4" resizeMode="cover" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* BACK BUTTON */}
      <View className="px-5 pb-4">
        <TouchableOpacity onPress={() => router.back()} className="bg-[#82c5fb] rounded-full py-4 items-center">
          <Text className="text-white font-bold text-lg">Back</Text>
        </TouchableOpacity>
      </View>

      {/* IMAGE VIEWER */}
      <Modal visible={viewerVisible} transparent animationType="fade">
        <View className="flex-1 bg-black">
          <TouchableOpacity onPress={() => setViewerVisible(false)} className="absolute top-12 right-6 z-10">
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>

          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentOffset={{ x: activeIndex * width, y: 0 }}>
            {parsedPost.images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={{ width, height }} resizeMode="contain" />
            ))}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
