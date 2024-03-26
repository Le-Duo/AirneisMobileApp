import React, { useContext } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Store } from '../Store';
import { useGetCarouselItemsQuery } from '../hooks/carouselHook';

const { width: screenWidth } = Dimensions.get('window');

const HomeCarousel = () => {
  const { state: { mode } } = useContext(Store);
  const { data: items, isLoading, error } = useGetCarouselItemsQuery();

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
    <Carousel
      data={items}
      renderItem={renderItem}
      sliderWidth={screenWidth}
      itemWidth={screenWidth - 60} // Adjust item width as needed
      layout={'default'} // You can explore 'stack' and 'tinder' layouts as well
    />
  );
};

const styles = StyleSheet.create({
  carouselItem: {
    width: screenWidth - 60, // Adjust width as needed
    height: 200, // Adjust height as needed
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
});

export default HomeCarousel;
