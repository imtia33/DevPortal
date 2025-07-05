import { View, Text, Dimensions, Platform } from 'react-native'
import React from 'react'
import GlareHover from './GlareHover'
import { MaterialIcons, FontAwesome5, Ionicons, Octicons, Feather, Entypo, EvilIcons } from '@expo/vector-icons'

const features = [
  {
    icon: <MaterialIcons name="rocket-launch" size={32} color="#FD366E" />,
    title: 'Showcase',
    description: 'Create beautiful project pages with live demos, code snippets, and detailed documentation',
  },
  {
    icon: <FontAwesome5 name="handshake" size={32} color="#38BDF8" />,
    title: 'Colaborate',
    description: 'Connect with developers who share your interests and build amazing projects together',
  },
  {
    icon: <Ionicons name="book-outline" size={32} color="#FBBF24" />,
    title: 'Learn ',
    description: 'Get feedback from experienced developers and improve your skills through community interaction',
  },
  {
    icon: <EvilIcons name="trophy" size={32} color="#F59E42" />,
    title: 'Build Reputation',
    description: 'Earn recognition for your contributions and establish yourself as a skilled developer',
  },
  {
    icon: <Feather name="github" size={32} color="#A855F7" />,
    title: 'GitHub Integration',
    description: 'Seamlessly sync your repositories and showcase your contributions',
  },
  {
    icon: <Entypo name="chat" size={32} color="#34D399" />,
    title: 'Community Feedback',
    description: 'Receive constructive feedback and engage in meaningful discussions about your work',
  },
]

const FeaturesSection = () => {
  const { width } = Dimensions.get('window')
  const isDesktop = width >= 1024
  const isTablet = width >= 768 && width < 1024
  const isMobile = width < 768

  const getBoxWidth = () => {
    if (isDesktop) return 360
    if (isTablet) return 340
    return '100%'
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 24,
        justifyContent: 'center',
      }}
    >
      {features.map((feature, idx) => (
        <View
          key={feature.title}
          style={{
            width: getBoxWidth(),
            backgroundColor: '#111111',
            borderRadius: 20,
            padding: 0,
            borderWidth: 1,
            borderColor: '#1A1A1A',
            overflow: 'hidden',
            alignItems: 'stretch',
            justifyContent: 'stretch',
            marginBottom: isMobile ? 20 : 0,
          }}
        >
          <GlareHover
            width="100%"
            height={200}
            style={{
              borderRadius: 20,
              width: '100%',
              height: 200,
            }}
          >
            <View style={{ width: '100%', padding: 16 }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: '#1A1A1A',
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                  alignSelf: 'flex-start',
                }}
              >
                {feature.icon}
              </View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: 8,
                }}
              >
                {feature.title}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: '#9CA3AF',
                  lineHeight: 24,
                }}
              >
                {feature.description}
              </Text>
            </View>
          </GlareHover>
        </View>
      ))}
    </View>
  )
}

export default FeaturesSection