import useStore from './Store';
import { ImageResizeMode, ImageStyle } from 'react-native';

export const useHeaderStyles = () => {
  const { mode } = useStore(state => ({ mode: state.mode }));
  return {
    headerStyle: {
      backgroundColor: mode === 'dark' ? '#333' : '#f8f9fa',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
      height: 30,
      borderRadius: 15, // Added border radius
    },
    headerTintColor: mode === 'dark' ? '#fff' : '#212529',
    headerTitleStyle: {
      fontWeight: 'bold' as 'bold',
      fontSize: 18,
    },
    headerTitleAlign: 'center' as 'center',
  };
};

export const useGetStyles = () => {
  const { mode } = useStore(state => ({ mode: state.mode }));
  console.log('Current Mode in useGetStyles:', mode);
  const styles = {
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: mode === 'dark' ? '#333' : '#fff',
      borderRadius: 10, // Added border radius
    },
    cartItem: {
      flex: 1,
      padding: 10,
      backgroundColor: mode === 'dark' ? '#fff' : '#333',
      borderRadius: 10, // Added border radius
    },
    cartItemImage: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
    cartItemDetail: {
      flex: 1,
      padding: 10,
      backgroundColor: mode === 'dark' ? '#fff' : '#333',
      borderRadius: 10, // Added border radius
    },
    cartSummary: {
      flex: 1,
      padding: 10,
      backgroundColor: mode === 'dark' ? '#fff' : '#333',
      borderRadius: 10, // Added border radius
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold' as 'bold',
      color: mode === 'dark' ? '#fff' : '#000',
      textAlign: 'center' as const,
      textTransform: 'uppercase' as const,
    },
    button: {
      padding: 10,
      margin: 5,
      backgroundColor: '#005eb8',
      borderRadius: 10,
    },
    input: {
      padding: 10,
      margin: 5,
      borderColor: mode === 'dark' ? '#005eb8' : '#333',
      borderWidth: 1,
      backgroundColor: mode === 'dark' ? '#333' : '#fff',
      color: mode === 'dark' ? '#fff' : '#000',
      borderRadius: 10, // Added border radius
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold' as 'bold',
      color: mode === 'dark' ? '#212529' : '#fff',
    },
    activityIndicator: {
      margin: 5,
    },
    error: {
      color: 'red',
    },
    category: {
      padding: 10,
      margin: 5,
      backgroundColor: mode === 'dark' ? '#fff' : '#333',
      borderRadius: 10, // Added border radius
    },
    filterItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      margin: 5,
      backgroundColor: mode === 'dark' ? '#333' : '#fff',
      borderRadius: 10,
      borderWidth: 1,
    },
    filterText: {
      flex: 1,
      marginLeft: 5,
      color: mode === 'dark' ? '#fff' : '#000',
      fontSize: 16,
    },
    material: {
      padding: 10,
      margin: 5,
      backgroundColor: mode === 'dark' ? '#fff' : '#333',
      borderRadius: 10, // Added border radius
    },
    productItem: {
      padding: 10,
      margin: 5,
      backgroundColor: mode === 'dark' ? '#fff' : '#333',
      borderRadius: 10, // Added border radius
    },
    noResults: {
      fontSize: 16,
      fontWeight: 'bold' as 'bold',
      color: mode === 'dark' ? '#212529' : '#fff',
    },
    enhancedContainer: {
      flex: 1,
      padding: 16,
      backgroundColor: mode === 'dark' ? '#fff' : '#333',
      borderRadius: 10, // Added border radius
    },
    filterContainer: {
      flex: 1,
      padding: 16,
      backgroundColor: mode === 'dark' ? '#333' : '#fff',
      borderRadius: 10, // Added border radius
    },
    card: {
      borderWidth: 1,
      borderColor: '#005eb8',
      borderRadius: 10,
      overflow: 'hidden' as 'hidden',
      margin: 10,
      backgroundColor: mode === 'dark' ? '#333' : '#fff',
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: mode === 'dark' ? '#fff' : '#000',
    },
    cardText: {
      fontSize: 16,
      color: mode === 'dark' ? '#fff' : '#000',
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center' as const,
    },
    productImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      margin: 0,
      padding: 0,
      borderRadius: 10,
    },
    cardBody: {
      padding: 10,
    },
    buttonDisabled: {
      backgroundColor: '#aaa',
      padding: 10,
      marginTop: 10,
      borderRadius: 10,
    },
    image: {
      width: '100%' as ImageStyle['width'],
      height: 200,
      resizeMode: 'cover' as ImageResizeMode,
    },
    categoryImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
    },
    text: {
      color: mode === 'dark' ? '#fff' : '#000',
      fontSize: 16,
    },
    priceText: {
      color: mode === 'dark' ? '#fff' : '#000',
      fontSize: 18,
      fontWeight: 'bold' as 'bold',
    },
    outOfStockButton: {
      backgroundColor: '#aaa',
      padding: 10,
      borderRadius: 10,
    },
    addToCartButton: {
      backgroundColor: '#005eb8',
      padding: 10,
      borderRadius: 10,
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: 200,
    },
    imageTitle: {
      position: 'absolute',
      width: '100%',
      textAlign: 'center',
      top: '50%',
      transform: [{ translateY: -20 }],
      fontSize: 40,
      fontWeight: 'bold',
      color: '#fff',
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    pageItem: {
      margin: 5,
    },
    pageText: {
      fontSize: 16,
      color: '#005eb8',
    },
    toggleButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      padding: 10,
      marginTop: 10,
      backgroundColor: '#005eb8',
      borderRadius: 10,
    },
    toggleLabel: {
      fontSize: 18,
      marginRight: 10,
      color: 'white',
    },
  };

  return { styles, mode };
};
