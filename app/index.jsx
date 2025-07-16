import React, { useEffect, useState } from 'react';
import { View, Text, Animated,Platform } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { getCurrentUser } from '../backend/appwrite';
import { useAppwriteContext } from '../context/appwriteContext';
import Logo from '../componants/Logo';

export default function LoadingScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const {isLogged, loading} = useAppwriteContext();

  

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,  
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    
  }, []);

  useEffect(() => {
    // Wait for the loading to complete before making redirect decision
    if (!loading) {
      if (isLogged) {
        router.replace('/screens');
      } else {
        router.replace('/Introduction');
      }
    }
  }, [isLogged, loading]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#19191D',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <StatusBar style="light" />
      
      <Animated.View 
        style={{
          alignItems: 'center',
          gap: 48,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }}
      >
        {/* Logo */}
        <View style={{ alignItems: 'center', gap: 16 }}>
          <View style={{
            width: 64,
            height: 64,
            backgroundColor: '#FD366E',
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <FontAwesome5 name="gitkraken" size={30} color="black" />
          </View>
          {/* <View>
          <Logo/>
          </View> */}
        </View>

        <View style={{ alignItems: 'center', gap: 16 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <LoadingDot delay={0} />
            <LoadingDot delay={200} />
            <LoadingDot delay={400} />
          </View>
          
        </View>
      </Animated.View>
    </View>
  );
}

function LoadingDot({ delay }) {
  const [opacity] = useState(new Animated.Value(0.3));

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    const timer = setTimeout(animate, delay);
    return () => clearTimeout(timer);
  }, [delay, opacity]);

  return (
    <Animated.View style={{
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#FF6B6B',
      opacity,
    }} />
  );
}