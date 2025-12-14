import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function StyleCard({ data = [], horizontal = true }) {
  const router = useRouter();
  const [posts, setPosts] = useState(data);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setPosts(data);
  }, [data]);

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

  const handleLike = async (postId) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return;

      const res = await fetch(
        `https://tourly-backend-3fa2.onrender.com/api/v1/posts/${postId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? json.data : p))
      );
    } catch (err) {
      console.log("Like error:", err.message);
    }
  };

  const renderItem = ({ item }) => {
    const normalizedUserId = userId
      ? String(userId).replace(/"/g, "")
      : null;

    const isLiked =
      !!normalizedUserId &&
      item.likes?.some((like) =>
        (typeof like === "object"
          ? String(like._id)
          : String(like)) === normalizedUserId
      );

    return (
      <View
        className={`bg-white rounded-2xl p-3 ${
          horizontal ? "mr-4 w-[43vw]" : "mb-5"
        }`}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: `/post/${item._id}`,
              params: { post: JSON.stringify(item) },
            })
          }
        >
          <Image
            source={{ uri: item.images?.[0] }}
            className={`w-full ${
              horizontal ? "h-40" : "h-52"
            } rounded-xl`}
          />

          <View className="mt-2">
            <Text className="font-semibold text-base">
              {item.title}
            </Text>
            <Text className="text-gray-500 text-sm">
              {item.location?.city}, {item.location?.country}
            </Text>
          </View>
        </TouchableOpacity>

        {/* LIKE ROW */}
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-gray-500 text-sm">
            {item.likes?.length || 0} likes
          </Text>

          <TouchableOpacity onPress={() => handleLike(item._id)}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={22}
              color={isLiked ? "#ef4444" : "#555"}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Vertical (no FlatList to avoid nesting issue)
  if (!horizontal) {
    return (
      <View className="w-[90%] mx-auto">
        {posts.map((item) => (
          <View key={item._id}>{renderItem({ item })}</View>
        ))}
      </View>
    );
  }

  // Horizontal FlatList
  return (
    <View className="w-[90%] mx-auto">
      <FlatList
        data={posts}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
}
