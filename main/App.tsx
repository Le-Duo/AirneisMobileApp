import React, { useContext } from 'react';
import {NavigationContainer, DarkTheme, DefaultTheme, useNavigation, NavigationProp} from '@react-navigation/native';
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
import {useColorScheme} from 'react-native';
import { StoreProvider, Store } from './src/Store';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  HomePage: undefined;
  Product: { slug: string };
  SignIn: { redirect: string };
};

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const queryClient = new QueryClient();

const signoutHandler = async () => {
  const { dispatch } = useContext(Store);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  dispatch({ type: 'USER_SIGNOUT' });
  await AsyncStorage.removeItem('userInfo');
  await AsyncStorage.removeItem('cartItems');
  await AsyncStorage.removeItem('shippingAddress');
  await AsyncStorage.removeItem('paymentMethod');
  navigation.navigate('HomePage');
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="HomePage" component={HomePage} />
      <HomeStack.Screen name="Product" component={ProductPage} />
      <HomeStack.Screen name="Products" component={ProductsPage} />
      <HomeStack.Screen name="PasswordResetRequest" component={PasswordResetRequest} />
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
  const { state } = useContext(Store);

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
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
                  iconName = state.userInfo ? 'sign-out' : 'sign-in';
                }
                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#005eb8',
              tabBarInactiveTintColor: 'gray',
              tabBarStyle: {paddingBottom: 5, paddingTop: 5},
            })}>
            <Tab.Screen name="Home" component={HomeStackNavigator} />
            <Tab.Screen name="Cart" component={CartPage} options={{tabBarLabel: 'Cart'}} />
            {state.userInfo ? (
              <Tab.Screen name="SignOut" component={SignOutComponent} options={{tabBarLabel: 'Sign Out'}} />
            ) : (
              <Tab.Screen name="SignIn" component={SigninPage} options={{tabBarLabel: 'Sign In'}} />
            )}
          </Tab.Navigator>
        </NavigationContainer>
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;

