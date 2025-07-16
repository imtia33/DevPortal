import {
  View,
  Text,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import React from "react";
import Markdown from "react-native-markdown-display";
import { useTheme } from "../context/ColorMode";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ShowCaseView = () => {
  const handleBackPress = () => {
    router.back();
  };

  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { theme } = useTheme();

  // Sample payload
  const payload = {
    title: "DevSpace Showcase",
    tagline: "Boost your productivity with DevSpace!",
    description: `# DevSpace

**DevSpace** is a tool for developers that streamlines your workflow.

## Features
- 🚀 Create beautiful project pages
- 🤝 Collaborate with other developers
- 📚 Learn and get feedback

> _Boost your productivity and showcase your work!_

[Visit our website](https://devspace.com)
    `,
    coverImageUrl: "https://picsum.photos/800/400",
    avatarUrl: "https://i.pravatar.cc/100",
    username: "John Doe",
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
      }}
    >
      <TouchableOpacity
        onPress={handleBackPress}
        style={{
          marginBottom: 16,
        }}
      >
        <Ionicons name="arrow-back" size={24} color={theme.textColor} />
      </TouchableOpacity>
      <Image
        source={{ uri: payload.coverImageUrl }}
        style={{
          width: "100%",
          height: isDesktop ? 400 : 200,
          borderRadius: 8,
        }}
      />
      <View
        style={{
          marginTop: 16,
        }}
      >
        <Text
          style={{
            fontSize: isDesktop ? 24 : 20,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {payload.title}
        </Text>
        <Text
          style={{
            fontSize: isDesktop ? 18 : 16,
            color: "#666",
            marginVertical: 8,
          }}
        >
          {payload.tagline}
        </Text>
        <Markdown
          style={{
            // Add any specific markdown styles here
          }}
        >
          {payload.description}
        </Markdown>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <Image
            source={{ uri: payload.avatarUrl }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: 8,
            }}
          />
          <Text
            style={{
              fontSize: 16,
              color: "#333",
            }}
          >
            {payload.username}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ShowCaseView;
