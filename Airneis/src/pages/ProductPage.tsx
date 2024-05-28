import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  ToastAndroid,
  StyleSheet,
} from 'react-native';
import {
  useRoute,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel-v4';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {useGetProductDetailsBySlugQuery} from '../hooks/productHook';
import {ApiError} from '../types/APIError';
import {getError} from '../utils';
import {useStore} from 'zustand';
import store from '../Store';
import {ConvertProductToCartItem} from '../utils';
import {Product} from '../types/Product';
import {useGetStyles} from '../styles';
import {useGetSimilarProductsQuery} from '../hooks/productHook';
import ProductItem from '../components/ProductItem';
import {RootStackParamList} from '../../App';
import {useEffect, useState} from 'react';
import apiClient from '../apiClient';
import {Stock} from '../types/Stock';
import { formatImageUrl } from '../utils';

export default function ProductPage() {
  interface RouteParams {
    slug: string;
  }

  const {mode} = useGetStyles();

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

  const {slug} = params || {};
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug || '');
  const categoryId = product?.category?._id || '';
  const productId = product?._id || '';
  const {data: similarProducts = [], error: similarProductsError} =
    useGetSimilarProductsQuery(categoryId, productId, {
      enabled: !!categoryId && !!productId,
    });

  useEffect(() => {
    if (similarProductsError) {
      console.error('Failed to fetch similar products:', similarProductsError);
    }
  }, [similarProductsError]);

  useEffect(() => {
    console.log('Using category ID:', categoryId, 'and product ID:', productId);
  }, [categoryId, productId]);

  useEffect(() => {
    console.log('Query enabled:', !!product && !!categoryId && !!productId);
  }, [product, categoryId, productId]);

  const {cart, cartAddItem} = useStore(store, state => ({
    cart: state.cart,
    cartAddItem: state.cartAddItem,
  }));

  const [stockData, setStockData] = useState<Record<string, Stock | undefined>>(
    {},
  ); // Moved outside any conditional logic

  useEffect(() => {
    if (similarProducts.length > 0) {
      const fetchStockData = async () => {
        const stockResponses = await Promise.all(
          similarProducts.map((product: Product) =>
            apiClient.get(`api/stocks/products/${product._id}`),
          ),
        );
        const stockData = stockResponses.reduce((acc, response, index) => {
          acc[similarProducts[index]._id] = response.data;
          return acc;
        }, {});
        setStockData(stockData);
      };

      fetchStockData();
    }
  }, [similarProducts]); // This useEffect is now unconditional

  // State to manage visibility
  const [showDescription, setShowDescription] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);

  // Toggle functions
  const toggleDescription = () => setShowDescription(!showDescription);
  const toggleMaterials = () => setShowMaterials(!showMaterials);

  if (!params) {
    return (
      <MessageBox variant="danger">
        <Text>No product slug provided</Text>
      </MessageBox>
    );
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

  const renderItem = ({item}: {item: string}) => {
    return (
      <View style={styles.imageContainer}>
        <Image source={{uri: item}} style={styles.productImage} />
      </View>
    );
  };

  if (isLoading) {
    return <LoadingBox />;
  } else if (error) {
    return (
      <MessageBox variant="danger">
        {getError(error as unknown as ApiError)}
      </MessageBox>
    );
  } else if (!product) {
    return (
      <MessageBox variant="danger">
        <Text>Product Not Found</Text>
      </MessageBox>
    );
  } else {
    return (
      <ScrollView style={{margin: 0, padding: 0}}>
        <View style={{margin: 0, padding: 0}}>
          <Carousel
            data={product.URLimages.map(image => formatImageUrl(image))}
            renderItem={renderItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={Dimensions.get('window').width}
            vertical={false}
          />
          <View style={styles.contentContainer}>
            <View style={styles.detailsContainer}>
              <Text style={dynamicStyles.productName}>{product.name}</Text>
              <Text
                style={dynamicStyles.productPrice}>{`£${product.price}`}</Text>
            </View>
            <Text style={dynamicStyles.stockText}>
              {product.stock > 0 ? 'In Stock : ' + product.stock : 'Out of Stock'}
            </Text>
            <View>
              {product.stock > 0 ? (
                <TouchableOpacity
                  onPress={addToCartHandler}
                  disabled={product.stock === 0}
                  style={styles.addToCartButton}
                >
                  <Text style={styles.buttonText}>ADD TO CART</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.outOfStockButton}
                  disabled={true}
                >
                  <Text style={styles.buttonText}>OUT OF STOCK</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.descriptionContainer}>
              <TouchableOpacity onPress={toggleDescription}>
                <Text style={dynamicStyles.descriptionTitle}>Description:</Text>
              </TouchableOpacity>
              {showDescription && (
                <Text style={dynamicStyles.descriptionText}>
                  {product.description}
                </Text>
              )}
            </View>
            <View style={styles.materialsContainer}>
              <TouchableOpacity onPress={toggleMaterials}>
                <Text style={dynamicStyles.materialsTitle}>Materials:</Text>
              </TouchableOpacity>
              {showMaterials && product.materials.map((material, index) => (
                <Text key={index} style={dynamicStyles.materialsText}>
                  {material.trim()}
                </Text>
              ))}
            </View>
            <View>
              <Text style={dynamicStyles.similarProductsTitle}>
                SIMILAR PRODUCTS
              </Text>
              {similarProducts.map((similarProduct: Product) => (
                <ProductItem
                  key={similarProduct._id}
                  product={similarProduct}
                  stockQuantity={
                    similarProduct._id
                      ? stockData[similarProduct._id]?.quantity
                      : undefined
                  }
                  onPress={() => {
                    if (similarProduct._id) {
                      navigation.navigate('Product', {
                        slug: similarProduct.slug,
                      });
                    } else {
                      console.error('Product ID is undefined');
                    }
                  }}
                />
              ))}
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
  button: {
    padding: 10,
    margin: 5,
    backgroundColor: '#005eb8',
    borderRadius: 10,
  },
  outOfStockButton: {
    backgroundColor: '#aaa',
    padding: 10,
    borderRadius: 10,
  },
  addToCartButton: {
    backgroundColor: '#005eb8',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center' as const,
  },
});
