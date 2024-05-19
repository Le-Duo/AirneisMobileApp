import useStore from './Store';

export const useGetStyles = () => {
  const {mode} = useStore(state => ({mode: state.mode}));
  console.log('Current Mode in useGetStyles:', mode); // Check the current mode
  const styles = {
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: mode === 'dark' ? '#333' : '#fff',
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
      color: mode === 'dark' ? '#fff' : '#000',
    },
    button: {
      padding: 10,
      margin: 5,
      backgroundColor: mode === 'dark' ? '#555' : '#005eb8',
    },
    input: {
      padding: 10,
      margin: 5,
      borderColor: mode === 'dark' ? '#555' : '#005eb8',
      backgroundColor: mode === 'dark' ? '#333' : '#fff',
      color: mode === 'dark' ? '#fff' : '#000',
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
      backgroundColor: mode === 'dark' ? '#333' : 'white',
    },
    card: {
      borderWidth: 1,
      borderColor: '#005eb8',
      borderRadius: 5,
      overflow: 'hidden',
      margin: 10,
      backgroundColor: mode === 'dark' ? '#333333' : '#ffffff',
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: mode === 'dark' ? '#ffffff' : '#000000',
    },
    cardText: {
      fontSize: 16,
      color: mode === 'dark' ? '#dddddd' : '#000000',
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
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
    },
  };
  console.log(styles); // Log out styles to check them
  return styles;
};
