import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
  useColorScheme,
} from "react-native";
import { useGetCategoriesQuery } from "../hooks/categoryHook";
import { useGetFeaturedProductsQuery } from "../hooks/featuredProductHook";
import { useQueryClient } from "@tanstack/react-query";
import {
  useNavigation,
  useTheme,
  NavigationProp,
} from "@react-navigation/native";
import ProductItem from "../components/ProductItem";
import HomeCarousel from "../components/HomeCarousel";
import { RootStackParamList } from "../../App";
import { formatImageUrl } from "../utils";

export default function HomePage() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    queryClient.invalidateQueries().then(() => {
      setRefreshing(false);
    });
  }, [queryClient]);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const scheme = useColorScheme();

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

  useEffect(() => {}, [scheme]);

  if (isLoadingCategories || isLoadingFeaturedProducts) {
    return <ActivityIndicator />;
  }

  if (categoriesError || featuredProductsError) {
    console.error("Categories Error:", categoriesError);
    console.error("Featured Products Error:", featuredProductsError);
    return <Text>Error loading data</Text>;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{ backgroundColor: colors.background }}
    >
      <View style={{ paddingTop: 10 }}>
        <HomeCarousel />
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
              color: colors.text,
            }}
          >
            FROM THE HIGHLANDS OF SCOTLAND
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
              color: colors.text,
            }}
          >
            OUR FURNITURE IS IMMORTAL
          </Text>
        </View>
        <View>
          {categories?.map((category) => (
            <TouchableOpacity
              key={category._id}
              onPress={() =>
                navigation.navigate("Products", { category: category.slug })
              }
              style={{ overflow: "hidden", margin: 10, borderRadius: 10 }}
            >
              <ImageBackground
                source={{
                  uri: formatImageUrl(category.urlImage),
                }}
                style={{ height: 200, justifyContent: "center" }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 32,
                    fontWeight: "600",
                    color: "white",
                    shadowColor: "black",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 10,
                  }}
                >
                  {category.name}
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <Text
            style={{ fontSize: 24, fontWeight: "bold", color: colors.text }}
          >
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
              <ProductItem
                key={featuredProduct._id}
                product={featuredProduct.product}
                stockQuantity={featuredProduct.quantity}
                onPress={() =>
                  navigation.navigate("Product", {
                    slug: featuredProduct.product.slug,
                  })
                }
              />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
