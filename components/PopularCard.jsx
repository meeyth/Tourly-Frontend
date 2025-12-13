import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PopularCard = ({ data }) => {
  const [posts, setPosts] = useState(data);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setPosts(data);
  }, [data]);

  // Get current user ID
  useEffect(() => {
    AsyncStorage.getItem("userId").then(id => {
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
      if (!res.ok) throw new Error(json.message || "Like failed");

      setPosts(prev =>
        prev.map(post => post._id === postId ? json.data : post)
      );

    } catch (err) {
      console.log("Like error:", err.message);
    }
  };

  if (!posts || posts.length === 0) {
    return <Text className="text-center text-gray-400 py-5">No posts available</Text>;
  }

  return (
    <View>
      {posts.map(post => {
        const normalizedUserId = userId ? String(userId).replace(/"/g, "") : null;
        const isLiked = !!normalizedUserId && post.likes?.some(like =>
          (typeof like === "object" ? String(like._id) : String(like)) === normalizedUserId
        );

        return (
          <View key={post._id} className="mb-5 bg-white rounded-2xl p-3">
            <Image
              source={{ uri: post.images[0] }}
              className="w-full h-52 rounded-xl"
            />

            <View className="flex-row justify-between items-center mt-3">
              <View>
                <Text className="font-bold text-lg">{post.title}</Text>
                <Text className="text-gray-500 text-sm">
                  {post.location.city}, {post.location.country}
                </Text>
              </View>

              <TouchableOpacity onPress={() => handleLike(post._id)}>
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={26}
                  color={isLiked ? "#ef4444" : "#555"}
                />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-500 mt-1">
              {post.likes?.length || 0} likes
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default PopularCard;
