"use client"

import { router, Tabs } from "expo-router"
import { View, Text, Platform, Animated, Easing, useWindowDimensions } from "react-native"
import { TouchableOpacity } from "react-native"
import { MaterialIcons, Entypo, FontAwesome5 } from "@expo/vector-icons"
import { useRef, useState, useEffect, useContext } from "react"
import { TabBarContext } from "../../context/TabBarContext"
import { useTheme } from "../../context/ColorMode"
import ThemeChanger from "../../componants/ThemeChanger"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAppwriteContext } from "../../context/appwriteContext"
import { login,logout } from "../../backend/appwrite"
import Logo from "../../componants/Logo"

// Fix: Avoid JS-driven animation warnings by using useNativeDriver: true only for supported properties (opacity, transform).
// For height/width, useNativeDriver: false.

function MainNavBar({ state, descriptors, navigation, onHover, myspaceDisabled }) {
  const { theme, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { showTabBar } = useContext(TabBarContext);
  const { isLogged,setIsLogged,setUser } = useAppwriteContext();

  // Only use useNativeDriver: true for transform/scale
  const scaleAnims = useRef(state.routes.map(() => new Animated.Value(1))).current;
  const borderRadiusAnims = useRef(state.routes.map(() => new Animated.Value(24))).current;
  const leftIndicatorAnims = useRef(state.routes.map(() => new Animated.Value(0))).current;

  // For width animation, must use useNativeDriver: false
  const navBarAnim = useRef(new Animated.Value(showTabBar ? 67 : 0)).current;

  useEffect(() => {
    Animated.timing(navBarAnim, {
      toValue: showTabBar ? 67 : 0,
      duration: 150,
      useNativeDriver: false, // width cannot use native driver
    }).start();
  }, [showTabBar]);

  // Modified: Only allow hover for myspace if isLogged is true
  const handleMouseEnter = (index) => {
    const route = state.routes[index];
    const isMyspace = route.name === "myspace";
    if (isMyspace && !isLogged) return; // No hover for disabled myspace

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

  // Modified: Only allow hover for myspace if isLogged is true
  const handleMouseLeave = (index) => {
    const route = state.routes[index];
    const isMyspace = route.name === "myspace";
    if (isMyspace && !isLogged) return; // No hover for disabled myspace

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
    state.routes.forEach((route, index) => {
      const isMyspace = route.name === "myspace";
      if (index === state.index) {
        // Instantly set value on tab switch
        leftIndicatorAnims[index].setValue(40);
        scaleAnims[index].setValue(1.1);
        borderRadiusAnims[index].setValue(16);
      } else {
        // If myspace is disabled, always reset to default (no hover/focus)
        if ((isMyspace && !isLogged) || hoveredIndex !== index) {
          leftIndicatorAnims[index].setValue(0);
          scaleAnims[index].setValue(1);
          borderRadiusAnims[index].setValue(24);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index, isLogged, hoveredIndex]);
  const handleLoginLogout=async()=>{
    if(isLogged){
      // Handle logout logic here
      console.log("Logging out...");
      const success = await logout();
      if(success){
        setIsLogged(false);
        setUser(null)
        // Switch to 'explore' tab if not already there
        const currentTab = state.routes[state.index].name;
        if(currentTab !== "explore"){
          navigation.navigate("explore");
        }
        router.replace('/log-in')
      }else{
        console.error("Logout failed");
      }
    }else{
      const res= await login();
      if(res){
        setIsLogged(true);
        setUser(res);
      }
    }
  }

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

          // Disable myspace tab if not logged in
          const isMyspace = route.name === "myspace";
          // myspaceDisabled is true if not logged in
          const isDisabled = isMyspace && myspaceDisabled;

          // If myspace is disabled, do not allow press or hover
          const onPress = () => {
            if (isDisabled) return;
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Only allow hover for myspace if enabled
          let hoverProps = {};
          if (Platform.OS === "web") {
            if (!(isMyspace && isDisabled)) {
              hoverProps = {
                onMouseEnter: () => handleMouseEnter(index),
                onMouseLeave: () => handleMouseLeave(index),
              };
            }
          }

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

          // If myspace is disabled, always use unfocused colors and no animation
          if (isMyspace && isDisabled) {
            iconColor = theme.unfocusedIcon;
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
                  height: isMyspace && isDisabled ? 0 : leftIndicatorAnims[index],
                  backgroundColor: theme.focusedBarIndicatorColor,
                  borderRadius: 2,
                  transform: [
                    {
                      translateY: (isMyspace && isDisabled)
                        ? 0
                        : leftIndicatorAnims[index].interpolate({
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
                activeOpacity={isDisabled ? 1 : 0.8}
                style={{
                  position: "relative",
                  cursor: Platform.OS === "web" ? (isDisabled ? "not-allowed" : "pointer") : undefined,
                  opacity: isDisabled ? 0.4 : 1,
                }}
                pointerEvents={isDisabled ? "none" : "auto"}
                {...hoverProps}
              >
                <Animated.View
                  style={{
                    width: isDesktop?37:43,
                    height: isDesktop?37:43,
                    borderRadius: 10,
                    backgroundColor: iconBackgroundColor,
                    justifyContent: "center",
                    alignItems: "center",
                    // If myspace is disabled, no scale animation
                    transform: isMyspace && isDisabled ? [{ scale: 1 }] : [{ scale: scaleAnims[index] }],
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
        {/* Add login icon at the bottom of the bar */}
        <View style={{ flex: 1 }} />
        <View style={{ marginBottom: 20, alignItems: "center", justifyContent: "flex-end" }}>
         <TouchableOpacity
         onPress={handleLoginLogout}
            style={{
              width: isDesktop?40:48,
              height: isDesktop?40:48,
              borderRadius: 10,
              backgroundColor: theme.mode === "dark" ? "rgba(253, 54, 110, 0.15)" : "rgba(253, 54, 110, 0.1)",
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 5,
              borderWidth: 1,
              borderColor: theme.mode === "dark" ? "rgba(253, 54, 110, 0.3)" : "rgba(253, 54, 110, 0.2)",
            }}
          >
            {isLogged?<MaterialIcons name="logout" size={24} color="#FD366E" />:<MaterialIcons name="login" size={24} color="#FD366E"  />}
          </TouchableOpacity>
          <Text className="font-psemibold "style={{color:theme.opposite,fontSize:12}}>{isLogged ? "LogOut" : "LogIn"}</Text>
        </View>
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
  const { isLogged, loading } = useAppwriteContext();

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

  // Only show hover for myspace if isLogged is true
  const handleHover = (label, index, yPosition) => {
    // If hovering myspace and not logged in, do not show hover
    if (index !== -1 && label) {
      if (label.toLowerCase().includes("myspace") && !isLogged) {
        setHoverInfo({ label: null, index: -1, yPosition: 0 });
        return;
      }
    }
    setHoverInfo({ label, index, yPosition })
  }

  return (
    <TabBarContext.Provider value={{ showTabBar, setShowTabBar: safeSetShowTabBar }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.firstTabBackground }}>
      
       
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
          height: showTabBar?height * 0.07:height * 0.07,
          backgroundColor: theme.firstTabBackground,
          zIndex: 1000,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: isDesktop?'center':'flex-start',
          position: 'relative',
          
        }}
      >
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
              
              
              <Logo height={40}/>
              <Text className="font-pregular text-xl" style={{color:theme.opposite }}>Axhibit</Text>
            </View>
          </View>
        )}
        {!isDesktop && !showTabBar && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft:10,
              
            }}
          >
            <TouchableOpacity
              onPress={() => setShowTabBar(true)}
              style={{
                borderRadius: 20,
                backgroundColor: 'rgba(0,0,0,0.08)',
                marginRight: 12,
                padding: 4,
              }}
            >
              <MaterialIcons name="arrow-back" size={24} color={theme.opposite} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '600', color: theme.opposite }}>
              Back
            </Text>
          </View>
        )}

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
          tabBar={(props) => <MainNavBar {...props} onHover={handleHover} myspaceDisabled={!isLogged} />}
        >
          <Tabs.Screen
            name="explore"
            options={{ title: "CodeSpace" }}
          />
          <Tabs.Screen
            name="myspace"
            options={{
              title: "MySpace",
              
            }}
          />
          
        </Tabs>
      </SafeAreaView>
      
    </TabBarContext.Provider>
  )
}
