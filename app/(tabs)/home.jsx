import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import images from "@/constants/images";
import icons from "@/constants/icons";
import StyleCard from "../../components/StyleCard";
import PopularCard from "../../components/PopularCard";
import ExploreCard from "../../components/ExploreCard";
import { fetchHomeData, fetchAllPosts } from "@/services/home.service";

const PROFILE_API = "https://tourly-backend-3fa2.onrender.com/api/v1/users/profile";

const Home = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [mostLiked, setMostLiked] = useState([]);
  const [recent, setRecent] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState(null); // ✅ Profile state

  const router = useRouter();

  const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const loadHomeData = async () => {
    try {
      setLoading(true);

      // Fetch profile
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        const res = await fetch(PROFILE_API, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json?.data?.profile) setProfile(json.data.profile);
      }

      // Fetch posts
      const data = await fetchHomeData();
      setMostLiked(data.mostLiked || []);
      setRecent(data.recent || []);

      const posts = await fetchAllPosts();
      setAllPosts(shuffleArray(posts));
    } catch (error) {
      console.log("Home API error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadHomeData();
  }, []);

  // Filter posts
  const filterPosts = (posts) =>
    posts.filter(
      (post) =>
        post.title?.toLowerCase().includes(search.toLowerCase()) ||
        post.location?.city?.toLowerCase().includes(search.toLowerCase())
    );

  const filteredMostLiked = filterPosts(mostLiked);
  const filteredRecent = filterPosts(recent);

  const showMostLiked = selectedFilter === "all" || selectedFilter === "mostLiked";
  const showRecent = selectedFilter === "all" || selectedFilter === "recent";

  if (loading && !refreshing) {
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#1E90FF"
              colors={["#1E90FF"]}
            />
          }
        >
          {/* ===== HEADER ===== */}
          <View className="px-5 mt-5 flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.push("/profile")}>
              <Image
                source={{
                  uri:
                    profile?.avatar ||
                    "https://ui-avatars.com/api/?name=User", // fallback
                }}
                className="w-12 h-12 rounded-full border-2 border-white"
              />
            </TouchableOpacity>

            <View className="items-center">
              <Text className="text-sm">My Location</Text>
              <Text className="text-lg font-semibold">
                <Entypo name="location-pin" size={16} color="#1E90FF" /> India
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/wishlist")}
              className="bg-white w-12 h-12 rounded-full items-center justify-center"
            >
              <Ionicons name="heart-outline" size={20} />
            </TouchableOpacity>
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

            <View className="flex-row items-center bg-white rounded-md mt-4 px-3 h-12">
              <Ionicons name="search" size={20} color="#888" />
              <TextInput
                placeholder="Where would you like to go?"
                placeholderTextColor="#888"
                value={search}
                onChangeText={setSearch}
                className="flex-1 px-2 text-sm"
              />
            </View>

            {/* ===== FILTER TABS ===== */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
              {[
                { key: "all", label: "All" },
                { key: "mostLiked", label: "Most Liked" },
                { key: "recent", label: "Recently Added" },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => setSelectedFilter(item.key)}
                  className={`px-4 py-2 mr-3 rounded-full ${
                    selectedFilter === item.key ? "bg-[#2271ac]" : "bg-[#69b3e3]"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold text-white ${
                      selectedFilter === item.key ? "font-bold" : ""
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ===== MOST LIKED, RECENT, EXPLORE (same as before) ===== */}
          {showMostLiked && (
            <>
              <View className="flex-row justify-between items-center w-[90%] mx-auto mt-8 mb-4">
                <Text className="text-xl font-bold">
                  Most Liked <FontAwesome6 name="mountain-sun" size={18} />
                </Text>
                <Entypo name="dots-three-horizontal" size={22} color="grey" />
              </View>
              <StyleCard data={filteredMostLiked} horizontal={selectedFilter !== "mostLiked"} />
            </>
          )}

          {showRecent && (
            <>
              <View className="flex-row justify-between items-center w-[90%] mx-auto mt-8 mb-4">
                <Text className="text-xl font-bold">
                  Recently Added <Entypo name="location" size={18} />
                </Text>
                <Entypo name="dots-three-horizontal" size={22} color="grey" />
              </View>
              <PopularCard data={filteredRecent} horizontal={selectedFilter === "all"} />
            </>
          )}

          {selectedFilter === "all" && (
            <>
              <View className="flex-row justify-between items-center w-[90%] mx-auto mt-8 mb-4">
                <Text className="text-xl font-bold">
                  Explore <Ionicons name="compass-outline" size={18} />
                </Text>
              </View>
              <ExploreCard data={allPosts} />
            </>
          )}
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
