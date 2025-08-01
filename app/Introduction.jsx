import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import MagicBento from '../componants/MagicBento';
import { login } from "../backend/appwrite";
import { router } from 'expo-router';
import Logo from '../componants/Logo';
import { useTheme } from "../context/ColorMode";
import ThemeChanger from '../componants/ThemeChanger';


const { width } = Dimensions.get('window');
const isDesktop = width >= 1024;
const isTablet = width >= 768 && width < 1024;
const isMobile = width < 768;

export default function HomeScreen() {
  const { theme, toggleTheme } = useTheme();

  const handleLogin = async () => {
    try {
      const res = await login();
      if(res){
        router.replace('/screens');
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Theme-based styles
  const needs = {
    Textcolor: theme.text,
    background: theme.background,
    cardBackground: theme.cardBackground,
    accent: theme.accent2,
    buttonText: theme.buttonText,
    borderColor: theme.borderColor,
  };

  return (
    <View style={{ flex: 1, backgroundColor: needs.background }}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView style={{ flex: 1, width: isDesktop ? '60%' : '100%', alignSelf: 'center', zIndex: 1,allignItems:'center' }}>
        {/* Header */}
        <View
          style={{
            height: 72,
            backgroundColor: theme.headerBackground,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: isDesktop ? 48 : 20,
            ...(isMobile ? {
              borderRadius: 0,
              borderBottomWidth: 0,
              marginTop: 0,
              marginBottom: 0,
            } : {
              borderBottomWidth: 1,
              borderBottomColor: needs.borderColor,
              borderRadius: 16,
              marginTop: 8,
              marginBottom: 8,
            })
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Logo height={40} width={40} />
            <Text className="font-Lsemi" style={{ fontSize: 22, color: needs.Textcolor, fontWeight: 'bold', marginLeft: 6 }}>Axhibit</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ThemeChanger
              focused={theme.mode}
              onToggle={mode => toggleTheme()}
              compact
            />
            <TouchableOpacity
              onPress={handleLogin}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 9,
                borderRadius: 8,
                minWidth: 100,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: needs.accent,
                shadowColor: needs.accent,
                shadowOpacity: 0.18,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                marginLeft: 8,
              }}>
              <Text className="font-psemibold" style={{ fontSize: 15, color: needs.buttonText, fontWeight: '600' }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Main Content */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}
          style={{ backgroundColor: 'transparent' }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              paddingVertical: isDesktop ? 100 : 60,
              paddingHorizontal: isDesktop ? 48 : 20,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <View
              style={{
                maxWidth: 900,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Text
                className="font-psemibold"
                style={{
                  fontSize: isDesktop ? 44 : 32,
                  textAlign: 'center',
                  marginBottom: 18,
                  color: needs.Textcolor,
                  fontWeight: 'bold',
                  letterSpacing: 0.5,
                  alignSelf: 'center',
                }}
              >
                Build your developer{Platform.OS === 'web' ? <br /> : '\n'}
                <Text
                  style={{
                    fontSize: isDesktop ? 44 : 32,
                    color: needs.accent,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  knowledge
                </Text>
              </Text>
              <Text
                style={{
                  fontSize: isDesktop ? 20 : 16,
                  color: theme.secondaryText,
                  textAlign: 'center',
                  marginBottom: 32,
                  marginTop: 2,
                  fontWeight: '400',
                  maxWidth: 600,
                  alignSelf: 'center',
                }}
              >
                Discover, share, and showcase your projects and skills. Join a vibrant community of developers and grow your knowledge together.
              </Text>
            </View>
          </View>
          {/* Bento Section */}
          <View
            style={{
              marginBottom: 40,
              alignSelf: 'center',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            
            <MagicBento theme={theme} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}