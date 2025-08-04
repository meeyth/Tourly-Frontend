import { Dimensions,Image, View, Text, ScrollView, ImageBackground ,StyleSheet} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from "@/constants/images";
import { LinearGradient } from "expo-linear-gradient";


const index = () => {
  return (
    // <View className="bg-white h-full">
    //   <ScrollView contentContainerClassName="h-full " style={{height: Dimensions.get('screen').height/2.25}} >
    //     <ImageBackground source={images.background} className="size-full rounded-b-lg h-[30%]" resizeMode="cover"/>

    //     </ScrollView>
    //     </View>
    <LinearGradient
      colors={["#acd9f6", "#ffffff"]} // Blue to white
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 0.35 }}
      style={styles.container}
    >
      
    </LinearGradient>
  )
}

export default index

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
})