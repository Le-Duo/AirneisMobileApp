import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import useStore from '../Store';
import {useEffect, useState} from 'react';
import {useCreateOrderMutation} from '../hooks/orderHook';
import LoadingBox from '../components/LoadingBox';
import {RootStackParamList} from '../../App';
import {useGetStyles} from '../styles';

export default function PlaceOrderPage() {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, 'PlaceOrder'>>();
  const {cart, userInfo, dispatch} = useStore(state => ({
    cart: state.cart,
    userInfo: state.userInfo,
    dispatch: state.cartClear,
  }));
  const {styles} = useGetStyles();

  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100;

  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0),
  );
  cart.shippingPrice =
    cart.itemsPrice < 400
      ? round2(39)
      : cart.itemsPrice <= 1000
      ? round2(59)
      : round2(109);
  cart.taxPrice = round2(0.2 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const {mutateAsync: createOrder} = useCreateOrderMutation();
  const [isLoading, setIsLoading] = useState(false);

  const placeOrderHandler = async () => {
    try {
      setIsLoading(true);
      const data = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: {
          user: userInfo?._id || '',
          fullName: cart.shippingAddress.fullName,
          street: cart.shippingAddress.street,
          city: cart.shippingAddress.city,
          postalCode: cart.shippingAddress.postalCode,
          country: cart.shippingAddress.country,
          phoneNumber: cart.shippingAddress.phoneNumber,
        },
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        user: userInfo?._id || '',
        isPaid: false,
        isDelivered: false,
      });
      console.log(data);
      if (data && data._id) {
        dispatch();
        navigation.navigate('Order', {orderId: data._id});
      } else {
        console.error('Unexpected response structure from order creation API.');
      }
    } catch (err) {
      console.error('Error processing order:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigation.navigate('Payment');
    }
  }, [cart, navigation]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Preview Order</Text>
      <View style={styles.card}>
        <Text style={styles.title}>Shipping</Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Name:</Text> {cart.shippingAddress.fullName}
          {'\n'}
          <Text style={styles.bold}>Address:</Text>{' '}
          {cart.shippingAddress.street}, {cart.shippingAddress.city},{' '}
          {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('ShippingAddress')}
          style={styles.button}
        >
          <Text>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Payment</Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Method:</Text> {cart.paymentMethod}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Payment')}
          style={styles.button}
        >
          <Text>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Items</Text>
        {cart.cartItems.map(item => (
          <View key={item._id} style={styles.item}>
            <Text style={styles.text}>
              {item.name} x {item.quantity} - £{item.price}
            </Text>
          </View>
        ))}
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          style={styles.button}
        >
          <Text>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <Text style={styles.text}>Items: £{cart.itemsPrice.toFixed(2)}</Text>
        <Text style={styles.text}>
          Shipping: £{cart.shippingPrice.toFixed(2)}
        </Text>
        <Text style={styles.text}>Tax: £{cart.taxPrice.toFixed(2)}</Text>
        <Text style={styles.text}>Total: £{cart.totalPrice.toFixed(2)}</Text>
        <TouchableOpacity
          onPress={placeOrderHandler}
          disabled={cart.cartItems.length === 0 || isLoading}
          style={styles.button}
        >
          <Text>Place Order</Text>
        </TouchableOpacity>
        {isLoading && <LoadingBox />}
      </View>
    </ScrollView>
  );
}