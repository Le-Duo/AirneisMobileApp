import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import useStore from "../Store";
import { useGetStyles } from "../styles";
import Icon from "react-native-vector-icons/FontAwesome";

type MenuItem = {
  title: string;
  screen: keyof RootStackParamList;
  icon: string;
  params?: any;
};

const MorePage = () => {
  const { styles } = useGetStyles();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { mode, switchMode, userInfo } = useStore((state) => ({
    mode: state.mode,
    switchMode: state.switchMode,
    userInfo: state.userInfo,
  }));

  const menuItems: MenuItem[] = [
    { title: "Profile", screen: "Profile", icon: "user" },
    { title: "Orders", screen: "OrderHistory", icon: "list" },
  ];

  return (
    <View style={styles.container}>
      {userInfo && menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() => {
            console.log("Navigating to:", item.screen);
            navigation.navigate(item.screen, item.params);
          }}
        >
          <Icon
            name={item.icon}
            size={20}
            color="#fff"
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('ThemeSettings')}
      >
        <Icon
          name="adjust"
          size={20}
          color="#fff"
          style={styles.menuIcon}
        />
        <Text style={styles.menuText}>Thème</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MorePage;
