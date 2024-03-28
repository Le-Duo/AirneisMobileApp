import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => {}}>
        <Image
          source={{ uri: "https://airneisstaticassets.onrender.com" + product.URLimage || "/assets/images/no-image.png" }}
          style={{
            ...styles.productImage,
            opacity: actualStock === 0 ? 0.5 : 1,
          }}
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

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#005eb8",
    borderRadius: 5,
    overflow: "hidden",
    margin: 10,
  },
  productImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 16,
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
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
  },
});

export default ProductItem;
