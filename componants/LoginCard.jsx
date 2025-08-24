"use client"
import { useEffect, useRef, useState } from "react"
import { View, Text, TextInput, Pressable, Animated, Easing, Platform, StyleSheet, Alert, ToastAndroid } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Feather, FontAwesome } from "@expo/vector-icons"
import { useTheme } from "../context/ColorMode"
import ThemeChanger from "./ThemeChanger"
import {login,EmailPassLogin,EmailPassCreateAccount} from "../backend/appwrite"
import { router } from "expo-router"
import ForgotPasswordModal from "./ForgotPasswordModal"
// Simple cross-platform toast helper
function showToast(message) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT)
  } else {
    Alert.alert('Error', message)
  }
}

// Local helpers (scoped to this component)
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

// Button with hover/press animation
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

export default function LoginCard({ onLogin = () => {set}, onSignUp = () => {}, onError = () => {} }) {
  const { theme, toggleTheme } = useTheme()
  const [showPassword, setShowPassword] = useState(false)
  const [animationStage, setAnimationStage] = useState(0)
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showGitHubTip, setShowGitHubTip] = useState(false)
  // Local form state
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

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimationStage(6), 50), // Card
      setTimeout(() => setAnimationStage(7), 200), // Fields
      setTimeout(() => setAnimationStage(8), 350), // Social & signup
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

  return (
    <Animated.View
    className="absolute inset-0 bg-gradient-to-br from-[#FD366E]/10 via-transparent to-purple-500/5 rounded-[2rem]"
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
    start={{x: 0, y: 0}}
    end={{x: 1, y: 1}}
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
                width:40,
                height: 40,
                borderRadius: 50,
                backgroundColor: '#FD366E',
                alignItems: 'center',
                justifyContent: 'center',
                bottom:10            }}
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
                const res=await EmailPassCreateAccount(name, email, password);
                if (!res) {
                  onError('Signup failed');
                  showToast('Signup failed');
                  return;
                }
                const res2 =await EmailPassLogin(email, password);
                setUser(res2);
                setIsLogged(true);
                if(res2){
                  router.replace('/screens');
                }

              } catch (e) {
                onError(e?.message || 'Signup failed');
                showToast(e?.message || 'Signup failed');
              }
            } else {
              try {
                await EmailPassLogin(email, password);
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

        <View style={{  justifyContent: 'center',alignSelf:'center' }}>
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
                await login();
              } catch (e) {
                onError(e?.message || 'GitHub login failed');
                showToast(e?.message || 'GitHub login failed');
              }
            }}
          >
            <FontAwesome className="self-center" name="github" size={22} color={theme.text} />
            
          </Button>
          <Text className="self-center font-psemibold text-xl " style={{color: theme.opposite,right:2 }}>GitHub</Text>
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
              <Text style={{ color: theme.accent2, fontWeight: "bold",  fontFamily: "Poppins-SemiBold",top:Platform.OS==='web'?0:5,fontSize:18 }}>
                Sign up
              </Text>
            </Pressable>
          </Text>
        ) : (
          <Text style={{ color: theme.secondaryText, fontSize: 18, fontFamily: "Poppins-Regular" }}>
            Already on Axhibit?{" "}
            <Pressable onPress={() => animateMode('login')}>
              <Text style={{ color: theme.accent2, fontWeight: "bold",  fontFamily: "Poppins-SemiBold",top:Platform.OS==='web'?0:5,fontSize:18 }}>
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
  )
}


