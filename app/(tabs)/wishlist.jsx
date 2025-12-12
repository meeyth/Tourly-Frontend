import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

const STORAGE_KEY = "wishlist_v1";

const DESTINATIONS = [
  {
    id: "munnar-hills",
    title: "Munnar Hills",
    location: "Kerala, India",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=60&auto=format&fit=crop",
  },
  {
    id: "pangong-tso",
    title: "Pangong Tso",
    location: "Ladakh, India",
    image:
      "https://images.unsplash.com/photo-1648851460314-ba293ba2cdcf?w=900&auto=format&fit=crop",
  },
];

export default function WishlistScreen() {
  const [wishlist, setWishlist] = useState(["munnar-hills", "pangong-tso"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (err) {
      console.log("Wishlist load failed", err);
    } finally {
      setLoading(false);
    }
  };

  const saveWishlist = async (newList) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (err) {
      console.log("Wishlist save failed", err);
    }
  };

  const removeFromWishlist = (id) => {
    const newList = wishlist.filter((x) => x !== id);
    setWishlist(newList);
    saveWishlist(newList);
  };

  const clearWishlist = () => {
    Alert.alert("Clear Wishlist?", "This will remove all saved destinations.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          setWishlist([]);
          await AsyncStorage.removeItem(STORAGE_KEY);
        },
      },
    ]);
  };

  const wishlistedDestinations = DESTINATIONS.filter((d) => wishlist.includes(d.id));

  const renderItem = ({ item }) => (
    <View className="flex-row bg-white/70 border border-black/5 rounded-xl overflow-hidden mb-3">
      <Image
        source={{ uri: item.image }}
        className="w-[110px] h-[96px]"
        resizeMode="cover"
      />

      <View className="flex-1 px-3 py-2">
        <Text className="text-[16px] font-semibold text-slate-900">
          {item.title}
        </Text>
        <Text className="text-[13px] text-slate-600 mt-[2px]">
          {item.location}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => removeFromWishlist(item.id)}
        className="p-3 flex justify-center"
      >
        <MaterialIcons name="favorite" size={24} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={["#acd9f6", "#ffffff"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 0.35 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        {/* HEADER */}
        <View className="flex-row px-4 pt-4 items-center justify-between">
          <Text className="text-2xl font-extrabold text-slate-900">
            Wishlist
          </Text>

          <TouchableOpacity onPress={clearWishlist}>
            <Text className="text-red-500 font-semibold">Clear</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={wishlistedDestinations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={() => (
            <View className="items-center mt-10 px-8">
              <Text className="text-slate-700 text-[15px] text-center">
                Your wishlist is empty. Add destinations you love and revisit
                them anytime!
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}