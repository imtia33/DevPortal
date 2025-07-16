"use client"
import { View, Text, TouchableOpacity, Animated, useWindowDimensions, Platform, TouchableNativeFeedback } from "react-native"
import React, { useRef, useState, useContext, useEffect } from "react"
import { TabBarContext } from "../context/TabBarContext"
import { useTheme } from "../context/ColorMode"
import ThemeChanger from "./ThemeChanger"
import { AntDesign, FontAwesome5, MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons"

function NestedTabSidebar({ 
  state, 
  descriptors, 
  navigation, 
  title = "MySpace",
  subtitle = "Commit & Collaborate",
  accentColor = "#FD366E",
  tabConfig = [] // Array of { name, title, icon, iconType }
}) {
  const { theme, toggleTheme } = useTheme()
  const { width } = useWindowDimensions()
  const isDesktop = width >= 768
  const { showTabBar, setShowTabBar } = useContext(TabBarContext)
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Only keep sidebar open/close animation
  const desktopWidth = 200; // Fixed width for desktop
  const mobileWidth = width * 0.85;
  
  const widthAnim = useRef(new Animated.Value(showTabBar ? (isDesktop ? desktopWidth : mobileWidth) : 0)).current

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: showTabBar ? (isDesktop ? desktopWidth : mobileWidth) : 0,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [showTabBar, isDesktop, width])

  const sidebarBg = theme.mode === "dark" 
    ? "linear-gradient(145deg, #1a1a1a 0%, #2d2d30 100%)" 
    : "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)"
  
  const borderColor = theme.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"
  const shadowColor = theme.mode === "dark" ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.1)"

  // Helper function to get icon based on tab config
  const getIcon = (routeName, color) => {
    const tabConfigItem = tabConfig.find(config => config.name === routeName);
    
    if (tabConfigItem) {
      const { icon, iconType = "Feather" } = tabConfigItem;
      
      switch (iconType) {
        case "Feather":
          return <Feather name={icon} size={20} color={color} />;
        case "FontAwesome5":
          return <FontAwesome5 name={icon} size={20} color={color} />;
        case "AntDesign":
          return <AntDesign name={icon} size={20} color={color} />;
        case "MaterialCommunityIcons":
          return <MaterialCommunityIcons name={icon} size={20} color={color} />;
        case "Ionicons":
          return <Ionicons name={icon} size={20} color={color} />;
        default:
          return <Feather name={icon} size={20} color={color} />;
      }
    }
    
    // Fallback to default icons
    switch (routeName) {
      case 'home':
        return <Feather name="home" size={18} color={color} />;
      case 'browse':
        return <Feather name="compass" size={20} color={color} />;
      case 'createShowOffs':
        return <FontAwesome5 name="gripfire" size={20} color={color} />
      case 'profile':
        return <Feather name="user" size={20} color={color} />;
      case 'settings':
        return <Feather name="settings" size={20} color={color} />;
      default:
        return <Feather name="circle" size={20} color={color} />;
    }
  };

  return (
    <Animated.View
      style={{
        width: widthAnim,
        height: "100%",
        backgroundColor: theme.secondTabBackground,
        borderTopLeftRadius:  24,
        ...(!isDesktop && {
          borderBottomLeftRadius: 24,
        }),
        
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
            backgroundColor: accentColor,
          }}
        />
        
        <View style={{ alignItems: 'center' }}>
          
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              backgroundColor: theme.mode === "dark" ? `${accentColor}20` : `${accentColor}15`,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              borderWidth: 1,
              borderColor: theme.mode === "dark" ? `${accentColor}40` : `${accentColor}30`,
            }}
          >
            <Feather 
              name="code" 
              size={24} 
              color={accentColor} 
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
            <Text style={{ color: theme.mode === 'dark' ? '#ffffff' : '#1a1a1a' }}>{title.split(' ')[0]}</Text>
            <Text style={{ color: accentColor }}>{title.split(' ').slice(1).join(' ')}</Text>
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
            {subtitle.split('&').map((part, index, array) => (
              <React.Fragment key={index}>
                {part}
                {index < array.length - 1 && (
                  <Text style={{ color: accentColor }}>&</Text>
                )}
              </React.Fragment>
            ))}
          </Text>
        </View>
        <View  style={{
          height:1,
          backgroundColor:borderColor,
          width:isDesktop?'100%':'110%',
          alignSelf:'center'
        }}/>
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
          let fontWeight = '300';
          
          let paddingVertical = 8; // Thinner height
          let borderRadius = 10;
          let borderWidth = 0;
          let borderColorTab = 'transparent';
  
          // --- Focused tab styling logic ---
          if (isDesktop) {
            if (isActive) {
              backgroundColor = theme.mode === 'dark' 
                ? `${accentColor}20`
                : `${accentColor}15`;
              
              color = accentColor;
              fontWeight = '400';
              borderRadius = 10;
              borderWidth = 1;
              borderColorTab = accentColor; 
              paddingVertical = 8;
            } else if (hoveredIndex === index) {
              backgroundColor = theme.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.03)';
              color = accentColor;
              fontWeight = '300';
            }
          }

          return (
            <View 
              key={route.key} 
              style={{ 
                borderRadius: borderRadius, 
                overflow: 'hidden', 
                marginBottom: 2,
              }}
            >
              <Touchable {...touchableProps} onPress={onPress}>
                <View
                  style={{
                    paddingVertical: paddingVertical,
                    paddingHorizontal: 20,
                    backgroundColor,
                    borderRadius: borderRadius,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    minHeight: 36,
                  }}
                >
                  {/* Icon with proper spacing */}
                  <View style={{ marginRight: 16, width: 20, alignItems: 'center' }}>
                    {getIcon(route.name, color)}
                  </View>
                  
                  {/* Enhanced text styling */}
                  <Text
                     className= "font-psemibold" 
                     style={{
                       color: isActive 
                         ? (theme.mode==='dark'?'#fff':'#000')
                         : (theme.mode==='dark'?'rgba(255, 255, 255, 0.6)':'rgba(0, 0, 0, 0.5)'),
                       fontSize: isDesktop?13:14,
                       top:3,
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
                        backgroundColor: accentColor,
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

export default NestedTabSidebar 