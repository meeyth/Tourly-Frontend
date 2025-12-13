import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { toggleLikePost } from "@/services/post.service";

export default function PopularCard({ data = [] }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(data);
  }, [data]);

  const handleLike = async (postId) => {
  try {
    const updatedPost = await toggleLikePost(postId);

    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId ? updatedPost : post
      )
    );
  } catch (error) {
    console.log("Like error:", error.message);
  }
};


  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={posts}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      renderItem={({ item }) => {
        const liked =
          item.likes?.length > 0 &&
          item.likes.some((l) => l === "temp" || l?._id);

        return (
          <View className="mr-4">
            <View className="bg-white rounded-2xl overflow-hidden w-40">
              <Image
                source={{ uri: item.images?.[0] }}
                className="w-full h-28"
              />

              {/* ❤️ LIKE BUTTON */}
              <TouchableOpacity
                className="absolute top-2 right-2 bg-white p-1 rounded-full"
                onPress={() => handleLike(item._id)}
              >
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={20}
                  color="red"
                />
              </TouchableOpacity>

              {/* ❤️ LIKE COUNT */}
              <View className="absolute bottom-0 left-0 bg-white px-2 py-1 rounded-tr-lg">
                <Text className="text-xs font-semibold">
                  ❤️ {item.likes.length}
                </Text>
              </View>
            </View>

            <Text className="mt-2 text-sm font-medium">
              {item.location?.city}
            </Text>
          </View>
        );
      }}
    />
  );
}
