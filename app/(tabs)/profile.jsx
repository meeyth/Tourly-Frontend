import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from "expo-linear-gradient";

const profile = () => {
  return (
    <LinearGradient
              colors={["#acd9f6", "#ffffff"]} // Blue to white
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 0.35 }}
              style={styles.container}
            >
              
            </LinearGradient>
  )
}

export default profile

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