<<<<<<< HEAD
import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  ToastAndroid,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {Store} from '../Store';
import {CartItem} from '../types/Cart';
import MessageBox from '../components/MessageBox';
import {styles} from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Product: {slug: string};
  HomePage: undefined;
  SignIn: {redirect: string};
=======
import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ToastAndroid } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Store } from '../Store';
import { CartItem } from '../types/Cart';
import MessageBox from '../components/MessageBox';

type RootStackParamList = {
  HomePage: undefined;
  Product: { slug: string };
  SignIn: { redirect: string };
>>>>>>> 5056b2f
};

export default function CartPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
<<<<<<< HEAD
  const {state, dispatch} = useContext(Store);
  const {cartItems} = state.cart;

  // J'utilise useEffect pour charger les articles du panier dès le montage du composant
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        // Je tente de récupérer les articles du panier stockés localement
        const cartItemsString = await AsyncStorage.getItem('cartItems');
        if (cartItemsString) {
          // Si des articles sont trouvés, je les parse et les charge dans l'état global
          const cartItems = JSON.parse(cartItemsString);
          dispatch({type: 'CART_LOAD_ITEMS', payload: cartItems});
        }
      } catch (error) {
        console.error('Failed to load cart items:', error);
      }
    };
=======

  const {
    state: {
      mode,
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store);
>>>>>>> 5056b2f

  const updateCartHandler = (item: CartItem, quantity: number) => {
    if (item.stock < quantity) {
      ToastAndroid.show('Sorry. Product is out of stock', ToastAndroid.SHORT);
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

<<<<<<< HEAD
  // J'utilise un autre useEffect pour surveiller les changements dans les articles du panier et afficher un log
  useEffect(() => {
    console.log('Cart items in CartPage updated:', cartItems);
  }, [cartItems]);

  return (
    <ScrollView style={styles.container} key={cartItems.length}>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>Shopping Cart</Text>
      {cartItems.length === 0 ? (
        <MessageBox>
          Cart is empty.{' '}
          <Text onPress={() => navigation.navigate('HomePage')}>
            Go Shopping
          </Text>
        </MessageBox>
      ) : (
        cartItems.map((item: CartItem) => (
          <View key={item._id} style={styles.cartItem}>
            <Image source={{uri: item.image}} style={styles.cartItemImage} />
            <TouchableOpacity
              onPress={() => navigation.navigate('Product', {slug: item.slug})}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
            {/* <View style={styles.cartItemDetail}>
              <Button
                onPress={() => updateCartHandler(item, item.quantity - 1)}
                title="-"
                disabled={item.quantity === 1}
              />
=======
  const checkoutHandler = () => {
    navigation.navigate('SignIn', { redirect: 'Shipping' });
  };

  const removeItemHandler = (item: CartItem) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping Cart</Text>
      {cartItems.length === 0 ? (
        <MessageBox>
        Cart is empty. <Text onPress={() => navigation.navigate('HomePage')}>Go Shopping</Text>
      </MessageBox>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Image source={{ uri: "https://airneisstaticassets.onrender.com" + item.image }} style={styles.image} />
              <Text onPress={() => navigation.navigate('Product', { slug: item.slug })}>{item.name}</Text>
              <TouchableOpacity onPress={() => updateCartHandler(item, item.quantity - 1)} disabled={item.quantity === 1}>
                <Text>-</Text>
              </TouchableOpacity>
>>>>>>> 5056b2f
              <Text>{item.quantity}</Text>
              <TouchableOpacity onPress={() => updateCartHandler(item, item.quantity + 1)} disabled={item.quantity === item.stock}>
                <Text>+</Text>
              </TouchableOpacity>
              <Text>£{item.price}</Text>
<<<<<<< HEAD
              <Button
                onPress={() => removeItemHandler(item)}
                title="Remove"
              />
            </View> */}
          </View>
        ))
      )}
      <View style={styles.cartSummary}>
        <Text>
          Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items) : £
          {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
        </Text>
        <Button title="Proceed to Checkout" disabled={cartItems.length === 0} />
      </View>
    </ScrollView>
  );
}

=======
              <TouchableOpacity onPress={() => removeItemHandler(item)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <TouchableOpacity onPress={checkoutHandler} disabled={cartItems.length === 0}>
        <Text>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
>>>>>>> 5056b2f
