import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Platform,
  TextStyle,
} from "react-native";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  LinkingOptions,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import useStore from "./src/Store";
import { useGetStyles } from "./src/styles";
import HomePage from "./src/pages/index";
import ProductPage from "./src/pages/ProductPage";
import ProductsPage from "./src/pages/ProductsPage";
import PasswordResetRequest from "./src/components/PasswordResetRequest";
import SigninPage from "./src/pages/SigninPage";
import SignupPage from "./src/pages/SignupPage";
import CartPage from "./src/pages/CartPage";
import ProfilePage from "./src/pages/ProfilePage";
import ShippingAddressPage from "./src/pages/ShippingAddressPage";
import PlaceOrderPage from "./src/pages/PlaceOrderPage";
import OrderPage from "./src/pages/OrderPage";
import OrderHistoryPage from "./src/pages/OrderHistoryPage";
import SearchPage from "./src/pages/SearchPage";
import MorePage from "./src/pages/MorePage";
import FilterScreen from "./src/components/FilterScreen";
import { Category } from "./src/types/Category";
import { FilterProvider } from "./src/context/FilterContext";
import ThemeSettingsPage from "./src/pages/ThemeSettingsPage";
import PaymentPage from "./src/pages/PaymentMethodPage";

export type RootStackParamList = {
  HomePage: undefined;
  Product: { slug: string };
  Products: { category: string };
  PasswordResetRequest: undefined;
  PasswordReset: { token: string };
  SignIn: { redirect?: string };
  SignUp: undefined;
  Cart: undefined;
  Profile: undefined;
  SignOut: undefined;
  Payment: undefined;
  ShippingAddress: undefined;
  PaymentMethod: undefined;
  PlaceOrder: undefined;
  Order: { orderId: string };
  OrderHistory: undefined;
  Search: { query?: string };
  FilterScreen: {
    minPrice?: number;
    maxPrice?: number;
    selectedCategories: { _id: string; slug: string }[];
    selectedMaterials: string[];
    applyFilters: (
      localMinPrice: number | undefined,
      localMaxPrice: number | undefined,
      localSelectedCategories: { _id: string; slug: string }[],
      localSelectedMaterials: string[]
    ) => void;
    resetFilters: () => void;
    categories: Category[];
    materials: string[];
  };
  ThemeSettings: undefined;
};

const queryClient = new QueryClient();
const HomeStack = createNativeStackNavigator();

function HomeStackNavigator() {
  const styles = useGetStyles();

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomePage"
        component={HomePage}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Product"
        component={ProductPage}
        options={{
          headerTitle: "Product Details",
        }}
      />
      <HomeStack.Screen name="Products" component={ProductsPage} />
      <HomeStack.Screen
        name="PasswordResetRequest"
        component={PasswordResetRequest}
      />
      <HomeStack.Screen name="SignIn" component={SigninPage} />
      <HomeStack.Screen name="SignUp" component={SignupPage} />
      <HomeStack.Screen name="Cart" component={CartPage} />
      <HomeStack.Screen name="Profile" component={ProfilePage} />
      <HomeStack.Screen
        name="ShippingAddress"
        component={ShippingAddressPage}
      />
      <HomeStack.Screen
        name="Payment"
        component={PaymentPage}
      />
      <HomeStack.Screen name="PlaceOrder" component={PlaceOrderPage} />
      <HomeStack.Screen name="Order" component={OrderPage} />
      <HomeStack.Screen name="OrderHistory" component={OrderHistoryPage} />
      <HomeStack.Screen
        name="Search"
        component={SearchPage}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen name="More" component={MorePage} />
    </HomeStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  const { userInfo } = useStore((state) => ({ userInfo: state.userInfo }));
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="shopping-cart" color={color} size={size} />
          ),
        }}
      />
      {userInfo ? (
        <Tab.Screen
          name="Profile"
          component={ProfilePage}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="user" color={color} size={size} />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="SignIn"
          component={SigninPage}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="sign-in" color={color} size={size} />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="More"
        component={MorePage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="ellipsis-v" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const SearchStack = createNativeStackNavigator();

function SearchStackNavigator() {
  const { styles: headerStyles } = useGetStyles();

  return (
    <SearchStack.Navigator
      screenOptions={{
        headerStyle: headerStyles.headerStyle,
        headerTintColor: headerStyles.headerTintColor,
        headerTitleStyle: {
          ...headerStyles.headerTitleStyle,
          fontWeight: "bold" as TextStyle["fontWeight"],
        },
        headerTitleAlign: "center" as "center" | "left",
      }}
    >
      <SearchStack.Screen
        name="SearchPage"
        component={SearchPage}
        options={{ headerShown: false }}
      />
      <SearchStack.Screen
        name="Product"
        component={ProductPage}
        options={{
          headerTitle: "Product Details",
          headerStyle: headerStyles.headerStyle,
          headerTintColor: headerStyles.headerTintColor,
        }}
      />
      <SearchStack.Screen name="FilterScreen" component={FilterScreen} />
    </SearchStack.Navigator>
  );
}

const RootStack = createNativeStackNavigator();

function RootStackNavigator() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Main"
        component={MyTabs}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Product"
        component={ProductPage}
        options={{ headerTitle: "Product Details" }}
      />
      <RootStack.Screen name="ThemeSettings" component={ThemeSettingsPage} />
    </RootStack.Navigator>
  );
}

const CustomDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: "#212529",
    card: "#212529",
    text: "#ffffff",
  },
};

const getTheme = (mode: string) => {
  return mode === "dark" ? CustomDarkTheme : NavigationDefaultTheme;
};

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['airneisapp://'],
  config: {
    screens: {
      PasswordReset: 'reset-password/:token',
    },
  },
};

export default function App() {
  const storeMode = useStore((state) => state.mode);
  const [theme, setTheme] = useState(getTheme(storeMode));

  useEffect(() => {
    setTheme(getTheme(storeMode));
  }, [storeMode]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      console.log("Starting app initialization");
      setIsLoading(false);
      console.log("App initialization complete");
    };
    bootstrapAsync();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#005eb8" />;
  }

  const statusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme} linking={linking}>
          <FilterProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
              />
              <SafeAreaView
                style={{
                  flex: 1,
                  backgroundColor: theme.colors.background,
                  paddingTop: Platform.OS === "android" ? statusBarHeight : 0,
                }}
              >
                <RootStackNavigator />
              </SafeAreaView>
            </GestureHandlerRootView>
          </FilterProvider>
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}
