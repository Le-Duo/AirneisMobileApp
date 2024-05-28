import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useStore} from 'zustand';
import store from '../Store';
import {CartItem} from '../types/Cart';
import MessageBox from '../components/MessageBox';
import Icon from 'react-native-vector-icons/FontAwesome';
import {RootStackParamList} from '../../App';
import { formatImageUrl } from '../utils';
import { useGetStyles } from '../styles';
import { Table, Row, Rows } from 'react-native-table-component';

export default function CartPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const {styles} = useGetStyles();

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

  const tableHead = ['Product', 'Name', 'Quantity', 'Price', 'Remove'];
  const tableData = cartItems.map((item) => [
    <TouchableOpacity onPress={() => navigation.navigate('Product', {slug: item.slug})}>
      <Image source={{ uri: formatImageUrl(item.image ?? '') }} style={styles.cartImage} />
    </TouchableOpacity>,
    <Text style={styles.text}>{item.name}</Text>,
    <View style={styles.quantityControls}>
      <TouchableOpacity onPress={() => updateCartHandler(item, item.quantity - 1)} disabled={item.quantity === 1}>
        <Icon name="minus" style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.text}>{item.quantity}</Text>
      <TouchableOpacity onPress={() => updateCartHandler(item, item.quantity + 1)} disabled={item.quantity === item.stock}>
        <Icon name="plus" style={styles.icon} />
      </TouchableOpacity>
    </View>,
    <Text style={styles.text}>£{item.price}</Text>,
    <TouchableOpacity onPress={() => removeItemHandler(item)}>
      <Icon name="trash" size={24} style={styles.icon} />
    </TouchableOpacity>
  ]);

  return (
    <View style={styles.cartContainer}>
      <Text style={styles.cartHeader}>Shopping Cart</Text>
      {cartItems.length === 0 ? (
        <MessageBox>
          Cart is empty.{' '}
          <Text onPress={() => navigation.navigate('HomePage')}>
            Go Shopping
          </Text>
        </MessageBox>
      ) : (
        <ScrollView style={styles.scrollView}>
          <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
            <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
            <Rows data={tableData} textStyle={styles.text}/>
          </Table>
        </ScrollView>
      )}
      <TouchableOpacity
        onPress={checkoutHandler}
        disabled={cartItems.length === 0}
        style={styles.addToCartButton}>
        <Text style={styles.buttonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}

