import React, { useEffect } from 'react'
import { View, StyleSheet, Animated, Easing, useWindowDimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'

const TiltedBackground = () => {
  const { width, height } = useWindowDimensions()
  const bottomAnim = React.useRef(new Animated.Value(height)).current
  const fadeAnim = React.useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(bottomAnim, {
        toValue: 0,
        duration: 700,
        delay: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start()
  }, [height]) 

  const dynamicStyles = {
    bottomWedge: {
      position: 'absolute',
      right: -width * 0.33,
      bottom: -height * 0.5,
      height: height * 1.4,
      width: width * 1.1,
      borderRadius: 50,
      overflow: 'hidden',
      shadowColor: 'rgba(43,10,18,0.65)',
      shadowOffset: { width: 0, height: 30 },
      shadowOpacity: 1,
      shadowRadius: 60,
      borderWidth: 2,
      borderColor: 'rgba(251,113,133,0.2)', // rose-500/20
    },
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={['rgba(255, 45, 83, 0.72)', 'rgba(176,18,63,1)', 'rgba(43,10,18,1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Bottom/right wedge */}
      <Animated.View
        style={[
          dynamicStyles.bottomWedge,
          {
            opacity: fadeAnim,
            transform: [
              { rotate: '65deg' },
              { translateY: bottomAnim },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgb(43, 10, 18)', 'rgb(122, 14, 45)', 'rgba(255,84,120,1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <BlurView
        intensity={40}
        tint='dark'
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      
    </View>
  )
}

export default TiltedBackground