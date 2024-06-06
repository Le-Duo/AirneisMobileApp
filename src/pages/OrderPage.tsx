import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {useGetOrderDetailsQuery} from '../hooks/orderHook';
import {ApiError} from '../types/APIError';
import {getError, formatImageUrl} from '../utils';
import {RootStackParamList} from '../../App';
import {useGetStyles} from '../styles';

export default function OrderPage() {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, 'Order'>>();
  const params = navigation.getState().routes[navigation.getState().index]
    .params as {orderId: string};
  const {orderId} = params;
  const {data: order, isLoading, error} = useGetOrderDetailsQuery(orderId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const {styles} = useGetStyles(); // Using styles from useGetStyles

  if (isLoading) {
    return <LoadingBox />;
  }
  if (error) {
    return (
      <MessageBox variant="danger">
        {getError(error as unknown as ApiError)}
      </MessageBox>
    );
  }
  if (!order) {
    return <MessageBox variant="danger">Order Not Found</MessageBox>;
  }

  return (
    <ScrollView>
      <Text style={styles.title}>Order {orderId}</Text>
      <View style={styles.container}>
        <View style={styles.orderCard}>
          <Text style={styles.cardTitle}>Shipping</Text>
          <Text>
            <Text style={styles.bold}>Name:</Text>{' '}
            <Text style={styles.text}>{order.shippingAddress.fullName}</Text>
            {'\n'}
            <Text style={styles.bold}>Phone Number:</Text>{' '}
            <Text style={styles.text}>{order.shippingAddress.phoneNumber}</Text>
            {'\n'}
            <Text style={styles.bold}>Address:</Text>{' '}
            <Text style={styles.text}>
              {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </Text>
          </Text>
          {order.isDelivered ? (
            <MessageBox variant="success">
              Delivered at{' '}
              {order.deliveredAt
                ? formatDate(order.deliveredAt.toString())
                : 'Date Unknown'}
            </MessageBox>
          ) : (
            <MessageBox variant="warning">Not Delivered</MessageBox>
          )}
        </View>

        <View style={styles.orderCard}>
          <Text style={styles.cardTitle}>Payment</Text>
          {typeof order.paymentMethod === 'object' && (
            <View>
              <Text style={styles.text}>
                <Text style={styles.bold}>Method:</Text> {order.paymentMethod}
              </Text>
            </View>
          )}
          {order.isPaid ? (
            <MessageBox variant="success">
              Paid at{' '}
              {order.paidAt
                ? formatDate(order.paidAt.toString())
                : 'Date Unknown'}
            </MessageBox>
          ) : (
            <MessageBox variant="warning">Not Paid</MessageBox>
          )}
        </View>

        <View style={styles.orderCard}>
          <Text style={styles.cardTitle}>Items</Text>
          {order.orderItems.map(item => (
            <TouchableOpacity
              key={item._id}
              onPress={() =>
                navigation.navigate('Product', {slug: item.slug})
              }>
              <Image
                source={{
                  uri: formatImageUrl(item.image ?? ''),
                }}
                style={styles.image}
              />
              <Text style={styles.text}>{item.name}</Text>
              <Text style={styles.text}>{item.quantity}</Text>
              <Text style={styles.text}>£{item.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
