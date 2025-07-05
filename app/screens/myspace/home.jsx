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
    <View style={{ backgroundColor: theme.screenBackground, height: '100%', width: '100%', borderTopWidth: 1, borderTopColor: 'rgb(227, 223, 223)' }}>
      <SafeAreaView>
        {!isDesktop && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: 'transparent',
          }}>
            <TouchableOpacity
              onPress={() => setShowTabBar(true)}
              style={{
                marginRight: 12,
                padding: 6,
                borderRadius: 20,
                backgroundColor: 'rgba(0,0,0,0.08)',
              }}
            >
              <MaterialIcons name="arrow-back" size={24} color="#222" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>Home</Text>
          </View>
        )}

        {/* Main content */}
        <View style={{
          flex: 1,
          justifyContent: isDesktop ? 'center' : undefined,
          alignItems: isDesktop ? 'center' : undefined
        }}>
         
        </View>
      </SafeAreaView>
    </View>
  )
}

export default Home
