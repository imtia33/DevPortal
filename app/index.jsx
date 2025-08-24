import React, { useEffect, useState } from 'react';
import { View, Text, Animated,Platform } from 'react-native';
import { router } from 'expo-router';

import { useAppwriteContext } from '../context/appwriteContext';
import Logo from '../componants/Logo';
import { useTheme } from '../context/ColorMode';
import { StatusBar } from 'expo-status-bar';

export default function LoadingScreen() {
  const { theme } = useTheme();
  const {isLogged, loading} = useAppwriteContext();

  



  useEffect(() => {
    
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
        backgroundColor: theme.primary,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      
      
        {/* Logo */}
        <View style={{ alignItems: 'center', gap: 16 }}>
          <View style={{
            width: 64,
            height: 64,
            
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Logo
           
            />
          </View>
          <View>
          
          </View>
        </View>

        
    </View>
  );
}

