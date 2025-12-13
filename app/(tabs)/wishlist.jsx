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

const API_BASE_URL = "https://tourly-backend-3fa2.onrender.com/api/v1";
const TOKEN_KEY = "accessToken";

const WishlistScreen = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* ---------------- FETCH WISHLIST ---------------- */
  const fetchWishlist = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      const res = await fetch(`${API_BASE_URL}/wishlist/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setWishlist(data?.data?.posts || []);
    } catch (error) {
      console.log("Wishlist fetch failed:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  /* ---------------- PULL TO REFRESH ---------------- */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWishlist();
  }, []);

  /* ---------------- REMOVE SINGLE POST ---------------- */
  const removeFromWishlist = async (postId) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      await fetch(`${API_BASE_URL}/wishlist/remove/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist((prev) => prev.filter((item) => item._id !== postId));
    } catch (error) {
      console.log("Remove wishlist failed:", error);
    }
  };

  /* ---------------- CLEAR WISHLIST ---------------- */
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
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            setWishlist([]);
          } catch (error) {
            console.log("Clear wishlist failed:", error);
          }
        },
      },
    ]);
  };

  /* ---------------- RENDER ITEM ---------------- */
  const renderItem = ({ item }) => (
    <View className="flex-row bg-white/70 border border-black/5 rounded-xl overflow-hidden mb-3">
      <Image
        source={{ uri: item?.images?.[0] }}
        className="w-[110px] h-[96px]"
        resizeMode="cover"
      />

      <View className="flex-1 px-3 py-2">
        <Text className="text-[16px] font-semibold text-slate-900">
          {item.title}
        </Text>
        <Text className="text-[13px] text-slate-600 mt-[2px]">
          {item.location?.city}, {item.location?.country}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => removeFromWishlist(item._id)}
        className="p-3 justify-center"
      >
        <MaterialIcons name="favorite" size={24} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  /* ---------------- UI ---------------- */
  return (
    <LinearGradient
      colors={["#acd9f6", "#ffffff"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 0.35 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 w-full">

        {/* FULL SCREEN LOADER (same as Home) */}
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
                tintColor="#1E90FF"        // iOS
                colors={["#1E90FF"]}       // Android
              />
            }
            ListHeaderComponent={() => (
              <View className="flex-row px-4 pt-4 items-center justify-between">
                <Text className="text-2xl font-extrabold text-slate-900">
                  Wishlist
                </Text>

                {wishlist.length > 0 && (
                  <TouchableOpacity onPress={clearWishlist}>
                    <Text className="text-red-500 font-semibold">Clear</Text>
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

export default WishlistScreen;
