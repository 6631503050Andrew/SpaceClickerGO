"use client"

import { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StatusBar } from "expo-status-bar"
import { StyleSheet, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as SplashScreen from "expo-splash-screen"

// Screens
import ClickerScreen from "./screens/ClickerScreen"
import UpgradesScreen from "./screens/UpgradesScreen"
import StatsScreen from "./screens/StatsScreen"

// Context
import { GameProvider } from "./context/GameContext"

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync()

const Tab = createBottomTabNavigator()

export default function App() {
  useEffect(() => {
    // Hide splash screen when app is ready
    const hideSplash = async () => {
      await SplashScreen.hideAsync()
    }

    hideSplash()
  }, [])

  return (
    <GameProvider>
      <View style={styles.container}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName

                if (route.name === "Clicker") {
                  iconName = focused ? "planet" : "planet-outline"
                } else if (route.name === "Upgrades") {
                  iconName = focused ? "rocket" : "rocket-outline"
                } else if (route.name === "Stats") {
                  iconName = focused ? "stats-chart" : "stats-chart-outline"
                }

                return <Ionicons name={iconName} size={size} color={color} />
              },
              tabBarActiveTintColor: "#6200ee",
              tabBarInactiveTintColor: "gray",
              headerStyle: {
                backgroundColor: "#6200ee",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            })}
          >
            <Tab.Screen name="Clicker" component={ClickerScreen} />
            <Tab.Screen name="Upgrades" component={UpgradesScreen} />
            <Tab.Screen name="Stats" component={StatsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </View>
    </GameProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
})
