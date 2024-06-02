import { useState, useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  useNavigation,
  NavigationProp,
  useRoute,
  RouteProp,
} from "@react-navigation/native";

import Icon from "react-native-vector-icons/FontAwesome";
import { Product } from "../types/Product";
import { useSearchProductsAndStock } from "../hooks/searchHook";
import { useGetCategoriesQuery } from "../hooks/categoryHook";
import { useGetUniqueMaterialsQuery } from "../hooks/productHook";
import ProductItem from "../components/ProductItem";
import { RootStackParamList } from "../../App";
import { useGetStyles } from "../styles";
import { useFilters } from "../context/FilterContext";

const parseQueryParams = (query: string) => {
  const params = new Map();
  query.split("&").forEach((part) => {
    const [key, value] = part.split("=").map(decodeURIComponent);
    if (!params.has(key)) {
      params.set(key, value);
    }
  });
  return params;
};

function SearchPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Search">>();
  const query = useMemo(
    () => parseQueryParams(route.params?.query || ""),
    [route.params?.query]
  );

  const { filters, applyFilters, resetFilters } = useFilters()!;

  const { data, isLoading, isError } = useSearchProductsAndStock({
    searchText: filters.searchQuery,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    categories: filters.selectedCategories.map((cat) => cat.slug),
    materials: filters.selectedMaterials,
  });

  const displayResults = data ? data[0] : [];
  const stocks = data ? data[1] : [];

  const { styles, mode } = useGetStyles();

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();
  const { data: materialsData, isLoading: isLoadingMaterials } =
    useGetUniqueMaterialsQuery();

  const openFilterScreen = () => {
    if (
      !isLoadingCategories &&
      !isLoadingMaterials &&
      categoriesData &&
      materialsData
    ) {
      navigation.navigate("FilterScreen", {
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        selectedCategories: filters.selectedCategories.map((cat) => ({
          _id: cat._id.toString(),
          slug: cat.slug,
        })),
        selectedMaterials: filters.selectedMaterials,
        categories: categoriesData,
        materials: materialsData,
        applyFilters: (
          localMinPrice,
          localMaxPrice,
          localSelectedCategories,
          localSelectedMaterials
        ) =>
          applyFilters(
            "",
            localMinPrice,
            localMaxPrice,
            localSelectedCategories.map((cat) => ({
              ...cat,
              name: cat.slug,
              urlImage: "",
              description: "",
            })),
            localSelectedMaterials
          ),
        resetFilters: resetFilters,
      });
    } else {
      console.error("Data is still loading or not available.");
    }
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    navigation.navigate("Search", {
      query: new URLSearchParams({
        query: filters.searchQuery,
        ...(filters.minPrice !== undefined
          ? { minPrice: filters.minPrice.toString() }
          : {}),
        ...(filters.maxPrice !== undefined
          ? { maxPrice: filters.maxPrice.toString() }
          : {}),
        categories: filters.selectedCategories.map((cat) => cat.slug).join(","),
        materials: filters.selectedMaterials.join(","),
      }).toString(),
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={openFilterScreen}
            style={{ marginHorizontal: 5 }}
          >
            <Icon
              name="filter"
              size={24}
              color={mode === "dark" ? "#fff" : "#333"}
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Search products..."
            value={filters.searchQuery}
            onChangeText={(value) => applyFilters(value, filters.minPrice, filters.maxPrice, filters.selectedCategories, filters.selectedMaterials)}
            style={[styles.input, { flex: 1, marginHorizontal: 5 }]}
            placeholderTextColor={mode === "dark" ? "#aaa" : "#999"}
          />
          <TouchableOpacity
            onPress={handleSearch}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <ActivityIndicator animating size="large" />
        ) : isError ? (
          <Text style={styles.error}>Error fetching results</Text>
        ) : displayResults.length > 0 ? (
          displayResults.map((product: Product) => {
            const stockItem = stocks.find(
              (stock) => stock.product._id === product._id
            );
            const stockQuantity = stockItem ? stockItem.quantity : 0;
            return (
              <ProductItem
                key={product._id}
                product={product}
                stockQuantity={stockQuantity}
                onPress={() => {
                  if (product.slug) {
                    navigation.navigate("Product", { slug: product.slug });
                  } else {
                    console.error("Product ID is undefined");
                  }
                }}
              />
            );
          })
        ) : (
          <Text style={styles.noResults}>No results found</Text>
        )}
      </View>
    </ScrollView>
  );
}

export default SearchPage;
