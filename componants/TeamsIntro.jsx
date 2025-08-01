
import { useState, useEffect, useRef, useCallback } from "react"
import { useTheme as useColorModeTheme } from "../context/ColorMode"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  Image,
} from "react-native"
import { Ionicons, Octicons } from "@expo/vector-icons"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

const DESKTOP_WIDTH = 1024 // You can adjust this threshold as needed

const isDesktop = Platform.OS === "web" && screenWidth >= DESKTOP_WIDTH

const project = {
  name: "Axhibit",
  contributors: 4,
  performance: 92,
  commits: 156,
  prs: 23,
  issues: 8,
}

const mockActivities = [
  {
    id: 1,
    user: "Tareef",
    userAvatar:'https://fra.cloud.appwrite.io/v1/storage/buckets/688c76c10013852b5c48/files/688c781800203c6d5d5c/view?project=684ac8600032f6eccf56',
    action: "added a PR",
    details: "Feature: Payment integration",
    comment: "Ready for review! Added Stripe integration",
    type: "pr",
    icon: "git-pull-request",
    color: "#FD366E",
    bgColor: "#F4F4F7",
    time: "2m ago",
    isGood: true,
  },
  {
    id: 2,
    user: "Shalman",
    userAvatar:'https://fra.cloud.appwrite.io/v1/storage/buckets/688c76c10013852b5c48/files/688c76cf0018c9ead36e/view?project=684ac8600032f6eccf56',
    action: "added a fix",
    details: "Bug: Cart validation error",
    comment: "Fixed product quantity validation",
    type: "fix",
    icon: "flash",
    color: "#FD366E",
    bgColor: "#F4F4F7",
    time: "5m ago",
    isGood: true,
  },
  {
    id: 3,
    user: "Musa",
    userAvatar:'https://fra.cloud.appwrite.io/v1/storage/buckets/688c76c10013852b5c48/files/688c77d40019f93e7650/view?project=684ac8600032f6eccf56',
    action: "tests failed",
    details: "Tests failed 3",
    comment: "Unit tests failing in checkout module",
    type: "error",
    icon: "warning",
    color: "#FD366E",
    bgColor: "#F4F4F7",
    time: "8m ago",
    isGood: false,
  },
  {
    id: 4,
    user: "Imtiaz",
    userAvatar:'https://scontent.fcgp3-1.fna.fbcdn.net/v/t39.30808-6/470188051_1539874426696401_2069158741001139087_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=bjOU-sNpUdsQ7kNvwG0HUnb&_nc_oc=AdnBCdpQrYU-qxpbWOPWDa5WssxG8zy55WMO6-i157CEKgcFyKkTt69qTjoPIl5I5yk&_nc_zt=23&_nc_ht=scontent.fcgp3-1.fna&_nc_gid=ZPn3q9SbBIDhH1pgd1N0Tg&oh=00_AfSodde_YkDh6k84QAd9LHx3FWXWkp8iQI55iGguWQOBWw&oe=68926435',
    action: "commented on PR",
    details: "PR #125: API optimization",
    comment: "Great work! Consider adding caching layer",
    type: "comment",
    icon: "chatbubble",
    color: "#FD366E",
    bgColor: "#F4F4F7",
    time: "12m ago",
    isGood: true,
  },
  {
    id: 5,
    user: "Shalman",
    userAvatar:'https://fra.cloud.appwrite.io/v1/storage/buckets/688c76c10013852b5c48/files/688c76cf0018c9ead36e/view?project=684ac8600032f6eccf56',
    action: "tests failed",
    details: "Tests failed 7",
    comment: "Integration tests timing out on payment flow",
    type: "error",
    icon: "alert-circle",
    color: "#FD366E",
    bgColor: "#F4F4F7",
    time: "15m ago",
    isGood: false,
  },
]

export default function GitHubProjectCard({ theme: propTheme = {} }) {
  
  // Use theme from context, fallback to propTheme if provided
  const contextTheme = useColorModeTheme?.() || {}
  const theme = { ...contextTheme, ...propTheme }

  const [showMembers, setShowMembers] = useState(false)
  const [visibleActivities, setVisibleActivities] = useState([])
  const [hasAnimated, setHasAnimated] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")
  const [popupType, setPopupType] = useState("success")
  const [crashCount, setCrashCount] = useState(3000)
  const [isCountingCrash, setIsCountingCrash] = useState(false)
  const [processedActivities, setProcessedActivities] = useState([])
  const [showCrashPopup, setShowCrashPopup] = useState(false)
  const [isReverting, setIsReverting] = useState(false)
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [comment, setComment] = useState("")
  const [showSignUp, setShowSignUp] = useState(false)
  const [showCodePopup, setShowCodePopup] = useState(false)

  const fadeAnims = useRef(mockActivities.map(() => new Animated.Value(1))).current // default to visible

  useEffect(() => {
    setTimeout(() => {
      setShowMembers(true)
    }, 800)
  }, [])

  // Animation trigger for both click (desktop) and "in view" (mobile/tablet)
  const triggerAnimation = useCallback(() => {
    if (!hasAnimated && showMembers) {
      setHasAnimated(true)
      const availableActivities = mockActivities.filter((_, index) => !processedActivities.includes(index))
      availableActivities.forEach((activity, displayIndex) => {
        const originalIndex = mockActivities.findIndex((a) => a.id === activity.id)
        setTimeout(() => {
          setVisibleActivities((prev) => [...prev, originalIndex])
          Animated.timing(fadeAnims[originalIndex], {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start()
        }, displayIndex * 100)
      })
    }
  }, [hasAnimated, showMembers, processedActivities, fadeAnims])

  // For desktop: trigger on mouse enter or click as before
  // For mobile/tablet: trigger when activity feed comes into view
  let eventHandlers = {}
  if (isDesktop) {
    eventHandlers = Platform.OS === 'web'
      ? { onMouseEnter: triggerAnimation }
      : { onPress: triggerAnimation, activeOpacity: 0.98 }
  } else {
    // On mobile/tablet, animation is triggered when feed comes into view
    eventHandlers = {}
  }

  // For mobile/tablet, trigger animation when feed comes into view
  const [activityFeedInView, setActivityFeedInView] = useState(false)
  const activityFeedRef = useRef(null)

  // Helper to check if the feed is in view (for mobile/tablet)
  const handleScroll = useCallback((event) => {
    if (isDesktop || hasAnimated || !showMembers) return
    if (!activityFeedRef.current) return

    activityFeedRef.current.measure((x, y, width, height, pageX, pageY) => {
      // Check if the feed is visible in the viewport
      // We'll consider it in view if its top is within the screen
      if (pageY < screenHeight && pageY + height > 0) {
        setActivityFeedInView(true)
      }
    })
  }, [hasAnimated, showMembers])

  useEffect(() => {
    if (!isDesktop && activityFeedInView && !hasAnimated) {
      triggerAnimation()
    }
  }, [activityFeedInView, hasAnimated, triggerAnimation])

  useEffect(() => {
    if (isCountingCrash) {
      const interval = setInterval(() => {
        setCrashCount((prev) => prev + Math.floor(Math.random() * 8) + 3)
      }, 1000)
      const timeout = setTimeout(() => {
        setIsCountingCrash(false)
        clearInterval(interval)
      }, 5000)
      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
  }, [isCountingCrash])

  useEffect(() => {
    if (isReverting) {
      const interval = setInterval(() => {
        setCrashCount((prev) => {
          const newCount = prev - Math.floor(Math.random() * 50) - 20
          return newCount <= 0 ? 0 : newCount
        })
      }, 200)
      const timeout = setTimeout(() => {
        setIsReverting(false)
        setCrashCount(0)
        setShowCrashPopup(false)
        setShowCommentBox(true)
        clearInterval(interval)
      }, 3000)
      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
  }, [isReverting])

  const handleAccept = (activity) => {
    const activityIndex = mockActivities.findIndex((a) => a.id === activity.id)
    Animated.timing(fadeAnims[activityIndex], {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setVisibleActivities((prev) => prev.filter((index) => index !== activityIndex))
      setProcessedActivities((prev) => [...prev, activityIndex])
    })
    if (activity.isGood) {
      setPopupMessage("Great! Changes approved successfully ✅")
      setPopupType("success")
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 3000)
    } else {
      setCrashCount(3000)
      setIsCountingCrash(true)
      setShowCrashPopup(true)
    }
  }

  const handleReject = (activity) => {
    const activityIndex = mockActivities.findIndex((a) => a.id === activity.id)
    Animated.timing(fadeAnims[activityIndex], {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setVisibleActivities((prev) => prev.filter((index) => index !== activityIndex))
      setProcessedActivities((prev) => [...prev, activityIndex])
    })
    setPopupMessage("Changes rejected and sent back for revision")
    setPopupType("error")
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 2000)
  }

  const handleRevert = () => {
    setIsCountingCrash(false)
    setIsReverting(true)
  }

  const handleSendComment = () => {
    setShowCommentBox(false)
    setComment("")
    setShowSignUp(true)
  }

  const availableActivities = mockActivities.filter((_, index) => !processedActivities.includes(index))

  // Only use theme.primary and theme.accent for all colors
  const primary = theme.primary || "#2563eb"
  const accent = theme.accent || "#16a34a"
  const accent2 = theme.accent2 || "#991b1b"
  const accent3 = theme.accent3 || "#64748b"
  const accent4 = theme.accent4 || "#f1f5f9"
  const accent5 = theme.accent5 || "#fff"
  const accent6 = theme.accent6 || "#e2e8f0"

  // Helper for activity card background
  function getActivityBg(activity) {
    if (activity.type === "pr") return accent + "22"
    if (activity.type === "fix") return primary + "22"
    if (activity.type === "error") return accent2 + "22"
    if (activity.type === "comment") return accent3 + "22"
    return accent4
  }

  // For mobile/tablet, show all activities by default (no animation) if not animated yet
  const shouldShowActivity = (index) => {
    if (isDesktop) {
      return visibleActivities.includes(index) || hasAnimated
    } else {
      // On mobile/tablet, show all activities if not animated, or use fadeAnims if animated
      return hasAnimated || true
    }
  }

  return (
    <View style={{
      width: '100%',
      maxHeight: 380,
      position: 'relative',
    }}>
      <StatusBar barStyle="dark-content" backgroundColor={accent5} />
      {/* Popup Message */}
      {showPopup && (
        <View style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          padding: 12,
          borderRadius: 12,
          zIndex: 50,
          backgroundColor: theme.opposite,
          borderColor: 'rgba(255, 49, 111, 0.17)',
          borderWidth: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '500',
            textAlign: 'center',
            color: theme.primary,
          }}>
            {popupMessage}
          </Text>
        </View>
      )}
      {/* Project Header */}
      <TouchableOpacity
        {...eventHandlers}
        style={{ width: '100%' }}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: 20,
          paddingBottom: 16,
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              color: theme.opposite,
              marginBottom: 8,
              letterSpacing: -0.5,
            }}>{project.name}</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}>
              <Ionicons name="people" size={16} color={accent3} />
              <Text style={{
                fontSize: 14,
                color: accent3,
                fontWeight: '500',
              }}>{project.contributors}</Text>
            </View>
          </View>
          {/* Performance Badge */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 10,
            gap: 4,
            borderWidth: 1,
            borderColor: accent2,
          }}>
            <Ionicons name="trending-up" size={24} color={"#FD366E"} />
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: theme.opposite,
            }}>{project.performance}%</Text>
          </View>
        </View>
        {/* Stats Grid */}
        <View style={{
          flexDirection: 'row',
          gap: 12,
          paddingHorizontal: 20,
          paddingBottom: 5,
        }}>
          <View style={{
            flex: 1,
            alignItems: 'center',
            padding: 5,
            borderRadius: 12,
            gap: 8,
            borderWidth: 1,
            borderColor:'#FD366E',
            backgroundColor: 'rgba(253, 54, 110, 0.1)',
          }}>
            <Ionicons name="git-commit" size={18} color={'#FD366E'} />
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: theme.opposite,
            }}>{project.commits}</Text>
            <Text className="font-psemibold" style={{
              fontSize: 12,
              color: theme.opposite,
              letterSpacing: 0.5,
            }}>Commits</Text>
          </View>
          <View style={{
            flex: 1,
            alignItems: 'center',
            padding: 5,
            borderRadius: 12,
            gap: 8,
            borderWidth: 1,
            borderColor:'#FD366E',
            backgroundColor: 'rgba(253, 54, 110, 0.1)',
          }}>
            <Ionicons name="git-pull-request" size={18} color={"#FD366E"} />
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: theme.opposite,
            }}>{project.prs}</Text>
            <Text className="font-psemibold" style={{
              fontSize: 12,
              color: theme.opposite,
              letterSpacing: 0.5,
            }}>PRs</Text>
          </View>
          <View style={{
            flex: 1,
            alignItems: 'center',
            padding: 5,
            borderRadius: 12,
            gap: 8,
            borderWidth: 1,
            borderColor:'#FD366E',
            backgroundColor: 'rgba(253, 54, 110, 0.1)',
          }}>
            <Ionicons name="bug" size={18} color={accent2} />
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: theme.opposite,
            }}>{project.issues}</Text>
            <Text className="font-psemibold" style={{
              fontSize: 12,
              color: theme.opposite,
              letterSpacing: 0.5,
            }}>Issues</Text>
          </View>
        </View>
      </TouchableOpacity>
      {/* Activity Feed */}
      {showMembers && (
        <View
          ref={activityFeedRef}
          onLayout={() => {}}
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginBottom: 12,
          }}>
            <View style={{
              width: 8,
              height: 8,
              backgroundColor: '#FD366E',
              borderRadius: 4,
            }} />
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: theme.opposite,
            }}>
              Recent Activity ({availableActivities.length} pending)
            </Text>
          </View>
          <ScrollView
            style={{
              maxHeight: 160,
              width: '100%',
            }}
            showsVerticalScrollIndicator={false}
            onScroll={
              !isDesktop
                ? (event) => {
                    handleScroll(event)
                  }
                : undefined
            }
            scrollEventThrottle={16}
          >
            {availableActivities.length === 0 ? (
              <View style={{
                alignItems: 'center',
                paddingVertical: 24,
              }}>
                <Ionicons name="checkmark-circle" size={40} color={accent} />
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: theme.opposite,
                  marginTop: 12,
                }}>All activities processed!</Text>
                <Text style={{
                  fontSize: 14,
                  color: accent3,
                  marginTop: 4,
                }}>
                  Great job managing your project 🎉
                </Text>
              </View>
            ) : (
              mockActivities.map((activity, index) => {
                if (processedActivities.includes(index)) return null
                // On desktop, use animation. On mobile, always show (opacity 1).
                const animatedStyle = isDesktop
                  ? {
                      opacity: fadeAnims[index],
                      transform: [
                        {
                          translateX: fadeAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0],
                          }),
                        },
                      ],
                    }
                  : {
                      opacity: 1,
                      transform: [{ translateX: 0 }],
                    }
                return (
                  <Animated.View
                    key={activity.id}
                    style={[
                      {
                        borderRadius: 12,
                        marginBottom: 8,
                        flexDirection: 'row',
                        overflow: 'hidden',
                        borderWidth: 1,
                        borderColor: accent3 + "33",
                        backgroundColor: accent3 + "11",
                      },
                      animatedStyle,
                    ]}
                  >
                    <View style={{
                      flex: 1,
                      flexDirection: 'row',
                      padding: 12,
                      gap: 12,
                    }}>
                        {/* Show user avatar image */}
                        <Image
                          source={{ uri: activity.userAvatar }}
                          style={{ width: 52, height: 52, borderRadius: 10,top:10 }}
                          resizeMode="contain"
                        />
                      <View style={{ flex: 1, gap: 6 }}>
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                        }}>
                          <Text className="font-Lsemi" style={{
                            fontSize: 14,
                            color: theme.opposite,
                          }}>{activity.user}</Text>
                          <Text style={{
                            fontSize: 14,
                            color: accent3,
                          }}>{activity.action}</Text>
                          <Text style={{
                            fontSize: 12,
                            color: accent3,
                            marginLeft: 'auto',
                          }}>{activity.time}</Text>
                        </View>
                        <Text className="font-Lsemi" style={{
                            fontSize: 14,
                            color: theme.opposite,
                          }}>{activity.details}</Text>
                        <View style={{
                          flexDirection: 'row',
                          gap: 8,
                          marginTop: 4,
                        }}>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 6,
                              gap: 4,
                              backgroundColor: 'rgba(253, 54, 110, 0.1)',
                              borderWidth: 1,
                              borderColor:'rgba(253, 54, 110, 0.46)',
                            }}
                            onPress={() => handleAccept(activity)}
                          >
                            <Ionicons name="git-merge" size={20} color={'#FD366E'} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 6,
                              gap: 4,
                              backgroundColor: 'rgba(253, 54, 110, 0.1)',
                              borderWidth: 1,
                              borderColor:'rgba(253, 54, 110, 0.46)',
                            }}
                            onPress={() => handleReject(activity)}
                          >
                            <Octicons name="git-pull-request-closed" size={20} color="#FD366E" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 6,
                              backgroundColor: 'rgba(253, 54, 110, 0.1)',
                              borderWidth: 1,
                              borderColor:'rgba(253, 54, 110, 0.46)',
                            }}
                            onPress={() => setShowCodePopup(true)}
                          >
                            <Text style={{
                              fontSize: 11,
                              fontWeight: '500',
                              color: 'rgb(242, 58, 116)',
                            }}>View Changes</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Animated.View>
                )
              })
            )}
          </ScrollView>
        </View>
      )}
      {/* Status Indicator */}
      
      {/* Crash Modal */}
      <Modal visible={showCrashPopup} transparent animationType="fade">
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: theme.opposite,
            borderRadius: 16,
            padding: 32,
            alignItems: 'center',
            maxWidth: 320,
            borderWidth: 2,
            borderColor: accent2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}>
            <Ionicons name="warning" size={56} color={accent2} />
            <Text style={{
              fontSize: 20,
              fontWeight: '800',
              color: accent2,
              marginVertical: 16,
              textAlign: 'center',
            }}>🚨 SITE CRASHED! 🚨</Text>
            <Text style={{
              fontSize: 16,
              color: accent2,
              marginBottom: 24,
              textAlign: 'center',
            }}>
              <Text style={{
                fontSize: 24,
                fontWeight: '800',
                color: primary,
              }}>{crashCount.toLocaleString()}+</Text>{' '}
              angry customers reporting!
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#FD366E',
                paddingHorizontal: 20,
                paddingVertical: 14,
                borderRadius: 10,
                gap: 8,
                shadowColor: primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              }}
              onPress={handleRevert}
              disabled={isReverting}
            >
              <Ionicons name="refresh" size={18} color="#fff" />
              <Text style={{
                color: '#fff',
                fontWeight: '600',
                fontSize: 16,
              }}>
                {isReverting ? 'Reverting...' : 'Revert Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Comment Modal */}
      <Modal visible={showCommentBox} transparent animationType="slide">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: theme.primary,
            borderRadius: 16,
            padding: 24,
            maxWidth: 320,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 6,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: theme.opposite,
              marginBottom: 20,
              textAlign: 'center',
            }}>Write a comment for rejection</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: accent3,
                borderRadius: 10,
                padding: 12,
                minHeight: 100,
                marginBottom: 20,
                fontSize: 14,
                fontFamily: 'System',
                color: theme.opposite,
              }}
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FD366E',
              paddingHorizontal: 20,
              paddingVertical: 14,
              borderRadius: 10,
              gap: 8,
              justifyContent: 'center',
              shadowColor: accent,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }} onPress={handleSendComment}>
              <Ionicons name="send" size={16} color="#fff" />
              <Text style={{
                color: '#fff',
                fontWeight: '600',
                fontSize: 16,
              }}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Sign Up Modal */}
      <Modal visible={showSignUp} transparent animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: accent5,
            borderRadius: 16,
            padding: 32,
            alignItems: 'center',
            maxWidth: 320,
            position: 'relative',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                padding: 4,
              }}
              onPress={() => setShowSignUp(false)}
            >
              <Ionicons name="close" size={24} color={theme.primary} />
            </TouchableOpacity>
            <Ionicons name="checkmark-circle" size={72} color={accent} />
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              color: theme.primary,
              marginVertical: 20,
              textAlign: 'center',
            }}>Wanna try out the full app?</Text>
            <Text style={{
              fontSize: 16,
              color: accent3,
              marginBottom: 28,
              textAlign: 'center',
              lineHeight: 24,
            }}>
              Experience the complete GitHub project management platform
            </Text>
            <TouchableOpacity style={{
              backgroundColor: '#FD366E',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 10,
              shadowColor: primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#fff',
              }}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Code Popup */}
      <Modal visible={showCodePopup} transparent animationType="slide">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: accent5,
            borderRadius: 16,
            padding: 24,
            maxWidth: screenWidth - 40,
            maxHeight: '80%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                color: primary,
              }}>Code Changes</Text>
              <TouchableOpacity onPress={() => setShowCodePopup(false)}>
                <Ionicons name="close" size={24} color={primary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{
              backgroundColor: accent4,
              borderRadius: 12,
              padding: 16,
              maxHeight: 300,
              borderWidth: 1,
              borderColor: accent3,
            }}>
              <Text style={{
                fontFamily: 'monospace',
                fontSize: 13,
                lineHeight: 20,
                color: primary,
              }}>
                <Text style={{ color: accent3 }}>
                  {'// payment.js - Stripe Integration\n'}
                </Text>
                <Text style={{ color: primary }}>import</Text>
                <Text style={{ color: primary }}> Stripe </Text>
                <Text style={{ color: primary }}>from</Text>
                <Text style={{ color: accent }}>'stripe'</Text>
                <Text style={{ color: primary }}>;{'\n\n'}</Text>
                <Text style={{ color: primary }}>const</Text>
                <Text style={{ color: primary }}> stripe = </Text>
                <Text style={{ color: primary }}>new</Text>
                <Text style={{ color: accent }}> Stripe</Text>
                <Text style={{ color: primary }}>
                  (process.env.STRIPE_SECRET_KEY);{'\n\n'}
                </Text>
                <Text style={{ color: primary }}>export async function</Text>
                <Text style={{ color: accent }}> createPaymentIntent</Text>
                <Text style={{ color: primary }}>(amount, currency) {'{\n'}</Text>
                <Text style={{ color: primary }}> try</Text>
                <Text style={{ color: primary }}> {'{\n'}</Text>
                <Text style={{ color: primary }}> const</Text>
                <Text style={{ color: primary }}> paymentIntent = </Text>
                <Text style={{ color: primary }}>await</Text>
                <Text style={{ color: primary }}> stripe.paymentIntents.</Text>
                <Text style={{ color: accent }}>create</Text>
                <Text style={{ color: primary }}>({'{\n'}</Text>
                <Text style={{ color: primary }}> amount: amount * </Text>
                <Text style={{ color: accent2 }}>100</Text>
                <Text style={{ color: accent3 }}>, // Convert to cents{'\n'}</Text>
                <Text style={{ color: primary }}> currency,{'\n'}</Text>
                <Text style={{ color: primary }}> automatic_payment_methods: {'{\n'}</Text>
                <Text style={{ color: primary }}> enabled: </Text>
                <Text style={{ color: accent }}>true</Text>
                <Text style={{ color: primary }}>{'\n      }\n    });'}</Text>
              </Text>
            </ScrollView>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 12,
              marginTop: 20,
            }}>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: accent3,
                }}
                onPress={() => setShowCodePopup(false)}
              >
                <Text style={{
                  color: accent3,
                  fontWeight: '500',
                }}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 8,
                  backgroundColor: accent,
                }}
                onPress={() => setShowCodePopup(false)}
              >
                <Text style={{
                  color: '#fff',
                  fontWeight: '600',
                }}>Looks Good!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
