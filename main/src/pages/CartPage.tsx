import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useStore} from 'zustand';
import store from '../Store';
import {CartItem} from '../types/Cart';
import MessageBox from '../components/MessageBox';
import Icon from 'react-native-vector-icons/FontAwesome';
import {RootStackParamList} from '../../App';

export default function CartPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const {
    cart: {cartItems},
    cartAddItem,
    cartRemoveItem,
    userInfo,
  } = useStore(store, state => ({
    cart: state.cart,
    cartAddItem: state.cartAddItem,
    cartRemoveItem: state.cartRemoveItem,
    userInfo: state.userInfo,
  }));

  const updateCartHandler = (
    cartItem: CartItem,
    quantity: CartItem['quantity'],
  ) => {
    console.log('Updating cart item:', cartItem);
    console.log(
      'Current stock quantity:',
      cartItem.stock,
      'Requested quantity:',
      quantity,
    );
    if (cartItem.stock < quantity) {
      ToastAndroid.show('Sorry. Product is out of stock', ToastAndroid.SHORT);
      return;
    }
    cartAddItem({...cartItem, quantity});
  };

  const checkoutHandler = () => {
    if (!userInfo) {
      navigation.navigate('SignIn', {redirect: 'ShippingAddress'});
    } else {
      navigation.navigate('ShippingAddress');
    }
  };

  const removeItemHandler = (item: CartItem) => {
    cartRemoveItem(item);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping Cart</Text>
      {cartItems.length === 0 ? (
        <MessageBox>
          Cart is empty.{' '}
          <Text onPress={() => navigation.navigate('HomePage')}>
            Go Shopping
          </Text>
        </MessageBox>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <View style={styles.listItem}>
              <Image
                source={{
                  uri:
                    'https://airneisstaticassets.onrender.com' +
                    item.image?.replace('../public', ''),
                }}
                style={styles.image}
              />
              <Text
                onPress={() =>
                  navigation.navigate('Product', {productId: item.slug})
                }>
                {item.name}
              </Text>
              {item.quantity > 1 && (
                <TouchableOpacity
                  onPress={() => updateCartHandler(item, item.quantity - 1)}
                  disabled={item.quantity === 1}>
                  <Icon name="minus" color="white" />
                </TouchableOpacity>
              )}
              <Text>{item.quantity}</Text>
              {item.quantity < item.stock && (
                <TouchableOpacity
                  onPress={() => updateCartHandler(item, item.quantity + 1)}
                  disabled={item.quantity === item.stock}>
                  <Icon name="plus" color="white" />
                </TouchableOpacity>
              )}
              <Text>£{item.price}</Text>
              <TouchableOpacity onPress={() => removeItemHandler(item)}>
                <Icon name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <TouchableOpacity
        onPress={checkoutHandler}
        disabled={cartItems.length === 0}>
        <Text>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  image: {
    width: 50,
    height: 50,
  },
});
