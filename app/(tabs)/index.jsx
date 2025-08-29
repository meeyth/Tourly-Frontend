import {
  Dimensions,
  Image,
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import { LinearGradient } from "expo-linear-gradient";
import icons from "@/constants/icons";
import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome6
} from "@expo/vector-icons";
import Filters from "../../components/Filters";
import StyleCard from "../../components/StyleCard";
import PopularCard from "../../components/PopularCard";


const index = () => {
  return (
    <LinearGradient
      colors={["#acd9f6", "#ffffff"]} // Blue to white
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 0.35 }}
      style={styles.container}
    >
      <SafeAreaView className="flex-1 w-full h-full">
        <View className="px-5">
          <View className="flex flex-row items-center justify-between mt-5">
            <View className="flex flex-row items-center">
              <TouchableOpacity>
                <Image
                  source={images.avatar}
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
              </TouchableOpacity>
            </View>
            <View className="flex flex-col items-center ml-2 justify-center">
              <Text className="text-sm ">My Location</Text>
              <View className="flex flex-col items-start ">
                <Text className="text-lg ">
                  <Entypo name="location-pin" size={16} color="#1E90FF" /> India
                </Text>
              </View>
            </View>
            <View className=" flex items-center bg-white w-12 h-12 rounded-full">
              <TouchableOpacity className="mt-3">
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="BLACK"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

       

         <View className="bg-[#87cefa] p-4 rounded-2xl w-[90%] h-[25%]  mt-10 max-w-md flex mx-auto ">
      
      <View className="flex-row justify-between items-center pr-5 pl-2">
        <View className=" items-center ">
          <Text className="text-white text-5xl font-bold">32°</Text>
          <Text className="text-white text-sm">Clear Cloud</Text>
        </View>
        <Image source={icons.cloudSun} className="w-16 h-10 items-center" />
      </View>

      
      <View className="flex-row items-center bg-white rounded-md mt-4 pl-3 pr-1 h-[25%] ">
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          placeholder="Where would you like to go?"
          placeholderTextColor="#888"
          className="flex-1 px-2 py-2 text-sm"
        />
        <TouchableOpacity className="p-2 bg-[#d6f0ff] rounded-md">
          <Ionicons name="filter-outline" size={18} color="#3b82f6" />
        </TouchableOpacity>
      </View>
      <Filters/>
    </View>
    

   <View className="flex flex-row items-center justify-between w-[90%] mx-auto m-5">
            <View><Text className="text-xl font-bold ">Browser by activity <FontAwesome6 name="mountain-sun" size={18} color="black" /></Text>
            </View>
            <TouchableOpacity>
               <Entypo name="dots-three-horizontal" size={24} color="grey" />
            </TouchableOpacity>
          </View>
    <StyleCard/>
       <View className="flex flex-row items-center justify-between w-[90%] mx-auto m-5">
            <View><Text className="text-xl font-bold ">Popular Destination <Entypo name="location" size={18} color="black" /></Text>
            </View>
            <TouchableOpacity>
               <Entypo name="dots-three-horizontal" size={24} color="grey" />
            </TouchableOpacity>
          </View>
          <PopularCard/>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Full screen
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});
