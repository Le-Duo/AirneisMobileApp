import {Text, Image, View} from 'react-native';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import ProductItem from '../components/ProductItem';
import {useSearchProductsAndStock} from '../hooks/searchHook';
import {getError, formatImageUrl} from '../utils';
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from '@react-navigation/native';
import {useGetStyles} from '../styles';
import {useGetCategoryDetailsBySlugQuery} from '../hooks/categoryHook';
import {ScrollView} from 'react-native-gesture-handler';

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
  const {styles} = useGetStyles();
  const {data: categoryDetails} = useGetCategoryDetailsBySlugQuery(
    categorySlug?.toString() || '',
  );

  const {
    data,
    error,
    isLoading,
  } = useSearchProductsAndStock({
    categories: categorySlug ? [categorySlug] : undefined,
  });

  const [products] = data || [];

  console.log("Category Slug:", categorySlug);
  console.log("Category Details:", categoryDetails);
  console.log("Error:", error);

  if (isLoading) {
    return <LoadingBox />;
  } else if (error) {
    return <MessageBox variant="danger">{getError(error as any)}</MessageBox>;
  } else {
    const imageUrl = formatImageUrl(categoryDetails?.urlImage || '');
    return (
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image source={{uri: imageUrl}} style={styles.categoryImage} />
          <Text style={styles.imageTitle}>{categoryDetails?.name}</Text>
        </View>
        <Text style={[styles.text, {padding: 10}]}>
          {categoryDetails?.description}
        </Text>
        <View>
          {products?.map(item  => (
            <ProductItem
              key={item.slug}
              product={item}
              stockQuantity={item.quantity}
              onPress={() => navigation.navigate('Product', {slug: item.slug})}
            />
          ))}
        </View>
      </ScrollView>
    );
  }
}
