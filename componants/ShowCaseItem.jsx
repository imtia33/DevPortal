import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ColorMode";
import { FontAwesome } from "@expo/vector-icons";

const ShowoffCard = ({ project, onPress }) => {
  const { theme } = useTheme();

  const maxVisibleTags = 3;
  const visibleTags = project.tags?.slice(0, maxVisibleTags) || [];
  const remainingTagsCount = (project.tags?.length || 0) - maxVisibleTags;
  const hasMoreTags = remainingTagsCount > 0;

  return (
    <TouchableOpacity
      onPress={() => onPress?.(project)}
      activeOpacity={0.8}
      style={{
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
      }}
    >
      <View
        style={{
          padding: 10,
          borderRadius: 10,
        }}
      >
        <Image
          source={{ uri: project.coverImageUrl }}
          style={{
            width: "100%",
            height: 180,
            borderRadius: 10,
          }}
          resizeMode="cover"
        />
      </View>

      <View
        style={{
          padding: 12,
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 4,
          }}
        >
          <Text
            className="font-psemibold"
            style={{
              fontSize: 20,
              flex: 1,
              marginRight: 8,
              color: theme.focusedText,
            }}
            numberOfLines={1}
          >
            {project.title}
          </Text>

          {project.stats?.stars != null && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                borderWidth:0.5,
                padding:10,
                borderRadius:10,
                borderColor: 'rgba(95, 91, 91, 0.7)',
              }}
            >
              <FontAwesome name="heart" size={20} color="#FD366E" />
              <Text
                style={{
                  fontSize: 14,
                  color: theme.focusedText,
                }}
              >
                {project.stats.stars}
              </Text>
            </View>
          )}
        </View>

        <Text
          numberOfLines={2}
          className="font-pthin"
          style={{
            fontSize: 14,
            marginTop: 4,
            lineHeight: 20,
            color: theme.focusedText,
          }}
        >
          {project.tagline}
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 8,
            gap: 6,
          }}
        >
          {visibleTags.map((tag, index) => (
            <Text
              key={`${tag}-${index}`}
              className="font-psemibold"
              style={{
                fontSize: 12,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                textAlign: "center",
                backgroundColor: theme.secondTabBackground,
                color: theme.focusedText,
                borderWidth:0.4,
                
              }}
            >
              {tag}
            </Text>
          ))}

          {hasMoreTags && (
            <Text
              className="font-psemibold"
              style={{
                fontSize: 12,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                textAlign: "center",
                backgroundColor: theme.secondTabBackground,
                color: theme.focusedText,
                fontWeight: "600",
              }}
            >
              +{remainingTagsCount}
            </Text>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 12,
          }}
        >
          <Image
            source={{ uri: project.owner.avatarUrl }}
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              marginRight: 8,
            }}
          />
          <Text
            className="font-psemibold"
            style={{
              fontSize: 13,
              flex: 1,
              color: theme.focusedText,
            }}
            numberOfLines={1}
          >
            {project.owner.username}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ShowoffCard;