import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';
import {useGetOrderHistoryQuery} from '../hooks/orderHook';
import {ApiError} from '../types/APIError';
import {getError} from '../utils';
import {useState} from 'react';
import {useGetStyles} from '../styles';

export default function OrderHistoryPage() {
  const {styles} = useGetStyles();
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'OrderHistory'>>();
  const {data: Orders, isLoading, error} = useGetOrderHistoryQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const totalOrders = Orders?.length;
  const totalPages = Math.ceil(totalOrders! / ordersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let number = 1; number <= totalPages; number++) {
    pageNumbers.push(number);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = Orders?.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text style={styles.error}>
          {getError(error as unknown as ApiError)}
        </Text>
      ) : (
        <>
          <FlatList
            data={currentOrders}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <View style={[styles.card, {padding: 15, marginVertical: 15}]}>
                <Text style={[styles.cardTitle, {marginBottom: 5}]}>
                  Order ID: {item._id}
                </Text>
                <Text style={styles.cardText}>
                  Date: {item.createdAt ? formatDate(item.createdAt) : 'N/A'}
                </Text>
                <Text style={[styles.cardText, {fontWeight: 'bold'}]}>
                  Total: £{item.totalPrice.toFixed(2)}
                </Text>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  {item.orderItems.slice(0, 3).map((orderItem, index) => (
                    <Image
                      key={index}
                      source={{
                        uri:
                          'https://airneisstaticassets.onrender.com' +
                          orderItem.image,
                      }}
                      style={[
                        styles.image,
                        {width: 60, height: 60, marginRight: 5},
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.cardText}>
                  Paid:{' '}
                  {item.isPaid
                    ? item.paidAt
                      ? formatDate(item.paidAt instanceof Date ? item.paidAt.toISOString() : item.paidAt)
                      : 'N/A'
                    : 'No'}
                </Text>
                <Text style={styles.cardText}>
                  Delivered:{' '}
                  {item.isDelivered
                    ? item.deliveredAt
                      ? formatDate(item.deliveredAt instanceof Date ? item.deliveredAt.toISOString() : item.deliveredAt)
                      : 'N/A'
                    : 'No'}
                </Text>
                <TouchableOpacity
                  style={[styles.button, {marginTop: 10}]}
                  onPress={() => {
                    navigation.navigate('Order', {orderId: item._id});
                  }}>
                  <Text style={styles.buttonText}>Details</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.pagination}>
            {pageNumbers.map(number => (
              <TouchableOpacity
                key={number}
                style={styles.pageItem}
                onPress={() => paginate(number)}>
                <Text style={styles.pageText}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
}
