import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
const API_BASE_URL = "https://tourly-backend-3fa2.onrender.com/api/v1";
const explore = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/posts`);
      const json = await res.json();
      setPosts(json?.data || []);
    } catch (err) {
      console.log("Explore error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(search.toLowerCase()) ||
    post.location?.city?.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      className="flex-1 aspect-square m-[1px]"
      onPress={() =>
        router.push({
          pathname: `/post/${item._id}`,
          params: { post: JSON.stringify(item) },
        })
      }
    >
      <Image
        source={{ uri: item.images?.[0] }}
        className="w-full h-full"
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#acd9f6", "#ffffff"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 0.35 }}
      style={styles.container}
    >
      <SafeAreaView className="flex-1 w-full">
        <View className="px-4 pt-5 pb-3">
          <Text className="text-2xl font-extrabold text-slate-900">
            Explore
          </Text>
          <View className="flex-row items-center bg-white rounded-xl mt-3 px-3 py-2 border border-slate-200">
            <Ionicons name="search" size={18} color="#888" />
            <TextInput
              placeholder="Search destinations"
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#999"
              className="flex-1 ml-2 text-sm"
            />
          </View>
        </View>
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#1E90FF" />
          </View>
        ) : (
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
