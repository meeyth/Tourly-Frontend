import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const USER = {
  username: "John Doe",
  email: "johndoe@gmail.com",
  profilePic: "https://i.pravatar.cc/300?img=12",
};

const USER_POSTS = [
  {
    _id: "1",
    title: "Sunrise at Munnar",
    images: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"],
    description: "A beautiful sunrise in the hills.",
    location: { city: "Munnar", country: "India" },
    likes: [],
  },
  {
    _id: "2",
    title: "Goa Beach",
    images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e"],
    description: "Relaxing beach vibes.",
    location: { city: "Goa", country: "India" },
    likes: [],
  },
  {
    _id: "3",
    title: "Manali Snow",
    images: ["https://images.unsplash.com/photo-1518684079-3c830dcef090"],
    description: "Snowy mountains and chill weather.",
    location: { city: "Manali", country: "India" },
    likes: [],
  },
];

export default function Profile() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#acd9f6", "#ffffff"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 0.35 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">

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
        <View className="items-center mt-6">
          <Image
            source={{ uri: USER.profilePic }}
            className="w-28 h-28 rounded-full border-4 border-white"
          />

          <Text className="mt-3 text-lg font-bold text-slate-900">
            {USER.username}
          </Text>

          <Text className="text-slate-500">
            {USER.email}
          </Text>

          <Text className="mt-2 text-slate-700 font-medium">
            {USER_POSTS.length} Posts
          </Text>
        </View>
        <FlatList
          data={USER_POSTS}
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
