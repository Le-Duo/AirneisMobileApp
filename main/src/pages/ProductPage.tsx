import { View, Text, Button, ScrollView, Dimensions, Image, ToastAndroid, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel-v4';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useGetProductDetailsBySlugQuery } from '../hooks/productHook';
import { ApiError } from '../types/APIError';
import { getError } from '../utils';
import { useStore } from 'zustand';
import store from '../Store';
import { ConvertProductToCartItem } from '../utils';
import { Product } from '../types/Product';

export default function ProductPage() {
  interface RouteParams {
    slug: string;
  }

  const route = useRoute();
  const params = route.params as RouteParams | undefined;

  const { slug } = params || {};
  const { data: product, isLoading, error } = useGetProductDetailsBySlugQuery(slug || '');

  const { cart, cartAddItem } = useStore(store, state => ({
    cart: state.cart,
    cartAddItem: state.cartAddItem,
  }));

  if (!params) {
    return <MessageBox variant="danger">No product slug provided</MessageBox>;
  }

  const addToCartHandler = async () => {
    if (!product) {
      ToastAndroid.show('Product is not available', ToastAndroid.SHORT);
      return;
    }
    const existItem = cart.cartItems.find(x => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.stock && product.stock < quantity) {
      ToastAndroid.show('Sorry. Product is out of stock', ToastAndroid.SHORT);
      return;
    }
    await cartAddItem({
      ...ConvertProductToCartItem(product as Product),
      quantity,
    });
    ToastAndroid.show('Product added to cart', ToastAndroid.SHORT);
  };

  const renderItem = ({ item }: { item: string }) => {
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: item }} style={styles.productImage} />
      </View>
    );
  };

  if (isLoading) {
    return <LoadingBox />;
  } else if (error) {
    return <MessageBox variant="danger">{getError(error as unknown as ApiError)}</MessageBox>;
  } else if (!product) {
    return <MessageBox variant="danger">Product Not Found</MessageBox>;
  } else {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.innerContainer}>
          <Carousel
            data={product.URLimages.map(
              image => 'https://airneisstaticassets.onrender.com' + image.replace('../public', ''),
            )}
            renderItem={renderItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={300}
            vertical={false}
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>{`£${product.price}`}</Text>
          </View>
          <Text style={styles.stockText}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</Text>
          <Button
            title={product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
            onPress={addToCartHandler}
            disabled={product.stock === 0}
            style={styles.cartButton}
          />
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description:</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>
          <View style={styles.materialsContainer}>
            <Text style={styles.materialsTitle}>Materials:</Text>
            {product.materials.map((material, index) => (
              <Text key={index} style={styles.materialsText}>{material.trim()}</Text>
            ))}
          </View>
          <View style={styles.similarProductsContainer}>
            <Text style={styles.similarProductsTitle}>SIMILAR PRODUCTS</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  innerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  stockText: {
    fontSize: 18,
    marginTop: 10,
  },
  cartButton: {
    backgroundColor: '#005eb8',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 20,
  },
  descriptionContainer: {
    marginTop: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 16,
  },
  materialsContainer: {
    marginTop: 20,
  },
  materialsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  materialsText: {
    fontSize: 16,
  },
  similarProductsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  similarProductsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});