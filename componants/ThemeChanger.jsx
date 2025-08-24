import { View, TouchableOpacity, Animated, Platform } from "react-native";
import { useRef, useEffect, useCallback } from "react";
import { Entypo, Feather } from "@expo/vector-icons";

const ThemeChanger = ({ focused, onToggle, compact,showBg }) => {
  const isLight = focused === "light";

  if (compact) {
    // Compact mode: just a single icon button
    return (
      <TouchableOpacity
        onPress={() => onToggle(isLight ? "dark" : "light")}
        style={{
          padding: 6,
          borderRadius: 7,
          width: 46,
          height: 43,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: showBg ? "rgba(0,0,0,0.13)" : undefined,
        }}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        accessibilityLabel="Toggle theme"
      >
        {isLight ? (
          <Feather name="moon" size={20} color="rgb(0, 0, 0)" />
        ) : (
          <Entypo name="light-down" size={22} color="#fff" />
        )}
      </TouchableOpacity>
    );
  }

  const slideAnim = useRef(new Animated.Value(isLight ? 0 : 1)).current;
  const lightScale = useRef(new Animated.Value(1)).current;
  const darkScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isLight ? 0 : 1,
      useNativeDriver: false,
      speed: 15,
      bounciness: 6,
    }).start();
  }, [focused, isLight]);

  const handleHoverIn = useCallback((which) => {
    Animated.spring(which === "light" ? lightScale : darkScale, {
      toValue: 1.05,
      useNativeDriver: true,
      speed: 25,
      bounciness: 0,
    }).start();
  }, [lightScale, darkScale]);

  const handleHoverOut = useCallback((which) => {
    Animated.spring(which === "light" ? lightScale : darkScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 25,
      bounciness: 0,
    }).start();
  }, [lightScale, darkScale]);

  const hoverProps = useCallback(
    (which) =>
      Platform.OS === "web"
        ? {
            onMouseEnter: () => handleHoverIn(which),
            onMouseLeave: () => handleHoverOut(which),
          }
        : {},
    [handleHoverIn, handleHoverOut]
  );

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.13)",
        borderRadius: 8,
        padding: 1.5,
        position: "relative",
        width: 80,
        height: 36,
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          top: 3,
          left: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [3, 42],
          }),
          width: 32,
          height: 30,
          backgroundColor: "#FD366E",
          borderRadius: 6,
          zIndex: 0,
        }}
      />

      {/* Light theme button */}
      <Animated.View style={{ transform: [{ scale: lightScale }], zIndex: 1 }}>
        <TouchableOpacity
          style={{
            padding: 6,
            borderRadius: 7,
            width: 36,
            height: 33,
            alignItems: "center",
            justifyContent: "center",
          }}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          {...hoverProps("light")}
          onPress={() => {
            if (!isLight) onToggle("light");
          }}
          
        >
          <Entypo
            name="light-down"
            size={18}
            style={{ right: 2 }}
            color={isLight ? "#fff" : "#888"}
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: darkScale }], zIndex: 1 }}>
        <TouchableOpacity
          style={{
            padding: 6,
            borderRadius: 7,
            width: 36,
            height: 33,
            alignItems: "center",
            justifyContent: "center",
          }}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          {...hoverProps("dark")}
          onPress={() => {
            if (isLight) onToggle("dark");
          }}

        >
          <Feather
            name="moon"
            size={16}
            style={{ left: 2 }}
            color={!isLight ? "#fff" : "#888"}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default ThemeChanger;
