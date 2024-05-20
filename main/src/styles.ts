import useStore from './Store';
import {ImageResizeMode, ImageStyle} from 'react-native';

export const useGetStyles = () => {
  const {mode} = useStore(state => ({mode: state.mode}));
  console.log('Current Mode in useGetStyles:', mode);
  const styles = {
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: mode === 'dark' ? '#fff' : '#333',
    },
    cartItem: {
      flex: 1,
      padding: 10,
      backgroundColor: mode === 'dark' ? '#333' : '#fff',
    },
    cartItemImage: {
      width: 100,
      height: 100,
    },
    cartItemDetail: {
      flex: 1,
      padding: 10,
      backgroundColor: mode === 'dark' ? '#333' : '#fff',
    },
    cartSummary: {
      flex: 1,
      padding: 10,
      backgroundColor: mode === 'dark' ? '#333' : '#fff',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold' as 'bold',
      color: mode === 'dark' ? '#000' : '#fff',
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
      borderColor: mode === 'dark' ? '#333' : '#005eb8',
      borderWidth: 1,
      backgroundColor: mode === 'dark' ? '#fff' : '#333',
      color: mode === 'dark' ? '#000' : '#fff',
      placeholderTextColor: mode === 'dark' ? '#000' : '#fff',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold' as 'bold',
      color: mode === 'dark' ? '#fff' : '#000',
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
      backgroundColor: mode === 'dark' ? '#333' : '#fff',
    },
    material: {
      padding: 10,
      margin: 5,
      backgroundColor: mode === 'dark' ? '#333' : '#fff',
    },
    productItem: {
      padding: 10,
      margin: 5,
      backgroundColor: mode === 'dark' ? '#333' : '#fff',
    },
    noResults: {
      fontSize: 16,
      fontWeight: 'bold' as 'bold',
      color: mode === 'dark' ? '#fff' : '#000',
    },
    enhancedContainer: {
      flex: 1,
      padding: 16,
      backgroundColor: mode === 'dark' ? '#333' : 'white',
    },
    filterContainer: {
      flex: 1,
      padding: 16,
      backgroundColor: mode === 'dark' ? '#fff' : '#333',
    },
    card: {
      borderWidth: 1,
      borderColor: '#005eb8',
      borderRadius: 5,
      overflow: 'hidden' as 'hidden',
      margin: 10,
      backgroundColor: mode === 'dark' ? '#fff' : '#333',
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: mode === 'dark' ? '#000' : '#fff',
    },
    cardText: {
      fontSize: 16,
      color: mode === 'dark' ? '#000' : '#fff', // Ensure text is white in dark mode
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center' as const,
    },
    productImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
      // opacity: actualStock === 0 ? 0.5 : 1,
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
      width: '100%' as ImageStyle['width'], // Ensure TypeScript recognizes the percentage string
      height: 200,
      resizeMode: 'cover' as ImageResizeMode,
    },
    text: {
      color: mode === 'dark' ? '#000' : '#fff',
      fontSize: 16,
    },
    priceText: {
      color: mode === 'dark' ? '#000' : '#fff',
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
      position: 'relative',
      width: '100%',
      height: 'auto',
    },
    imageTitle: {
      position: 'absolute',
      width: '100%',
      textAlign: 'center',
      top: '50%',
      transform: [{translateY: -20}],
      fontSize: 40,
      fontWeight: 'bold',
      color: '#fff',
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 0},
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
      flexDirection: 'row', // Align items horizontally
      alignItems: 'center', // Center items vertically within the container
      justifyContent: 'space-between', // Space between the text and the icon
      padding: 10,
      marginTop: 10,
      backgroundColor: '#005eb8', // Adjust background color based on mode
      borderRadius: 5,
    },
    toggleLabel: {
      fontSize: 18,
      marginRight: 10,
      color: 'white',
    },
  };

  return {styles, mode};
};
