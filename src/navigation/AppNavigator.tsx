import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AppStackParamList } from './types'
import BottomTabNavigator from './BottomTabNavigator'
import MovieDetailScreen from '../features/movies/screens/MovieDetailScreen'
import AccountScreen from '../features/account/screens/AccountScreen'

const Stack = createNativeStackNavigator<AppStackParamList>()

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Tabs' component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name='MovieDetails' component={MovieDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Account" component={AccountScreen} />
    </Stack.Navigator>
  )
}

export default AppNavigator