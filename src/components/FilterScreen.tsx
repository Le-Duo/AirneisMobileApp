import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from '../../App';
import { useGetStyles } from '../styles';
import { useFilters } from '../context/FilterContext';
import { Category } from '../types/Category';

type FilterScreenRouteProp = RouteProp<RootStackParamList, 'FilterScreen'>;

function FilterScreen() {
  const navigation = useNavigation();
  const route = useRoute<FilterScreenRouteProp>();
  const { filters, applyFilters, resetFilters } = useFilters()!;
  const {
    categories = [],
    materials = [],
  } = route.params;

  const [localMinPrice, setLocalMinPrice] = useState<string | undefined>(filters.minPrice?.toString());
  const [localMaxPrice, setLocalMaxPrice] = useState<string | undefined>(filters.maxPrice?.toString());
  const [selectedCategoriesState, setSelectedCategories] = useState<Category[]>(filters.selectedCategories);
  const [selectedMaterialsState, setSelectedMaterials] = useState<string[]>(filters.selectedMaterials);
  const [showCategories, setShowCategories] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const { styles } = useGetStyles();

  const toggleCategory = (category: Category) => {
    const index = selectedCategoriesState.findIndex(c => c._id === category._id);
    if (index > -1) {
      setSelectedCategories(selectedCategoriesState.filter(c => c._id !== category._id));
    } else {
      setSelectedCategories([...selectedCategoriesState, category]);
    }
  };

  const toggleMaterial = (material: string) => {
    if (selectedMaterialsState.includes(material)) {
      setSelectedMaterials(selectedMaterialsState.filter(m => m !== material));
    } else {
      setSelectedMaterials([...selectedMaterialsState, material]);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TextInput
          placeholder="Minimum Price"
          value={localMinPrice}
          onChangeText={text => setLocalMinPrice(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Maximum Price"
          value={localMaxPrice}
          onChangeText={text => setLocalMaxPrice(text)}
          style={styles.input}
        />
        <View>
          <View style={styles.filterSection}>
            <TouchableOpacity onPress={() => setShowCategories(!showCategories)} style={styles.button}>
              <Text style={styles.buttonText}>{showCategories ? "Hide Categories" : "Show Categories"}</Text>
            </TouchableOpacity>
            {showCategories && (
              <View style={styles.list}>
                {categories.map(category => (
                  <TouchableOpacity key={category._id} onPress={() => toggleCategory(category)} style={styles.item}>
                    <Icon
                      name={selectedCategoriesState.some(c => c._id === category._id) ? 'check-square' : 'square-o'}
                      size={24}
                      color={styles.icon.color}
                    />
                    <Text style={styles.buttonText}> {category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View style={styles.filterSection}>
            <TouchableOpacity onPress={() => setShowMaterials(!showMaterials)} style={styles.button}>
              <Text style={styles.buttonText}>{showMaterials ? "Hide Materials" : "Show Materials"}</Text>
            </TouchableOpacity>
            {showMaterials && (
              <View style={styles.list}>
                {materials.map(material => (
                  <TouchableOpacity key={material} onPress={() => toggleMaterial(material)} style={styles.item}>
                    <Icon
                      name={selectedMaterialsState.includes(material) ? 'check-square' : 'square-o'}
                      size={24}
                      color={styles.icon.color}
                    />
                    <Text style={styles.buttonText}> {material}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => {
            applyFilters('', localMinPrice ? Number(localMinPrice) : undefined, localMaxPrice ? Number(localMaxPrice) : undefined, selectedCategoriesState, selectedMaterialsState);
            navigation.goBack();
          }} style={styles.button}>
            <Text style={styles.buttonText}>Apply Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            resetFilters();
            navigation.goBack();
          }} style={styles.redButton}>
            <Text style={styles.buttonText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

export default FilterScreen;

