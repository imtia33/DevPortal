import { View, Text, TouchableOpacity, useWindowDimensions, BackHandler, ScrollView, FlatList } from 'react-native';
import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
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

  const item = {
    id: "abc123",
    title: "React Native Chat App",
    tagline: "A sleek and modern chat app built with Firebase.",
    coverImageUrl: "https://fra.cloud.appwrite.io/v1/storage/buckets/67701c52003c8f02e665/files/67d6c369000f861598f5/view?project=673bbe980022bc5d9813&mode=admin",
    tags: `["React Native", "appwrite", "Chat"]`,
    createdAt: "2024-11-15T08:00:00.000Z",
    username: "imtia33",
    avatarUrl: "https://avatars.githubusercontent.com/u/12345678?v=4",
    stars: 128,
    isPromoted: true,
  };

  
  const data = useMemo(() => {
    return Array.from({ length: 10 }, (_, idx) => ({
      ...item,
      id: `item-${idx}`,
    }));
  }, []);

  // Memoize the renderItem function
  const renderItem = useCallback(({ item }) => {
    return <ShowCaseItem project={item} />;
  }, []);

  // Memoize the keyExtractor function
  const keyExtractor = useCallback((item) => item.id, []);

  // Memoize styles to prevent recreation
  const contentContainerStyle = useMemo(() => ({
    padding: isDesktop ? 24 : 4,
    gap: 24,
  }), [isDesktop]);

  const columnWrapperStyle = useMemo(() => 
    numColumns > 1 ? { gap: 24 } : undefined, 
    [numColumns]
  );

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

  return (
    <View onLayout={onLayout} style={{ flex: 1, backgroundColor: theme.firstTabBackground, borderTopWidth: 1, borderTopColor: theme.borderTopColor, justifyContent: 'center', alignItems: 'center' }}>
      
      
        
      <FlatList
        data={data}
        renderItem={renderItem}
        numColumns={numColumns}
        key={numColumns} 
        keyExtractor={keyExtractor}
        contentContainerStyle={contentContainerStyle}
        columnWrapperStyle={columnWrapperStyle}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={3}
        updateCellsBatchingPeriod={50}
        disableVirtualization={false}
        showsVerticalScrollIndicator={false}
        getItemLayout={numColumns === 1 ? (data, index) => ({
          length: 370,
          offset: 370 * index,
          index,
        }) : undefined}
      />
      
    </View>
  );
};

export default Browse;
