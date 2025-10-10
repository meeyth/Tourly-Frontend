import {FontAwesome ,FontAwesome5  } from "@expo/vector-icons"; 
import { Tabs } from "expo-router";
import { StyleSheet,Text, View ,TouchableOpacity} from "react-native";
import { LinearGradient } from "expo-linear-gradient";


function TabIcon({ focused, icon, title }) {
    if (focused) {
        return (
            <View className=" bg-[#82cffb]  justify-center items-center mt-4 rounded-lg w-20 h-10">

                <FontAwesome5 name={icon} size={24} color="white" />
            </View>
                
        );
    }

    return (
        <View className="size-full justify-center items-center mt-4 rounded-full">
            <FontAwesome5 name={icon} size={24} color="#acd9f6" />
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarPressColor: "transparent",
        tabBarButton: (props) => (
          <TouchableOpacity
            {...props}
            activeOpacity={1}
            android_ripple={{ color: "transparent" }}
          />
        ),
                tabBarItemStyle: {
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                },
                tabBarStyle: {
                    backgroundColor: "#ffffff",
                    borderRadius: 10,
                    marginHorizontal: 20,
                    marginBottom: 36,
                    height: 52,
                    position: "absolute",
                    overflow: "hidden",
                    borderWidth: 1,
                    //borderColor: "#0F0D23",
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={"home"} title="Home" />
                    ),
                }}
            />

            <Tabs.Screen
                name="explore"
                options={{
                    title: "explore",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={"compass"} title="Search" />
                    ),
                }}
            />

            <Tabs.Screen
                name="wishlist"
                options={{
                    title: "wishlist",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={"map-marker-alt"} title="Save" />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={"user-circle"} title="Profile" />
                    ),
                }}
            />
        </Tabs>
    );
}

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