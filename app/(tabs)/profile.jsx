import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://YOUR_BACKEND_IP:PORT/api/v1/user/profile";

export default function Profile() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");

      const res = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();

      if (json?.data) {
        setProfile(json.data.profile);
        setPosts(json.data.posts);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#acd9f6", "#ffffff"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 0.35 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-5 pt-6 flex-row justify-between items-center">
          <Text className="text-2xl font-extrabold text-slate-900">
            Profile
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/profile/edit")}
            className="bg-[#82c5fb] px-4 py-2 rounded-full"
          >
            <Text className="text-white font-semibold">Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View className="items-center mt-6">
          <Image
            source={{ uri: profile?.avatar }}
            className="w-28 h-28 rounded-full border-4 border-white"
          />

          <Text className="mt-3 text-lg font-bold text-slate-900">
            {profile?.username}
          </Text>

          <Text className="mt-2 text-slate-700 font-medium">
            {posts.length} Posts
          </Text>
        </View>

        {/* Posts Grid */}
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120, marginTop: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: `/post/${item._id}`,
                  params: { post: JSON.stringify(item) },
                })
              }
              className="flex-1 aspect-square m-[1px]"
            >
              <Image
                source={{ uri: item.images[0] }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
