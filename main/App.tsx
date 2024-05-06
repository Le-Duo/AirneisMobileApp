import React, {useContext, useEffect, useState} from 'react';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import HomePage from './src/pages/index';
import ProductPage from './src/pages/ProductPage';
import ProductsPage from './src/pages/ProductsPage';
import CartPage from './src/pages/CartPage';
import SigninPage from './src/pages/SigninPage';
import SignupPage from './src/pages/SignupPage';
import PasswordResetRequest from './src/components/PasswordResetRequest';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useColorScheme, Text, ActivityIndicator} from 'react-native';
import {StoreProvider, Store} from './src/Store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {initializeState} from './src/Store';

type RootStackParamList = {
  HomePage: undefined;
  Product: {slug: string};
  SignIn: {redirect: string};
};

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const queryClient = new QueryClient();

const signoutHandler = async () => {
  const {dispatch} = useContext(Store);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  dispatch({type: 'USER_SIGNOUT'});
  await AsyncStorage.multiRemove([
    'userInfo',
    'cartItems',
    'shippingAddress',
    'paymentMethod',
  ]);
  navigation.navigate('HomePage');
};

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="HomePage" component={HomePage} />
      <HomeStack.Screen name="Product" component={ProductPage} />
      <HomeStack.Screen name="Products" component={ProductsPage} />
      <HomeStack.Screen
        name="PasswordResetRequest"
        component={PasswordResetRequest}
      />
      <HomeStack.Screen name="SignIn" component={SigninPage} />
      <HomeStack.Screen name="SignUp" component={SignupPage} />
    </HomeStack.Navigator>
  );
}

const SignOutComponent = () => {
  signoutHandler();
  return null;
};

function App() {
  const scheme = useColorScheme();
  const {state, dispatch} = useContext(Store);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(!!state.userInfo);
  const [key, setKey] = useState(0);

  useEffect(() => {
    initializeState(dispatch).then(() => {
      setIsLoading(false);
      console.log('State initialized with user:', state.userInfo);
    });
  }, [dispatch]);

  useEffect(() => {
    console.log('Updated user info:', state.userInfo);
    setIsSignedIn(!!state.userInfo);
    setKey(prev => prev + 1); // Increment key to force re-render
  }, [state.userInfo]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <NavigationContainer
          key={key} // Use key to force re-render
          theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Tab.Navigator
            screenOptions={({route}) => ({
              headerShown: false,
              tabBarIcon: ({focused, color, size}) => {
                let iconName = `question`;

                if (route.name === 'Home') {
                  iconName = 'home';
                } else if (route.name === 'Cart') {
                  iconName = 'shopping-cart';
                } else if (route.name === 'SignIn') {
                  iconName = isSignedIn ? 'sign-out' : 'sign-in';
                }
                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#005eb8',
              tabBarInactiveTintColor: 'gray',
              tabBarStyle: {
                paddingBottom: 5,
                paddingTop: 5,
              },
              tabBarLabelStyle: {
                width: '100%',
              },
            })}>
            <Tab.Screen name="Home" component={HomeStackNavigator} />
            <Tab.Screen
              name="Cart"
              component={CartPage}
              options={{tabBarLabel: 'Cart'}}
            />
            {isSignedIn ? (
              <Tab.Screen
                name="SignOut"
                component={SignOutComponent}
                options={{tabBarLabel: 'Sign Out'}}
              />
            ) : (
              <Tab.Screen
                name="SignIn"
                component={SigninPage}
                options={{tabBarLabel: 'Sign In'}}
              />
            )}
          </Tab.Navigator>
        </NavigationContainer>
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;

