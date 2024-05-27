import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from '../../App';

type FilterScreenRouteProp = RouteProp<RootStackParamList, 'FilterScreen'>;

function FilterScreen() {
  const navigation = useNavigation();
  const route = useRoute<FilterScreenRouteProp>();
  const {
    applyFilters,
    resetFilters,
    categories = [],
    materials = [],
    selectedCategories = [],
    selectedMaterials = [],
    minPrice,
    maxPrice
  } = route.params;

  const [localMinPrice, setLocalMinPrice] = useState<string | undefined>(minPrice?.toString());
  const [localMaxPrice, setLocalMaxPrice] = useState<string | undefined>(maxPrice?.toString());
  const [selectedCategoriesState, setSelectedCategories] = useState(selectedCategories);
  const [selectedMaterialsState, setSelectedMaterials] = useState(selectedMaterials);
  const [showCategories, setShowCategories] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);

  const toggleCategory = (category: { _id: string; slug: string }) => {
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
            <Button title={showCategories ? "Hide Categories" : "Show Categories"} onPress={() => setShowCategories(!showCategories)} />
            {showCategories && (
              <View style={styles.list}>
                {categories.map(category => (
                  <TouchableOpacity key={category._id} onPress={() => toggleCategory(category)} style={styles.item}>
                    <Icon
                      name={selectedCategoriesState.some(c => c._id === category._id) ? 'check-square' : 'square-o'}
                      size={24}
                      color="black"
                    />
                    <Text>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View style={styles.filterSection}>
            <Button title={showMaterials ? "Hide Materials" : "Show Materials"} onPress={() => setShowMaterials(!showMaterials)} />
            {showMaterials && (
              <View style={styles.list}>
                {materials.map(material => (
                  <TouchableOpacity key={material} onPress={() => toggleMaterial(material)} style={styles.item}>
                    <Icon
                      name={selectedMaterialsState.includes(material) ? 'check-square' : 'square-o'}
                      size={24}
                      color="black"
                    />
                    <Text>{material}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Apply Filters" onPress={() => {
            applyFilters(localMinPrice ? Number(localMinPrice) : undefined, localMaxPrice ? Number(localMaxPrice) : undefined, selectedCategoriesState, selectedMaterialsState);
            navigation.goBack();
          }} />
          <Button title="Reset Filters" onPress={() => {
            resetFilters();
            navigation.goBack();
          }} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterSection: {
    flex: 1,
    marginHorizontal: 50,
    paddingVertical: 10,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default FilterScreen;

