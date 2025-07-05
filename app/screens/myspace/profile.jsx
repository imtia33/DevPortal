import { View, Text, TouchableOpacity, useWindowDimensions, BackHandler } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { TabBarContext } from '../../../context/TabBarContext'
import { MaterialIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../context/ColorMode'
const Profile = () => {
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
    <View style={{ backgroundColor: theme.screenBackground, height: '100%', width: '100%', borderTopWidth: 1, borderTopColor: 'rgb(227, 223, 223)' }}>
      <SafeAreaView>
        {!isDesktop && (
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 }}>
            <TouchableOpacity
              onPress={() => setShowTabBar(true)}
              style={{ marginRight: 12, padding: 6, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.08)' }}
            >
              <MaterialIcons name="arrow-back" size={24} color="#222" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>Profile</Text>
          </View>
        )}
        <View style={{ flex: 1, justifyContent: isDesktop ? 'center' : undefined, alignItems: isDesktop ? 'center' : undefined }}>
          {isDesktop && <Text>Profile</Text>}
        </View>
      </SafeAreaView>
    </View>
  )
}

export default Profile
