import { Tabs } from 'expo-router';
import { NavigationProvider } from '../componants/NavigationProvider';

export default function TabLayout() {
  return (
    <NavigationProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}>
        
        <Tabs.Screen name="home" />
        <Tabs.Screen name="profile" />
        <Tabs.Screen name="browse" />
        <Tabs.Screen name="search" />
      </Tabs>
    </NavigationProvider>
  );
}