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
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import { LinearGradient } from "expo-linear-gradient";
import icons from "@/constants/icons"; 
import {Entypo,Ionicons  } from '@expo/vector-icons';


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
            <Image source={images.avatar} className="w-12 h-12 rounded-full border-2 border-white" />
          </TouchableOpacity>
      
    </View>
    <View className="flex flex-col items-center ml-2 justify-center">
                <Text className="text-sm ">My Location</Text>
                <View className="flex flex-col items-start">
                  <Text className="text-lg ">
                 <Entypo name="location-pin" size={16} color="#1E90FF" />
                     {" "}India</Text>
                </View>
             

      </View>
      <View className=" flex items-center bg-white w-12 h-12 rounded-full">
        <TouchableOpacity className="mt-3">
           <Ionicons name="notifications-outline" size={20} color="BLACK" />
          </TouchableOpacity>
      </View>
  </View>
</View>

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
