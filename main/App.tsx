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
import {
  useColorScheme,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import ProfilePage from './src/pages/ProfilePage';
import ShippingAddressPage from './src/pages/ShippingAddressPage';
import PaymentMethodPage from './src/pages/PaymentMethodPage';
import PlaceOrderPage from './src/pages/PlaceOrderPage';
import OrderPage from './src/pages/OrderPage';
import store from './src/Store';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerNavigationProp } from '@react-navigation/drawer';

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
  Order: {orderId: string};
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
      <HomeStack.Screen
        name="ShippingAddress"
        component={ShippingAddressPage}
      />
      <HomeStack.Screen name="PlaceOrder" component={PlaceOrderPage} />
      <HomeStack.Screen name="Order" component={OrderPage} />
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

const MenuComponent = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.toggleDrawer();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>Open Drawer</Text>
    </TouchableOpacity>
  );
};

const DrawerContent = () => (
  <NavigationContainer>
    <Drawer.Navigator>
      <Drawer.Screen name="Main" component={HomeStackNavigator} />
      <Drawer.Screen name="Menu" component={MenuComponent} />
      <Drawer.Screen name="Sign Out" component={SignOutComponent} />
    </Drawer.Navigator>
  </NavigationContainer>
);

const BottomTabs = () => {
  const isDrawerOpen = useDrawerStatus() === 'open';

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Menu') {
            iconName = isDrawerOpen ? 'close' : 'menu';
          } else {
            iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={DrawerContent} />
      {/* <Tab.Screen name="Search" component={SearchPage} /> */}
      <Tab.Screen name="Cart" component={CartPage} />
      <Tab.Screen
        name="Menu"
        component={DrawerContent}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.dispatch(DrawerActions.toggleDrawer());
          },
        })}
      />
    </Tab.Navigator>
  );
};

import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function App() {
  const scheme = useColorScheme();
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

  const Tab = createBottomTabNavigator();

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <BottomTabs />
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;
