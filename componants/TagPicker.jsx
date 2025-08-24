import React from "react"
import { View, Text, ScrollView, Pressable, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ColorMode"

// Accepts: visible, onClose, selectedTags, onAddTag, onRemoveTag, onClearAll, tagCategories, maxTags
export default function TagPicker({
  visible,
  onClose,
  selectedTags = [],
  onAddTag,
  onRemoveTag,
  onClearAll,
  tagCategories,
  maxTags = 10,
}) {
  const { theme } = useTheme()
  const colors = theme?.mode === "dark"
    ? {
        background: "rgb(6, 10, 17)",
        foreground: "#f1f5f9",
        card: "rgb(7, 12, 21)",
        primary: "#15803d",
        primaryForeground: "#fef2f2",
        secondary: "#1e293b",
        secondaryForeground: "#f1f5f9",
        muted: "#1e293b",
        mutedForeground: "#94a3b8",
        destructive: "#7f1d1d",
        border: "#1e293b",
      }
    : {
        background: "rgb(236, 244, 240)",
        foreground: "#0f172a",
        card: "#fff",
        primary: "#22c55e",
        primaryForeground: "#052e16",
        secondary: "#f1f5f9",
        secondaryForeground: "#0f172a",
        muted: "#f1f5f9",
        mutedForeground: "#64748b",
        destructive: "#ef4444",
        border: "#e2e8f0",
      }
  const selectedTagsSet = React.useMemo(() => new Set(selectedTags.map((t) => t.name)), [selectedTags])
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", padding: 16 }}>
        {/* Backdrop press to close */}
        <Pressable onPress={onClose} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <View style={{ width: "100%", maxWidth: 900, maxHeight: "85%", backgroundColor: colors.card, borderRadius: 24, borderWidth: 1, borderColor: colors.border + "30", overflow: "hidden" }}>
          <View style={{ padding: 16, borderBottomWidth: 1, borderColor: colors.border + "50", backgroundColor: colors.muted }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: 'wrap', gap: 8 }}>
              <View style={{ flexShrink: 1, paddingRight: 8 }}>
                <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: "700" }}>Select Project Tags</Text>
                <Text style={{ color: colors.mutedForeground, marginTop: 4, fontSize: 12 }}>Choose technologies and platforms that power your project</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ backgroundColor: colors.primary, color: colors.primaryForeground, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, fontSize: 12 }}>{Math.min(selectedTagsSet.size, maxTags)}/{maxTags}</Text>
                <Pressable onPress={onClose} hitSlop={8} style={{ padding: 10, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="close" size={20} color={colors.foreground} />
                </Pressable>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 }}>
              <Text style={{ backgroundColor: colors.primary, color: colors.primaryForeground, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, fontSize: 12 }}>{Math.min(selectedTagsSet.size, maxTags)}/{maxTags} selected</Text>
              {selectedTagsSet.size > 0 && (
                <Pressable onPress={onClearAll}>
                  <Text style={{ color: colors.destructive, fontSize: 12 }}>Clear all</Text>
                </Pressable>
              )}
            </View>
          </View>
          <ScrollView style={{ padding: 16 }} contentContainerStyle={{ paddingBottom: 16 }}>
            {Object.entries(tagCategories).map(([category, tags]) => (
              <View key={category} style={{ marginBottom: 16 }}>
                <Text style={{ color: colors.foreground, fontWeight: "700", marginBottom: 8 }}>{category}</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {tags.map((tag) => {
                    const isSelected = selectedTagsSet.has(tag.name)
                    const limitReached = selectedTags.length >= maxTags
                    return (
                      <Pressable
                        key={tag.name}
                        onPress={() => (isSelected ? onRemoveTag(tag.name) : onAddTag(tag, category.toLowerCase()))}
                        disabled={limitReached && !isSelected}
                        style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, backgroundColor: isSelected ? tag.defaultColor + "22" : colors.background, borderColor: isSelected ? tag.defaultColor + "55" : colors.border + "60", opacity: limitReached && !isSelected ? 0.5 : 1 }}
                      >
                        <Text style={{ color: isSelected ? tag.defaultColor : colors.foreground, fontSize: 13 }}>{tag.name}</Text>
                      </Pressable>
                    )
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={{ padding: 16, borderTopWidth: 1, borderColor: colors.border + "50", backgroundColor: colors.muted }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
              <Pressable onPress={onClose} style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.secondary }}>
                <Text style={{ color: colors.secondaryForeground, fontWeight: "600" }}>Done</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}
