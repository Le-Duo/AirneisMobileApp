import {useState} from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel-v4';
import {useGetCarouselItemsQuery} from '../hooks/carouselHook';

const {width: screenWidth} = Dimensions.get('window');

const HomeCarousel = () => {
  const {data: items, isLoading, error} = useGetCarouselItemsQuery();
  const [activeSlide, setActiveSlide] = useState(0);

  const renderItem = ({item}: {item: any}) => {
    const {src, caption} = item as {src: string; caption: string};
    return (
      <View style={styles.carouselItem}>
        <Image
          source={{uri: 'https://airneisstaticassets.onrender.com' + src}}
          style={styles.image}
        />
        <View style={styles.captionContainer}>
          <Text style={styles.captionText}>{caption}</Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (!items || items.length === 0) {
    return <Text>No images available</Text>;
  }

  return (
    <View>
      <Carousel
        data={items}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth - 60}
        layout={'default'}
        onSnapToItem={index => setActiveSlide(index)}
        autoplay={true}
        autoplayInterval={5000}
        vertical={false}
      />
      <Pagination
        dotsLength={items.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.paginationDot}
        inactiveDotStyle={styles.inactiveDotStyle}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselItem: {
    width: screenWidth - 60,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  captionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  captionText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'black',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
  paginationContainer: {
    marginTop: -25,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  inactiveDotStyle: {},
});

export default HomeCarousel;
