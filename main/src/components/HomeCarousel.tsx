import React, { useContext, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel-v4';
import { Store } from '../Store';
import { useGetCarouselItemsQuery } from '../hooks/carouselHook';

const { width: screenWidth } = Dimensions.get('window');

const HomeCarousel = () => {
  const { state: { mode } } = useContext(Store);
  const { data: items, isLoading, error } = useGetCarouselItemsQuery();
  const [activeSlide, setActiveSlide] = useState(0);

  const renderItem = ({ item }: { item: { src: string; caption: string } }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: "https://airneisstaticassets.onrender.com" + item.src }} style={styles.image} />
      <Text style={styles.captionText}>{item.caption}</Text>
    </View>
  );

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

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
        onSnapToItem={(index) => setActiveSlide(index)}
        autoplay={true}
        autoplayInterval={5000}
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
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  captionText: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
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
  inactiveDotStyle: {
  },
});

export default HomeCarousel;