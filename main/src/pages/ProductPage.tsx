import { View, Text, Button, ScrollView, Dimensions, Image, ToastAndroid, StyleSheet } from 'react-native';
import { useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
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
import { useGetStyles } from '../styles';
import { useGetSimilarProductsQuery } from '../hooks/productHook';
import ProductItem from '../components/ProductItem';
import { RootStackParamList } from '../../App';

export default function ProductPage() {
  interface RouteParams {
    slug: string;
  }

  const { mode } = useGetStyles();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const dynamicStyles = StyleSheet.create({
    productName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: mode === 'dark' ? '#FFFFFF' : '#000',
    },
    productPrice: {
      fontSize: 24,
      fontWeight: 'bold',
      color: mode === 'dark' ? '#FFFFFF' : '#000',
    },
    stockText: {
      fontSize: 18,
      marginTop: 10,
      color: mode === 'dark' ? '#FFFFFF' : '#000',
    },
    descriptionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: mode === 'dark' ? '#FFFFFF' : '#000',
    },
    descriptionText: {
      fontSize: 16,
      color: mode === 'dark' ? '#FFFFFF' : '#000',
    },
    materialsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: mode === 'dark' ? '#FFFFFF' : '#000',
    },
    materialsText: {
      fontSize: 16,
      color: mode === 'dark' ? '#FFFFFF' : '#000',
    },
    similarProductsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: mode === 'dark' ? '#FFFFFF' : '#000',
    },
  });

  const route = useRoute();
  const params = route.params as RouteParams | undefined;

  const { slug } = params || {};
  const { data: product, isLoading, error } = useGetProductDetailsBySlugQuery(slug || '');
  const categoryId = product?.category?._id || '';
  const productId = product?._id || '';
  const { data: similarProducts = [] } = useGetSimilarProductsQuery(categoryId, productId);

  const { cart, cartAddItem } = useStore(store, state => ({
    cart: state.cart,
    cartAddItem: state.cartAddItem,
  }));

  if (!params) {
    return <MessageBox variant="danger"><Text>No product slug provided</Text></MessageBox>;
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
    return <MessageBox variant="danger"><Text>Product Not Found</Text></MessageBox>;
  } else {
    return (
      <ScrollView style={{ margin: 0, padding: 0 }}>
        <View style={{ margin: 0, padding: 0 }}>
          <Carousel
            data={product.URLimages.map(
              image => 'https://airneisstaticassets.onrender.com' + image.replace('../public', ''),
            )}
            renderItem={renderItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={Dimensions.get('window').width}
            vertical={false}
          />
          <View style={styles.contentContainer}>
            <View style={styles.detailsContainer}>
              <Text style={dynamicStyles.productName}>{product.name}</Text>
              <Text style={dynamicStyles.productPrice}>{`£${product.price}`}</Text>
            </View>
            <Text style={dynamicStyles.stockText}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</Text>
            <Button
              title={product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
              onPress={addToCartHandler}
              disabled={product.stock === 0}
              style={styles.cartButton}
            />
            <View style={styles.descriptionContainer}>
              <Text style={dynamicStyles.descriptionTitle}>Description:</Text>
              <Text style={dynamicStyles.descriptionText}>{product.description}</Text>
            </View>
            <View style={styles.materialsContainer}>
              <Text style={dynamicStyles.materialsTitle}>Materials:</Text>
              {product.materials.map((material, index) => (
                <Text key={index} style={dynamicStyles.materialsText}>{material.trim()}</Text>
              ))}
            </View>
            <View style={styles.similarProductsContainer}>
              <Text style={dynamicStyles.similarProductsTitle}>SIMILAR PRODUCTS</Text>
              {similarProducts?.map(similarProduct => {
                console.log("Similar Product:", similarProduct); // Log each similar product
                return (
                  <ProductItem
                    key={similarProduct._id}
                    product={similarProduct}
                    stockQuantity={similarProduct.quantity}
                    onPress={() => navigation.navigate('Product', { slug: similarProduct.slug })}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: Dimensions.get('window').height * 0.4,
    margin: 0,
    padding: 0,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
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
  materialsContainer: {
    marginTop: 20,
  },
  similarProductsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  contentContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
});

