import React, { useState, useRef, useEffect } from "react";
import { View, Text, PanResponder, StyleSheet, TextInput, Pressable } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { useTheme } from "../context/ColorMode";

export default function ColorPicker({ 
  initialColor = "#374151", 
  onColorChange = () => {}, 
  size = 200, 
  showHexInput = true,
  showPresets = true 
}) {
  const { theme } = useTheme();
  const colors = theme?.mode === "dark"
    ? {
        background: "rgb(6, 10, 17)",
        foreground: "#f1f5f9",
        card: "rgb(7, 12, 21)",
        border: "#1e293b",
        input: "#1e293b",
        mutedForeground: "#94a3b8",
        primary: "#15803d",
        primaryForeground: "#fef2f2",
      }
    : {
        background: "rgb(236, 244, 240)",
        foreground: "#0f172a",
        card: "#fff",
        border: "#e2e8f0",
        input: "#e2e8f0",
        mutedForeground: "#64748b",
        primary: "#22c55e",
        primaryForeground: "#052e16",
      };

  // Convert hex to HSV
  const hexToHsv = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    if (diff !== 0) {
      if (max === r) h = ((g - b) / diff) % 6;
      else if (max === g) h = (b - r) / diff + 2;
      else h = (r - g) / diff + 4;
    }
    h = Math.round(60 * h);
    if (h < 0) h += 360;

    const s = max === 0 ? 0 : diff / max;
    const v = max;

    return [h, s, v];
  };

  // Initialize state from initial color
  const [h, s, v] = hexToHsv(initialColor);
  const [hue, setHue] = useState(h);
  const [sat, setSat] = useState(s);
  const [val, setVal] = useState(v);
  const [hexInput, setHexInput] = useState(initialColor);

  // Update hex input when initial color changes
  useEffect(() => {
    const [h, s, v] = hexToHsv(initialColor);
    setHue(h);
    setSat(s);
    setVal(v);
    setHexInput(initialColor);
  }, [initialColor]);

  const hsvToRgb = (h, s, v) => {
    let f = (n, k = (n + h / 60) % 6) =>
      v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
  };

  const rgbToHex = (r, g, b) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const updateColor = (newHue, newSat, newVal) => {
    const [r, g, b] = hsvToRgb(newHue, newSat, newVal);
    const hex = rgbToHex(r, g, b);
    setHue(newHue);
    setSat(newSat);
    setVal(newVal);
    setHexInput(hex);
    onColorChange(hex);
  };

  const handleHexInputChange = (text) => {
    setHexInput(text);
    if (text.match(/^#[0-9A-Fa-f]{6}$/)) {
      const [h, s, v] = hexToHsv(text);
      setHue(h);
      setSat(s);
      setVal(v);
      onColorChange(text);
    }
  };

  const svResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      const { locationX, locationY } = e.nativeEvent;
      const s = Math.max(0, Math.min(1, locationX / size));
      const v = Math.max(0, Math.min(1, 1 - locationY / size));
      updateColor(hue, s, v);
    },
    onPanResponderMove: (e) => {
      const { locationX, locationY } = e.nativeEvent;
      const s = Math.max(0, Math.min(1, locationX / size));
      const v = Math.max(0, Math.min(1, 1 - locationY / size));
      updateColor(hue, s, v);
    },
  });

  const hueResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      const h = Math.max(0, Math.min(1, e.nativeEvent.locationX / size)) * 360;
      updateColor(h, sat, val);
    },
    onPanResponderMove: (e) => {
      const h = Math.max(0, Math.min(1, e.nativeEvent.locationX / size)) * 360;
      updateColor(h, sat, val);
    },
  });

  return (
    <View style={styles.container}>
      {/* Main Color Picker */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        {/* Saturation-Value square */}
        <View {...svResponder.panHandlers} style={{ borderRadius: 12, overflow: 'hidden' }}>
          <Svg height={size} width={size}>
            <Defs>
              <LinearGradient id={`sat-${hue}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="white" />
                <Stop offset="100%" stopColor={`hsl(${hue},100%,50%)`} />
              </LinearGradient>
              <LinearGradient id={`val-${hue}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="transparent" />
                <Stop offset="100%" stopColor="black" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill={`url(#sat-${hue})`} />
            <Rect width="100%" height="100%" fill={`url(#val-${hue})`} />
          </Svg>
          {/* Picker dot */}
          <View
            style={{
              position: 'absolute',
              left: sat * size - 6,
              top: (1 - val) * size - 6,
              width: 12,
              height: 12,
              borderRadius: 6,
              borderWidth: 2,
              borderColor: 'white',
              backgroundColor: 'transparent',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
            }}
          />
        </View>

        {/* Hue bar */}
        <View {...hueResponder.panHandlers} style={{ marginTop: 16, borderRadius: 6, overflow: 'hidden' }}>
          <Svg height={24} width={size}>
            <Defs>
              <LinearGradient id="hue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="red" />
                <Stop offset="16%" stopColor="yellow" />
                <Stop offset="33%" stopColor="lime" />
                <Stop offset="50%" stopColor="cyan" />
                <Stop offset="66%" stopColor="blue" />
                <Stop offset="83%" stopColor="magenta" />
                <Stop offset="100%" stopColor="red" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#hue-gradient)" />
          </Svg>
          {/* Hue picker */}
          <View
            style={{
              position: 'absolute',
              left: (hue / 360) * size - 6,
              top: 6,
              width: 12,
              height: 12,
              borderRadius: 6,
              borderWidth: 2,
              borderColor: 'white',
              backgroundColor: 'transparent',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
            }}
          />
        </View>
      </View>

      {/* Current Color Preview */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <View style={[
          styles.preview, 
          { 
            backgroundColor: hexInput,
            borderColor: colors.border,
            shadowColor: colors.foreground,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }
        ]} />
        <Text style={{ 
          marginTop: 8, 
          color: colors.foreground, 
          fontFamily: 'monospace',
          fontSize: 14,
          fontWeight: '600'
        }}>
          {hexInput.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 0,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  preview: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
  },
});
