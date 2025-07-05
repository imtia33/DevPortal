import { View, Text, TouchableOpacity, useWindowDimensions, BackHandler, ScrollView, FlatList } from 'react-native';
import React, { useContext, useEffect,useState } from 'react';
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
  const [numColumns, setNumColumns] = useState(1);

  const onLayout = (event) => {
    const containerWidth = event.nativeEvent.layout.width;
    const itemWidth = isDesktop ? 350 : 280; // Smaller for mobile
    const padding = 8;
    const gap = 4;
    
    const availableWidth = containerWidth - padding;
    const columns = Math.floor((availableWidth + gap) / (itemWidth + gap));
    setNumColumns(Math.max(1, columns));
  };

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
    <View onLayout={onLayout} style={{ flex: 1, backgroundColor: theme.screenBackground, borderTopWidth: 1, borderTopColor: theme.borderTopColor }}>
      
      
        
      <FlatList
        data={Array.from({ length: 10 }).map((_, idx) => item)}
        renderItem={({ item }) => <ShowCaseItem project={item} />}
        numColumns={numColumns}
        key={numColumns} 
        keyExtractor={(item, idx) => idx.toString()}
        contentContainerStyle={{
          padding: isDesktop?24:4,
          gap: 24,
        }}
        columnWrapperStyle={numColumns > 1 ? { gap: 24 } : undefined}
      />
      
    </View>
  );
};

export default Browse;
