import React from 'react';
import {NavigationContainer, DarkTheme, DefaultTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import HomePage from './src/pages/index';
import ProductPage from './src/pages/ProductPage';
import CartPage from './src/pages/CartPage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useColorScheme} from 'react-native';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const queryClient = new QueryClient();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="HomePage" component={HomePage} />
      <HomeStack.Screen name="Product" component={ProductPage} />
    </HomeStack.Navigator>
  );
}

function App() {
  const scheme = useColorScheme();
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Tab.Navigator
          screenOptions={({route}) => ({
            headerShown: false,
            tabBarIcon: ({focused, color, size}) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Cart') {
                iconName = 'shopping-cart';
              }
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {paddingBottom: 5, paddingTop: 5},
          })}>
          <Tab.Screen name="Home" component={HomeStackNavigator} />
          <Tab.Screen name="Cart" component={CartPage} options={{tabBarLabel: 'Cart'}} />
        </Tab.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;
