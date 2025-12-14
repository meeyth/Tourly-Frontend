import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const API_BASE_URL = "https://tourly-backend-3fa2.onrender.com/api/v1";
const TOKEN_KEY = "accessToken";

const Wishlist = () => {
  const router = useRouter();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWishlist = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const res = await fetch(`${API_BASE_URL}/wishlist/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWishlist(data?.data?.posts || []);
    } catch (error) {
      console.log("Wishlist fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (postId) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      await fetch(`${API_BASE_URL}/wishlist/remove/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => prev.filter((item) => item._id !== postId));
    } catch (error) {
      console.log("Remove wishlist error:", error);
    }
  };

  const clearWishlist = () => {
    Alert.alert("Clear Wishlist?", "This will remove all saved posts.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            await fetch(`${API_BASE_URL}/wishlist/clear`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            setWishlist([]);
          } catch (error) {
            console.log("Clear wishlist error:", error);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View className="flex-row bg-white rounded-xl shadow-md mb-3 items-center overflow-hidden">
      <TouchableOpacity
        activeOpacity={0.85}
        className="flex-row flex-1 items-center"
        onPress={() =>
          router.push({
            pathname: `/post/${item._id}`,
            params: {
              post: JSON.stringify(item),
            },
          })
        }
      >
        <View className="flex-1 px-4 py-3">
          <Text className="text-[15px] font-semibold text-slate-900">
            {item.title}
          </Text>
          <Text className="text-[13px] text-slate-500 mt-1">
            {item.location?.city}, {item.location?.country}
          </Text>
        </View>
        {item.images?.[0] && (
          <Image
            source={{ uri: item.images[0] }}
            className="w-16 h-16 rounded-lg mr-2"
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => removeFromWishlist(item._id)}
        className="p-3"
      >
        <MaterialIcons name="close" size={22} color="#1E90FF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={["#acd9f6", "#ffffff"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 0.35 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 w-full">
        {loading && !refreshing ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#1E90FF" />
          </View>
        ) : (
          <FlatList
            data={wishlist}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#1E90FF"
                colors={["#1E90FF"]}
              />
            }
            ListHeaderComponent={() => (
              <View className="flex-row px-4 pt-4 items-center justify-between">
                <Text className="text-2xl font-extrabold text-slate-900">
                  Wishlist
                </Text>
                {wishlist.length > 0 && (
                  <TouchableOpacity onPress={clearWishlist}>
                    <Text className="text-blue-500 font-semibold">
                      Clear
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            ListEmptyComponent={() => (
              <View className="items-center mt-20 px-8">
                <Text className="text-slate-700 text-[15px] text-center">
                  Your wishlist is empty. Start saving posts you love ❤️
                </Text>
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};
export default Wishlist;
