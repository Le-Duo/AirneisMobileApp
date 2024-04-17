import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Cart, CartItem} from './types/Cart';
import {UserInfo} from './types/UserInfo';
import {ShippingAddress} from './types/shippingAddress';

type AppState = {
  mode: string;
  cart: Cart;
  userInfo: UserInfo | null;
  existingAddresses: ShippingAddress[];
};

const loadInitialState = async (): Promise<AppState> => {
  const userInfo = await AsyncStorage.getItem('userInfo');
  const mode = await AsyncStorage.getItem('mode') ?? 'light';
  const cartItems = await AsyncStorage.getItem('cartItems');
  const shippingAddress = await AsyncStorage.getItem('shippingAddress');
  const paymentMethod = await AsyncStorage.getItem('paymentMethod');
  const existingAddresses = await AsyncStorage.getItem('existingAddresses');

  return {
    userInfo: userInfo ? JSON.parse(userInfo) : null,
    mode: mode,
    cart: {
      cartItems: cartItems ? JSON.parse(cartItems) : [],
      shippingAddress: shippingAddress ? JSON.parse(shippingAddress) : ({} as ShippingAddress),
      paymentMethod: paymentMethod ? paymentMethod : 'Card',
      itemsPrice: 0,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 0,
    },
    existingAddresses: existingAddresses ? JSON.parse(existingAddresses) : [],
  };
};

let initialState: AppState = {
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

const initializeState = async () => {
  initialState = await loadInitialState();
};

type Action =
  | {type: 'SWITCH_MODE'}
  | {type: 'CART_ADD_ITEM'; payload: CartItem}
  | {type: 'CART_REMOVE_ITEM'; payload: CartItem}
  | {type: 'CART_CLEAR'}
  | {type: 'USER_SIGNIN'; payload: UserInfo}
  | {type: 'USER_SIGNOUT'}
  | {type: 'SAVE_SHIPPING_ADDRESS'; payload: ShippingAddress}
  | {type: 'SAVE_PAYMENT_METHOD'; payload: string}
  | {type: 'INITIALIZE_STATE'; payload: AppState};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SWITCH_MODE': {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem('mode', newMode);
      return {...state, mode: newMode};
    }
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item: CartItem) => item._id === newItem._id,
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item: CartItem) =>
            item._id === existItem._id ? newItem : item,
          )
        : [...state.cart.cartItems, newItem];

      AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {...state, cart: {...state.cart, cartItems}};
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item: CartItem) => item._id !== action.payload._id,
      );
      AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {...state, cart: {...state.cart, cartItems}};
    }
    case 'CART_CLEAR':
      return {
        ...state,
        cart: {...state.cart, cartItems: []},
      };
    case 'USER_SIGNIN':
      AsyncStorage.setItem('userInfo', JSON.stringify(action.payload));
      return {...state, userInfo: action.payload};
    case 'USER_SIGNOUT':
      AsyncStorage.multiRemove(['userInfo', 'cartItems', 'shippingAddress', 'paymentMethod', 'existingAddresses']);
      return {
        mode: 'light',
        cart: {
          cartItems: [],
          paymentMethod: 'Card',
          shippingAddress: {} as ShippingAddress,
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
        existingAddresses: [],
        userInfo: null,
      };
    case 'SAVE_SHIPPING_ADDRESS':
      const {payload} = action;
      AsyncStorage.setItem('shippingAddress', JSON.stringify(payload));
      return {
        ...state,
        cart: {...state.cart, shippingAddress: payload},
      };
    case 'SAVE_PAYMENT_METHOD':
      AsyncStorage.setItem('paymentMethod', action.payload);
      return {
        ...state,
        cart: {...state.cart, paymentMethod: action.payload},
      };
    case 'INITIALIZE_STATE':
      return action.payload;
    default:
      return state;
  }
}

const defaultDispatch: React.Dispatch<Action> = () => initialState;

const Store = React.createContext({
  state: initialState,
  dispatch: defaultDispatch,
});

function StoreProvider(props: React.PropsWithChildren<{}>) {
  const [state, dispatch] = React.useReducer<React.Reducer<AppState, Action>>(
    reducer,
    initialState,
  );

  React.useEffect(() => {
    initializeState().then(() => {
      dispatch({ type: 'INITIALIZE_STATE', payload: initialState });
    });
  }, []);

  return <Store.Provider value={{state, dispatch}} {...props} />;
}

export {Store, StoreProvider};

