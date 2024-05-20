import {useState, useEffect, useMemo, useRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useRoute, RouteProp} from '@react-navigation/native';
import {Product} from '../types/Product';
import {useSearchProducts} from '../hooks/searchHook';
import {useGetCategoriesQuery} from '../hooks/categoryHook';
import {useGetUniqueMaterialsQuery} from '../hooks/productHook';
import ProductItem from '../components/ProductItem';
import {RootStackParamList} from '../../App';
import {useGetStyles} from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';

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
  const [showCategories, setShowCategories] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  const toggleMaterials = () => {
    setShowMaterials(!showMaterials);
  };

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

  const {styles, mode} = useGetStyles();

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
          title="Filter"
          onPress={handleShow}
          color={styles.button.backgroundColor}
        />
        <TextInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
          placeholderTextColor={mode === 'dark' ? '#000' : '#555'}
        />
        <Button
          title="Search"
          onPress={handleSearch}
          color={styles.button.backgroundColor}
        />

        {showFilter && (
          <View style={styles.filterContainer}>
            <TextInput
              placeholder="Minimum Price"
              value={minPrice?.toString()}
              onChangeText={(text: string) =>
                setMinPrice(text ? Number(text) : undefined)
              }
              style={styles.input}
              placeholderTextColor={mode === 'dark' ? '#000' : '#fff'}
            />
            <TextInput
              placeholder="Maximum Price"
              value={maxPrice?.toString()}
              onChangeText={(text: string) =>
                setMaxPrice(text ? Number(text) : undefined)
              }
              style={styles.input}
              placeholderTextColor={mode === 'dark' ? '#000' : '#fff'}
            />
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleCategories}>
              <Text style={styles.toggleLabel}>Categories</Text>
              <Icon
                name={showCategories ? 'angle-up' : 'angle-down'}
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <View
              style={{
                display: showCategories ? 'block' : 'none',
              }}>
              {showCategories &&
                (isLoadingCategories ? (
                  <ActivityIndicator animating={true} size="large" />
                ) : isErrorCategories ? (
                  <Text style={styles.error}>Error loading categories</Text>
                ) : (
                  categories?.map(category => (
                    <Text key={category._id} style={styles.category}>
                      {category.name}
                    </Text>
                  ))
                ))}
            </View>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleMaterials}>
              <Text style={styles.toggleLabel}>Materials</Text>
              <Icon
                name={showMaterials ? 'angle-up' : 'angle-down'}
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <View
              style={{
                display: showMaterials ? 'block' : 'none',
              }}>
              {showMaterials &&
                (isLoadingMaterials ? (
                  <ActivityIndicator animating={true} size="large" />
                ) : isErrorMaterials ? (
                  <Text style={styles.error}>Error loading materials</Text>
                ) : (
                  uniqueMaterials?.map(material => (
                    <Text key={material} style={styles.material}>
                      {material}
                    </Text>
                  ))
                ))}
            </View>
            <Button
              title="Apply Filters"
              onPress={handleFilterSubmit}
              color="#6200ee"
            />
            <Button title="Reset Filters" onPress={resetFilters} color="red" />
          </View>
        )}
        {isLoading ? (
          <ActivityIndicator animating={true} size="large" />
        ) : isError ? (
          <Text style={styles.error}>Error fetching results</Text>
        ) : displayResults && displayResults.length > 0 ? (
          displayResults.map((product: Product) => (
            <ProductItem key={product._id} product={product} />
          ))
        ) : (
          <Text style={styles.noResults}>No results found</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default SearchPage;
