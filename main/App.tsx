import {useEffect, useState} from 'react';
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
import ProfilePage from './src/pages/ProfilePage';
import ShippingAddressPage from './src/pages/ShippingAddressPage';
import PaymentMethodPage from './src/pages/PaymentMethodPage';
import PlaceOrderPage from './src/pages/PlaceOrderPage';
import {createDrawerNavigator} from '@react-navigation/drawer';
import store from './src/Store';

export type RootStackParamList = {
  HomePage: undefined;
  Product: {productId: string};
  Products: {category: string};
  PasswordResetRequest: undefined;
  SignIn: {redirect?: string};
  SignUp: undefined;
  Cart: undefined;
  Profile: undefined;
  SignOut: undefined;
  Payment: undefined;
  ShippingAddress: undefined;
  PaymentMethod: undefined;
  PlaceOrder: undefined;
};

const HomeStack = createStackNavigator();
const queryClient = new QueryClient();

export function useSignoutHandler() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const signoutHandler = async () => {
    console.log('Signing out, clearing user data');
    store.getState().userSignOut();
    navigation.navigate('SignIn', {redirect: 'HomePage'});
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
      <HomeStack.Screen name="Cart" component={CartPage} />
      <HomeStack.Screen name="Profile" component={ProfilePage} />
      <HomeStack.Screen name="Payment" component={PaymentMethodPage} />
      <HomeStack.Screen name="ShippingAddress" component={ShippingAddressPage} />
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
  const userInfo = store(state => state.userInfo);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (userInfo) {
      navigation.navigate('HomePage');
    }
  }, [userInfo, navigation]);

  if (userInfo) {
    return null;
  }

  return <SigninPage />;
};

function App() {
  const scheme = useColorScheme();
  const userInfo = store(state => state.userInfo);
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
        <Drawer.Navigator>
          {userInfo ? (
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
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;
