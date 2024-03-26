import { useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native';

function useScrollToTop(ref: React.RefObject<ScrollView>) {
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      ref.current?.scrollTo({ x: 0, y: 0, animated: true });
    });

    return unsubscribe;
  }, [navigation, route]);
}

export default useScrollToTop;