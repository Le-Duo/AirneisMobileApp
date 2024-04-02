import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, useColorScheme } from 'react-native';
import { Store } from "../Store";
import { CartItem } from "../types/Cart";
import { Product } from "../types/Product";
import { ConvertProductToCartItem } from "../utils";

function ProductItem({ product, stockQuantity }: { product: Product; stockQuantity?: number }) {
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
      Alert.alert("Sorry", "Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
    Alert.alert("Success", "Product added to cart");
  };

  const styles = StyleSheet.create({
    card: {
      borderWidth: 1,
      borderColor: isDark ? "#ffffff" : "#005eb8",
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
      color: isDark ? "#ffffff" : "#000000",
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
      backgroundColor: "#cccccc",
      padding: 10,
      marginTop: 10,
    },
  });

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => {}}>
        <Image
          source={{ uri: "https://airneisstaticassets.onrender.com" + product.URLimages[0] || "/assets/images/no-image.png" }}
          style={styles.productImage}
        />
      </TouchableOpacity>
      <View style={styles.cardBody}>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.cardTitle}>{product.name}</Text>
        </TouchableOpacity>
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
  );
}

export default ProductItem;
