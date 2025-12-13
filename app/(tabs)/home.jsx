import {
  Image,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Entypo,
  Ionicons,
  FontAwesome6,
} from "@expo/vector-icons";

import images from "@/constants/images";
import icons from "@/constants/icons";
import Filters from "../../components/Filters";
import StyleCard from "../../components/StyleCard";
import PopularCard from "../../components/PopularCard";
import { fetchHomeData } from "@/services/home.service";

const Home = () => {
  const [mostLiked, setMostLiked] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const data = await fetchHomeData();
        setMostLiked(data.mostLiked || []);
        setRecent(data.recent || []);
      } catch (error) {
        console.log("Home API error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
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
      style={styles.container}
    >
      <SafeAreaView className="flex-1 w-full">
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* ===== HEADER ===== */}
          <View className="px-5 mt-5 flex-row items-center justify-between">
            <TouchableOpacity>
              <Image
                source={images.avatar}
                className="w-12 h-12 rounded-full border-2 border-white"
              />
            </TouchableOpacity>

            <View className="items-center">
              <Text className="text-sm">My Location</Text>
              <Text className="text-lg font-semibold">
                <Entypo name="location-pin" size={16} color="#1E90FF" /> India
              </Text>
            </View>

            <View className="bg-white w-12 h-12 rounded-full items-center justify-center">
              <Ionicons name="notifications-outline" size={20} />
            </View>
          </View>

          {/* ===== SEARCH CARD ===== */}
          <View className="bg-[#87cefa] p-4 rounded-2xl w-[90%] mt-10 mx-auto">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-white text-5xl font-bold">32°</Text>
                <Text className="text-white text-sm">Clear Cloud</Text>
              </View>
              <Image source={icons.cloudSun} className="w-16 h-10" />
            </View>

            <View className="flex-row items-center bg-white rounded-md mt-4 px-3">
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

            <Filters />
          </View>

          {/* ===== MOST LIKED ===== */}
          <View className="flex-row justify-between items-center w-[90%] mx-auto mt-8 mb-4">
            <Text className="text-xl font-bold">
              Most Liked <FontAwesome6 name="mountain-sun" size={18} />
            </Text>
            <Entypo name="dots-three-horizontal" size={22} color="grey" />
          </View>

          <StyleCard data={mostLiked} />

          {/* ===== RECENT POSTS ===== */}
          <View className="flex-row justify-between items-center w-[90%] mx-auto mt-8 mb-4">
            <Text className="text-xl font-bold">
              Recently Added <Entypo name="location" size={18} />
            </Text>
            <Entypo name="dots-three-horizontal" size={22} color="grey" />
          </View>

          <PopularCard data={recent} />

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
