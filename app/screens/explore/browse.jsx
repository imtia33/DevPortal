import { View, Text, TouchableOpacity, useWindowDimensions, BackHandler, ScrollView, FlatList } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { TabBarContext } from '../../../context/TabBarContext';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShowCaseItem from '../../../componants/ShowCaseItem';
import { useTheme } from '../../../context/ColorMode';

const Browse = () => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { showTabBar, setShowTabBar } = useContext(TabBarContext);

  useEffect(() => {
    const backAction = () => {
      if (!showTabBar) {
        setShowTabBar(true);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [showTabBar]);

  const item = {
    id: "abc123",
    title: "React Native Chat App",
    tagline: "A sleek and modern chat app built with Firebase.",
    coverImageUrl: "https://fra.cloud.appwrite.io/v1/storage/buckets/67701c52003c8f02e665/files/67d6c369000f861598f5/view?project=673bbe980022bc5d9813&mode=admin",
    tags: ["React Native", "appwrite", "Chat"],
    createdAt: "2024-11-15T08:00:00.000Z",
    owner: {
      username: "imtia33",
      avatarUrl: "https://avatars.githubusercontent.com/u/12345678?v=4",
    },
    stats: {
      stars: 128,
      isPromoted: true,
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.screenBackground, borderTopWidth: 1, borderTopColor: theme.borderTopColor }}>
      {!isDesktop && (
          <View style={{ flexDirection: 'row', alignItems: 'center',  paddingHorizontal: 16,paddingTop:10,paddingBottom:5 ,borderBottomWidth:1,borderBottomColor:theme.borderTopColor}}>
            <TouchableOpacity
              onPress={() => setShowTabBar(true)}
              style={{ marginRight: 12, padding: 6, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.08)' }}
            >
              <MaterialIcons name="arrow-back" size={24} color={theme.opposite} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '600',color:theme.opposite }}>Browse</Text>
            
          </View>
        )}
      
        
        <FlatList
          data={Array.from({ length: 1 }).map((_, idx) => item)}
          renderItem={({ item }) => <ShowCaseItem project={item} />}
          keyExtractor={(item, idx) => idx.toString()}
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 24,
            justifyContent: 'flex-start',
            padding: isDesktop ? 24 : 5,
          }}
        />
      
    </View>
  );
};

export default Browse;
