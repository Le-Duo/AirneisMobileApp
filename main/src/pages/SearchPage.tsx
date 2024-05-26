import {useState, useEffect, useMemo} from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  useNavigation,
  NavigationProp,
  useRoute,
  RouteProp,
} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/FontAwesome';
import {Product} from '../types/Product';
import {useSearchProducts} from '../hooks/searchHook';
import {useGetCategoriesQuery} from '../hooks/categoryHook';
import {useGetUniqueMaterialsQuery} from '../hooks/productHook';
import ProductItem from '../components/ProductItem';
import {RootStackParamList} from '../../App';
import {useGetStyles} from '../styles';

const parseQueryParams = (query: string) => {
  const params = new Map();
  query.split('&').forEach(part => {
    const [key, value] = part.split('=').map(decodeURIComponent);
    if (!params.has(key)) {
      params.set(key, value);
    }
  });
  return params;
};

function SearchPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Search'>>();
  const query = useMemo(
    () => parseQueryParams(route.params?.query || ''),
    [route.params?.query],
  );

  const [searchQuery, setSearchQuery] = useState(query.get('query') || '');
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [selectedCategories, setSelectedCategories] = useState<
    {id: string; slug: string}[]
  >([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const {
    data: displayResults,
    isLoading,
    isError,
  } = useSearchProducts({
    searchText: searchQuery,
    minPrice: minPrice,
    maxPrice: maxPrice,
    categories: selectedCategories.map(cat => cat.slug),
    materials: selectedMaterials,
  });

  const {styles, mode} = useGetStyles();

  // Example of fetching categories and materials
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const { data: materialsData, isLoading: isLoadingMaterials } = useGetUniqueMaterialsQuery();

  // Ensure data is set in state variables and passed to FilterScreen
  const openFilterScreen = () => {
    if (!isLoadingCategories && !isLoadingMaterials && categoriesData && materialsData) {
      navigation.navigate('FilterScreen', {
        minPrice,
        maxPrice,
        selectedCategories,
        selectedMaterials,
        categories: categoriesData,
        materials: materialsData,
        applyFilters: (localMinPrice, localMaxPrice, localSelectedCategories, localSelectedMaterials) => {
          setMinPrice(localMinPrice);
          setMaxPrice(localMaxPrice);
          setSelectedCategories(localSelectedCategories);
          setSelectedMaterials(localSelectedMaterials);
        },
        resetFilters: () => {
          setSearchQuery('');
          setMinPrice(undefined);
          setMaxPrice(undefined);
          setSelectedCategories([]);
          setSelectedMaterials([]);
        }
      });
    } else {
      // Handle loading or error state
      console.error("Data is still loading or not available.");
    }
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    navigation.navigate('Search', {
      query: new URLSearchParams({
        query: searchQuery,
        minPrice: minPrice?.toString(),
        maxPrice: maxPrice?.toString(),
        categories: selectedCategories.map(cat => cat.slug).join(','),
        materials: selectedMaterials.join(','),
      }).toString()
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={openFilterScreen} style={{ marginHorizontal: 5 }}>
            <Icon name="filter" size={24} color={mode === 'dark' ? '#aaa' : '#999'} />
          </TouchableOpacity>
          <TextInput
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.input, { flex: 1, marginHorizontal: 5 }]}
            placeholderTextColor={mode === 'dark' ? '#aaa' : '#999'}
          />
          <Button title="Search" onPress={handleSearch} color={styles.button.backgroundColor} />
        </View>
        {isLoading ? (
          <ActivityIndicator animating size="large" />
        ) : isError ? (
          <Text style={styles.error}>Error fetching results</Text>
        ) : displayResults && displayResults.length > 0 ? (
          displayResults.map((product: Product) => (
            <ProductItem
              key={product._id}
              product={product}
              onPress={() => navigation.navigate('Product', { productId: product._id })}
            />
          ))
        ) : (
          <Text style={styles.noResults}>No results found</Text>
        )}
      </View>
    </ScrollView>
  );
}

export default SearchPage;

