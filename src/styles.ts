import useStore from './Store';
import { ImageResizeMode, ImageStyle } from 'react-native';

export const useHeaderStyles = () => {
  const { mode } = useStore(state => ({ mode: state.mode }));
  return {
    headerStyle: {
      backgroundColor: mode === 'dark' ? '#212529' : '#f8f9fa',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
      height: 30,
      borderRadius: 15,
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
  const styles = {
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: mode === 'dark' ? '#212529' : '#fff',
      borderRadius: 10,
      justifyContent: 'center' as 'center',
      alignItems: 'center' as 'center',
    },
    menuItem: {
      flexDirection: 'row' as 'row', 
      alignItems: 'center' as 'center', 
      padding: 15,
      marginVertical: 10,
      backgroundColor: '#005eb8' as const,
      width: '80%' as const,
      borderRadius: 5,
    },
    menuIcon: {
      marginRight: 10,
    },
    menuText: {
      color: '#fff' as const,
      fontSize: 18,
      fontWeight: 'bold' as 'bold',
      textAlign: 'center' as const,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold' as 'bold',
      marginBottom: 20,
      color: mode === 'dark' ? '#fff' : '#212529',
    },
    radioContainer: {
      width: '100%',
    },
    radioItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    },
    radioText: {
      fontSize: 18,
      color: mode === 'dark' ? '#fff' : '#212529',
    },
    cartItem: {
      flex: 1,
      padding: 10,
      backgroundColor: mode === 'dark' ? '#fff' : '#212529',
      borderRadius: 10,
    },
    cartItemImage: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
    cartItemDetail: {
      flex: 1,
      padding: 10,
      backgroundColor: mode === 'dark' ? '#fff' : '#212529',
      borderRadius: 10,
    },
    cartSummary: {
      flex: 1,
      padding: 10,
      backgroundColor: mode === 'dark' ? '#fff' : '#212529',
      borderRadius: 10,
    },
    button: {
      padding: 10,
      margin: 5,
      backgroundColor: '#005eb8' as const,
      borderRadius: 10,
    },
    redButton: {
      padding: 10,
      margin: 5,
      backgroundColor: '#ff0000' as const,
      borderRadius: 10,
    },
    input: {
      padding: 10,
      margin: 5,
      borderColor: mode === 'dark' ? '#005eb8' : '#212529',
      borderWidth: 1,
      backgroundColor: mode === 'dark' ? '#212529' : '#fff',
      color: mode === 'dark' ? '#fff' : '#212529',
      borderRadius: 10,
      fontSize: 16,
      fontWeight: '500' as const,
      shadowColor: '#000' as const,
      shadowOffset: { width: 0, height: 2 } as const,
      shadowOpacity: 0.1,
      shadowRadius: 1.5,
      elevation: 2,
      placeholderTextColor: mode === 'dark' ? '#ccc' : '#212529',
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
      color: 'red' as const,
      fontSize: 16,
      textAlign: 'center' as const,
    },
    category: {
      padding: 10,
      margin: 5,
      backgroundColor: mode === 'dark' ? '#fff' : '#212529',
      borderRadius: 10,
    },
    filterItem: {
      flex: 1,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      padding: 10,
      margin: 5,
      backgroundColor: mode === 'dark' ? '#212529' : '#fff',
      borderRadius: 10,
      borderWidth: 1,
    },
    filterText: {
      flex: 1,
      marginLeft: 5,
      color: mode === 'dark' ? '#fff' : '#212529',
      fontSize: 16,
    },
    material: {
      padding: 10,
      margin: 5,
      backgroundColor: mode === 'dark' ? '#fff' : '#212529',
      borderRadius: 10,
    },
    productItem: {
      padding: 10,
      margin: 5,
      backgroundColor: mode === 'dark' ? '#fff' : '#212529',
      borderRadius: 10,
    },
    noResults: {
      fontSize: 16,
      fontWeight: 'bold' as 'bold',
      color: mode === 'dark' ? '#212529' : '#fff',
    },
    enhancedContainer: {
      flex: 1,
      padding: 16,
      backgroundColor: mode === 'dark' ? '#fff' : '#212529',
      borderRadius: 10,
    },
    filterContainer: {
      flex: 1,
      padding: 16,
      backgroundColor: mode === 'dark' ? '#212529' : '#fff',
      borderRadius: 10,
    },
    card: {
      borderWidth: 1,
      borderColor: '#005eb8' as const,
      borderRadius: 10,
      overflow: 'hidden' as 'hidden',
      margin: 10,
      backgroundColor: mode === 'dark' ? '#212529' : '#fff',
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold' as 'bold',
      color: mode === 'dark' ? '#fff' : '#212529',
    },
    cardText: {
      fontSize: 16,
      color: mode === 'dark' ? '#fff' : '#212529',
    },
    buttonText: {
      color: '#fff' as const,
      textAlign: 'center' as const,
    },
    productImage: {
      width: '100%' as ImageStyle['width'],
      height: '100%' as ImageStyle['height'],
      resizeMode: 'cover' as ImageResizeMode,
      margin: 0,
      padding: 0,
      borderRadius: 10,
    },
    cardBody: {
      padding: 10,
    },
    buttonDisabled: {
      backgroundColor: '#aaa' as const,
      padding: 10,
      marginTop: 10,
      borderRadius: 10,
    },
    image: {
      width: '100%' as ImageStyle['width'],
      height: 200,
      resizeMode: 'cover' as ImageResizeMode,
    },
    grayscaleImage: {
      width: '100%' as ImageStyle['width'],
      height: 200,
      resizeMode: 'cover' as ImageResizeMode,
      tintColor: 'gray' as const,
    },
    categoryImage: {
      width: '100%' as ImageStyle['width'],
      height: 200,
      resizeMode: 'cover' as ImageResizeMode,
    },
    text: {
      color: mode === 'dark' ? '#fff' : '#212529',
      fontSize: 16,
    },
    priceText: {
      color: mode === 'dark' ? '#fff' : '#212529',
      fontSize: 18,
      fontWeight: 'bold' as 'bold',
    },
    outOfStockButton: {
      backgroundColor: '#aaa' as const,
      padding: 10,
      borderRadius: 10,
    },
    addToCartButton: {
      backgroundColor: '#005eb8' as const,
      padding: 10,
      borderRadius: 10,
    },
    imageContainer: {
      position: 'relative' as const,
      width: '100%' as const,
      height: 200,
    },
    imageTitle: {
      position: 'absolute' as const,
      width: '100%' as const,
      textAlign: 'center' as const,
      top: '50%' as const,
      transform: [{ translateY: -20 }],
      fontSize: 40,
      fontWeight: 'bold' as 'bold',
      color: '#fff' as const,
      shadowColor: 'black' as const,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
    },
    pagination: {
      flexDirection: 'row' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    pageItem: {
      margin: 5,
    },
    pageText: {
      fontSize: 16,
      color: '#005eb8' as const,
    },
    toggleButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      padding: 10,
      marginTop: 10,
      backgroundColor: '#005eb8' as const,
      borderRadius: 10,
    },
    toggleLabel: {
      fontSize: 18,
      marginRight: 10,
      color: 'white' as const,
    },
    bold: {
      fontWeight: 'bold' as 'bold',
    },
    item: {
      padding: 10,
      marginVertical: 5,
      backgroundColor: mode === 'dark' ? '#444' : '#ddd',
      borderRadius: 10,
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
    },
    summary: {
      padding: 20,
      margin: 10,
      backgroundColor: mode === 'dark' ? '#212529' : '#fff',
      borderRadius: 10,
      shadowColor: '#212529' as const,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 1.5,
      elevation: 3,
    },
    summaryTitle: {
      fontSize: 20,
      fontWeight: 'bold' as 'bold',
      color: mode === 'dark' ? '#fff' : '#212529',
      marginBottom: 10,
    },
    cartContainer: {
      flex: 1,
      padding: 0,
      alignItems: 'stretch' as const,
    },
    cartHeader: {
      fontSize: 24,
      fontWeight: 'bold' as 'bold',
      color: mode === 'dark' ? '#fff' : '#212529',
    },
    cartListItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#cccccc' as const,
    },
    cartImage: {
      width: 50,
      height: 50,
    },
    table: {
      width: '100%' as const,
      alignItems: 'stretch' as const,
    },
    tableRow: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#cccccc' as const,
      alignItems: 'center' as const,
    },
    tableCell: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      padding: 5,
      borderWidth: 1,
      borderColor: '#cccccc' as const,
      borderStyle: 'solid' as const,
    },
    quantityControls: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    icon: {
      color: mode === 'dark' ? '#fff' : '#212529',
    },
    cartText: {
      color: mode === 'dark' ? '#fff' : '#212529',
    },
    scrollView: {
      width: '100%' as const,
    },
    dataTable: {
      width: '100%' as const,
    },
    buttonContainer: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      padding: 10,
    },
    filterSection: {
      flex: 1,
      marginHorizontal: 50,
      paddingVertical: 10,
    },
    list: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
    },
    tableHeaderText: {
      fontWeight: 'bold' as 'bold',
      fontSize: 16,
      color: mode === 'dark' ? '#fff' : '#212529',
      textAlign: 'center' as const,
    },
    totalPriceContainer: {
      padding: 10,
      margin: 10,
      backgroundColor: mode === 'dark' ? '#212529' : '#fff',
      borderRadius: 10,
      alignItems: 'center' as const,
    },
    totalPriceText: {
      fontSize: 18,
      fontWeight: 'bold' as 'bold',
      color: mode === 'dark' ? '#fff' : '#212529',
    },
  };

  return { styles, mode };
}
