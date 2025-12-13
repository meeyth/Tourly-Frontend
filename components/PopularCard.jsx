import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Touchable } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For heart icon

export default function PopularCard({ data = [] }) {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity className="mr-4">
          <View className="bg-white rounded-2xl overflow-hidden w-40">
            <Image
              source={{ uri: item.images?.[0] }}
              className="w-full h-28"
            />

            <View className="absolute bottom-0 left-0 bg-white px-2 py-1 flex-row rounded-tr-md">
              <Text className="text-xs font-semibold ">
                ❤️ {item.likes.length}
              </Text>
            </View>
          </View>

          <Text className="mt-2 text-sm font-medium">
            {item.location?.city}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}



