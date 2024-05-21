import { useState, useEffect, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Product } from '../types/Product';
import { useSearchProducts } from '../hooks/searchHook';
import { useGetCategoriesQuery } from '../hooks/categoryHook';
import { useGetUniqueMaterialsQuery } from '../hooks/productHook';
import ProductItem from '../components/ProductItem';
import { RootStackParamList } from '../../App';
import { useGetStyles } from '../styles';
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
  const [selectedCategories, setSelectedCategories] = useState<{ id: string, slug: string }[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const sortBy = query.get('sortBy') || '';
  const sortOrder = query.get('sortOrder') || 'asc';
  const [showCategories, setShowCategories] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);

  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);


  const applyFilters = () => {
    setMinPrice(localMinPrice);
    setMaxPrice(localMaxPrice);
    setShowFilter(false);
  };

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
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    categories: selectedCategories.map(cat => cat.slug),
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

  const { styles, mode } = useGetStyles();

  useEffect(() => {
    const minPriceValue = query.get('minPrice');
    const maxPriceValue = query.get('maxPrice');
    const categoriesValue = query.get('categories');
    const materialsValue = query.get('materials');

    setMinPrice(minPriceValue ? Number(minPriceValue) : undefined);
    setMaxPrice(maxPriceValue ? Number(maxPriceValue) : undefined);
    setSelectedCategories(categoriesValue ? categoriesValue.split(',').map((slug: string) => ({ slug, id: slug })) : []);
    setSelectedMaterials(materialsValue ? materialsValue.split(',') : []);
  }, [query]);

  const handleSearch = (e: any) => {
    e.preventDefault();
    const params = new URLSearchParams({
      query: searchQuery,
      ...(minPrice && { minPrice: String(minPrice) }),
      ...(maxPrice && { maxPrice: String(maxPrice) }),
      ...(selectedCategories.length > 0 && {
        categories: selectedCategories.map(cat => cat.slug).join(','),
      }),
      ...(selectedMaterials.length > 0 && {
        materials: selectedMaterials.join(','),
      }),
    }).toString();

    console.log("Navigating with query:", params);
    navigation.navigate('Search', { query: params });
  };

  const handleFilterSubmit = (e: any) => {
    e.preventDefault();
    applyFilters();
  };

  const resetFilters = () => {
    setSearchQuery('');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setShowFilter(false);
    navigation.navigate('Search', { query: '' });
  };

  const handleShow = () => {
    setShowFilter(!showFilter);
  };

  const handleCategorySelect = (selectedCategory: { id: string, slug: string }) => {
    console.log("Current categories:", selectedCategories);
    const index = selectedCategories.findIndex(c => c.id === selectedCategory.id);

    if (index > -1) {
      const newCategories = selectedCategories.filter(c => c.id !== selectedCategory.id);
      console.log("Removing category, new categories:", newCategories);
      setSelectedCategories(newCategories);
    } else {
      const newCategories = [...selectedCategories, selectedCategory];
      console.log("Adding category, new categories:", newCategories);
      setSelectedCategories(newCategories);
    }
  };

  const handleMaterialSelect = (material: string) => {
    if (selectedMaterials.includes(material)) {
      setSelectedMaterials(selectedMaterials.filter(m => m !== material));
    } else {
      setSelectedMaterials([...selectedMaterials, material]);
    }
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
          placeholderTextColor={mode === 'dark' ? '#aaa' : '#999'}
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
              value={localMinPrice?.toString()}
              onChangeText={(text: string) =>
                setLocalMinPrice(text ? Number(text) : undefined)
              }
              style={styles.input}
              placeholderTextColor={mode === 'dark' ? '#aaa' : '#999'}
            />
            <TextInput
              placeholder="Maximum Price"
              value={localMaxPrice?.toString()}
              onChangeText={(text: string) =>
                setLocalMaxPrice(text ? Number(text) : undefined)
              }
              style={styles.input}
              placeholderTextColor={mode === 'dark' ? '#aaa' : '#999'}
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
                display: showCategories ? 'flex' : 'none',
              }}>
              <ScrollView horizontal={true}>
                {showCategories &&
                  (isLoadingCategories ? (
                    <ActivityIndicator animating={true} size="large" />
                  ) : isErrorCategories ? (
                    <Text style={styles.error}>Error loading categories</Text>
                  ) : (
                    categories?.map(category => (
                      <TouchableOpacity
                        key={category._id}
                        style={styles.filterItem}
                        onPress={() => handleCategorySelect({ id: category._id, slug: category.slug })}
                      >
                        <Icon
                          name={selectedCategories.some(c => c.id === category._id) ? 'check-square' : 'square-o'}
                          size={24}
                          color="black"
                        />
                        <Text style={styles.filterText}>
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ))}
              </ScrollView>
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
                display: showMaterials ? 'flex' : 'none',
              }}>
              <ScrollView horizontal={true}>
                {showMaterials &&
                  (isLoadingMaterials ? (
                    <ActivityIndicator animating={true} size="large" />
                  ) : isErrorMaterials ? (
                    <Text style={styles.error}>Error loading materials</Text>
                  ) : (
                    uniqueMaterials?.map(material => (
                      <TouchableOpacity
                        key={material}
                        style={styles.filterItem}
                        onPress={() => handleMaterialSelect(material)}
                      >
                        <Icon
                          name={
                            selectedMaterials.includes(material)
                              ? 'check-square'
                              : 'square-o'
                          }
                          size={24}
                          color="black"
                        />
                        <Text style={styles.filterText}>
                          {' '}{material}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ))}
              </ScrollView>
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




