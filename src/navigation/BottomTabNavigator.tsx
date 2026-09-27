import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DiscoverScreen from '../features/movies/screens/DiscoverScreen';
import SearchScreen from '../features/movies/screens/SearchScreen';
import WatchlistScreen from '../features/watchlist/screens/WatchlistScreen';
import { BottomTabParamList } from './types';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<BottomTabParamList>();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.bulb,
        tabBarInactiveTintColor: colors.dim,
        tabBarIcon: () => null,
        tabBarIconStyle: { display: 'none' },
        tabBarLabelStyle: { fontSize: 14, fontWeight: '500' },
        tabBarStyle: {
          backgroundColor: colors.ink,
          borderTopColor: colors.line,
          height: 58,
          paddingTop: 6,
        },
      }}
    >
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Watchlist" component={WatchlistScreen} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
