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
};

export default function CartPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const {
    state: {
      mode,
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store);

  const updateCartHandler = (item: CartItem, quantity: number) => {
    if (item.stock < quantity) {
      ToastAndroid.show('Sorry. Product is out of stock', ToastAndroid.SHORT);
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

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
              <Text>{item.quantity}</Text>
              <TouchableOpacity onPress={() => updateCartHandler(item, item.quantity + 1)} disabled={item.quantity === item.stock}>
                <Text>+</Text>
              </TouchableOpacity>
              <Text>£{item.price}</Text>
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
