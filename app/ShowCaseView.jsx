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
  ActivityIndicator,
}
from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import Markdown from "react-native-markdown-display";
import { useTheme } from "../context/ColorMode";
import { useAppwriteContext } from "../context/appwriteContext";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { databases, DATABASE_ID } from "../backend/appwrite";

// Helper function to get the appropriate icon component
const getExpoIconComponent = (family) => {
  switch (family) {
    case "ionicons":
      return Ionicons
    case "materialCommunity":
      return MaterialCommunityIcons
    case "fontawesome6":
      return FontAwesome6
    default:
      return Ionicons
  }
}

// Demo type configurations
const demoTypeConfigs = {
  web: { label: "Website", iconName: "earth", iconFamily: "ionicons" },
  github: { label: "GitHub", iconName: "logo-github", iconFamily: "ionicons" },
  googleplay: { label: "Google Play", iconName: "logo-android", iconFamily: "ionicons" },
  applestore: { label: "App Store", iconName: "logo-apple-appstore", iconFamily: "ionicons" },
}

const ShowCaseView = ({ data = null }) => {
  const handleBackPress = () => {
    router.back();
  };
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { theme } = useTheme();
  const { getCachedShowcase, setCachedShowcase, isCacheValid } = useAppwriteContext();
  const { id } = useLocalSearchParams();
  
  // State for managing data and loading
  const [showcaseData, setShowcaseData] = useState(data);
  const [loading, setLoading] = useState(!data && !!id);
  const [error, setError] = useState(null);

  // Collection ID for Appwrite
  const COLLECTION_ID = "686e24d4000a49ad0954";

  // Function to fetch showcase data from Appwrite
  const fetchShowcaseData = async (documentId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check cache first
      const cachedData = getCachedShowcase(documentId);
      if (cachedData && isCacheValid(documentId)) {
        setShowcaseData(cachedData.data);
        setLoading(false);
        return;
      }
      
      const response = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        documentId
      );
      
      // Cache the fetched data
      setCachedShowcase(documentId, response);
      setShowcaseData(response);
    } catch (err) {
      console.error('Error fetching showcase data:', err);
      setError(err.message || 'Failed to load showcase data');
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when component mounts if ID is provided and no data is passed
  useEffect(() => {
    if (!data && id) {
      // Check cache first before deciding to fetch
      const cachedData = getCachedShowcase(id);
      if (cachedData && isCacheValid(id)) {
        setShowcaseData(cachedData.data);
        setLoading(false);
      } else {
        fetchShowcaseData(id);
      }
    }
  }, [id, data, getCachedShowcase, isCacheValid]);

  // Use data in priority: props data > fetched data > smart-detected params data > fallback
  const payload = showcaseData || {
    title: "Loading...",
    tagline: "Please wait while we load the project data",
    description: `# Loading\nProject data is being loaded...`,
    coverImageUrl: "https://picsum.photos/seed/loading/1280/720",
    avatarUrl: "https://i.pravatar.cc/100",
    username: "Loading...",
    upvotes: 0,
    tags: JSON.stringify([]),
    demo: JSON.stringify([]),
  };

  // Parse tags and demo links from JSON strings
  const parsedTags = React.useMemo(() => {
    try {
      return typeof payload.tags === 'string' ? JSON.parse(payload.tags) : payload.tags || [];
    } catch {
      return [];
    }
  }, [payload.tags]);

  const parsedDemoLinks = React.useMemo(() => {
    try {
      return typeof payload.demo === 'string' ? JSON.parse(payload.demo) : payload.demo || [];
    } catch {
      return [];
    }
  }, [payload.demo]);

  // Group demo links by category
  const demoLinksByCategory = React.useMemo(() => {
    const downloads = [];
    const social = [];
    
    parsedDemoLinks.forEach((link) => {
      if (link.type === 'googleplay' || link.type === 'applestore') {
        downloads.push(link);
      } else {
        social.push(link);
      }
    });
    
    return { downloads, social };
  }, [parsedDemoLinks]);

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.mode === "dark" ? "#121212" : "#f5f5f5",
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator 
          size="large" 
          color={theme.mode === "dark" ? "#BB86FC" : "#007AFF"} 
        />
        <Text 
          style={{
            color: theme.mode === "dark" ? "#E0E0E0" : "#333",
            marginTop: 16,
            fontSize: 16,
          }}
        >
          Loading showcase...
        </Text>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.mode === "dark" ? "#121212" : "#f5f5f5",
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <Ionicons 
          name="alert-circle" 
          size={64} 
          color={theme.mode === "dark" ? "#ef4444" : "#dc2626"} 
        />
        <Text 
          style={{
            color: theme.mode === "dark" ? "#E0E0E0" : "#333",
            marginTop: 16,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Failed to Load Showcase
        </Text>
        <Text 
          style={{
            color: theme.mode === "dark" ? "#94a3b8" : "#64748b",
            marginTop: 8,
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          {error}
        </Text>
        <TouchableOpacity
          onPress={() => id && fetchShowcaseData(id)}
          style={{
            marginTop: 20,
            paddingHorizontal: 20,
            paddingVertical: 12,
            backgroundColor: theme.mode === "dark" ? "#BB86FC" : "#007AFF",
            borderRadius: 8,
          }}
        >
          <Text 
            style={{
              color: "#fff",
              fontWeight: 'bold',
            }}
          >
            Retry
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleBackPress}
          style={{
            marginTop: 12,
            paddingHorizontal: 20,
            paddingVertical: 12,
          }}
        >
          <Text 
            style={{
              color: theme.mode === "dark" ? "#E0E0E0" : "#333",
            }}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Markdown styles to match the original aesthetic
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
      fontSize: 20,
      lineHeight: 30,
    },
    bullet_list: {
      marginBottom: 10,
    },
    link: {
      color: theme.mode === "dark" ? "#BB86FC" : "#007AFF",
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
          maxWidth: isDesktop ? '70%' : "100%", // Maximum width for desktop
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
          {/* Left Column (Desktop) / Top Section (Mobile) - Project Info */}
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
              {payload.title !== "Loading..." && (payload.upvotes || payload.stars) && (
                <TouchableOpacity style={buttonStyle}>
                  <Ionicons
                    name="heart-outline"
                    size={18}
                    color={theme.mode === "dark" ? "#E0E0E0" : "#333"}
                  />
                  <Text style={buttonTextStyle}>{payload.upvotes || payload.stars || 0}</Text>
                </TouchableOpacity>
              )}
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

            {/* Cover Image - Show below tagline on mobile */}
            {!isDesktop && (
              <View
                style={{
                  backgroundColor: theme.mode === "dark" ? "#1F1E1E" : "#F0F0F0",
                  borderRadius: 10,
                  marginBottom: 20,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={{ uri: payload.coverImageUrl }}
                  style={{
                    width: "100%",
                    height: 200,
                    borderRadius: 10,
                  }}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Download the Application */}
            {demoLinksByCategory.downloads.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text className="font-pregular" style={sectionHeadingStyle}>Download the Application</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                  {demoLinksByCategory.downloads.map((link, index) => {
                    const config = demoTypeConfigs[link.type];
                    const IconComponent = getExpoIconComponent(config?.iconFamily || 'ionicons');
                    return (
                      <TouchableOpacity
                        key={index}
                        style={buttonStyle}
                        onPress={() => Linking.openURL(link.url)}
                      >
                        <IconComponent
                          name={config?.iconName || 'apps'}
                          size={18}
                          color={theme.mode === "dark" ? "#E0E0E0" : "#333"}
                        />
                        <Text style={buttonTextStyle}>{config?.label || link.type}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Stay in Touch */}
            {demoLinksByCategory.social.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text className="font-psemibold" style={sectionHeadingStyle}>Stay in Touch</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                  {demoLinksByCategory.social.map((link, index) => {
                    const config = demoTypeConfigs[link.type];
                    const IconComponent = getExpoIconComponent(config?.iconFamily || 'ionicons');
                    return (
                      <TouchableOpacity
                        key={index}
                        style={buttonStyle}
                        onPress={() => Linking.openURL(link.url)}
                      >
                        <IconComponent
                          name={config?.iconName || 'link'}
                          size={18}
                          color={theme.mode === "dark" ? "#E0E0E0" : "#333"}
                        />
                        <Text style={buttonTextStyle}>{config?.label || link.type}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Tags */}
            {parsedTags.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text className="font-psemibold" style={sectionHeadingStyle}>Tags</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {parsedTags.map((tag, index) => {
                    const IconComponent = getExpoIconComponent(tag.iconFamily || 'ionicons');
                    return (
                      <TouchableOpacity 
                        key={index} 
                        style={tagStyle}
                      >
                        {tag.iconName && (
                          <IconComponent
                            name={tag.iconName}
                            size={16}
                            color={tag.color || (theme.mode === "dark" ? "#E0E0E0" : "#333")}
                          />
                        )}
                        <Text 
                          className="font-psemibold" 
                          style={tagTextStyle}
                        >
                          {tag.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </View>

          {/* Right Column (Desktop only) - Cover Image */}
          {isDesktop && (
            <View
              style={{
                flex: 1,
                width: "50%",
              }}
            >
              <View
                style={{
                  backgroundColor: theme.mode === "dark" ? "#1F1E1E" : "#F0F0F0",
                  borderRadius: 10,
                  marginBottom: 20,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={{ uri: payload.coverImageUrl }}
                  style={{
                    width: "100%",
                    height: 300,
                    borderRadius: 10,
                  }}
                  resizeMode="cover"
                />
              </View>
            </View>
          )}
        </View>

        {/* Project Description - Only show if we have real content */}
        {payload.description && payload.title !== "Loading..." && (
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
        )}

        {/* Share Section - Only show if we have real project data */}
        {payload.title !== "Loading..." && (
          <View style={{ marginBottom: 20 }}>
            <Text className="font-psemibold" style={sectionHeadingStyle}>Share</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            <TouchableOpacity
              style={buttonStyle}
              onPress={() =>
                Linking.openURL(
                  `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    `https://builtwith.appwrite.io/projects/${id || 'showcase'}/`
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
                    `https://builtwith.appwrite.io/projects/${id || 'showcase'}/`
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
                    `https://builtwith.appwrite.io/projects/${id || 'showcase'}/`
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
                    `https://builtwith.appwrite.io/projects/${id || 'showcase'}/`
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
        )}

        
      </ScrollView>

      
    </SafeAreaView>
  );
};

export default ShowCaseView;