import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function StyleCard({ data = [] }) {
  const router = useRouter();

  return (
    <View className="w-[90%] mx-auto">
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="items-center mr-4"
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: `/post/${item._id}`,
                params: {
                  post: JSON.stringify(item),
                },
              })
            }
          >
            <View className="bg-white w-[15vw] h-[20vw] rounded-xl overflow-hidden">
              <Image
                source={{ uri: item.images?.[0] }}
                className="w-full h-full"
              />
            </View>
            <Text className="mt-1 text-xs">
              {item.location?.city}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
