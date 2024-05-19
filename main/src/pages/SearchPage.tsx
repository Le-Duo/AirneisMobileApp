import {useState, useEffect, useMemo} from 'react';
import {ScrollView, View} from 'react-native';
import {Text, TextInput, Button, ActivityIndicator} from 'react-native-paper';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useRoute, RouteProp} from '@react-navigation/native';
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

const SearchPage = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Search'>>();
  const query = useMemo(
    () => parseQueryParams(route.params?.query || ''),
    [route.params?.query],
  );

  const [searchQuery, setSearchQuery] = useState(query.get('query') || '');
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const sortBy = query.get('sortBy') || '';
  const sortOrder = query.get('sortOrder') || 'asc';

  const {
    data: displayResults,
    isLoading,
    isError,
  } = useSearchProducts({
    searchText: searchQuery,
    minPrice,
    maxPrice,
    categories: selectedCategories,
    inStock: query.get('inStock') === 'true',
    materials: selectedMaterials,
    sortBy: sortBy as 'price' | 'dateAdded' | 'inStock' | undefined,
    sortOrder: sortOrder as 'asc' | 'desc' | undefined,
  });

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useGetCategoriesQuery();

  const {
    data: uniqueMaterials,
    isLoading: isLoadingMaterials,
    isError: isErrorMaterials,
  } = useGetUniqueMaterialsQuery();

  const styles = useGetStyles();

  useEffect(() => {
    const minPriceValue = query.get('minPrice');
    const maxPriceValue = query.get('maxPrice');
    const categoriesValue = query.get('categories');
    const materialsValue = query.get('materials');

    setMinPrice(minPriceValue ? Number(minPriceValue) : undefined);
    setMaxPrice(maxPriceValue ? Number(maxPriceValue) : undefined);
    setSelectedCategories(categoriesValue ? categoriesValue.split(',') : []);
    setSelectedMaterials(materialsValue ? materialsValue.split(',') : []);
  }, [query]);

  const handleSearch = (e: any) => {
    e.preventDefault();
    const params = new URLSearchParams({
      query: searchQuery,
      ...(minPrice && {minPrice: String(minPrice)}),
      ...(maxPrice && {maxPrice: String(maxPrice)}),
      ...(selectedCategories.length > 0 && {
        categories: selectedCategories.join(','),
      }),
      ...(selectedMaterials.length > 0 && {
        materials: selectedMaterials.join(','),
      }),
    }).toString();
    navigation.navigate('Search', {query: params});
  };

  const handleFilterSubmit = (e: any) => {
    e.preventDefault();
    const params = new URLSearchParams({
      query: searchQuery,
      ...(minPrice && {minPrice: String(minPrice)}),
      ...(maxPrice && {maxPrice: String(maxPrice)}),
      ...(selectedCategories.length > 0 && {
        categories: selectedCategories.join(','),
      }),
      ...(selectedMaterials.length > 0 && {
        materials: selectedMaterials.join(','),
      }),
    }).toString();
    navigation.navigate('Search', {query: params});
    setShowFilter(false);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setShowFilter(false);
    navigation.navigate('Search', {query: ''});
  };

  const handleShow = () => {
    setShowFilter(!showFilter);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Search</Text>
        <Button
          icon="filter"
          mode="contained"
          onPress={handleShow}
          style={styles.button}>
          <Text>Filter</Text>
        </Button>
        <TextInput
          label="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          style={styles.input}
        />
        <Button mode="contained" onPress={handleSearch} style={styles.button}>
          <Text>Search</Text>
        </Button>

        {showFilter && (
          <View style={styles.filterContainer}>
            <TextInput
              label="Minimum Price"
              value={minPrice?.toString()}
              onChangeText={(text: string) =>
                setMinPrice(text ? Number(text) : undefined)
              }
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Maximum Price"
              value={maxPrice?.toString()}
              onChangeText={(text: string) =>
                setMaxPrice(text ? Number(text) : undefined)
              }
              mode="outlined"
              style={styles.input}
            />
            <Text style={styles.label}>Categories</Text>
            {isLoadingCategories ? (
              <ActivityIndicator
                animating={true}
                style={styles.activityIndicator}
              />
            ) : isErrorCategories ? (
              <Text style={styles.error}>Error loading categories</Text>
            ) : (
              categories?.map(category => (
                <Text key={category._id} style={styles.category}>
                  {category.name}
                </Text>
              ))
            )}
            <Text style={styles.label}>Materials</Text>
            {isLoadingMaterials ? (
              <ActivityIndicator
                animating={true}
                style={styles.activityIndicator}
              />
            ) : isErrorMaterials ? (
              <Text style={styles.error}>Error loading materials</Text>
            ) : (
              uniqueMaterials?.map(material => (
                <Text key={material} style={styles.material}>
                  {material}
                </Text>
              ))
            )}
            <Button
              mode="contained"
              onPress={handleFilterSubmit}
              style={styles.button}>
              <Text>Apply Filters</Text>
            </Button>
            <Button
              mode="contained"
              color="red"
              onPress={resetFilters}
              style={styles.button}>
              <Text>Reset Filters</Text>
            </Button>
          </View>
        )}

        <View style={styles.container}>
          {isLoading ? (
            <ActivityIndicator
              animating={true}
              style={styles.activityIndicator}
            />
          ) : isError ? (
            <Text style={styles.error}>Error fetching results</Text>
          ) : displayResults && displayResults.length > 0 ? (
            displayResults.map((product: Product) => (
              <ProductItem
                key={product._id}
                product={product}
                style={styles.productItem}
              />
            ))
          ) : (
            <Text style={styles.noResults}>No results found</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default SearchPage;
