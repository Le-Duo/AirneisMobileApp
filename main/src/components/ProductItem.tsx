import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ViewStyle,
  ImageStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import useStore from '../Store';
import {CartItem} from '../types/Cart';
import {Product} from '../types/Product';
import {ConvertProductToCartItem} from '../utils';

function ProductItem({
  product,
  stockQuantity,
  onPress,
  style,
}: {
  product: Product;
  stockQuantity?: number;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  const {cart, cartAddItem, mode} = useStore(state => ({
    cart: state.cart,
    cartAddItem: state.cartAddItem,
    mode: state.mode,
  }));

  const {cartItems} = cart;
  const actualStock =
    stockQuantity !== undefined ? stockQuantity : product.stock;

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

  const backgroundColor = mode === 'dark' ? '#333' : '#fff';
  const textColor = mode === 'dark' ? '#fff' : '#000';
  const buttonBackgroundColor = mode === 'dark' ? '#007bff' : '#005eb8';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={
        [
          {
            padding: 10,
            margin: 5,
            backgroundColor,
            borderWidth: 1,
            borderColor: buttonBackgroundColor,
            borderRadius: 5,
          },
          style,
        ] as StyleProp<ViewStyle>
      }>
      <Image
        source={{
          uri:
            'https://airneisstaticassets.onrender.com' +
              product.URLimages[0].replace('../public', '') ||
            '/assets/images/no-image.png',
        }}
        style={
          {
            width: '100%',
            height: 200,
            resizeMode: 'cover',
          } as StyleProp<ImageStyle>
        }
      />
      <View style={{padding: 10}}>
        <Text
          style={
            {
              fontSize: 18,
              fontWeight: 'bold',
              color: textColor,
            } as StyleProp<TextStyle>
          }>
          {product.name}
        </Text>
        <Text style={{fontSize: 16, color: textColor}}>£{product.price}</Text>
        {actualStock === 0 ? (
          <TouchableOpacity
            style={{backgroundColor: '#aaa', padding: 10, marginTop: 10}}
            disabled>
            <Text
              style={
                {
                  color: textColor,
                  textAlign: 'center',
                } as StyleProp<TextStyle>
              }>
              Out of Stock
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              padding: 10,
              margin: 5,
              backgroundColor: buttonBackgroundColor,
            }}
            onPress={() => addToCartHandler(ConvertProductToCartItem(product))}>
            <Text
              style={
                {
                  color: textColor,
                } as StyleProp<TextStyle>
              }>
              Add to Cart
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default ProductItem;
