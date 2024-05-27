import {useEffect, useState} from 'react';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ActivityIndicator} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import {FAB, Provider as PaperProvider} from 'react-native-paper';
import store from './src/Store';
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
import OrderHistoryPage from './src/pages/OrderHistoryPage';
import HomePage from './src/pages/index';
import SearchPage from './src/pages/SearchPage';
import MorePage from './src/pages/MorePage';
import useStore from './src/Store';
import { useHeaderStyles } from './src/styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FilterScreen from './src/components/FilterScreen';
import { Category } from './src/types/Category';

export type RootStackParamList = {
  HomePage: undefined;
  Product: {slug: string};
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
  OrderHistory: undefined;
  Search: {query?: string};
  FilterScreen: {
    minPrice?: number;
    maxPrice?: number;
    selectedCategories: { _id: string; slug: string }[];
    selectedMaterials: string[];
    applyFilters: (localMinPrice: number | undefined, localMaxPrice: number | undefined, localSelectedCategories: { _id: string; slug: string }[], localSelectedMaterials: string[]) => void;
    resetFilters: () => void;
    categories: Category[];
    materials: string[];
  };
};
const queryClient = new QueryClient();
const HomeStack = createNativeStackNavigator();
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ ...useHeaderStyles }}>
      <HomeStack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
      <HomeStack.Screen name="Product" component={ProductPage} options={{ headerTitle: 'Product Details' }} />
      <HomeStack.Screen name="Products" component={ProductsPage} options={{ headerTitle: 'Products' }} />
      <HomeStack.Screen name="PasswordResetRequest" component={PasswordResetRequest} />
      <HomeStack.Screen name="SignIn" component={SigninPage} />
      <HomeStack.Screen name="SignUp" component={SignupPage} />
      <HomeStack.Screen name="Cart" component={CartPage} />
      <HomeStack.Screen name="Profile" component={ProfilePage} />
      <HomeStack.Screen name="Payment" component={PaymentMethodPage} />
      <HomeStack.Screen name="ShippingAddress" component={ShippingAddressPage} />
      <HomeStack.Screen name="PlaceOrder" component={PlaceOrderPage} />
      <HomeStack.Screen name="Order" component={OrderPage} />
      <HomeStack.Screen name="OrderHistory" component={OrderHistoryPage} />
      <HomeStack.Screen name="Search" component={SearchPage} options={{ headerShown: false }}/>
      <HomeStack.Screen name="More" component={MorePage} />
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
const Tab = createBottomTabNavigator();
function MyTabs() {
  const {userInfo} = useStore(state => ({userInfo: state.userInfo}));
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{tabBarIcon: ({color, size}) => <Icon name="home" color={color} size={size} />}}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackNavigator}
        options={{tabBarIcon: ({color, size}) => <Icon name="search" color={color} size={size} />}}
      />
      <Tab.Screen
        name="Cart"
        component={CartPage}
        options={{
          tabBarIcon: ({color, size}) => <Icon name="shopping-cart" color={color} size={size} />,
        }}
      />
      {userInfo ? (
        <Tab.Screen
            name="Profile"
            component={ProfilePage}
            options={{
              tabBarIcon: ({color, size}) => <Icon name="user" color={color} size={size} />,
            }}
          />
      ) : (
        <Tab.Screen
          name="SignIn"
          component={SigninPage}
          options={{
            tabBarIcon: ({color, size}) => <Icon name="sign-in" color={color} size={size} />,
          }}
        />
      )}
      <Tab.Screen
        name="More"
        component={MorePage}
        options={{
          tabBarIcon: ({color, size}) => <Icon name="ellipsis-v" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
const SearchStack = createNativeStackNavigator();
function SearchStackNavigator() {
  return (
    <SearchStack.Navigator screenOptions={{ ...useHeaderStyles }}>
      <SearchStack.Screen name="SearchPage" component={SearchPage} options={{ headerShown: false }} />
      <SearchStack.Screen name="Product" component={ProductPage} options={{ headerTitle: 'Product Details' }} />
      <SearchStack.Screen name="FilterScreen" component={FilterScreen} />
    </SearchStack.Navigator>
  );
}
const RootStack = createNativeStackNavigator();

function RootStackNavigator() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Main" component={MyTabs} options={{ headerShown: false }} />
      <RootStack.Screen name="Product" component={ProductPage} />
    </RootStack.Navigator>
  );
}

function App() {
  const storeMode = useStore(state => state.mode);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const bootstrapAsync = async () => {
      setIsLoading(false);
    };
    bootstrapAsync();
  }, []);
  if (isLoading) {
    return <ActivityIndicator size="large" color="#005eb8" />;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <NavigationContainer theme={storeMode === 'dark' ? DarkTheme : DefaultTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootStackNavigator />
            <FAB
              style={{
                position: 'absolute',
                margin: 16,
                right: 0,
                bottom: 48,
                backgroundColor: '#005eb8',
              }}
              icon="theme-light-dark"
              color="#fff"
              onPress={() => store.getState().switchMode()}
            />
          </GestureHandlerRootView>
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}
export default App;

