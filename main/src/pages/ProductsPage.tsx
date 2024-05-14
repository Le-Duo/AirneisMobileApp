import {View, Text, FlatList} from 'react-native';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import ProductItem from '../components/ProductItem';
import {useSearchProducts} from '../hooks/searchHook';
import {getError} from '../utils';
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from '@react-navigation/native';

interface RouteParams {
  category?: string;
}

type RootStackParamList = {
  Product: {slug: string};
};

export default function ProductsPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<{params: RouteParams}, 'params'>>();
  const category = route.params?.category;

  // Use useSearchProducts when category is present
  const {
    data: products,
    error,
    isLoading,
  } = useSearchProducts({
    categories: category ? [category] : undefined,
  });

  if (isLoading) {
    return <LoadingBox />;
  } else if (error) {
    return (
      <MessageBox variant="danger">
        {getError(error as any)}{' '}
        {/* Adjusted as per instructions, assuming getError can handle generic Error types */}
      </MessageBox>
    );
  } else {
    return (
      <View style={{flex: 1, padding: 10}}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginVertical: 10,
          }}>
          {category}
        </Text>
        <FlatList
          data={products}
          renderItem={({item}) => (
            <ProductItem
              product={item}
              stockQuantity={item.quantity}
              onPress={() => navigation.navigate('Product', {slug: item.slug})}
            />
          )}
          keyExtractor={item => item.slug}
        />
      </View>
    );
  }
}
