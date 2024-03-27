import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { useGetCategoriesQuery } from '../hooks/categoryHook';
import { useGetFeaturedProductsQuery } from "../hooks/featuredProductHook";
import { useNavigation } from '@react-navigation/native';
import ProductItem from '../components/ProductItem';
import HomeCarousel from '../components/HomeCarousel';

export default function HomePage() {
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useGetCategoriesQuery();
  const { data: featuredProducts, isLoading: isLoadingFeaturedProducts, error: featuredProductsError } = useGetFeaturedProductsQuery();
  const navigation = useNavigation();

  if (isLoadingCategories || isLoadingFeaturedProducts) {
    return <ActivityIndicator />; 
  }

  if (categoriesError || featuredProductsError) {
    return <Text>Error loading data</Text>; 
  }

  
  return (
    <ScrollView>
      <View>
      <HomeCarousel />
        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
            FROM THE HIGHLANDS OF SCOTLAND
          </Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
            OUR FURNITURE IS IMMORTAL
          </Text>
        </View>
        <View>
          {categories.map((category) => (
            <TouchableOpacity
              key={category._id}
              onPress={() =>
                navigation.navigate('Products', { category: category.name })
              }
            >
              <ImageBackground
                source={{ uri: "https://airneisstaticassets.onrender.com" + category.urlImage }}
                style={{ height: 200, justifyContent: 'center' }}
              >
                <Text style={{ textAlign: 'center', fontSize: 20 }}>{category.name}</Text>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
            THE HIGHLANDERS OF THE MOMENT
          </Text>
        </View>
        <View>
          {featuredProducts?.map((featuredProduct) => {
            if (!featuredProduct.product) {
              console.error(
                "Product details are missing for featured product",
                featuredProduct._id
              );
              return null;
            }
            return (
              <TouchableOpacity
                key={featuredProduct._id}
                style={{ marginBottom: 10 }}
              >
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
