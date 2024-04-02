import React, {useContext} from 'react';
import {View, Text, Button, ScrollView, Alert, Dimensions, Image} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel-v4';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {useGetProductDetailsBySlugQuery} from '../hooks/productHook';
import {ApiError} from '../types/APIError';
import {getError} from '../utils';
import {Store} from '../Store';
import {ConvertProductToCartItem} from '../utils';

export default function ProductPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const {slug} = route.params;
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug);

  const {state, dispatch} = useContext(Store);
  const {cart} = state;

  const addToCartHandler = () => {
    const existItem = cart.cartItems.find(x => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.stock && product.stock < quantity) {
      Alert.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {...ConvertProductToCartItem(product), quantity},
    });
    Alert.alert('Product added to cart');
    navigation.navigate('Cart');
  };

  // Carousel renderItem method
  const renderItem = ({item}) => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={{uri: item}}
          style={{width: '100%', height: 200}}
        />
      </View>
    );
  };

  // Gestion des différents états de la requête
  if (isLoading) {
    return <LoadingBox />;
  } else if (error) {
    return (
      <MessageBox variant="danger">
        {getError(error as unknown as ApiError)}
      </MessageBox>
    );
  } else if (!product) {
    return <MessageBox variant="danger">Product Not Found</MessageBox>;
  } else {
    return (
      <ScrollView>
        <View style={{padding: 10}}>
          <Carousel
            data={product.URLimages.map(image => 'https://airneisstaticassets.onrender.com' + image)}
            renderItem={renderItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={300}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>
              {product.name}
            </Text>
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>{`£${product.price}`}</Text>
          </View>
          <Text>{product.stock > 0 ? 'En stock' : 'Stock épuisé'}</Text>
          <Button
            title={product.stock > 0 ? 'AJOUTER AU PANIER' : 'STOCK ÉPUISÉ'}
            onPress={addToCartHandler}
            disabled={product.stock === 0}
          />
          <View style={{marginVertical: 5}}>
            <Text style={{fontWeight: 'bold'}}>Description:</Text>
            <Text>{product.description}</Text>
          </View>
          <View style={{marginVertical: 5}}>
            <Text style={{fontWeight: 'bold'}}>Materials:</Text>
            {product.materials.map((material, index) => (
              <Text key={index}>{material.trim()}</Text>
            ))}
          </View>
          <View style={{marginVertical: 5, alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>SIMILAR PRODUCTS</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}
