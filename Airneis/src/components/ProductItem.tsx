import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ViewStyle,
} from 'react-native';
import useStore from '../Store';
import { CartItem } from '../types/Cart';
import { Product } from '../types/Product';
import { ConvertProductToCartItem } from '../utils';
import { useGetStyles } from '../styles';
import { formatImageUrl } from '../utils';

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
  const { cart, cartAddItem } = useStore(state => ({
    cart: state.cart,
    cartAddItem: state.cartAddItem,
  }));

  const { styles } = useGetStyles();

  const { cartItems } = cart;
  const actualStock =
    stockQuantity !== undefined ? stockQuantity : product.stock;

  const addToCartHandler = async (item: CartItem) => {
    const existItem = cartItems.find(x => x._id === item._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (actualStock && actualStock < quantity) {
      ToastAndroid.show('Sorry, Product is out of stock', ToastAndroid.SHORT);
      return;
    }
    await cartAddItem({ ...item, quantity });
    ToastAndroid.show('Success, Product added to cart', ToastAndroid.SHORT);
  };

  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, style]}>
      {actualStock === 0 ? (
        <React.Fragment>
          <Image
            source={{
              uri: product.URLimages[0]
                ? formatImageUrl(product.URLimages[0])
                : '/assets/images/no-image.png',
            }}
            style={[styles.image, { tintColor: 'gray' }]}
          />
          <Image
            source={{
              uri: product.URLimages[0]
                ? formatImageUrl(product.URLimages[0])
                : '/assets/images/no-image.png',
            }}
            style={[styles.image, { position: 'absolute', opacity: 0.3 }]}
          />
        </React.Fragment>
      ) : (
        <Image
          source={{
            uri: product.URLimages[0]
              ? formatImageUrl(product.URLimages[0])
              : '/assets/images/no-image.png',
          }}
          style={styles.image}
        />
      )}
      <View style={{ padding: 10, borderRadius: 10 }}>
        <Text style={styles.text}>{product.name}</Text>
        <Text style={styles.priceText}>£{product.price}</Text>
        {actualStock === 0 ? (
          <TouchableOpacity style={styles.outOfStockButton} disabled>
            <Text style={styles.buttonText}>Out of Stock</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => addToCartHandler(ConvertProductToCartItem(product))}
            activeOpacity={0.7}>
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default ProductItem;
