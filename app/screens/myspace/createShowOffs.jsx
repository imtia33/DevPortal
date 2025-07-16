import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { create, createShowoff } from '../../../backend/appwrite'
import { useAppwriteContext } from '../../../context/appwriteContext'

const payload = {
  title: "DevSpace Showcase",
  tagline: "Boost your productivity with DevSpace!",
  description: "DevSpace is a tool for developers that streamlines your workflow, ",
  tags: JSON.stringify(["productivity", "automation", "tooling"]),
  coverImageUrl: "https://picsum.photos/800/400", // sample working image
  gitRepo: "https://github.com/vercel/next.js",
  demo: JSON.stringify([
    {
      type: "website",
      url: "https://devspace.com"
    },
    {
      type: "google-play",
      url: "https://play.google.com/store/apps/details?id=com.devspace.app"
    },
    {
      type: "app-store",
      url: "https://apps.apple.com/app/devspace/id1234567890"
    }
  ]),
  avatarUrl: "https://i.pravatar.cc/100", // avatar image
  username: "John Doe"
};


const CreateShowOffs = () => {
  const [loading, setLoading] = useState(false)
  const { isLogged } = useAppwriteContext()
 
  const handlePress = async () => {
    if (!isLogged) {
      Alert.alert('Please log in')
      return
    }
    setLoading(true)
    try {
      const res1= await createShowoff(JSON.stringify(payload))
      console.log(res1)
    
    } catch (e) {
      Alert.alert('Error', e.message)
    }
    setLoading(false)
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!isLogged ? (
        <Text>Please log in to create showoffs</Text>
      ) : (
        <TouchableOpacity
          onPress={handlePress}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#007AFF',
            padding: 16,
            borderRadius: 8,
            width: 200,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            {loading ? 'Creating...' : 'Create ShowOff'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default CreateShowOffs
