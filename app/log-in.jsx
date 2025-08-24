"use client"
import { useEffect, useRef, useState } from "react"
import { View, Text, TextInput, Pressable, Animated, Easing, Platform, StyleSheet, Dimensions, ScrollView, Alert, ToastAndroid } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Feather, FontAwesome } from "@expo/vector-icons"
import { useTheme } from "../context/ColorMode"
import ThemeChanger from "../componants/ThemeChanger"
import { login, EmailPassLogin, EmailPassCreateAccount } from "../backend/appwrite"
import { router } from "expo-router"
import Logo from "../componants/Logo"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from 'expo-status-bar';
import { useAppwriteContext } from '../context/appwriteContext';

// Only one definition of useAnimatedValue, with useNativeDriver: false for compatibility
function useAnimatedValue(show, config = {}) {
  const { from = 0, to = 1, duration = 400, delay = 0, easing = Easing.out(Easing.cubic) } = config
  const animated = useRef(new Animated.Value(from)).current
  useEffect(() => {
    if (show) {
      Animated.timing(animated, {
        toValue: to,
        duration,
        delay,
        useNativeDriver: false,
        easing,
      }).start()
    } else {
      Animated.timing(animated, {
        toValue: from,
        duration: duration / 2,
        useNativeDriver: false,
        easing,
      }).start()
    }
  }, [show])
  return animated
}

function showToast(message) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT)
  } else {
    Alert.alert('Error', message)
  }
}

// helpers for color alpha from hex
function hexToRgb(hex) {
  if (!hex) return [253, 54, 110]
  const normalized = hex.replace('#', '')
  const value = normalized.length === 3
    ? normalized.split('').map((c) => c + c).join('')
    : normalized
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return [r, g, b]
}

function withAlpha(hex, alpha) {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r},${g},${b},${alpha})`
}

function useScreenWidthPercent() {
  const [screenInfo, setScreenInfo] = useState(() => {
    const { width, height } = Dimensions.get("window")
    return { width, height }
  })

  useEffect(() => {
    const onChange = ({ window }) => {
      setScreenInfo({ width: window.width, height: window.height })
    }
    let sub
    if (Dimensions.addEventListener) {
      sub = Dimensions.addEventListener("change", onChange)
    } else if (Dimensions.addEventListener) {
      sub = Dimensions.addEventListener("change", onChange) // legacy fallback
    }
    return () => {
      if (sub && sub.remove) sub.remove()
      else if (Dimensions.removeEventListener) Dimensions.removeEventListener("change", onChange)
    }
  }, [])

  // Hide branding if width < 55% of height (portrait/narrow)
  const isWeb = Platform.OS === "web"
  const hideBranding = screenInfo.width < 0.55 * screenInfo.height || (isWeb && screenInfo.width < 700)

  return { ...screenInfo, hideBranding }
}

const Button = ({ children, variant = "default", style, gradientColors, hoverScale = 1.02, pressScale = 0.98, ...props }) => {
  const hoverAnim = useRef(new Animated.Value(0)).current
  const pressAnim = useRef(new Animated.Value(0)).current

  const animateTo = (animatedValue, toValue, duration = 160) =>
    Animated.timing(animatedValue, {
      toValue,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start()

  const onHoverIn = () => animateTo(hoverAnim, 1)
  const onHoverOut = () => animateTo(hoverAnim, 0)
  const onPressIn = () => animateTo(pressAnim, 1, 120)
  const onPressOut = () => animateTo(pressAnim, 0, 120)

  const hoverScaleValue = hoverAnim.interpolate({ inputRange: [0, 1], outputRange: [1, hoverScale] })
  const pressScaleValue = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [1, pressScale] })
  const combinedScale = Animated.multiply(hoverScaleValue, pressScaleValue)

  const baseButtonStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    height: 56,
    minHeight: 48,
    paddingHorizontal: 16,
  }

  const variantStyle =
    variant === "default"
      ? { backgroundColor: gradientColors ? "transparent" : "#FD366E" }
      : { backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "#fff3" }

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

  if (gradientColors && Array.isArray(gradientColors)) {
    return (
      <Animated.View style={{ transform: [{ scale: combinedScale }] }}>
        <LinearGradient colors={gradientColors} start={[0, 0]} end={[1, 0]} style={[{ borderRadius: 12, overflow: "hidden" }, style]}>
          <AnimatedPressable
            onHoverIn={Platform.OS === "web" ? onHoverIn : undefined}
            onHoverOut={Platform.OS === "web" ? onHoverOut : undefined}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[baseButtonStyle, { backgroundColor: "transparent" }]}
            {...props}
          >
            {children}
          </AnimatedPressable>
        </LinearGradient>
      </Animated.View>
    )
  }

  return (
    <Animated.View style={{ transform: [{ scale: combinedScale }] }}>
      <AnimatedPressable
        onHoverIn={Platform.OS === "web" ? onHoverIn : undefined}
        onHoverOut={Platform.OS === "web" ? onHoverOut : undefined}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[baseButtonStyle, variantStyle, style]}
        {...props}
      >
        {children}
      </AnimatedPressable>
    </Animated.View>
  )
}

const Input = ({ style, placeholderTextColor, ...props }) => {
  const { theme } = useTheme()
  const isDark = theme.mode === 'dark'
  const baseColors = {
    borderColor: theme.borderColor,
    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#ffffff',
    color: theme.text,
  }
  return (
    <TextInput
      style={[
        {
          height: 56,
          borderRadius: 16,
          borderWidth: 1,
          ...baseColors,
          fontSize: 18,
          fontFamily: "Poppins-Regular",
          paddingHorizontal: 16,
          marginTop: 0,
          marginBottom: 0,
        },
        style,
      ]}
      placeholderTextColor={placeholderTextColor || theme.secondaryText}
      {...props}
    />
  )
}

const Label = ({ children, style, ...props }) => (
  <Text
    style={[
      {
        color: "#fff",
        fontWeight: "600",
        fontFamily: "Poppins-SemiBold",
        fontSize: 16,
        marginBottom: 0,
        flexDirection: "row",
        alignItems: "center",
      },
      style,
    ]}
    {...props}
  >
    {children}
  </Text>
)

// Dummy ForgotPasswordModal to prevent crash if not imported
function ForgotPasswordModal({ visible, onClose }) {
  // You should import your real modal here
  return null
}

export default function LoginSampleCombined() {
  const { theme, toggleTheme } = useTheme()
  const [animationStage, setAnimationStage] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showGitHubTip, setShowGitHubTip] = useState(false)
  const {setIsLogged, setUser} = useAppwriteContext();
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  // Animated mode progress (0 = login, 1 = signup) and card expansion
  const modeAnim = useRef(new Animated.Value(0)).current
  const cardExtra = useRef(new Animated.Value(0)).current
  const extraPadding = cardExtra.interpolate({ inputRange: [0, 1], outputRange: [0, 110] })

  // GitHub tip animation
  const gitHubTipAnim = useRef(new Animated.Value(0)).current

  const animateMode = (target) => {
    const toValue = target === 'signup' ? 1 : 0
    setMode(target)
    Animated.parallel([
      Animated.timing(modeAnim, { toValue, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(cardExtra, { toValue, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start()
  }

  const animateGitHubTip = (show) => {
    setShowGitHubTip(show)
    Animated.timing(gitHubTipAnim, {
      toValue: show ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start()
  }

  // Remove duplicate setAnimationStage
  // Remove duplicate useEffect for animationStage
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimationStage(1), 50), // Background effects
      setTimeout(() => setAnimationStage(2), 150), // Geometric shapes
      setTimeout(() => setAnimationStage(3), 250), // Left sidebar
      setTimeout(() => setAnimationStage(4), 350), // Branding
      setTimeout(() => setAnimationStage(5), 450), // Feature cards
      setTimeout(() => setAnimationStage(6), 550), // Login form
      setTimeout(() => setAnimationStage(7), 650), // Form fields
      setTimeout(() => setAnimationStage(8), 750), // Social buttons
    ]
    return () => timeouts.forEach(clearTimeout)
  }, [])

  // Animations (local to card)
  const loginCardTrans = useAnimatedValue(animationStage >= 6, { from: 32, to: 0, duration: 600 })
  const loginCardOpacity = useAnimatedValue(animationStage >= 6, { from: 0, to: 1, duration: 600 })
  const loginCardScale = useAnimatedValue(animationStage >= 6, { from: 0.95, to: 1, duration: 600 })

  const sparkleScale = useAnimatedValue(animationStage >= 6, { from: 0, to: 1, duration: 400, delay: 100 })
  const sparkleRotate = useAnimatedValue(animationStage >= 6, { from: 180, to: 0, duration: 400, delay: 100 })

  const formHeaderTrans = useAnimatedValue(animationStage >= 6, { from: 16, to: 0, duration: 400, delay: 200 })
  const formHeaderOpacity = useAnimatedValue(animationStage >= 6, { from: 0, to: 1, duration: 400, delay: 200 })

  const emailTrans = useAnimatedValue(animationStage >= 7, { from: 16, to: 0, duration: 300, delay: 100 })
  const emailOpacity = useAnimatedValue(animationStage >= 7, { from: 0, to: 1, duration: 300, delay: 100 })

  const passTrans = useAnimatedValue(animationStage >= 7, { from: 16, to: 0, duration: 300, delay: 200 })
  const passOpacity = useAnimatedValue(animationStage >= 7, { from: 0, to: 1, duration: 300, delay: 200 })

  const dividerOpacity = useAnimatedValue(animationStage >= 8, { from: 0, to: 1, duration: 300, delay: 100 })
  const signupTrans = useAnimatedValue(animationStage >= 8, { from: 16, to: 0, duration: 300, delay: 500 })
  const signupOpacity = useAnimatedValue(animationStage >= 8, { from: 0, to: 1, duration: 300, delay: 500 })

  // Animations for sign-up only fields
  const nameTrans = modeAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] })
  const nameOpacity = modeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })
  const confirmTrans = modeAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] })
  const confirmOpacity = modeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })

  const headerTitle = mode === 'signup' ? 'Create your Axhibit account' : 'Welcome back to Axhibit'
  const headerSubtitle = mode === 'signup'
    ? 'Join Axhibit to showcase and collaborate'
    : 'Showcase projects, manage GitHub, collaborate with teams'

  // Animated values for each section
  const bgOpacity = useAnimatedValue(animationStage >= 1, { from: 0, to: 1, duration: 500 })
  const leftSidebarTrans = useAnimatedValue(animationStage >= 3, { from: -80, to: 0, duration: 600 })
  const leftSidebarOpacity = useAnimatedValue(animationStage >= 3, { from: 0, to: 1, duration: 600 })
  const logoTrans = useAnimatedValue(animationStage >= 4, { from: 32, to: 0, duration: 400, delay: 100 })
  const logoOpacity = useAnimatedValue(animationStage >= 4, { from: 0, to: 1, duration: 400, delay: 100 })
  const headingTrans = useAnimatedValue(animationStage >= 4, { from: 32, to: 0, duration: 400, delay: 200 })
  const headingOpacity = useAnimatedValue(animationStage >= 4, { from: 0, to: 1, duration: 400, delay: 200 })
  const descTrans = useAnimatedValue(animationStage >= 4, { from: 32, to: 0, duration: 400, delay: 300 })
  const descOpacity = useAnimatedValue(animationStage >= 4, { from: 0, to: 1, duration: 400, delay: 300 })

  // Feature cards
  const feature1Trans = useAnimatedValue(animationStage >= 5, { from: -32, to: 0, duration: 300, delay: 100 })
  const feature1Opacity = useAnimatedValue(animationStage >= 5, { from: 0, to: 1, duration: 300, delay: 100 })
  const feature2Trans = useAnimatedValue(animationStage >= 5, { from: -32, to: 0, duration: 300, delay: 200 })
  const feature2Opacity = useAnimatedValue(animationStage >= 5, { from: 0, to: 1, duration: 300, delay: 200 })
  const feature3Trans = useAnimatedValue(animationStage >= 5, { from: -32, to: 0, duration: 300, delay: 300 })
  const feature3Opacity = useAnimatedValue(animationStage >= 5, { from: 0, to: 1, duration: 300, delay: 300 })

  // --- LAYOUT FIX: Place login card on the left for web, right for mobile ---
  // We'll use flexDirection: row for web, column for mobile, and order the children accordingly

  const isWeb = Platform.OS === "web"

  // --- Responsive: Hide branding if screen is "narrow" (see hook above) ---
  const { hideBranding } = useScreenWidthPercent()

  // Fix: onError handler for error messages
  function onError(msg) {
    setErrorMessage(msg)
    setTimeout(() => setErrorMessage(""), 4000)
  }

  // Fix: setUser and setIsLogged are not defined, so we remove them for now
  // You should connect to your user context/store if needed

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: theme.background }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            minHeight: Platform.OS === 'web' ? '100vh' : undefined,
            backgroundColor: theme.background,
            flex: 1,
            flexDirection: isWeb ? "row-reverse" : "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 5,
              position: "relative",
              zIndex: 20,
              order: isWeb ? 0 : 1,
            }}
          >
            <View style={{ width: "100%", maxWidth: 480, position: "relative" }}>
              {errorMessage ? (
                <View style={{
                  backgroundColor: 'rgba(244, 63, 94, 0.15)',
                  borderColor: 'rgba(244, 63, 94, 0.35)',
                  borderWidth: 1,
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 12,
                }}>
                  <Text style={{ color: '#ef4444', fontFamily: 'Poppins-SemiBold' }}>{errorMessage}</Text>
                </View>
              ) : null}
              <Animated.View
                style={{
                  borderRadius: 32,
                  borderWidth: 1,
                  borderColor: theme.borderColor,
                  shadowColor: theme.accent2,
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 8 },
                  position: "relative",
                  overflow: 'hidden',
                  transform: [
                    { translateY: loginCardTrans },
                    { scale: loginCardScale },
                  ],
                  opacity: loginCardOpacity,
                }}
              >
                <LinearGradient
                  colors={['rgba(253, 54, 110, 0.1)', 'transparent', 'rgba(147, 51, 234, 0.05)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                  pointerEvents="none"
                />
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.10)' }]} />

                {/* Padded content */}
                <View style={{ padding: 24, paddingTop: 40, paddingBottom: 40 }}>
                  {/* Form header */}
                  <Animated.View
                    style={{
                      marginBottom: 20,
                      transform: [{ translateY: formHeaderTrans }],
                      opacity: formHeaderOpacity,
                    }}
                  >
                    {/* Theme toggle (compact) */}
                    <Animated.View
                      style={{
                        alignSelf: 'flex-end',
                        transform: [
                          {
                            rotate: sparkleRotate.interpolate({
                              inputRange: [0, 360],
                              outputRange: ["0deg", "360deg"],
                            }),
                          },
                          { scale: sparkleScale },
                        ],
                      }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 50,
                          backgroundColor: '#FD366E',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bottom: 10
                        }}
                      >
                        <ThemeChanger
                          focused={theme.mode}
                          onToggle={() => toggleTheme()}
                          compact
                        />
                      </View>
                    </Animated.View>
                    <Text style={{ fontSize: 32, fontWeight: "bold", color: theme.text, marginBottom: 5, fontFamily: "Poppins-Bold" }}>{headerTitle}</Text>
                    <Text style={{ color: theme.secondaryText, fontSize: 18, fontFamily: "Poppins-Regular" }}>{headerSubtitle}</Text>
                  </Animated.View>

                  <View style={{ gap: 32 }}>
                    {/* Name field (animated for sign up) */}
                    <Animated.View
                      style={{
                        height: modeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 96] }),
                        overflow: 'hidden',
                      }}
                      pointerEvents={mode === 'signup' ? 'auto' : 'none'}
                    >
                      <Animated.View style={{ gap: 12, transform: [{ translateX: nameTrans }], opacity: nameOpacity }}>
                        <Label>
                          <Feather name="user" size={16} color={theme.accent2} style={{ marginRight: 8 }} />
                          <Text style={{ color: theme.secondaryText, fontFamily: 'Poppins-Medium' }}>Name</Text>
                        </Label>
                        <Input
                          id="name"
                          placeholder="Enter your name"
                          value={name}
                          onChangeText={setName}
                          autoCapitalize="words"
                        />
                      </Animated.View>
                    </Animated.View>
                    {/* Email field */}
                    <Animated.View
                      style={{
                        gap: 12,
                        transform: [{ translateX: emailTrans }],
                        opacity: emailOpacity,
                      }}
                    >
                      <Label>
                        <Feather name="mail" size={16} color={theme.accent2} style={{ marginRight: 8 }} />
                        <Text style={{ color: theme.secondaryText, fontFamily: 'Poppins-Medium' }}>Email Address</Text>
                      </Label>
                      <Input
                        id="email"
                        keyboardType="email-address"
                        placeholder="Enter your email address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        spellCheck={false}
                        onFocus={() => {
                          if (mode === 'signup') {
                            animateGitHubTip(true)
                          }
                        }}
                        onBlur={() => {
                          if (mode === 'signup') {
                            animateGitHubTip(false)
                          }
                        }}
                      />

                      {/* GitHub email note - only show in signup mode */}
                      <Animated.View
                        style={{
                          height: gitHubTipAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 120] }),
                          overflow: 'hidden',
                          opacity: gitHubTipAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                        }}
                        pointerEvents={showGitHubTip ? 'auto' : 'none'}
                      >
                        <View style={{
                          backgroundColor: withAlpha(theme.accent2, 0.08),
                          borderLeftWidth: 3,
                          borderLeftColor: theme.accent2,
                          borderRadius: 12,
                          padding: 16,
                          marginTop: 8,
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          gap: 12,
                        }}>
                          <View style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: withAlpha(theme.accent2, 0.15),
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 2,
                          }}>
                            <Feather name="info" size={12} color={theme.accent2} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{
                              color: theme.text,
                              fontSize: 14,
                              fontFamily: 'Poppins-SemiBold',
                              marginBottom: 4,
                            }}>
                              GitHub Integration Tip
                            </Text>
                            <Text style={{
                              color: theme.secondaryText,
                              fontSize: 13,
                              fontFamily: 'Poppins-Regular',
                              lineHeight: 18,
                            }}>
                              Use the same email address that's connected to your GitHub account for seamless repository linking and collaboration features.
                            </Text>
                          </View>
                        </View>
                      </Animated.View>
                    </Animated.View>

                    {/* Password field */}
                    <Animated.View
                      style={{
                        gap: 12,
                        transform: [{ translateX: passTrans }],
                        opacity: passOpacity,
                      }}
                    >
                      <Label>
                        <Feather name="lock" size={16} color={theme.accent2} style={{ marginRight: 8 }} />
                        <Text style={{ color: theme.secondaryText, fontFamily: 'Poppins-Medium' }}>Password</Text>
                      </Label>
                      <View style={{ position: "relative" }}>
                        <Input
                          id="password"
                          secureTextEntry={!showPassword}
                          placeholder="Enter your password"
                          style={{ paddingRight: 48 }}
                          value={password}
                          onChangeText={setPassword}
                          autoCapitalize="none"
                          autoComplete="password"
                        />
                        <Pressable
                          onPress={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: 16,
                            top: "50%",
                            transform: [{ translateY: -12 }],
                            zIndex: 2,
                          }}
                        >
                          {showPassword ? (
                            <Feather name="eye-off" size={20} color="#9ca3af" />
                          ) : (
                            <Feather name="eye" size={20} color="#9ca3af" />
                          )}
                        </Pressable>
                      </View>
                    </Animated.View>

                    {/* Confirm password (animated for sign up) */}
                    <Animated.View
                      style={{
                        height: modeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 96] }),
                        overflow: 'hidden',
                      }}
                      pointerEvents={mode === 'signup' ? 'auto' : 'none'}
                    >
                      <Animated.View style={{ gap: 12, transform: [{ translateX: confirmTrans }], opacity: confirmOpacity }}>
                        <Label>
                          <Feather name="lock" size={16} color={theme.accent2} style={{ marginRight: 8 }} />
                          <Text style={{ color: theme.secondaryText, fontFamily: 'Poppins-Medium' }}>Retype Password</Text>
                        </Label>
                        <Input
                          id="confirmPassword"
                          secureTextEntry={!showPassword}
                          placeholder="Retype your password"
                          style={{ paddingRight: 48 }}
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          autoCapitalize="none"
                          autoComplete="password-new"
                        />
                      </Animated.View>
                    </Animated.View>

                    {/* Forgot password link (login only) */}
                    <Animated.View
                      style={{
                        height: modeAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }),
                        overflow: 'hidden',
                      }}
                      pointerEvents={mode === 'login' ? 'auto' : 'none'}
                    >
                      <Animated.View style={{ alignItems: 'flex-end', opacity: modeAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }}>
                        <Pressable onPress={() => setShowForgotPassword(true)}>
                          <Text style={{ color: theme.accent2, fontWeight: "600", fontFamily: "Poppins-SemiBold" }}>
                            Forgot Password?
                          </Text>
                        </Pressable>
                      </Animated.View>
                    </Animated.View>

                    {/* Sign in button */}
                    <Button
                      gradientColors={[theme.accent2, withAlpha(theme.accent2, 0.8)]}
                      style={{
                        width: "100%",
                        height: 56,
                        borderRadius: 16,
                        shadowColor: theme.accent2,
                        shadowOpacity: 0.2,
                        shadowRadius: 12,
                        borderWidth: 0,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 0,
                        marginBottom: 0,
                      }}
                      onPress={async () => {
                        if (mode === 'signup') {
                          if (!name || !email || !password || password !== confirmPassword) {
                            onError('Please fill all fields and ensure passwords match');
                            showToast('Please fill all fields and ensure passwords match');
                            return;
                          }
                          try {
                            const res = await EmailPassCreateAccount(name, email, password);
                            if (!res) {
                              onError('Signup failed');
                              showToast('Signup failed');
                              return;
                            }
                            const res2 = await EmailPassLogin(email, password);
                            setUser(res2); // removed, fix: not defined
                            setIsLogged(true); // removed, fix: not defined
                            if (res2) {
                              router.replace('/screens');
                            }
                          } catch (e) {
                            onError(e?.message || 'Signup failed');
                            showToast(e?.message || 'Signup failed');
                          }
                        } else {
                          try {
                            const res2 = await EmailPassLogin(email, password);
                            setUser(res2); 
                            setIsLogged(true); 
                            router.replace('/screens');
                          } catch (e) {
                            onError(e?.message || 'Login failed');
                            showToast(e?.message || 'Login failed');
                          }
                        }
                      }}
                    >
                      <Text style={{ color: theme.buttonText, fontWeight: "bold", fontSize: 18, fontFamily: "Poppins-SemiBold" }}>{mode === 'signup' ? 'Create Account' : 'Sign In'}</Text>
                    </Button>

                    {/* Divider */}
                    <Animated.View
                      style={{
                        position: "relative",
                        opacity: dividerOpacity,
                        marginTop: 0,
                        marginBottom: 0,
                      }}
                    >
                      <View style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: "50%",
                        height: 1,
                        backgroundColor: theme.mode === 'dark' ? "rgba(255,255,255,0.12)" : withAlpha(theme.text, 0.08),
                      }} />
                      <View style={{
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1,
                      }}>
                        <Text style={{
                          paddingHorizontal: 16,
                          backgroundColor: theme.background,
                          color: theme.secondaryText,
                          fontWeight: "500",
                          fontSize: 14,
                          fontFamily: "Poppins-Medium",
                          borderRadius: 8,
                        }}>{mode === 'signup' ? 'Or sign up with' : 'Or continue with'}</Text>
                      </View>
                    </Animated.View>

                    <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                      <Button
                        variant="outline"
                        hoverScale={1.06}
                        style={{
                          width: 56,
                          height: 48,
                          borderRadius: 12,
                          alignItems: "center",
                          justifyContent: "center",
                          margin: 0,
                          backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#ffffff',
                          borderColor: theme.borderColor,
                          borderWidth: 1,
                          shadowColor: theme.mode === 'dark' ? '#000' : withAlpha(theme.text, 0.3),
                          shadowOpacity: 0.2,
                          shadowRadius: 10,
                          shadowOffset: { width: 0, height: 6 },
                        }}
                        onPress={async () => {
                          try {
                            const res= await login();
                            if(Platform.OS!=='web'){
                              router.replace('/screens');
                              setUser(res);
                              setIsLogged(true);
                            }
                            
                          } catch (e) {
                            onError(e?.message || 'GitHub login failed');
                            showToast(e?.message || 'GitHub login failed');
                          }
                        }}
                      >
                        <FontAwesome name="github" size={22} color={theme.text} />
                      </Button>
                      <Text style={{ color: theme.opposite, right: 6, fontFamily: "Poppins-SemiBold", fontSize: 20, alignSelf: "center" }}>GitHub</Text>
                    </View>
                  </View>

                  {/* Mode switch link */}
                  <Animated.View
                    style={{
                      marginTop: 10,
                      alignItems: "center",
                      transform: [{ translateY: signupTrans }],
                      opacity: signupOpacity,
                    }}
                  >
                    {mode === 'login' ? (
                      <Text style={{ color: theme.secondaryText, fontSize: 18, fontFamily: "Poppins-Regular" }}>
                        New to Axhibit?{" "}
                        <Pressable onPress={() => animateMode('signup')}>
                          <Text style={{ color: theme.accent2, fontWeight: "bold", fontFamily: "Poppins-SemiBold", top: Platform.OS === 'web' ? 0 : 5, fontSize: 18 }}>
                            Sign up
                          </Text>
                        </Pressable>
                      </Text>
                    ) : (
                      <Text style={{ color: theme.secondaryText, fontSize: 18, fontFamily: "Poppins-Regular" }}>
                        Already on Axhibit?{" "}
                        <Pressable onPress={() => animateMode('login')}>
                          <Text style={{ color: theme.accent2, fontWeight: "bold", fontFamily: "Poppins-SemiBold", top: Platform.OS === 'web' ? 0 : 5, fontSize: 18 }}>
                            Sign in
                          </Text>
                        </Pressable>
                      </Text>
                    )}
                  </Animated.View>

                  {/* Card expansion/compression spacer */}
                  <Animated.View style={{ height: extraPadding }} />
                </View>

                {/* Forgot Password Modal */}
                <ForgotPasswordModal
                  visible={showForgotPassword}
                  onClose={() => setShowForgotPassword(false)}
                />
              </Animated.View>
            </View>
          </View>
          {!hideBranding && (
            <Animated.View
              style={{
                display: isWeb ? "flex" : "none",
                flexDirection: "column",
                width: isWeb ? "40%" : "100%",
                position: "relative",
                zIndex: 10,
                transform: [{ translateX: leftSidebarTrans }],
                opacity: leftSidebarOpacity,
                height: "100%",
                order: isWeb ? 1 : 0, // right on web, above on mobile
              }}
            >
              <View style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                ...(Platform.OS === 'web' ? { backdropFilter: "blur(24px)" } : {}),
                borderRightWidth: 1,
                borderRightColor: theme.borderColor,
                height: "100%",
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                padding: 48,
                position: "relative",
              }}>
                <View style={{ marginBottom: 32 }}>
                  {/* Logo and brand name */}
                  <Animated.View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 24,
                      transform: [{ translateY: logoTrans }],
                      opacity: logoOpacity,
                    }}
                  >
                    <Logo height={38} width={38} />
                    <Text style={{ fontSize: 28, fontWeight: "bold", color: theme.text, fontFamily: "Poppins-Bold" }}>Axhibit</Text>
                  </Animated.View>
                  {/* Main heading */}
                  <Animated.View
                    style={{
                      transform: [{ translateY: headingTrans }],
                      opacity: headingOpacity,
                    }}
                  >
                    <Text style={{ fontSize: 40, fontWeight: "bold", color: theme.text, marginBottom: 24, lineHeight: 48, fontFamily: "Poppins-ExtraBold" }}>
                      Showcase your
                      {"\n"}
                      <Text style={{ fontFamily: "Poppins-ExtraBold" }}>Projects</Text>
                    </Text>
                  </Animated.View>
                  <Animated.Text
                    style={{
                      fontSize: 20,
                      color: theme.secondaryText,
                      marginBottom: 48,
                      transform: [{ translateY: descTrans }],
                      opacity: descOpacity,
                      fontFamily: "Poppins-Regular",
                    }}
                  >
                    Show off your work, manage GitHub repos, and collaborate effortlessly with your team — all in one place.
                  </Animated.Text>
                </View>
                {/* Feature highlights with staggered animations */}
                <View style={{ gap: 24 }}>
                  <Animated.View
                    style={{
                      backgroundColor: "rgba(255,255,255,0.10)",
                      ...(Platform.OS === 'web' ? { backdropFilter: "blur(16px)" } : {}),
                      borderRadius: 24,
                      padding: 24,
                      borderWidth: 1,
                      borderColor: theme.borderColor,
                      flexDirection: "row",
                      alignItems: "flex-start",
                      marginBottom: 0,
                      transform: [{ translateX: feature1Trans }],
                      opacity: feature1Opacity,
                    }}
                  >
                    <View style={{
                      width: 48,
                      height: 48,
                      backgroundColor: withAlpha(theme.accent2, 0.2),
                      ...(Platform.OS === 'web' ? { backdropFilter: "blur(4px)" } : {}),
                      borderRadius: 16,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 16,
                      marginTop: 4,
                    }}>
                      <Feather name="image" size={24} color={theme.accent2} />
                    </View>
                    <View>
                      <Text style={{ color: theme.text, fontWeight: "600", marginBottom: 8, fontFamily: "Poppins-SemiBold" }}>Showcase Projects</Text>
                      <Text style={{ color: theme.secondaryText, fontSize: 14, fontFamily: "Poppins-Regular" }}>Beautiful portfolios with live previews and rich metadata</Text>
                    </View>
                  </Animated.View>
                  <Animated.View
                    style={{
                      backgroundColor: "rgba(255,255,255,0.10)",
                      ...(Platform.OS === 'web' ? { backdropFilter: "blur(16px)" } : {}),
                      borderRadius: 24,
                      padding: 24,
                      borderWidth: 1,
                      borderColor: theme.borderColor,
                      flexDirection: "row",
                      alignItems: "flex-start",
                      marginBottom: 0,
                      transform: [{ translateX: feature2Trans }],
                      opacity: feature2Opacity,
                    }}
                  >
                    <View style={{
                      width: 48,
                      height: 48,
                      backgroundColor: withAlpha(theme.accent2, 0.2),
                      ...(Platform.OS === 'web' ? { backdropFilter: "blur(4px)" } : {}),
                      borderRadius: 16,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 16,
                      marginTop: 4,
                    }}>
                      <Feather name="git-branch" size={24} color={theme.accent2} />
                    </View>
                    <View>
                      <Text style={{ color: theme.text, fontWeight: "600", marginBottom: 8, fontFamily: "Poppins-SemiBold" }}>GitHub Management</Text>
                      <Text style={{ color: theme.secondaryText, fontSize: 14, fontFamily: "Poppins-Regular" }}>Sync repositories, issues, and pull requests</Text>
                    </View>
                  </Animated.View>
                  <Animated.View
                    style={{
                      backgroundColor: "rgba(255,255,255,0.10)",
                      ...(Platform.OS === 'web' ? { backdropFilter: "blur(16px)" } : {}),
                      borderRadius: 24,
                      padding: 24,
                      borderWidth: 1,
                      borderColor: theme.borderColor,
                      flexDirection: "row",
                      alignItems: "flex-start",
                      marginBottom: 0,
                      transform: [{ translateX: feature3Trans }],
                      opacity: feature3Opacity,
                    }}
                  >
                    <View style={{
                      width: 48,
                      height: 48,
                      backgroundColor: withAlpha(theme.accent2, 0.2),
                      ...(Platform.OS === 'web' ? { backdropFilter: "blur(4px)" } : {}),
                      borderRadius: 16,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 16,
                      marginTop: 4,
                    }}>
                      <Feather name="users" size={24} color={theme.accent2} />
                    </View>
                    <View>
                      <Text style={{ color: theme.text, fontWeight: "600", marginBottom: 8, fontFamily: "Poppins-SemiBold" }}>Team Collaboration</Text>
                      <Text style={{ color: theme.secondaryText, fontSize: 14, fontFamily: "Poppins-Regular" }}>Plan, discuss, and ship together</Text>
                    </View>
                  </Animated.View>
                </View>
              </View>
            </Animated.View>
          )}
          {/* Background Effects inspired by premium design */}
          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { zIndex: 0, opacity: bgOpacity }]}
          >
            <LinearGradient
              colors={[
                Platform.OS === 'web' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.02)',
                'transparent',
                Platform.OS === 'web' ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)'
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
      </ScrollView>
      <StatusBar  style= {theme.mode==='dark'?'light':'dark'} />
    </SafeAreaView>
  )
}
