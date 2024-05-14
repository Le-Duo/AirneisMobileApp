import React, {useContext, useEffect, useState} from 'react';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import HomePage from './src/pages/index';
import ProductPage from './src/pages/ProductPage';
import ProductsPage from './src/pages/ProductsPage';
import CartPage from './src/pages/CartPage';
import SigninPage from './src/pages/SigninPage';
import SignupPage from './src/pages/SignupPage';
import PasswordResetRequest from './src/components/PasswordResetRequest';
import {useColorScheme, ActivityIndicator} from 'react-native';
import {StoreProvider, Store} from './src/Store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfilePage from './src/pages/ProfilePage';
import {createDrawerNavigator} from '@react-navigation/drawer';

type RootStackParamList = {
  HomePage: undefined;
  Product: {slug: string};
  SignIn: {redirect: string};
};

const HomeStack = createStackNavigator();
const queryClient = new QueryClient();

export function useSignoutHandler() {
  const {dispatch} = useContext(Store);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const signoutHandler = async () => {
    console.log('Signing out, clearing user data');
    dispatch({type: 'USER_SIGNOUT'});
    await AsyncStorage.multiRemove([
      'userInfo',
      'cartItems',
      'shippingAddress',
      'paymentMethod',
    ]);
    navigation.navigate({name: 'SignIn'});
  };

  return signoutHandler;
}

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
  const signoutHandler = useSignoutHandler();
  useEffect(() => {
    signoutHandler();
  }, [signoutHandler]);

  return null;
};

const SignInComponent = () => {
  const {state} = useContext(Store);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (state.userInfo) {
      navigation.navigate('HomePage');
    }
  }, [state.userInfo, navigation]);

  if (state.userInfo) {
    return null;
  }

  return <SigninPage />;
};

function App() {
  const scheme = useColorScheme();
  const {state} = useContext(Store);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const Drawer = createDrawerNavigator();

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StoreProvider>
          <Drawer.Navigator>
            {state.userInfo ? (
              <>
                <Drawer.Screen name="Home" component={HomeStackNavigator} />
                <Drawer.Screen name="Cart" component={CartPage} />
                <Drawer.Screen name="Profile" component={ProfilePage} />
                <Drawer.Screen name="SignOut" component={SignOutComponent} />
              </>
            ) : (
              <>
                <Drawer.Screen name="Home" component={HomeStackNavigator} />
                <Drawer.Screen name="Cart" component={CartPage} />
                <Drawer.Screen name="SignIn" component={SignInComponent} />
              </>
            )}
          </Drawer.Navigator>
        </StoreProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;
