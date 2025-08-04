import { Stack } from "expo-router";
import "../global.css";
import React from 'react';
import { StatusBar } from "expo-status-bar";


export default function RootLayout() {
  return <Stack >
    
    <Stack.Screen name="(tabs)" options={{headerShown:false}}/>

  </Stack>;
}
