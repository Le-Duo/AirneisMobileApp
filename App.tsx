import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Store } from './src/Store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useScrollToTop from './src/hooks/useScrollToTop';
import HomePage from './src/pages/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

function App() {
  const scrollViewRef = React.useRef(null);
  // useScrollToTop(scrollViewRef);

  const {
    state: { mode, cart, userInfo },
    dispatch,
  } = useContext(Store)

  useEffect(() => {
    AsyncStorage.setItem('data-bs-theme', mode)
  }, [mode])

  const switchModeHandler = () => {
    dispatch({ type: 'SWITCH_MODE' })
  }

  const signoutHandler = async () => {
    dispatch({ type: 'USER_SIGNOUT' })
    await AsyncStorage.removeItem('userInfo')
    await AsyncStorage.removeItem('cartItems')
    await AsyncStorage.removeItem('shippingAddress')
    await AsyncStorage.removeItem('paymentMethod')
    // navigation.navigate('Home') // This line is commented out as navigation will be handled differently in the new setup
  }

  const [showOffcanvas, setShowOffcanvas] = useState(false)

  const handleCloseOffcanvas = () => setShowOffcanvas(false)

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomePage} options={{ title: 'AIRNEIS' }} />
          {/* Define other screens and navigation structure here */}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;