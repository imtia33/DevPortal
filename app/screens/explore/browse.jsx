import { View, Text, TouchableOpacity, useWindowDimensions, BackHandler, ScrollView, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { TabBarContext } from '../../../context/TabBarContext';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShowCaseItem from '../../../componants/ShowCaseItem';
import { useTheme } from '../../../context/ColorMode';
import { databases, DATABASE_ID } from '../../../backend/appwrite';
import { Query } from 'react-native-appwrite';

const Browse = () => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { showTabBar, setShowTabBar } = useContext(TabBarContext);
  const [numColumns, setNumColumns] = useState(1);
  
  // Collection ID for showcases
  const COLLECTION_ID = "686e24d4000a49ad0954";
  
  // State for data and pagination
  const [showcases, setShowcases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDocumentId, setLastDocumentId] = useState(null);
  const [error, setError] = useState(null);
  
  // Pagination settings
  const ITEMS_PER_PAGE = 10;
  
  // Function to fetch showcases with cursor pagination
  const fetchShowcases = async (isRefresh = false, cursor = null) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setError(null);
      } else if (cursor) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }
      
      const queries = [
        Query.orderDesc('$createdAt'),
        Query.limit(ITEMS_PER_PAGE)
      ];
      
      // Add cursor for pagination
      if (cursor && !isRefresh) {
        queries.push(Query.cursorAfter(cursor));
      }
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        queries
      );
      
      const newShowcases = response.documents;
      
      if (isRefresh) {
        setShowcases(newShowcases);
        setLastDocumentId(newShowcases.length > 0 ? newShowcases[newShowcases.length - 1].$id : null);
      } else if (cursor) {
        setShowcases(prev => [...prev, ...newShowcases]);
        setLastDocumentId(newShowcases.length > 0 ? newShowcases[newShowcases.length - 1].$id : lastDocumentId);
      } else {
        setShowcases(newShowcases);
        setLastDocumentId(newShowcases.length > 0 ? newShowcases[newShowcases.length - 1].$id : null);
      }
      
      // Check if there are more items
      setHasMore(newShowcases.length === ITEMS_PER_PAGE);
      
    } catch (err) {
      console.error('Error fetching showcases:', err);
      setError(err.message || 'Failed to load showcases');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchShowcases();
  }, []);
  
  // Refresh handler
  const handleRefresh = useCallback(() => {
    fetchShowcases(true);
  }, []);
  
  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && lastDocumentId) {
      fetchShowcases(false, lastDocumentId);
    }
  }, [loadingMore, hasMore, lastDocumentId]);

  // Memoize the renderItem function
  const renderItem = useCallback(({ item }) => {
    return <ShowCaseItem project={item} />;
  }, []);

  // Memoize the keyExtractor function
  const keyExtractor = useCallback((item) => item.$id || item.id, []);
  
  // Render footer for loading more
  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={theme.mode === 'dark' ? '#BB86FC' : '#007AFF'} />
        <Text style={{ 
          color: theme.mode === 'dark' ? '#E0E0E0' : '#333',
          marginTop: 8,
          fontSize: 14
        }}>
          Loading more...
        </Text>
      </View>
    );
  }, [loadingMore, theme]);
  
  // Render empty state
  const renderEmptyState = useCallback(() => {
    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }}>
          <ActivityIndicator size="large" color={theme.mode === 'dark' ? '#BB86FC' : '#007AFF'} />
          <Text style={{ 
            color: theme.mode === 'dark' ? '#E0E0E0' : '#333',
            marginTop: 16,
            fontSize: 16
          }}>
            Loading showcases...
          </Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60, paddingHorizontal: 20 }}>
          <MaterialIcons 
            name="error-outline" 
            size={64} 
            color={theme.mode === 'dark' ? '#ef4444' : '#dc2626'} 
          />
          <Text style={{ 
            color: theme.mode === 'dark' ? '#E0E0E0' : '#333',
            marginTop: 16,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Failed to Load Showcases
          </Text>
          <Text style={{ 
            color: theme.mode === 'dark' ? '#94a3b8' : '#64748b',
            marginTop: 8,
            fontSize: 14,
            textAlign: 'center'
          }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => fetchShowcases()}
            style={{
              marginTop: 20,
              paddingHorizontal: 20,
              paddingVertical: 12,
              backgroundColor: theme.mode === 'dark' ? '#BB86FC' : '#007AFF',
              borderRadius: 8
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }}>
        <MaterialIcons 
          name="inbox" 
          size={64} 
          color={theme.mode === 'dark' ? '#94a3b8' : '#64748b'} 
        />
        <Text style={{ 
          color: theme.mode === 'dark' ? '#E0E0E0' : '#333',
          marginTop: 16,
          fontSize: 18,
          fontWeight: 'bold'
        }}>
          No Showcases Found
        </Text>
        <Text style={{ 
          color: theme.mode === 'dark' ? '#94a3b8' : '#64748b',
          marginTop: 8,
          fontSize: 14,
          textAlign: 'center'
        }}>
          Be the first to create a project showcase!
        </Text>
      </View>
    );
  }, [loading, error, theme]);

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
      {showcases.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={showcases}
          renderItem={renderItem}
          numColumns={numColumns}
          key={numColumns} 
          keyExtractor={keyExtractor}
          contentContainerStyle={contentContainerStyle}
          columnWrapperStyle={columnWrapperStyle}
          removeClippedSubviews={true}
          maxToRenderPerBatch={3}
          windowSize={5}
          initialNumToRender={6}
          updateCellsBatchingPeriod={50}
          disableVirtualization={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.mode === 'dark' ? '#BB86FC' : '#007AFF']}
              tintColor={theme.mode === 'dark' ? '#BB86FC' : '#007AFF'}
              progressBackgroundColor={theme.mode === 'dark' ? '#1e293b' : '#f1f5f9'}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          getItemLayout={numColumns === 1 ? (data, index) => ({
            length: 370,
            offset: 370 * index,
            index,
          }) : undefined}
        />
      )}
    </View>
  );
};

export default Browse;
