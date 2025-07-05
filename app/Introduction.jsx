// Optimized version of your component
// Focus: reduced nesting, better layout structure, and less DOM bloat on web

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
import RotatingText from '../componants/RotatingText';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import FeaturesSection from "../componants/FeaturesSection";
import Footer from '../componants/FooterNote';

const { width } = Dimensions.get('window');
const isDesktop = width >= 1024;
const isTablet = width >= 768 && width < 1024;
const isMobile = width < 768;

export default function HomeScreen() {
  const rotatingTextRef = useRef(null);
  const texts = [
    'Show off Your Project',
    'Inspire Others',
    'Colaborate with devs',
    'Share Your Knowledge',
    'Build Your Portfolio',
    'Connect with Developers',
    'Showcase Your Skills',
    'Learn from Others',
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          height: 72,
          borderBottomWidth: 1,
          borderBottomColor: '#1A1A1A',
          backgroundColor: 'rgba(10,10,10,0.95)',
          ...(Platform.OS === 'web' && { backdropFilter: 'blur(20px)' }),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: isDesktop ? 48 : 20,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 36, height: 36, backgroundColor: '#FF6B6B', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesome5 name="gitkraken" size={30} color="black" />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#FFFFFF' }}>DevPortal</Text>
        </View>
        
        
        <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#FD366E', borderRadius: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>Get Started</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingVertical: isDesktop ? 120 : 80, paddingHorizontal: isDesktop ? 48 : 20, alignItems: 'center' }}>
          <View style={{ maxWidth: 1200, alignSelf: 'center' }}>
            <Text style={{ fontSize: isDesktop ? 56 : isMobile ? 36 : 48, fontWeight: '800', color: '#FFF', textAlign: isDesktop ? 'left' : 'center', marginBottom: 24 }}>
              Build your developer{'\n'}
              <Text style={{ color: '#FF6B6B' }}>knowledge</Text>
            </Text>
            <RotatingText
              style={{ alignSelf: 'center' }}
              ref={rotatingTextRef}
              texts={texts}
              loop
              auto
              rotationInterval={2500}
              staggerDuration={100}
              staggerFrom="first"
              splitBy="characters"
              characterStyle={{ fontSize: 24, fontWeight: 'bold', color: '#FD366E' }}
            />
            <Text  style={{ fontSize: isDesktop ? 20 : 18, color: '#9CA3AF', textAlign: isDesktop ? 'left' : 'center', marginVertical: 30 }}>
              Join the community where code meets collaboration.
            </Text>
            <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: 16, alignItems: 'center' }}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF6B6B', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#FFF' }}>Start Showcasing</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
              <TouchableOpacity style={{ paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12, borderWidth: 1, borderColor: '#333' }}>
                <Text style={{ fontSize: 18, fontWeight: '500', color: '#FFF' }}>Browse Projects</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            paddingVertical: isDesktop ? 120 : 80,
            paddingHorizontal: isDesktop ? 48 : 20,
            backgroundColor: '#0F0F0F',
          }}
        >
          <View
            style={{
              maxWidth: 1200,
              alignSelf: 'center',
              width: '100%',
            }}
          >
            <Text
              style={{
                fontSize: isDesktop ? 40 : 32,
                fontWeight: '700',
                color: '#FFFFFF',
                textAlign: 'center',
                marginBottom: 16,
                lineHeight: isDesktop ? 48 : 40,
              }}
            >
              Everything you need to get started with your developer journey
            </Text>

            <FeaturesSection/>
          </View>
        </View>

        <View style={{ paddingVertical: isDesktop ? 120 : 80, paddingHorizontal: isDesktop ? 48 : 20 }}>
          <View style={{ maxWidth: 600, alignSelf: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: isDesktop ? 40 : 32, fontWeight: '700', color: '#FFF', textAlign: 'center', marginBottom: 16 }}>
              Ready to showcase your projects?
            </Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF6B6B', paddingHorizontal: 40, paddingVertical: 18, borderRadius: 12 }}>
              <Text style={{ fontSize: 20, fontWeight: '600', color: '#FFF' }}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </View>
        <Footer/>
      </ScrollView>
      
    </SafeAreaView>
  );
}