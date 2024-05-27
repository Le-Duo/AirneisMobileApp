import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type MenuItem = {
  title: string;
  screen: keyof RootStackParamList;
};

const MorePage = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const menuItems: MenuItem[] = [
    {title: 'Profile', screen: 'Profile'},
    {title: 'Orders', screen: 'OrderHistory'},
    // {title: 'Settings', screen: 'Settings'},
    // {title: 'Help', screen: 'Help'},
  ];

  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate(item.screen, {} as any);
          }}>
          <Text style={styles.menuText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menuItem: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#005eb8',
    width: '80%',
    borderRadius: 5,
  },
  menuText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MorePage;
