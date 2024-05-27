import {useState, useMemo} from 'react';
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
import {useSearchProductsAndStock} from '../hooks/searchHook';
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

  const {data, isLoading, isError} = useSearchProductsAndStock({
    searchText: searchQuery,
    minPrice: minPrice,
    maxPrice: maxPrice,
    categories: selectedCategories.map(cat => cat.slug),
    materials: selectedMaterials,
  });

  const displayResults = data ? data[0] : [];
  const stocks = data ? data[1] : [];

  const {styles, mode} = useGetStyles();

  const {data: categoriesData, isLoading: isLoadingCategories} =
    useGetCategoriesQuery();
  const {data: materialsData, isLoading: isLoadingMaterials} =
    useGetUniqueMaterialsQuery();

  const openFilterScreen = () => {
    if (
      !isLoadingCategories &&
      !isLoadingMaterials &&
      categoriesData &&
      materialsData
    ) {
      navigation.navigate('FilterScreen', {
        minPrice,
        maxPrice,
        selectedCategories: selectedCategories.map(cat => ({ _id: cat.id, slug: cat.slug })),
        selectedMaterials,
        categories: categoriesData,
        materials: materialsData,
        applyFilters: (
          localMinPrice,
          localMaxPrice,
          localSelectedCategories,
          localSelectedMaterials,
        ) => {
          setMinPrice(localMinPrice);
          setMaxPrice(localMaxPrice);
          setSelectedCategories(localSelectedCategories.map(cat => ({ id: cat._id, slug: cat.slug })));
          setSelectedMaterials(localSelectedMaterials);
        },
        resetFilters: () => {
          setSearchQuery('');
          setMinPrice(undefined);
          setMaxPrice(undefined);
          setSelectedCategories([]);
          setSelectedMaterials([]);
        },
      });
    } else {
      console.error('Data is still loading or not available.');
    }
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    navigation.navigate('Search', {
      query: new URLSearchParams({
        query: searchQuery,
        ...(minPrice !== undefined ? { minPrice: minPrice.toString() } : {}),
        ...(maxPrice !== undefined ? { maxPrice: maxPrice.toString() } : {}),
        categories: selectedCategories.map(cat => cat.slug).join(','),
        materials: selectedMaterials.join(','),
      }).toString(),
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={openFilterScreen}
            style={{marginHorizontal: 5}}>
            <Icon
              name="filter"
              size={24}
              color={mode === 'dark' ? '#aaa' : '#999'}
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.input, {flex: 1, marginHorizontal: 5}]}
            placeholderTextColor={mode === 'dark' ? '#aaa' : '#999'}
          />
          <Button
            title="Search"
            onPress={handleSearch}
            color={styles.button.backgroundColor}
          />
        </View>
        {isLoading ? (
          <ActivityIndicator animating size="large" />
        ) : isError ? (
          <Text style={styles.error}>Error fetching results</Text>
        ) : displayResults.length > 0 ? (
          displayResults.map((product: Product) => {
            const stockItem = stocks.find(
              stock => stock.product._id === product._id,
            );
            const stockQuantity = stockItem ? stockItem.quantity : 0;
            return (
              <ProductItem
                key={product._id}
                product={product}
                stockQuantity={stockQuantity}
                onPress={() => {
                  if (product.slug) {
                    navigation.navigate('Product', {slug: product.slug});
                  } else {
                    console.error('Product ID is undefined');
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
