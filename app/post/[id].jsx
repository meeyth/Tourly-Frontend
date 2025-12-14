import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function PostDetails() {
  const router = useRouter();
  const { post } = useLocalSearchParams();

  if (!post) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text>Post not found</Text>
      </SafeAreaView>
    );
  }

  const parsedPost = JSON.parse(post);

  const [viewerVisible, setViewerVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openViewer = (index) => {
    setActiveIndex(index);
    setViewerVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ===== USER INFO (TOP) ===== */}
        <View className="flex-row items-center px-5 py-4">
          <TouchableOpacity className="flex-row items-center">
            <Image
              source={{
                uri:
                  parsedPost.createdBy?.avatar ||
                  "https://ui-avatars.com/api/?name=User",
              }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View>
              <Text className="font-semibold text-base text-slate-900">
                {parsedPost.createdBy?.username || "Unknown User"}
              </Text>
              <Text className="text-xs text-slate-500">
                Post creator
              </Text>
            </View>
          </TouchableOpacity>
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

          {/* TITLE */}
          <Text className="text-2xl font-extrabold text-slate-900">
            {parsedPost.title}
          </Text>

          {/* LOCATION */}
          <View className="flex-row items-center mt-2">
            <Ionicons name="location-outline" size={16} color="#3b82f6" />
            <Text className="ml-1 text-slate-600">
              {parsedPost.location?.city}, {parsedPost.location?.country}
            </Text>
          </View>

          {/* LIKES */}
          <View className="flex-row items-center mt-2">
            <Ionicons name="heart" size={16} color="#ef4444" />
            <Text className="ml-1 text-slate-600">
              {parsedPost.likes?.length || 0} likes
            </Text>
          </View>

          <View className="h-[1px] bg-slate-200 my-5" />

          {/* DESCRIPTION */}
          <Text className="text-lg font-bold text-slate-900 mb-1">
            Description
          </Text>
          <Text className="text-slate-700 leading-6">
            {parsedPost.description || "No description available."}
          </Text>

          {/* MORE PHOTOS */}
          {parsedPost.images?.length > 1 && (
            <View className="mt-6">
              <Text className="text-lg font-bold text-slate-900 mb-3">
                More Photos
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
              >
                {parsedPost.images.slice(1).map((img, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.85}
                    onPress={() => openViewer(index + 1)}
                  >
                    <Image
                      source={{ uri: img }}
                      className="w-44 h-32 rounded-xl mr-4"
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* BACK BUTTON */}
      <View className="px-5 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-[#82c5fb] rounded-full py-4 items-center"
        >
          <Text className="text-white font-bold text-lg">Back</Text>
        </TouchableOpacity>
      </View>

      {/* IMAGE VIEWER */}
      <Modal visible={viewerVisible} transparent animationType="fade">
        <View className="flex-1 bg-black">
          <TouchableOpacity
            onPress={() => setViewerVisible(false)}
            className="absolute top-12 right-6 z-10"
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: activeIndex * width, y: 0 }}
          >
            {parsedPost.images.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={{ width, height }}
                resizeMode="contain"
              />
            ))}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
