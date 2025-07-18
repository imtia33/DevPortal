import {
  View,
  Text,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  StyleSheet,
}
from "react-native";
import React from "react";
import Markdown from "react-native-markdown-display";
import { useTheme } from "../context/ColorMode"; // Assuming this path is correct
import { router } from "expo-router"; // Assuming expo-router is used
import { Ionicons } from "@expo/vector-icons"; // For icons
import { SafeAreaView } from "react-native-safe-area-context"; // For safe area handling

const ShowCaseView = () => {
  const handleBackPress = () => {
    router.back();
  };
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { theme } = useTheme();

  // Sample payload - extended to include more data
  const payload = {
    title: "Paralino",
    tagline: "Secure, private, encrypted",
    description: `# Paralino
Paralino is the ultimate location sharing app that provides a safe, secure, and private way to share your real-time location with friends and family. With advanced end-to-end encryption, your location data is protected and only accessible to those you choose.

🔒 **Secure Real-Time Location Sharing**
*   Share your GPS location in real-time on a live map.
*   End-to-end encryption ensures only authorized users can see your location.

📍 **Place Alerts**
*   Set up geofences and receive instant push notifications when someone enters or leaves predefined areas like home, work, or school.
*   Stay connected and informed about your loved ones' whereabouts.

📱 **Multiple Device Support**
*   Connect and track multiple devices under one account.
*   Ideal for families or groups wanting to stay connected.

⚙️ **Full Control Over Your Privacy**
*   Share your location for a specific time without revealing additional data like speed or battery level.
*   Pause or stop sharing at any time.

🔋 **Device Status Monitoring**
*   View detailed device information such as battery level, speed, elevation, signal strength, and permissions.
*   You are still in control what device information you want to share.

👥 **Group Location Sharing**
*   Create multiple groups with different members.
*   Control what you share with each group separately.

🔋 **Battery Efficient**
*   Optimized to minimize battery usage while sharing location.
*   Location is shared periodically or when requested by other members.

🛡️ **Advanced Encryption**
*   Paralino uses robust end-to-end encryption protocols to keep your location data private.
*   Your data is only readable by you and the people you choose to share it with.

🚫 **No Ads, No Tracking**
*   We respect your privacy and do not display ads or track your data.
*   We don't have your information and therefore we can not misuse it.
    `,
    coverImageUrl: "https://picsum.photos/seed/paralino/1280/720", // Placeholder for a project image
    avatarUrl: "https://i.pravatar.cc/100", // Placeholder for user avatar
    username: "Appwrite Team",
    upvotes: 6,
    googlePlayUrl: "https://play.google.com/store/apps/details?id=app.paralino.android",
    websiteUrl: "https://paralino.com",
    githubUrl: "https://github.com/paralino",
    twitterUrl: "https://x.com/heyzlmr",
    tags: [
      { name: "Android", icon: "logo-android" },
      { name: "SaaS", icon: null },
      { name: "Databases", icon: "server-outline" },
      { name: "Authentication", icon: "people-outline" },
      { name: "Messaging", icon: "chatbox-outline" },
      { name: "Functions", icon: "flash-outline" },
      { name: "Realtime", icon: "time-outline" },
    ],
  };

  // Markdown styles to match the general aesthetic
  const markdownStyles = StyleSheet.create({
    body: {
      color: theme.mode === "dark" ? "#E0E0E0" : "#333",
      fontSize: 20,
      lineHeight: 30,
      fontFamily: "Poppins-Regular",
    },
    heading1: {
      color: theme.mode === "dark" ? "#FFF" : "#222",
      fontSize: 34,
      fontWeight: "bold",
      marginTop: 24,
      marginBottom: 14,
      fontFamily: "Poppins-Bold",
    },
    heading2: {
      color: theme.mode === "dark" ? "#FFF" : "#222",
      fontSize: 28,
      fontWeight: "bold",
      marginTop: 20,
      marginBottom: 10,
      fontFamily: "Poppins-SemiBold",
    },
    heading3: {
      color: theme.mode === "dark" ? "#FFF" : "#222",
      fontSize: 24,
      fontWeight: "bold",
      marginTop: 18,
      marginBottom: 8,
      fontFamily: "Poppins-SemiBold",
    },
    paragraph: {
      color: theme.mode === "dark" ? "#E0E0E0" : "#333",
      marginBottom: 14,
      fontFamily: "Poppins-Regular",
      fontSize: 20,
      lineHeight: 30,
    },
    strong: {
      fontWeight: "bold",
    },
    list_item: {
      color: theme.mode === "dark" ? "#E0E0E0" : "#333",
      marginBottom: 5,
    },
    bullet_list: {
      marginBottom: 10,
    },
    link: {
      color: theme.mode === "dark" ? "#BB86FC" : "#007AFF", // A purple/blue for links
      textDecorationLine: "underline",
    },
    blockquote: {
      backgroundColor: theme.mode === "dark" ? "#282828" : "#F0F0F0",
      borderLeftWidth: 4,
      borderLeftColor: theme.mode === "dark" ? "#BB86FC" : "#007AFF",
      paddingLeft: 10,
      marginVertical: 10,
    },
  });

  const buttonStyle = {
    backgroundColor: theme.mode === "dark" ? "#333" : "#F0F0F0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  };

  const buttonTextStyle = {
    color: theme.mode === "dark" ? "#E0E0E0" : "#333",
    fontSize: 17,
  };

  const tagStyle = {
    backgroundColor: theme.mode === "dark" ? "#333" : "#F0F0F0",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  };

  const tagTextStyle = {
    color: theme.mode === "dark" ? "#E0E0E0" : "#333",
    fontSize: 16,
  };

  const sectionHeadingStyle = {
    color: theme.mode === "dark" ? "#FFF" : "#222",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.mode === "dark" ? "#121212" : "#f5f5f5",
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.mode === "dark" ? "#121212" : "#f5f5f5",
        }}
        contentContainerStyle={{
          padding: isDesktop ? 30 : 20,
          maxWidth: isDesktop ? 1600 : "100%", // Maximum width for desktop
          alignSelf: "center",
        }}
      >
        {/* Simulated header gap */}
        <View style={{ height: isDesktop ? 48 : 24 }} />
        {/* Back to Projects */}
        <TouchableOpacity
          onPress={handleBackPress}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            alignSelf: "flex-start",
          }}
        >
          <Ionicons
            name="chevron-back-outline"
            size={18}
            color={theme.mode === "dark" ? "#BB86FC" : "#007AFF"}
          />
          <Text
            style={{
              color: theme.mode === "dark" ? "#BB86FC" : "#007AFF",
              fontSize: 16,
              marginLeft: 5,
            }}
          >
            Back to Projects
          </Text>
        </TouchableOpacity>

        {/* Main Content Area: Info/Tags (Left) and Image (Right) on Desktop */}
        <View
          style={{
            flexDirection: isDesktop ? "row" : "column",
            alignItems: isDesktop ? "flex-start" : "stretch",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          {/* Left Column (Desktop) / Top Section (Mobile) - Project Info & Buttons */}
          <View
            style={{
              flex: isDesktop ? 1 : undefined,
              marginRight: isDesktop ? 30 : 0,
              marginBottom: isDesktop ? 0 : 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text
                className="font-pbold"
                style={{
                  color: theme.mode === "dark" ? "#FFF" : "#222",
                  fontSize: 36,
                  fontWeight: "bold",
                  marginRight: 10,
                }}
              >
                {payload.title}
              </Text>
              <TouchableOpacity style={buttonStyle}>
                <Ionicons
                  name="heart-outline"
                  size={18}
                  color={theme.mode === "dark" ? "#E0E0E0" : "#333"}
                />
                <Text style={buttonTextStyle}>{payload.upvotes}</Text>
              </TouchableOpacity>
            </View>
            <Text
              className="font-plight"
              style={{
                color: theme.mode === "dark" ? "#E0E0E0" : "#555",
                fontSize: 22,
                marginBottom: 20,
              }}
            >
              {payload.tagline}
            </Text>

            {/* Download the Application */}
            <View style={{ marginBottom: 20 }}>
              <Text className="font-psemibold" style={sectionHeadingStyle}>Download the Application</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {payload.googlePlayUrl && (
                  <TouchableOpacity
                    style={buttonStyle}
                    onPress={() => Linking.openURL(payload.googlePlayUrl)}
                  >
                    <Ionicons
                      name="logo-google-playstore"
                      size={18}
                      color={theme.mode === "dark" ? "#E0E0E0" : "#333"}
                    />
                    <Text className="font-psemibold" style={buttonTextStyle}>Google Play</Text>
                  </TouchableOpacity>
                )}
                {/* Add App Store button if applicable */}
              </View>
            </View>

            {/* Stay in Touch */}
            <View style={{ marginBottom: 20 }}>
              <Text className="font-psemibold" style={sectionHeadingStyle}>Stay in Touch</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {payload.websiteUrl && (
                  <TouchableOpacity
                    style={buttonStyle}
                    onPress={() => Linking.openURL(payload.websiteUrl)}
                  >
                    <Ionicons
                      name="globe-outline"
                      size={18}
                      color={theme.mode === "dark" ? "#E0E0E0" : "#333"}
                    />
                    <Text className="font-psemibold" style={buttonTextStyle}>Visit Website</Text>
                  </TouchableOpacity>
                )}
                {payload.githubUrl && (
                  <TouchableOpacity
                    style={buttonStyle}
                    onPress={() => Linking.openURL(payload.githubUrl)}
                  >
                    <Ionicons
                      name="logo-github"
                      size={18}
                      color={theme.mode === "dark" ? "#E0E0E0" : "#333"}
                    />
                    <Text className="font-psemibold" style={buttonTextStyle}>View on GitHub</Text>
                  </TouchableOpacity>
                )}
                {payload.twitterUrl && (
                  <TouchableOpacity
                    style={buttonStyle}
                    onPress={() => Linking.openURL(payload.twitterUrl)}
                  >
                    <Ionicons
                      name="logo-twitter"
                      size={18}
                      color={theme.mode === "dark" ? "#E0E0E0" : "#333"}
                    />
                    <Text className="font-psemibold" style={buttonTextStyle}>Follow on Twitter</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Tags */}
            <View style={{ marginBottom: 20 }}>
              <Text className="font-psemibold" style={sectionHeadingStyle}>Tags</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {payload.tags.map((tag, index) => (
                  <TouchableOpacity key={index} style={tagStyle}>
                    {tag.icon && (
                      <Ionicons
                        name={tag.icon} // Type assertion for Ionicons name
                        size={16}
                        color={theme.mode === "dark" ? "#E0E0E0" : "#333"}
                      />
                    )}
                    <Text className="font-psemibold" style={tagTextStyle}>{tag.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Right Column (Desktop) / Bottom Section (Mobile) - Cover Image */}
          <View
            style={{
              flex: isDesktop ? 1 : undefined,
              width: isDesktop ? "50%" : "100%",
            }}
          >
            {/* Cover Image */}
            <View
              style={{
                backgroundColor: theme.mode === "dark" ? "#1F1E1E" : "#F0F0F0",
                borderRadius: 10,
                marginBottom: 20,
                overflow: "hidden", // Ensures image respects border radius
              }}
            >
              <Image
                source={{ uri: payload.coverImageUrl }}
                style={{
                  width: "100%",
                  height: isDesktop ? 300 : 200,
                  borderRadius: 10, // Apply to image directly for better control
                }}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Project Description (Full Width Below Image/Tags) */}
        <View
          style={{
            backgroundColor: theme.mode === "dark" ? "#1A1A1A" : "#FFF",
            borderRadius: 10,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <Markdown style={markdownStyles}>{payload.description}</Markdown>
        </View>

        {/* Share Section */}
        <View style={{ marginBottom: 20 }}>
          <Text className="font-psemibold" style={sectionHeadingStyle}>Share</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            <TouchableOpacity
              style={buttonStyle}
              onPress={() =>
                Linking.openURL(
                  `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    `https://builtwith.appwrite.io/projects/66f18039bb0437ddf8be/`
                  )}&text=${encodeURIComponent(
                    `Built with Appwrite: ${payload.title}`
                  )}`
                )
              }
            >
              <Ionicons
                name="logo-twitter"
                size={20}
                color={theme.mode === "dark" ? "#E0E0E0" : "#333"}
              />
              <Text className="font-psemibold" style={buttonTextStyle}>Twitter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={buttonStyle}
              onPress={() =>
                Linking.openURL(
                  `https://www.facebook.com/sharer.php?u=${encodeURIComponent(
                    `https://builtwith.appwrite.io/projects/66f18039bb0437ddf8be/`
                  )}`
                )
              }
            >
              <Ionicons
                name="logo-facebook"
                size={20}
                color={theme.mode === "dark" ? "#E0E0E0" : "#333"}
              />
              <Text className="font-psemibold" style={buttonTextStyle}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={buttonStyle}
              onPress={() =>
                Linking.openURL(
                  `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                    `https://builtwith.appwrite.io/projects/66f18039bb0437ddf8be/`
                  )}&title=${encodeURIComponent(
                    `Built with Appwrite: ${payload.title}`
                  )}&source=BuiltWithAppwrite`
                )
              }
            >
              <Ionicons
                name="logo-linkedin"
                size={20}
                color={theme.mode === "dark" ? "#E0E0E0" : "#333"}
              />
              <Text className="font-psemibold" style={buttonTextStyle}>LinkedIn</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={buttonStyle}
              onPress={() =>
                Linking.openURL(
                  `https://www.reddit.com/submit?url=${encodeURIComponent(
                    `https://builtwith.appwrite.io/projects/66f18039bb0437ddf8be/`
                  )}&title=${encodeURIComponent(
                    `Built with Appwrite: ${payload.title}`
                  )}`
                )
              }
            >
              <Ionicons
                name="logo-reddit"
                size={20}
                color={theme.mode === "dark" ? "#E0E0E0" : "#333"}
              />
              <Text className="font-psemibold" style={buttonTextStyle}>Reddit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={buttonStyle}
              onPress={() =>
                Linking.openURL(
                  `mailto:?subject=${encodeURIComponent(
                    `Built with Appwrite: ${payload.title}`
                  )}&body=${encodeURIComponent(payload.tagline)}`
                )
              }
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={theme.mode === "dark" ? "#E0E0E0" : "#333"}
              />
              <Text className="font-psemibold" style={buttonTextStyle}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      
    </SafeAreaView>
  );
};

export default ShowCaseView;