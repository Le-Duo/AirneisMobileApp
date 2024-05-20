import {Text, FlatList, Image, View} from 'react-native';
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
import {useGetStyles} from '../styles';
import {useGetCategoryDetailsBySlugQuery} from '../hooks/categoryHook';

interface RouteParams {
  category?: string;
}

type RootStackParamList = {
  Product: {slug: string};
};

export default function ProductsPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<{params: RouteParams}, 'params'>>();
  const categorySlug = route.params?.category;
  const styles = useGetStyles();
  const {data: categoryDetails} =
    useGetCategoryDetailsBySlugQuery(categorySlug);

  const {
    data: products,
    error,
    isLoading,
  } = useSearchProducts({
    categories: categorySlug ? [categorySlug] : undefined,
  });

  if (isLoading) {
    return <LoadingBox />;
  } else if (error) {
    return <MessageBox variant="danger">{getError(error as any)}</MessageBox>;
  } else {
    return (
      <>
        <Image
          source={{
            uri:
              'https://airneisstaticassets.onrender.com' +
              categoryDetails.urlImage,
          }}
          style={styles.image}
        />
        <Text style={styles.imageTitle}>{categoryDetails?.name}</Text>
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
      </>
    );
  }
}
