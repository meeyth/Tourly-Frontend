import { Tabs } from "expo-router";
import {FontAwesome ,FontAwesome5  } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const HomeLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,

        // 🔹 Remove Android ripple & iOS opacity
        tabBarPressColor: "transparent",
        tabBarButton: (props) => (
          <TouchableOpacity
            {...props}
            activeOpacity={1}
            android_ripple={{ color: "transparent" }}
          />
        ),

        tabBarItemStyle: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        },
        tabBarStyle: {
          borderRadius: 10,
          marginHorizontal: 30,
          marginBottom: 45,
          height: 10,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          headerShown: false,
          title: "Search",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="compass" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          headerShown: false,
          title: "Create",
          tabBarIcon: ({ color }) => (
           <FontAwesome5 name="map-marker-alt" size={23} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "My Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user-circle" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default HomeLayout;
