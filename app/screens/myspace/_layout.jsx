"use client"
import { Tabs } from "expo-router"
import { View, useWindowDimensions } from "react-native"
import React from "react"
import { useTheme } from "../../../context/ColorMode"
import NestedTabSidebar from "../../../componants/NestedTabSidebar"

export default function MySpaceLayout() {
  const { width } = useWindowDimensions()
  const isDesktop = width >= 768
  const { theme } = useTheme()

  // Tab configuration for MySpace
  const mySpaceTabConfig = [
    {
      name: 'home',
      title: 'Home',
      icon: 'home',
      iconType: 'Feather'
    },
    {
      name: 'profile',
      title: 'Profile', 
      icon: 'user',
      iconType: 'Feather'
    },
    {
      name: 'createShowOffs',
      title: 'Showcase',
      icon: 'gripfire',
      iconType: 'FontAwesome5'
    }
  ]

  return (
    <View 
      style={{ 
        flex: 1, 
        flexDirection: "row", 
        backgroundColor: theme.firstTabBackground,
      }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarPosition: "left",
        }}
        tabBar={(props) => (
          <NestedTabSidebar 
            {...props} 
            title="MySpace"
            subtitle="Commit & Collaborate"
            accentColor="#FD366E"
            tabConfig={mySpaceTabConfig}
          />
        )}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
          }}
        />
        <Tabs.Screen
          name="createShowOffs"
          options={{
            title: "Showcase",
          }}
        />
      </Tabs>
    </View>
  )
}