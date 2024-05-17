import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useGetOrderDetailsQuery } from '../hooks/orderHook';
import { ApiError } from '../types/APIError';
import { getError } from '../utils';
import useStore from '../Store';
import { RootStackParamList } from '../../App';

export default function OrderPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'Order'>>();
  const params = navigation.getState().routes[navigation.getState().index].params as { orderId: string };
  const { orderId } = params;
  const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  if (isLoading) {
    return <LoadingBox />;
  }
  if (error) {
    return <MessageBox variant="danger">{getError(error as unknown as ApiError)}</MessageBox>;
  }
  if (!order) {
    return <MessageBox variant="danger">Order Not Found</MessageBox>;
  }

  return (
    <ScrollView>
      <Text style={styles.header}>Order {orderId}</Text>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Shipping</Text>
          <Text>
            <Text style={styles.bold}>Name:</Text> {order.shippingAddress.fullName}{'\n'}
            <Text style={styles.bold}>Phone Number:</Text> {order.shippingAddress.phoneNumber}{'\n'}
            <Text style={styles.bold}>Address:</Text> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </Text>
          {order.isDelivered ? (
            <MessageBox variant="success">
            Delivered at {order.deliveredAt ? formatDate(order.deliveredAt.toString()) : 'Date Unknown'}
          </MessageBox>
          ) : (
            <MessageBox variant="warning">Not Delivered</MessageBox>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment</Text>
          <Text>
            <Text style={styles.bold}>Method:</Text> {order.paymentMethod}
          </Text>
          {order.isPaid ? (
            <MessageBox variant="success">
              Paid at {order.paidAt ? formatDate(order.paidAt.toString()) : 'Date Unknown'}
            </MessageBox>
          ) : (
            <MessageBox variant="warning">Not Paid</MessageBox>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items</Text>
          {order.orderItems.map((item) => (
            <TouchableOpacity key={item._id} onPress={() => navigation.navigate('Product', { productId: item.slug })}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text>{item.name}</Text>
              <Text>{item.quantity}</Text>
              <Text>£{item.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    marginVertical: 10,
    textAlign: 'center',
  },
  container: {
    padding: 10,
  },
  card: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});
