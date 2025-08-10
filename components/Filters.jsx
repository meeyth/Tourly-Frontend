// Filters.js
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
import { categories } from "@/constants/data";

export default function Filters() {
  const params = useLocalSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(params.filter || "All");

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const handleCategoryPress = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory("All");
      router.setParams({ filter: "All" });
      return;
    }
    setSelectedCategory(category);
    router.setParams({ filter: category });
  };

  const onScroll = (e) => {
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
    const x = contentOffset.x || 0;
    const viewWidth = layoutMeasurement.width || 0;
    const fullWidth = contentSize.width || 0;

    setShowLeft(x > 0);
    setShowRight(x + viewWidth < fullWidth);
  };

  const onContentSizeChange = (w) => {
    setShowRight(w > 0);
  };

  return (
    <View className="relative mt-auto py-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center", // can't be directly in className
        }}
        onScroll={onScroll}
        onContentSizeChange={(w) => onContentSizeChange(w)}
        scrollEventThrottle={16}
      >
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleCategoryPress(item.category)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === item.category ? "bg-[#2271ac]" : "bg-[#69b3e3]"
            } ${item.category === "All" ? "ml-0" : "ml-3"}`}
            activeOpacity={0.85}
          >
            <Text
              className={`text-sm text-white ${
                selectedCategory === item.category ? "font-bold" : ""
              }`}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LEFT FADE */}
      {showLeft && (
        <LinearGradient
          colors={["#87cefa", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="absolute left-0 top-0 bottom-0 w-12 z-10"
          pointerEvents="none"
        />
      )}

      {/* RIGHT FADE */}
      {showRight && (
        <LinearGradient
          colors={["transparent", "#87cefa"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="absolute right-0 top-0 bottom-0 w-12 z-10"
          pointerEvents="none"
        />
      )}
    </View>
  );
}
