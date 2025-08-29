import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Touchable } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For heart icon

const destinations = [
  {
    id: "1",
    name: "Gujarat",
    image: "https://media.istockphoto.com/id/1488633267/photo/light-and-sound-show-at-worlds-tallest-statue-known-as-statue-of-unity-with-beautiful-sunset.jpg?s=612x612&w=0&k=20&c=6mPvCJyTyKWzyP88H2hRtxy3awk5XImGoUaHHbRh_hQ=",
    rating: 4.5,
    reviews: "3k",
  },
  {
    id: "2",
    name: "Rajasthan",
    image: "https://media.istockphoto.com/id/1398087835/photo/pink-palace-hawa-mahal-jaipur-india-beautiful-sunset-view.jpg?s=612x612&w=0&k=20&c=S8X6bk4Mdp0xu624dFZCHfobotdwdIp7K1FEQJV6hkI=",
    rating: 4.0,
    reviews: "3.8k",
  },
  {
    id: "3",
    name: "Hyderbad",
    image: "https://c.ndtvimg.com/2025-03/7ndi40jo_hyderabad-_625x300_11_March_25.jpg",
    rating: 4.7,
    reviews: "14.5k",
  },
];

export default function PopularDestinations() {
  return (
    <View className="mt-4">
      

    
      <FlatList
      className=""
        horizontal
        showsHorizontalScrollIndicator={false}
        data={destinations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity className="mr-4">
            <View className="relative">
  {/* Card Container */}
  <View className="bg-white rounded-2xl overflow-hidden w-40">
    <Image
      source={{ uri: item.image }}
      className="w-full h-28"
      resizeMode="cover"
    />

    
    <View className="absolute bottom-0 left-0 bg-white rounded-tr-lg rounded-bl-lg px-2 py-1 flex-row items-center">
      <Ionicons name="star" size={14} color="#FFD700" />
      <Text className="text-xs font-semibold ml-1">{item.rating}</Text>
      <Text className="text-[10px] text-gray-500 ml-1">
        ({item.reviews})
      </Text>
    </View>
  </View>

  
  <TouchableOpacity className="absolute top-0 right-0 w-8 h-8 rounded-tr-lg rounded-bl-lg bg-white items-center justify-center ">
    <Ionicons name="heart" size={19} color="red" />
  </TouchableOpacity>
</View>


           
            <Text className="mt-2 text-sm font-medium">
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
}


