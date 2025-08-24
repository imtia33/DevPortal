import React, { memo, useMemo, useCallback } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ColorMode";
import { useAppwriteContext } from "../context/appwriteContext";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

const ShowCaseItem = ({ project, onPress }) => {
  const { theme } = useTheme();
  const { setCachedShowcase } = useAppwriteContext();

  // Memoize parsed tags to prevent recalculation
  const parsedTags = useMemo(() => {
    if (typeof project.tags === "string") {
      try {
        return JSON.parse(project.tags);
      } catch (e) {
        return [];
      }
    } else if (Array.isArray(project.tags)) {
      return project.tags;
    }
    return [];
  }, [project.tags]);

  // Memoize visible tags
  const { visibleTags, remainingTagsCount, hasMoreTags } = useMemo(() => {
    const maxVisibleTags = 3;
    const visibleTags = parsedTags.slice(0, maxVisibleTags);
    const remainingTagsCount = parsedTags.length - maxVisibleTags;
    const hasMoreTags = remainingTagsCount > 0;
    return { visibleTags, remainingTagsCount, hasMoreTags };
  }, [parsedTags]);

  // Memoize the onPress handler
  const handlePress = useCallback(() => {
    // Cache the project data for efficient navigation
    setCachedShowcase(project.$id || project.id, project);
    
    // Navigate with clean URL - only ID in params
    router.push(`/ShowCaseView?id=${project.$id || project.id}`);
  }, [project, setCachedShowcase]);

  
  const containerStyle = useMemo(() => ({
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    width: 350,
    height: 370,
    backgroundColor: theme.cardBackground,
    borderColor: theme.borderTopColor,
  }), [theme.cardBackground, theme.borderTopColor]);

  const imageContainerStyle = useMemo(() => ({
    padding: 10,
    borderRadius: 10,
  }), []);

  const imageStyle = useMemo(() => ({
    width: "100%",
    height: 180,
    borderRadius: 10,
  }), []);

  const contentStyle = useMemo(() => ({
    padding: 12,
    flex: 1,
  }), []);

  const titleContainerStyle = useMemo(() => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  }), []);

  const titleStyle = useMemo(() => ({
    fontSize: 20,
    flex: 1,
    marginRight: 8,
    color: theme.focusedText,
  }), [theme.focusedText]);

  const starsContainerStyle = useMemo(() => ({
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 0.5,
    padding: 10,
    borderRadius: 10,
    borderColor: 'rgba(95, 91, 91, 0.7)',
  }), []);

  const starsTextStyle = useMemo(() => ({
    fontSize: 14,
    color: theme.focusedText,
  }), [theme.focusedText]);

  const taglineStyle = useMemo(() => ({
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
    color: theme.focusedText,
  }), [theme.focusedText]);

  const tagsContainerStyle = useMemo(() => ({
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 6,
  }), []);

  const tagStyle = useMemo(() => ({
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textAlign: "center",
    backgroundColor: theme.secondTabBackground,
    color: theme.focusedText,
    borderWidth: 0.4,
  }), [theme.secondTabBackground, theme.focusedText]);

  const moreTagsStyle = useMemo(() => ({
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textAlign: "center",
    backgroundColor: theme.secondTabBackground,
    color: theme.focusedText,
    fontWeight: "600",
  }), [theme.secondTabBackground, theme.focusedText]);

  const userContainerStyle = useMemo(() => ({
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  }), []);

  const avatarStyle = useMemo(() => ({
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  }), []);

  const usernameStyle = useMemo(() => ({
    fontSize: 13,
    flex: 1,
    color: theme.focusedText,
  }), [theme.focusedText]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={containerStyle}
    >
      <View style={imageContainerStyle}>
        <Image
          source={{ uri: project.coverImageUrl }}
          style={imageStyle}
          resizeMode="cover"
        />
      </View>

      <View style={contentStyle}>
        <View style={titleContainerStyle}>
          <Text
            className="font-psemibold"
            style={titleStyle}
            numberOfLines={1}
          >
            {project.title}
          </Text>

          {project.stars != null && (
            <View style={starsContainerStyle}>
              <FontAwesome name="heart" size={20} color="#FD366E" />
              <Text style={starsTextStyle}>
                {project.stars}
              </Text>
            </View>
          )}
        </View>

        <Text
          numberOfLines={2}
          className="font-pthin"
          style={taglineStyle}
        >
          {project.tagline}
        </Text>

        <View style={tagsContainerStyle}>
          {visibleTags.map((tag, index) => {
            // Handle both old string format and new object format
            const tagName = typeof tag === 'string' ? tag : tag.name || tag;
            return (
              <Text
                key={`${tagName}-${index}`}
                className="font-psemibold"
                style={tagStyle}
              >
                {tagName}
              </Text>
            );
          })}

          {hasMoreTags && (
            <Text
              className="font-psemibold"
              style={moreTagsStyle}
            >
              +{remainingTagsCount}
            </Text>
          )}
        </View>

        <View style={userContainerStyle}>
          <Image
            source={{ uri: project.avatarUrl }}
            style={avatarStyle}
          />
          <Text
            className="font-psemibold"
            style={usernameStyle}
            numberOfLines={1}
          >
            {project.username}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ShowCaseItem);