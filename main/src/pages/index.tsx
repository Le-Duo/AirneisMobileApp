import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  useColorScheme,
  RefreshControl
} from 'react-native';
import {useGetCategoriesQuery} from '../hooks/categoryHook';
import {useGetFeaturedProductsQuery} from '../hooks/featuredProductHook';
import { useQueryClient } from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import ProductItem from '../components/ProductItem';
import HomeCarousel from '../components/HomeCarousel';

export default function HomePage() {
  const [ refreshing, setRefreshing ] = useState(false);
  const queryClient = useQueryClient();
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    queryClient.invalidateQueries().then(() => {
      setRefreshing(false);
    });
  }, [queryClient]);
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useGetCategoriesQuery();
  const {
    data: featuredProducts,
    isLoading: isLoadingFeaturedProducts,
    error: featuredProductsError,
  } = useGetFeaturedProductsQuery();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#333' : '#FFF';

  if (isLoadingCategories || isLoadingFeaturedProducts) {
    return <ActivityIndicator />;
  }

  if (categoriesError || featuredProductsError) {
    return <Text>Error loading data</Text>;
  }

  return (
    <ScrollView 
      style={{backgroundColor: backgroundColor}}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <View>
        <HomeCarousel />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 10,
          }}>
          <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>
            FROM THE HIGHLANDS OF SCOTLAND
          </Text>
          <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>
            OUR FURNITURE IS IMMORTAL
          </Text>
        </View>
        <View>
          {categories?.map(category => (
            <TouchableOpacity
              key={category._id}
              onPress={() =>
                navigation.navigate('Products', {category: category.name})
              }
              style={{overflow: 'hidden', margin: 10}}>
              <ImageBackground
                source={{
                  uri:
                    'https://airneisstaticassets.onrender.com' +
                    category.urlImage,
                }}
                style={{height: 200, justifyContent: 'center'}}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 32,
                    fontWeight: '600',
                    color: 'white',
                    shadowColor: 'black',
                    shadowOffset: {width: 0, height: 0},
                    shadowOpacity: 1,
                    shadowRadius: 10,
                  }}>
                  {category.name}
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{alignItems: 'center', marginVertical: 10}}>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>
            THE HIGHLANDERS OF THE MOMENT
          </Text>
        </View>
        <View>
          {featuredProducts?.map(featuredProduct => {
            if (!featuredProduct.product) {
              console.error(
                'Product details are missing for featured product',
                featuredProduct._id,
              );
              return null;
            }
            return (
              <TouchableOpacity
                key={featuredProduct._id}
                onPress={() => navigation.navigate('Product', {slug: featuredProduct.product.slug})}
                style={{marginBottom: 10}}>
                <ProductItem
                  product={featuredProduct.product}
                  stockQuantity={featuredProduct.quantity}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
