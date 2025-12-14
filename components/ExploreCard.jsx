import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const ExploreCard = ({ data = [] }) => {
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

  // ❤️ LIKE / UNLIKE
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

      // update only the liked post
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? json.data : p))
      );
    } catch (err) {
      console.log("Like error:", err.message);
    }
  };

  return (
    <View className="w-[90%] mx-auto">
      {posts.map((item) => {
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
            key={item._id}
            className="bg-white rounded-2xl mb-6 overflow-hidden"
          >
            {/* 👤 USER HEADER */}
            <View className="flex-row items-center px-3 py-2">
              <Image
                source={{ uri: item.createdBy?.avatar }}
                className="w-10 h-10 rounded-full"
              />
              <View className="ml-3">
                <Text className="font-semibold text-sm">
                  {item.createdBy?.username}
                </Text>
                <Text className="text-xs text-gray-500">
                  {item.location?.city}, {item.location?.country}
                </Text>
              </View>
            </View>

            {/* 🖼 POST IMAGE */}
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
                className="w-full h-56"
              />
            </TouchableOpacity>

            {/* 📝 DESCRIPTION */}
            <View className="px-3 py-2">
              <Text className="font-semibold text-base">{item.title}</Text>
              {item.description ? (
                <Text className="text-gray-600 text-sm mt-1">
                  {item.description}
                </Text>
              ) : null}
            </View>

            {/* ❤️ LIKE ROW */}
            <View className="flex-row justify-between items-center px-3 pb-3">
              <Text className="text-gray-500 text-sm">
                {item.likes?.length || 0} likes
              </Text>

              <TouchableOpacity onPress={() => handleLike(item._id)}>
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={24}
                  color={isLiked ? "#ef4444" : "#555"}
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default ExploreCard;
