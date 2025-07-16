import { View, Text, useWindowDimensions, TouchableOpacity, BackHandler } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { TabBarContext } from '../../../context/TabBarContext'
import { MaterialIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../context/ColorMode'

const Home = () => {
  const {theme} = useTheme()
  const { width } = useWindowDimensions()
  const isDesktop = width >= 768
  const { showTabBar, setShowTabBar } = useContext(TabBarContext)

  useEffect(() => {
    const backAction = () => {
      if (!showTabBar) {
        setShowTabBar(true)
        return true // prevent default back behavior
      }
      return false // allow default behavior
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

    return () => backHandler.remove() // cleanup
  }, [showTabBar])

  return (
    <View style={{ flex: 1, backgroundColor: theme.firstTabBackground, borderTopWidth: 0.5, borderTopColor: theme.borderTopColor }}>
     
    </View>
  )
}

export default Home
