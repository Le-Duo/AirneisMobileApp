import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, useColorScheme, ToastAndroid } from 'react-native';
import { Store } from "../Store";
import { CartItem } from "../types/Cart";
import { Product } from "../types/Product";
import { ConvertProductToCartItem } from "../utils";
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProductItem({ product, stockQuantity, onPress }: { product: Product; stockQuantity?: number; onPress?: () => void}) {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const actualStock = stockQuantity !== undefined ? stockQuantity : product.stock;
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const addToCartHandler = async (item: CartItem) => {
    const existItem = cartItems.find((x) => x._id === item._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (actualStock && actualStock < quantity) {
      ToastAndroid.show("Sorry, Product is out of stock", ToastAndroid.SHORT);
      return;
    }
    const updatedCartItems = existItem
      ? cartItems.map((x) =>
          x._id === existItem._id ? { ...item, quantity } : x
        )
      : [...cartItems, { ...item, quantity }];
  
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
    ToastAndroid.show("Success, Product added to cart", ToastAndroid.SHORT);
  
    // Save the updated cart items to AsyncStorage
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      console.log('Cart items saved successfully');
    } catch (error) {
      console.error('Failed to save cart items:', error);
    }
  };

  const styles = StyleSheet.create({
    card: {
      borderWidth: 1,
      borderColor: "#005eb8",
      borderRadius: 5,
      overflow: "hidden",
      margin: 10,
      backgroundColor: isDark ? "#333333" : "#ffffff",
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#ffffff" : "#000000",
    },
    cardText: {
      fontSize: 16,
      color: isDark ? "#dddddd" : "#000000",
    },
    buttonText: {
      color: "#fff",
      textAlign: "center",
    },
    productImage: {
      width: "100%",
      height: 200,
      resizeMode: "cover",
      opacity: actualStock === 0 ? 0.5 : 1,
    },
    cardBody: {
      padding: 10,
    },
    button: {
      backgroundColor: "#007bff",
      padding: 10,
      marginTop: 10,
    },
    buttonDisabled: {
      backgroundColor: "#aaa",
      padding: 10,
      marginTop: 10,
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
    <View style={styles.card}>
        <Image
          source={{ uri: "https://airneisstaticassets.onrender.com" + product.URLimages[0] || "/assets/images/no-image.png" }}
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
            onPress={() => addToCartHandler(ConvertProductToCartItem(product))}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
    </TouchableOpacity>
  );
}

export default ProductItem;

