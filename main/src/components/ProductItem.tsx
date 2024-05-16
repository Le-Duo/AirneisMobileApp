import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ToastAndroid,
} from 'react-native';
import {useStore} from 'zustand';
import store from '../Store';
import {CartItem} from '../types/Cart';
import {Product} from '../types/Product';
import {ConvertProductToCartItem} from '../utils';

function ProductItem({
  product,
  stockQuantity,
  onPress,
}: {
  product: Product;
  stockQuantity?: number;
  onPress?: () => void;
}) {
  const {cart, cartAddItem} = useStore(store, state => ({
    cart: state.cart,
    cartAddItem: state.cartAddItem,
  }));
  const {cartItems} = cart;

  const actualStock =
    stockQuantity !== undefined ? stockQuantity : product.stock;
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const addToCartHandler = async (item: CartItem) => {
    const existItem = cartItems.find(x => x._id === item._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (actualStock && actualStock < quantity) {
      ToastAndroid.show('Sorry, Product is out of stock', ToastAndroid.SHORT);
      return;
    }

    await cartAddItem({...item, quantity});
    ToastAndroid.show('Success, Product added to cart', ToastAndroid.SHORT);
  };

  const styles = StyleSheet.create({
    card: {
      borderWidth: 1,
      borderColor: '#005eb8',
      borderRadius: 5,
      overflow: 'hidden',
      margin: 10,
      backgroundColor: isDark ? '#333333' : '#ffffff',
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#000000',
    },
    cardText: {
      fontSize: 16,
      color: isDark ? '#dddddd' : '#000000',
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
    },
    productImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
      opacity: actualStock === 0 ? 0.5 : 1,
    },
    cardBody: {
      padding: 10,
    },
    button: {
      backgroundColor: '#007bff',
      padding: 10,
      marginTop: 10,
    },
    buttonDisabled: {
      backgroundColor: '#aaa',
      padding: 10,
      marginTop: 10,
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={{flex: 1}}>
      <View style={styles.card}>
        <Image
          source={{
            uri:
              'https://airneisstaticassets.onrender.com' +
                product.URLimages[0].replace('../public', '') ||
              '/assets/images/no-image.png',
          }}
          style={styles.productImage}
        />
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{product.name}</Text>
          <Text style={styles.cardText}>£{product.price}</Text>
          {actualStock === 0 ? (
            <TouchableOpacity style={styles.buttonDisabled} disabled>
              <Text style={styles.buttonText}>Out of Stock</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                addToCartHandler(ConvertProductToCartItem(product))
              }>
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default ProductItem;
