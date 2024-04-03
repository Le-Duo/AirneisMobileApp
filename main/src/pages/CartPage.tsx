import React, { useContext } from 'react';
import { View, Text, Button, ScrollView, ToastAndroid, Image, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Store } from '../Store';
import { CartItem } from '../types/Cart';
import MessageBox from '../components/MessageBox';
import { styles } from '../styles';

type RootStackParamList = {
  Product: { slug: string };
  HomePage: undefined;
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
    ToastAndroid.show('Item removed from cart', ToastAndroid.SHORT);
  };

  console.log('Cart items in CartPage:', cartItems);

  return (
    <ScrollView style={styles.container}>
      <Text style={{fontSize: 20, fontWeight: "bold"}}>Shopping Cart</Text>
      {cartItems.length === 0 ? (
        <MessageBox>
          Cart is empty. <Text onPress={() => navigation.navigate('HomePage')}>Go Shopping</Text>
        </MessageBox>
      ) : (
        cartItems.map((item: CartItem) => (
          <View key={item._id} style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.cartItemImage} />
            <TouchableOpacity onPress={() => navigation.navigate('Product', { slug: item.slug })}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
            <View style={styles.cartItemDetail}>
              <Button
                onPress={() => updateCartHandler(item, item.quantity - 1)}
                title="-"
                disabled={item.quantity === 1}
              />
              <Text>{item.quantity}</Text>
              <Button
                onPress={() => updateCartHandler(item, item.quantity + 1)}
                title="+"
                disabled={item.quantity === item.stock}
              />
              <Text>£{item.price}</Text>
              <Button
                onPress={() => removeItemHandler(item)}
                title="Remove"
              />
            </View>
          </View>
        ))
      )}
      <View style={styles.cartSummary}>
        <Text>
          Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items) : £
          {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
        </Text>
        <Button
          onPress={checkoutHandler}
          title="Proceed to Checkout"
          disabled={cartItems.length === 0}
        />
      </View>
    </ScrollView>
  );
}
