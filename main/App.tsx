import {useEffect, useState} from 'react';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useColorScheme, ActivityIndicator} from 'react-native';
import store from './src/Store';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProductPage from './src/pages/ProductPage';
import ProductsPage from './src/pages/ProductsPage';
import PasswordResetRequest from './src/components/PasswordResetRequest';
import SigninPage from './src/pages/SigninPage';
import SignupPage from './src/pages/SignupPage';
import CartPage from './src/pages/CartPage';
import ProfilePage from './src/pages/ProfilePage';
import PaymentMethodPage from './src/pages/PaymentMethodPage';
import ShippingAddressPage from './src/pages/ShippingAddressPage';
import PlaceOrderPage from './src/pages/PlaceOrderPage';
import OrderPage from './src/pages/OrderPage';
import HomePage from './src/pages/index';
import SearchPage from './src/pages/SearchPage';
import useStore from './src/Store';
import {FAB, Provider as PaperProvider} from 'react-native-paper';

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
  Search: {query?: string};
};

const queryClient = new QueryClient();

const HomeStack = createStackNavigator();

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
      <HomeStack.Screen name="Search" component={SearchPage} />
    </HomeStack.Navigator>
  );
}

export function useSignoutHandler() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const signoutHandler = async () => {
    console.log('Signing out, clearing user data');
    store.getState().userSignOut();
    navigation.navigate('SignIn', {redirect: 'HomePage'});
  };

  return signoutHandler;
}

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
function MyTabs() {
  const {userInfo} = useStore(state => ({userInfo: state.userInfo}));

  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchPage}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartPage}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="shopping-cart" color={color} size={size} />
          ),
        }}
      />
      {userInfo ? (
        <>
          <Tab.Screen
            name="Profile"
            component={ProfilePage}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="user" color={color} size={size} />
              ),
            }}
          />
        </>
      ) : (
        <Tab.Screen
          name="SignIn"
          component={SigninPage}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="sign-in" color={color} size={size} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}

function App() {
  const [theme, setTheme] = useState(useColorScheme()); // Use state to manage theme
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const toggleTheme = () => {
    setTheme(current => (current === 'dark' ? 'light' : 'dark')); // Toggle theme state
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#005eb8" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <NavigationContainer
          theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
          <MyTabs />
          <FAB
            style={{
              position: 'absolute',
              margin: 16,
              right: 0,
              bottom: 48,
              backgroundColor: '#005eb8',
            }}
            icon="theme-light-dark"
            onPress={toggleTheme}
          />
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}

export default App;
