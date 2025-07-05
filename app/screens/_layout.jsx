"use client"

import { Tabs } from "expo-router"
import { View, Text, Platform, Animated, Easing, useWindowDimensions } from "react-native"
import { TouchableOpacity } from "react-native"
import { MaterialIcons, Entypo, FontAwesome5 } from "@expo/vector-icons"
import { useRef, useState, useEffect, useContext } from "react"
import { TabBarContext } from "../../context/TabBarContext"
import { useTheme } from "../../context/ColorMode"
import ThemeChanger from "../../componants/ThemeChanger"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"

// Fix: Avoid JS-driven animation warnings by using useNativeDriver: true only for supported properties (opacity, transform).
// For height/width, useNativeDriver: false.

function MainNavBar({ state, descriptors, navigation, onHover }) {
  const { theme, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { showTabBar } = useContext(TabBarContext);

  // Only use useNativeDriver: true for transform/scale
  const scaleAnims = useRef(state.routes.map(() => new Animated.Value(1))).current;
  const borderRadiusAnims = useRef(state.routes.map(() => new Animated.Value(24))).current;
  const leftIndicatorAnims = useRef(state.routes.map(() => new Animated.Value(0))).current;

  // For width animation, must use useNativeDriver: false
  const navBarAnim = useRef(new Animated.Value(showTabBar ? 72 : 0)).current;

  useEffect(() => {
    Animated.timing(navBarAnim, {
      toValue: showTabBar ? 72 : 0,
      duration: 300,
      useNativeDriver: false, // width cannot use native driver
    }).start();
  }, [showTabBar]);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
    const { options } = descriptors[state.routes[index].key];
    const label =
      options.tabBarLabel !== undefined
        ? options.tabBarLabel
        : options.title !== undefined
        ? options.title
        : state.routes[index].name;

    // Calculate position based on index
    const itemHeight = 56; // 48px button + 8px margin
    const startOffset = 12; // paddingTop
    const yPosition = startOffset + index * itemHeight + 24; // Center on button

    onHover(label, index, yPosition); // Pass Y position to parent

    Animated.timing(scaleAnims[index], {
      toValue: 1.1,
      duration: 200,
      useNativeDriver: true, // transform supported
      easing: Easing.out(Easing.cubic),
    }).start();
    Animated.timing(borderRadiusAnims[index], {
      toValue: 16,
      duration: 200,
      useNativeDriver: false, // borderRadius not supported
      easing: Easing.out(Easing.cubic),
    }).start();
    if (state.index !== index) {
      Animated.timing(leftIndicatorAnims[index], {
        toValue: 20,
        duration: 200,
        useNativeDriver: false, // height not supported
        easing: Easing.out(Easing.cubic),
      }).start();
    }
  };

  const handleMouseLeave = (index) => {
    setHoveredIndex(null);
    onHover(null, -1, 0); // Clear hover info

    Animated.timing(scaleAnims[index], {
      toValue: 1,
      duration: 200,
      useNativeDriver: true, // transform supported
      easing: Easing.out(Easing.cubic),
    }).start();
    Animated.timing(borderRadiusAnims[index], {
      toValue: 24,
      duration: 200,
      useNativeDriver: false, // borderRadius not supported
      easing: Easing.out(Easing.cubic),
    }).start();
    if (state.index !== index) {
      Animated.timing(leftIndicatorAnims[index], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false, // height not supported
        easing: Easing.out(Easing.cubic),
      }).start();
    }
  };

  useEffect(() => {
    state.routes.forEach((_, index) => {
      if (index === state.index) {
        // Instantly set value on tab switch
        leftIndicatorAnims[index].setValue(40);
        scaleAnims[index].setValue(1.1);
        borderRadiusAnims[index].setValue(16);
      } else {
        if (hoveredIndex !== index) {
          leftIndicatorAnims[index].setValue(0);
          scaleAnims[index].setValue(1);
          borderRadiusAnims[index].setValue(24);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index]);

  return (
    <Animated.View
      style={{
        width: navBarAnim,
        height: "100%",
        backgroundColor: theme.firstTabBackground,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          width: 72,
          height: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 12,
          paddingHorizontal: 12,
          position: "relative",
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const hoverProps =
            Platform.OS === "web"
              ? {
                  onMouseEnter: () => handleMouseEnter(index),
                  onMouseLeave: () => handleMouseLeave(index),
                }
              : {};

          // Themed icon color: show focusedIcon color on hover or focus, otherwise unfocusedIcon
          let iconColor;
          if (isFocused || hoveredIndex === index) {
            iconColor = theme.focusedIcon;
          } else {
            iconColor = theme.unfocusedIcon;
          }

          // Themed icon background: show focusedIconBackground on focus or hover, otherwise unfocusedIconBackground
          let iconBackgroundColor;
          if (isFocused || hoveredIndex === index) {
            iconBackgroundColor = theme.focusedIconBackground;
          } else {
            iconBackgroundColor = theme.unfocusedIconBackground;
          }

          return (
            <View
              key={route.key}
              style={{
                position: "relative",
                marginBottom: 16,
                zIndex: hoveredIndex === index ? 9999 : 1,
                overflow: "visible",
              }}
            >
              {/* Left indicator bar */}
              <Animated.View
                style={{
                  position: "absolute",
                  left: -12,
                  top: "50%",
                  width: 4,
                  height: leftIndicatorAnims[index],
                  backgroundColor: theme.focusedBarIndicatorColor,
                  borderRadius: 2,
                  transform: [
                    {
                      translateY: leftIndicatorAnims[index].interpolate({
                        inputRange: [0, 40],
                        outputRange: [0, -20],
                      }),
                    },
                  ],
                  zIndex: 1,
                }}
              />

              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                activeOpacity={0.8}
                style={{
                  position: "relative",
                  cursor: Platform.OS === "web" ? "pointer" : undefined,
                }}
                {...hoverProps}
              >
                <Animated.View
                  style={{
                    width: 43,
                    height: 43,
                    borderRadius: 15,
                    backgroundColor: iconBackgroundColor,
                    justifyContent: "center",
                    alignItems: "center",
                    transform: [{ scale: scaleAnims[index] }],
                    overflow: "hidden",
                  }}
                >
                  <View style={{ justifyContent: "center", alignItems: "center" }}>
                    {route.name === "myspace" && (
                      <Entypo
                        name="code"
                        size={24}
                        color={iconColor}
                      />
                    )}
                    {route.name === "explore" && (
                      <MaterialIcons
                        name="explore"
                        size={24}
                        color={iconColor}
                      />
                    )}
                  </View>
                </Animated.View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
}

export default function Layout() {
  const { width, height } = useWindowDimensions()
  const { theme, toggleTheme } = useTheme();
  const isDesktop = width >= 768
  const [showTabBar, setShowTabBar] = useState(true)
  const [hoverInfo, setHoverInfo] = useState({ label: null, index: -1, yPosition: 0 })

  const safeSetShowTabBar = (value) => {
    if (isDesktop && value === false) {
      return
    }
    setShowTabBar(value)
  }

  useEffect(() => {
    if (isDesktop && !showTabBar) {
      setShowTabBar(true)
    }
  }, [isDesktop, showTabBar])

  // Debug log for showTabBar state
  useEffect(() => {
    console.log('showTabBar changed:', showTabBar, 'isDesktop:', isDesktop)
  }, [showTabBar, isDesktop])

  const handleHover = (label, index, yPosition) => {
    setHoverInfo({ label, index, yPosition })
  }

  return (
    <TabBarContext.Provider value={{ showTabBar, setShowTabBar: safeSetShowTabBar }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.firstTabBackground }}>
      <StatusBar
        style={theme.mode === 'dark' ? 'light' : 'dark'}
        translucent={true}
      />
       
        {hoverInfo.label && Platform.OS === "web" && isDesktop && (
          <View
            style={{
              position: "absolute",
              top: height * 0.028 + hoverInfo.yPosition, 
              left: 80, 
              backgroundColor: "#18191c",
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 6,
              shadowColor: "#000",
              shadowOpacity: 0.3,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 8,
              zIndex: 99999, 
              minWidth: 80,
              pointerEvents: "none",
            }}
            pointerEvents="none"
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "600",
                fontSize: 14,
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {hoverInfo.label}
            </Text>
           
            <View
              style={{
                position: "absolute",
                left: -6,
                top: "50%",
                transform: [{ translateY: -6 }],
                width: 0,
                height: 0,
                borderTopWidth: 6,
                borderTopColor: "transparent",
                borderBottomWidth: 6,
                borderBottomColor: "transparent",
                borderRightWidth: 6,
                borderRightColor: "#18191c",
              }}
            />
          </View>
        )}

      {/* Always visible header bar */}
      <View
        style={{
          height: height * 0.05,
          backgroundColor: theme.firstTabBackground,
          zIndex: 1000,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* 👈 Centered DevPortal Logo */}
        {isDesktop && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'none', // prevent interfering with ThemeChanger click
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 name="gitkraken" size={30} color={theme.mainIconColor} />
              <Text
                className="font-psemibold"
                style={{
                  fontSize: 20,
                  color: theme.focusedText,
                  marginLeft: 8,
                }}
              >
                DevPortal
              </Text>
            </View>
          </View>
        )}

        {/* 👉 ThemeChanger on the right */}
        {isDesktop && (
          <View
            style={{
              position: 'absolute',
              right: 10,
              top: 0,
              bottom: 0,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ThemeChanger focused={theme.mode} onToggle={toggleTheme} />
          </View>
        )}
      </View>

        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarPosition: "left",
          }}
          tabBar={(props) => <MainNavBar {...props} onHover={handleHover} />}
        >
          <Tabs.Screen name="myspace" options={{ title: "MySpace" }} />
          <Tabs.Screen name="explore" options={{ title: "CodeSpace" }} />
        </Tabs>
      </SafeAreaView>
      
    </TabBarContext.Provider>
  )
}
