import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";

const destinations = [
  { id: "1", name: "Kolkata", image: "https://t4.ftcdn.net/jpg/06/47/65/23/360_F_647652348_2K9xCHSncQ9x3wI1C2cQWW319FcsVJIA.jpg" },
  { id: "2", name: "Mumbai", image: "https://greatruns.com/wp-content/uploads/2017/04/mumbai-cover.jpeg" },
  { id: "3", name: "Bangaluru", image: "https://www.tripsavvy.com/thmb/QS7YoZPIIgBNklph1Cjeq3mDgUk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-536116268-5b5d74e846e0fb0050adcf3b.jpg" },
  { id: "4", name: "Delhi", image: "https://delhitourism.gov.in/dt/images/About_Img.jpg" },
  { id: "5", name: "Ahmedabad", image: "https://images.pexels.com/photos/2409361/pexels-photo-2409361.jpeg" },
];

export default function StyleCard() {
  return (
    <View className="w-[90%] mx-auto">
      <View className="h-28 justify-center">
        <FlatList
        contentContainerClassName="flex gap-5"
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          data={destinations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity className="items-center">
              <View className="bg-white w-[24vw] h-[20vw] rounded-xl overflow-hidden shadow">
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-full rounded-xl"
                  resizeMode="cover"
                />
              </View>
              <Text className="mt-1 text-xs">{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}


