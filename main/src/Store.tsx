import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, ShippingAddress} from './types/Cart';
import { UserInfo } from './types/UserInfo';

interface StoreState {
  mode: string;
  cart: {
    cartItems: CartItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
  };
  userInfo: UserInfo | null;
  existingAddresses: any[];
}

interface StoreActions {
  initializeState: () => Promise<void>;
  switchMode: () => Promise<void>;
  cartAddItem: (newItem: CartItem) => Promise<void>;
  cartRemoveItem: (itemToRemove: CartItem) => void;
  cartClear: () => void;
  userSignIn: (userInfo: UserInfo) => void;
  userSignOut: () => void;
  saveShippingAddress: (payload: ShippingAddress) => void;
  savePaymentMethod: (paymentMethod: string) => void;
}

export type MyState = StoreState & StoreActions;

const loadInitialState = async () => {
  try {
    const userInfo = await AsyncStorage.getItem('userInfo');
    const mode = (await AsyncStorage.getItem('mode')) ?? 'light';
    const cartItems = await AsyncStorage.getItem('cartItems');
    const shippingAddress = await AsyncStorage.getItem('shippingAddress');
    const paymentMethod = await AsyncStorage.getItem('paymentMethod');
    const existingAddresses = await AsyncStorage.getItem('existingAddresses');

    return {
      userInfo: userInfo ? JSON.parse(userInfo) : null,
      mode: mode,
      cart: {
        cartItems: cartItems ? JSON.parse(cartItems) : [],
        shippingAddress: shippingAddress
          ? JSON.parse(shippingAddress)
          : ({} as ShippingAddress),
        paymentMethod: paymentMethod || 'Card',
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
      },
      existingAddresses: existingAddresses ? JSON.parse(existingAddresses) : [],
    };
  } catch (error) {
    console.error('Failed to load initial state:', error);
    return {
      mode: 'light',
      cart: {
        cartItems: [],
        shippingAddress: {} as ShippingAddress,
        paymentMethod: 'Card',
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
      },
      userInfo: null,
      existingAddresses: [],
    };
  }
};

// Use StateCreator to define the store
const store = create<MyState>((set, get) => ({
  mode: 'light',
  cart: {
    cartItems: [],
    shippingAddress: {} as ShippingAddress,
    paymentMethod: 'Card',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
  },
  userInfo: null,
  existingAddresses: [],
  initializeState: async () => {
    const loadedState = await loadInitialState();
    set(loadedState);
  },
  switchMode: async () => {
    const newMode = get().mode === 'light' ? 'dark' : 'light';
    try {
      await AsyncStorage.setItem('mode', newMode);
      set({mode: newMode});
    } catch (error) {
      console.error('Failed to switch mode:', error);
    }
  },
  cartAddItem: async (newItem: CartItem) => {
    const cartItems = get().cart.cartItems;
    const existItem = cartItems.find(item => item._id === newItem._id);
    const updatedCartItems = existItem
      ? cartItems.map(item => (item._id === existItem._id ? newItem : item))
      : [...cartItems, newItem];
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      set({cart: {...get().cart, cartItems: updatedCartItems}});
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  },
  cartRemoveItem: (itemToRemove: CartItem) => {
    const cartItems = get().cart.cartItems.filter(
      (item: CartItem) => item._id !== itemToRemove._id,
    );
    AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
    set({cart: {...get().cart, cartItems}});
  },
  cartClear: () => {
    set({
      cart: {
        ...get().cart,
        cartItems: [],
      },
    });
  },
  userSignIn: (userInfo: UserInfo) => {
    console.log('User info received from server:', userInfo);
    AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    set({userInfo});
  },
  userSignOut: () => {
    AsyncStorage.multiRemove([
      'userInfo',
      'cartItems',
      'shippingAddress',
      'paymentMethod',
    ]);
    set({
      userInfo: null,
      cart: {
        ...get().cart,
        cartItems: [],
        shippingAddress: {} as ShippingAddress,
        paymentMethod: 'Card',
      },
    });
  },
  saveShippingAddress: (payload: ShippingAddress) => {
    AsyncStorage.setItem('shippingAddress', JSON.stringify(payload));
    set({cart: {...get().cart, shippingAddress: payload}});
  },
  savePaymentMethod: (paymentMethod: string) => {
    AsyncStorage.setItem('paymentMethod', paymentMethod);
    set({cart: {...get().cart, paymentMethod}});
  },
}));

export default store;
