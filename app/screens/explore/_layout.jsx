"use client"
import { Tabs } from "expo-router"
import { View, useWindowDimensions } from "react-native"
import React from "react"
import { useTheme } from "../../../context/ColorMode"
import NestedTabSidebar from "../../../componants/NestedTabSidebar"

export default function ExploreLayout() {
  const { width } = useWindowDimensions()
  const isDesktop = width >= 768
  const { theme } = useTheme()

  // Tab configuration for Explore
  const exploreTabConfig = [
    {
      name: 'browse',
      title: 'Browse',
      icon: 'gripfire',
      iconType: 'FontAwesome5'
    },
    {
      name: 'search',
      title: 'Search',
      icon: 'search',
      iconType: 'Feather'
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
            title="CodeSpace"
            subtitle="Explore & Discover"
            accentColor="#FD366E"
            tabConfig={exploreTabConfig}
          />
        )}
      >
        <Tabs.Screen
          name="browse"
          options={{
            title: "Browse",
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
          }}
        />
      </Tabs>
    </View>
  )
}