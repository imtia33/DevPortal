import { View, Text, TouchableOpacity, useWindowDimensions, BackHandler } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { TabBarContext } from '../../../context/TabBarContext'
import { MaterialIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../context/ColorMode'
const Search = () => {
  const { theme } = useTheme()
  const { width } = useWindowDimensions()
  const isDesktop = width >= 768
  const { showTabBar, setShowTabBar } = useContext(TabBarContext)

  useEffect(() => {
    const backAction = () => {
      if (!showTabBar) {
        setShowTabBar(true)
        return true
      }
      return false
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => backHandler.remove()
  }, [showTabBar])

  return (
    <View style={{ backgroundColor: theme.firstTabBackground, height: '100%', width: '100%', borderTopWidth: 1, borderTopColor: theme.borderTopColor }}>
      <SafeAreaView>
        
        
      </SafeAreaView>
    </View>
  )
}

export default Search
