import useStore from './Store';
import { ImageResizeMode, ImageStyle } from 'react-native';

export const headerStyles = {
  headerStyle: {
    backgroundColor: '#f8f9fa',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    height: 30,
  },
  headerTintColor: '#005eb8',
  headerTitleStyle: {
    fontWeight: 'bold' as 'bold',
    fontSize: 18,
  },
  headerTitleAlign: 'center' as 'center',
};

export const useGetStyles = () => {
  const { mode } = useStore(state => ({ mode: state.mode }));
  console.log('Current Mode in useGetStyles:', mode);
  const styles = {
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: mode === 'dark' ? '#333' : '#fff',
    },
    cartItem: {
      flex: 1,
      padding: 10,
      backgroundColor: mode === 'dark' ? '#fff' : '#333',
    },
    cartItemImage: {
      width: 100,
      height: 100,
    },
    cartItemDetail: {
      flex: 1,
      padding: 10,
      backgroundColor: mode === 'dark' ? '#fff' : '#333',
    },
    cartSummary: {
      flex: 1,
      padding: 10,
      backgroundColor: mode === 'dark' ? '#fff' : '#333',
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
      borderRadius: 5,
    },
    input: {
      padding: 10,
      margin: 5,
      borderColor: mode === 'dark' ? '#005eb8' : '#333',
      borderWidth: 1,
      backgroundColor: mode === 'dark' ? '#333' : '#fff',
      color: mode === 'dark' ? '#fff' : '#000',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold' as 'bold',
      color: mode === 'dark' ? '#000' : '#fff',
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
    },
    filterItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      margin: 5,
      backgroundColor: mode === 'dark' ? '#333' : '#fff',
      borderRadius: 5,
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
    },
    productItem: {
      padding: 10,
      margin: 5,
      backgroundColor: mode === 'dark' ? '#fff' : '#333',
    },
    noResults: {
      fontSize: 16,
      fontWeight: 'bold' as 'bold',
      color: mode === 'dark' ? '#000' : '#fff',
    },
    enhancedContainer: {
      flex: 1,
      padding: 16,
      backgroundColor: mode === 'dark' ? '#fff' : '#333',
    },
    filterContainer: {
      flex: 1,
      padding: 16,
      backgroundColor: mode === 'dark' ? '#333' : '#fff',
    },
    card: {
      borderWidth: 1,
      borderColor: '#005eb8',
      borderRadius: 5,
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
      height: 200,
      resizeMode: 'cover',

    },
    cardBody: {
      padding: 10,
    },
    buttonDisabled: {
      backgroundColor: '#aaa',
      padding: 10,
      marginTop: 10,
      borderRadius: 5,
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
      borderRadius: 5,
    },
    addToCartButton: {
      backgroundColor: '#005eb8',
      padding: 10,
      borderRadius: 5,
    },
    imageContainer: {
      //positions possible : absolute, relative, fixed
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
      borderRadius: 5,
    },
    toggleLabel: {
      fontSize: 18,
      marginRight: 10,
      color: 'white',
    },
  };

  return { styles, mode, headerStyles };
};

