"use client"

import { useEffect, useMemo, useState } from "react"
import { Ionicons, MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons"
import { useTheme } from "../context/ColorMode"
import { ICON_FAMILIES, getIconsByFamily } from "../imports/expoIcons"
import { View, Text, ScrollView, TextInput, Pressable, ActivityIndicator } from "react-native"

export default function IconPicker({ onSelect, onSelectIcon, selectedIcon }) {
  const { theme } = useTheme()
  const isDark = theme?.mode === "dark"
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleCount, setVisibleCount] = useState(25)
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const rAF = requestAnimationFrame(() => setIsMounted(true))
    const t = setTimeout(() => setIsMounted(true), 0)
    return () => { cancelAnimationFrame(rAF); clearTimeout(t) }
  }, [])

  // ✅ always load ALL icons
  const baseList = useMemo(() => {
    if (!isMounted) return []
    return Object.keys(ICON_FAMILIES)
      .map((famKey) =>
        getIconsByFamily(famKey).map((i) => ({ ...i, family: famKey }))
      )
      .flat()
  }, [isMounted])

  const filteredList = useMemo(() => {
    if (!isMounted) return []
    const term = searchTerm.trim().toLowerCase()
    return term ? baseList.filter((i) => i.name.toLowerCase().includes(term)) : baseList
  }, [baseList, searchTerm, isMounted])

  const icons = useMemo(() => filteredList.slice(0, visibleCount), [filteredList, visibleCount])

  useEffect(() => {
    if (isMounted && icons.length >= 0) setIsLoading(false)
  }, [isMounted, icons.length])

  const totalCount = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return term ? baseList.filter((i) => i.name.toLowerCase().includes(term)).length : baseList.length
  }, [baseList, searchTerm])

  useEffect(() => {
    setIsLoading(true)
    setVisibleCount(25)
    const rAF = requestAnimationFrame(() => setIsLoading(false))
    return () => cancelAnimationFrame(rAF)
  }, [searchTerm])

  // Helper: pick correct component per family
  const getComponentByFamily = (family) => {
    switch (family) {
      case "materialCommunity":
        return MaterialCommunityIcons
      case "fontawesome6":
        return FontAwesome6
      case "ionicons":
      default:
        return Ionicons
    }
  }

  return (
    <View style={{ flex: 1, padding: 0 }}>
      {/* Search bar */}
      <View style={{ paddingHorizontal: 16, marginVertical: 8 }}>
        <TextInput
          placeholder="Search icons..."
          placeholderTextColor={theme?.secondaryText}
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={{
            height: 40,
            borderWidth: 1,
            borderColor: theme?.ring || theme?.borderColor,
            borderRadius: 10,
            paddingHorizontal: 12,
            color: theme?.text,
            backgroundColor: theme?.cardBackground || theme?.background,
          }}
        />
      </View>

      {/* Loading */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 24 }}>
          <ActivityIndicator size="small" color={theme?.ring || "#22c55e"} />
          <Text style={{ marginTop: 8, color: theme?.secondaryText, fontSize: 12 }}>Loading icons…</Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 8, flexDirection: "row", flexWrap: "wrap" }}
        >
          {icons.map((icon) => {
            const PerIconComp = getComponentByFamily(icon.family)
            const isSelected = !!selectedIcon && icon.name === selectedIcon
            return (
              <Pressable
                key={`${icon.family}:${icon.name}`}
                onPress={() => (onSelectIcon || onSelect)?.(icon.name, icon.family)}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: isSelected ? (theme?.ring || theme?.borderColor) : theme?.borderColor,
                  alignItems: "center",
                  justifyContent: "center",
                  margin: 6,
                  backgroundColor: isSelected
                    ? (isDark ? "#2A2A2E" : "#F3F4F6")
                    : (theme?.cardBackground || theme?.background),
                }}
              >
                <PerIconComp name={icon.name} size={26} color={isDark ? "#FFFFFF" : "#000000"} />
              </Pressable>
            )
          })}
        </ScrollView>
      )}

      {/* Footer */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingBottom: 8,
        }}
      >
        <Text style={{ color: theme?.secondaryText, fontSize: 12 }}>
          Showing {icons.length} of {totalCount} icons
        </Text>
        {icons.length < filteredList.length && (
          <Pressable
            onPress={() => setVisibleCount((c) => c + 25)}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderWidth: 1,
              borderColor: theme?.borderColor,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: theme?.text, fontSize: 12 }}>Load more</Text>
          </Pressable>
        )}
      </View>
    </View>
  )
}
