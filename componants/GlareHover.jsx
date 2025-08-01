import React, { useRef } from "react";
import { Platform, View, StyleSheet, Pressable } from "react-native";

// Helper to convert hex to rgba
function hexToRgba(hex, opacity = 1) {
  hex = hex.replace("#", "");
  if (/^[\dA-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } else if (/^[\dA-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return hex;
}

const GlareHover = ({
  width = "500px",
  height = "500px",
  background = "#000",
  borderRadius = "10px",
  borderColor = "#333",
  children,
  glareColor = "#ffffff",
  glareOpacity = 0.5,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false,
  className = "",
  style = {},
}) => {
  const overlayRef = useRef(null);
  const hasPlayed = useRef(false);

  // Compose the glare gradient
  const rgba = hexToRgba(glareColor, glareOpacity);

  // Web: Animate glare on hover
  const animateIn = () => {
    if (Platform.OS !== "web") return;
    const el = overlayRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.backgroundPosition = "-100% -100%, 0 0";
    el.offsetHeight; // force reflow
    el.style.transition = `${transitionDuration}ms ease`;
    el.style.backgroundPosition = "100% 100%, 0 0";
    hasPlayed.current = true;
  };

  const animateOut = () => {
    if (Platform.OS !== "web") return;
    const el = overlayRef.current;
    if (!el) return;
    if (playOnce && hasPlayed.current) {
      el.style.transition = "none";
      el.style.backgroundPosition = "-100% -100%, 0 0";
    } else {
      el.style.transition = `${transitionDuration}ms ease`;
      el.style.backgroundPosition = "-100% -100%, 0 0";
    }
  };

  // Web overlay style
  const overlayStyleWeb = {
    position: "absolute",
    inset: 0,
    background: `linear-gradient(${glareAngle}deg,
        hsla(0,0%,0%,0) 60%,
        ${rgba} 70%,
        hsla(0,0%,0%,0) 100%)`,
    backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "-100% -100%, 0 0",
    pointerEvents: "none",
    borderRadius,
    transition: `${transitionDuration}ms ease`,
    zIndex: 1,
  };

  // App overlay style (static, no hover)
  const overlayStyleApp = {
    ...StyleSheet.absoluteFillObject,
    borderRadius: typeof borderRadius === "number" ? borderRadius : undefined,
    zIndex: 1,
    // Simulate a subtle glare as a static gradient overlay
    backgroundColor: "transparent",
    ...(Platform.OS !== "web"
      ? {
          // Use a linear gradient if available, else fallback to a semi-transparent overlay
          // You can use expo-linear-gradient for a better effect
          // Here, we just use a semi-transparent overlay for simplicity
          backgroundColor: "rgba(255,255,255,0.08)",
        }
      : {}),
  };

  // Container style
  const containerStyle = [
    {
      width: typeof width === "number" ? width : undefined,
      height: typeof height === "number" ? height : undefined,
      backgroundColor: background,
      borderRadius: typeof borderRadius === "number" ? borderRadius : undefined,
      borderColor: borderColor,
      borderWidth: 1,
      overflow: "hidden",
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
      cursor: Platform.OS === "web" ? "pointer" : undefined,
    },
    style,
  ];

  if (Platform.OS === "web") {
    return (
      <div
        className={`relative grid place-items-center overflow-hidden border cursor-pointer ${className}`}
        style={{
          width,
          height,
          background,
          borderRadius,
          borderColor,
          ...style,
        }}
        onMouseEnter={animateIn}
        onMouseLeave={animateOut}
      >
        <div ref={overlayRef} style={overlayStyleWeb} />
        {children}
      </div>
    );
  }


  return (
    <View style={containerStyle}>
      <View pointerEvents="none" style={overlayStyleApp} />
      {children}
    </View>
  );
};

export default GlareHover;