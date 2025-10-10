import { Stack } from "expo-router";
import React from 'react';
import "../global.css";
import { Provider } from "react-redux";
import {store} from "../services/store";
export default function RootLayout() {
  return<Provider store={store}>
  <Stack screenOptions={{ headerShown: false }}>

    <Stack.Screen name="(auth)/AuthLoading" />

    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

  </Stack>
  </Provider> 
}
