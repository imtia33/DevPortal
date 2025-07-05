"use client"
import { Tabs } from "expo-router"
import { View, Text, TouchableOpacity, Animated, useWindowDimensions, Platform, TouchableNativeFeedback } from "react-native"
import React, { useRef, useState, useContext, useEffect } from "react"
import { TabBarContext } from "../../../context/TabBarContext"
import { useTheme } from "../../../context/ColorMode"
import ThemeChanger from "../../../componants/ThemeChanger"
import { AntDesign, FontAwesome5, MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons"

function NestedTabSidebar({ state, descriptors, navigation }) {
  const { theme, toggleTheme } = useTheme()
  const { width } = useWindowDimensions()
  const isDesktop = width >= 768
  const { showTabBar, setShowTabBar } = useContext(TabBarContext)
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Only keep sidebar open/close animation
  const widthAnim = useRef(new Animated.Value(showTabBar ? (isDesktop ? 280 : width * 0.85) : 0)).current

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: showTabBar ? (isDesktop ? 280 : width * 0.85) : 0,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [showTabBar, isDesktop, width])

  const sidebarBg = theme.mode === "dark" 
    ? "linear-gradient(145deg, #1a1a1a 0%, #2d2d30 100%)" 
    : "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)"
  
  const borderColor = theme.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"
  const shadowColor = theme.mode === "dark" ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.1)"

  return (
    <Animated.View
      style={{
        width: widthAnim,
        height: "100%",
        backgroundColor: theme.secondTabBackground,
        borderRightWidth: 1,
        borderRightColor: borderColor,
        borderTopLeftRadius: widthAnim.interpolate({
          inputRange: [0, isDesktop ? 280 : width * 0.85],
          outputRange: [0, 24],
          extrapolate: "clamp",
        }),
        ...(!isDesktop && {
          borderBottomLeftRadius: widthAnim.interpolate({
            inputRange: [0, isDesktop ? 280 : width * 0.85],
            outputRange: [0, 24],
            extrapolate: "clamp",
          }),
        }),
        // Enhanced shadow
        shadowColor: shadowColor,
        shadowOffset: {
          width: 4,
          height: 0,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        position: "static",
        overflow: "hidden",
      }}
    >
      {/* Elegant Header with gradient accent */}
      <View 
        style={{ 
          paddingHorizontal: 24, 
          paddingVertical: 32,
          marginBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
          position: 'relative',
        }}
      >
        {/* Subtle gradient accent line */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 24,
            right: 24,
            height: 3,
            borderRadius: 2,
            background: 'linear-gradient(90deg, #FD366E 0%, #FF8A56 50%, #3B82F6 100%)',
            backgroundColor: '#FD366E', // Fallback for React Native
          }}
        />
        
        <View style={{ alignItems: 'center' }}>
          {/* Icon with subtle glow effect */}
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              backgroundColor: theme.mode === "dark" ? "rgba(253, 54, 110, 0.15)" : "rgba(253, 54, 110, 0.1)",
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              borderWidth: 1,
              borderColor: theme.mode === "dark" ? "rgba(253, 54, 110, 0.3)" : "rgba(253, 54, 110, 0.2)",
            }}
          >
            <Feather 
              name="code" 
              size={24} 
              color="#FD366E" 
            />
          </View>
          
          {/* Enhanced typography */}
          <Text
            style={{
              fontSize: 22,
              fontWeight: "800",
              letterSpacing: -0.5,
              textAlign: 'center',
              lineHeight: 28,
            }}
          >
            <Text style={{ color: "#FD366E" }}>Code</Text>
            <Text style={{ color: theme.mode === 'dark' ? '#ffffff' : '#1a1a1a' }}>Space</Text>
          </Text>
          
          {/* Subtle subtitle */}
          <Text
            style={{
              fontSize: 13,
              color: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
              fontWeight: '500',
              marginTop: 4,
              letterSpacing: 0.3,
            }}
          >
            Explore & Discover
          </Text>
        </View>
      </View>

      {/* Navigation Section */}
      <View style={{ paddingHorizontal: 16, flex: 1 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 12,
            marginLeft: 8,
          }}
        >
          Navigation
        </Text>

        {/* Enhanced Tab Items */}
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name

          const isActive = isDesktop && state.index === index;
          const isAndroid = Platform.OS === "android";

          const onPress = () => {
            setShowTabBar(false);
            navigation.navigate(route.name);
          }

          const hoverProps = isDesktop ? {
            onMouseEnter: () => setHoveredIndex(index),
            onMouseLeave: () => setHoveredIndex(null),
          } : {};

          const Touchable = isAndroid ? TouchableNativeFeedback : TouchableOpacity;
          const touchableProps = isAndroid ? {
            background: TouchableNativeFeedback.Ripple(
              theme.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
              false
            ),
          } : {
            activeOpacity: 0.7,
            ...hoverProps,
          };

          // Enhanced styling with better visual hierarchy
          let backgroundColor = 'transparent';
          let color = theme.mode === 'dark' ? '#e2e8f0' : '#334155';
          let fontWeight = '500';
          let borderLeftColor = 'transparent';
          let borderLeftWidth = 0;

          if (isDesktop) {
            if (isActive) {
              backgroundColor = theme.mode === 'dark' 
                ? 'rgba(59, 130, 246, 0.15)' 
                : 'rgba(59, 130, 246, 0.08)';
              color = theme.mode === 'dark' ? '#60a5fa' : '#2563eb';
              fontWeight = '700';
              borderLeftColor = '#3b82f6';
              borderLeftWidth = 3;
            } else if (hoveredIndex === index) {
              backgroundColor = theme.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.03)';
              color = theme.mode === 'dark' ? '#f1f5f9' : '#1e293b';
              fontWeight = '600';
            }
          }

          // Apply appropriate icons for each tab
          const getIcon = () => {
            switch (route.name) {
              case 'home':
                // Home tab: use a home icon
                return <Feather name="home" size={20} color={color} />;
              case 'browse':
                // Browse/Explore tab: use a compass icon
                return <Feather name="compass" size={20} color={color} />;
              case 'search':
                // Search tab: use a search icon
                return <Feather name="search" size={20} color={color} />;
              case 'profile':
                // Profile tab: use a user icon
                return <Feather name="user" size={20} color={color} />;
              case 'settings':
                
                return <Feather name="settings" size={20} color={color} />;
              default:
                
                return <Feather name="circle" size={20} color={color} />;
            }
          };

          return (
            <View 
              key={route.key} 
              style={{ 
                borderRadius: 12, 
                overflow: 'hidden', 
                marginBottom: 6,
                borderLeftWidth,
                borderLeftColor,
              }}
            >
              <Touchable {...touchableProps} onPress={onPress}>
                <View
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    backgroundColor,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    minHeight: 52,
                  }}
                >
                  {/* Icon with proper spacing */}
                  <View style={{ marginRight: 16, width: 20, alignItems: 'center' }}>
                    {getIcon()}
                  </View>
                  
                  {/* Enhanced text styling */}
                  <Text
                    style={{
                      color,
                      fontSize: 16,
                      fontWeight,
                      letterSpacing: -0.2,
                      textTransform: 'capitalize',
                      flex: 1,
                    }}
                  >
                    {label}
                  </Text>

                  {/* Active indicator dot */}
                  {isActive && (
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#3b82f6',
                        marginLeft: 8,
                      }}
                    />
                  )}
                </View>
              </Touchable>
            </View>
          )
        })}
      </View>

      {!isDesktop && (
        <View
          style={{
            paddingHorizontal: 24,
            paddingVertical: 24,
            borderTopWidth: 1,
            borderTopColor: borderColor,
            backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.mode === 'dark' ? '#e2e8f0' : '#334155',
                  marginBottom: 2,
                }}
              >
                Appearance
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                }}
              >
                {theme.mode === 'dark' ? 'Dark mode' : 'Light mode'}
              </Text>
            </View>
            <ThemeChanger
              focused={theme.mode}
              onToggle={toggleTheme}
            />
          </View>
        </View>
      )}
    </Animated.View>
  )
}

export default function ExploreLayout() {
  const { width } = useWindowDimensions()
  const isDesktop = width >= 768
  const { theme } = useTheme()

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
        tabBar={(props) => <NestedTabSidebar {...props} />}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="browse"
          options={{
            title: "Explore",
          }}
        />
      </Tabs>
    </View>
  )
}