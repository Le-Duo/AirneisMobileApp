import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { CreditCard } from "../types/CreditCard";
import {
  useGetUserByIdQuery,
} from "../hooks/userHook";
import { RootStackParamList } from "../../App";
import useStore from "../Store";
import { useGetStyles } from "../styles";

type PaymentMethodState = Pick<
  CreditCard,
  "bankName" | "number" | "fullName"
> & {
  _id?: string;  // Add this line
  monthExpiration: number | null;
  yearExpiration: number | null;
};

export default function PaymentMethodPage() {
  const currentMonth = new Date().getMonth() + 1; // getMonth() is zero-indexed, add 1 for current month
  const currentYear = new Date().getFullYear();

  const [paymentMethodDetails, setPaymentMethodDetails] = useState<PaymentMethodState>({
    bankName: "",
    number: "",
    fullName: "",
    monthExpiration: currentMonth,
    yearExpiration: currentYear,
  });

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { cart, userInfo, savePaymentMethod } = useStore((state) => ({
    cart: state.cart,
    userInfo: state.userInfo,
    savePaymentMethod: state.savePaymentMethod,
  }));
  const { shippingAddress, paymentMethod } = cart;

  useEffect(() => {
    if (!shippingAddress.street) {
      navigation.navigate("ShippingAddress");
    }
  }, [shippingAddress, navigation]);

  const userConnectedID = userInfo ? userInfo._id : null;

  const {
    data: user,
    error,
    isLoading,
  } = useGetUserByIdQuery(userConnectedID ?? "");
  const [cards, setCards] = useState<CreditCard[]>([]);

  useEffect(() => {
    if (user && user.paymentCards) {
      setCards(user.paymentCards);
    }
  }, [user]);

  const handleInputChange = (name: string, value: string) => {
    setPaymentMethodDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const submitHandler = () => {
    savePaymentMethod(JSON.stringify(paymentMethodDetails));
    navigation.navigate("PlaceOrder");
  };

  const { styles, mode } = useGetStyles();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error fetching user data</Text>;

  return (
    <View style={styles.container}>
      <ScrollView>
        {cards.map((card) => (
          <TouchableOpacity
            key={card._id}
            style={[
              styles.card,
              card._id === paymentMethodDetails._id ? styles.activeCard : null,
            ]}
            onPress={() => setPaymentMethodDetails(card)}
          >
            <Text style={styles.text}>
              {card.bankName} - {card.number}
            </Text>
            <Text style={styles.text}>{card.fullName}</Text>
            <Text style={styles.text}>
              {card.monthExpiration}/{card.yearExpiration}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        value={paymentMethodDetails.fullName}
        onChangeText={(text) => handleInputChange("fullName", text)}
        placeholder="Full Name"
        placeholderTextColor={mode === 'dark' ? 'gray' : '#999'}
      />
      <TextInput
        style={styles.input}
        value={paymentMethodDetails.bankName}
        onChangeText={(text) => handleInputChange("bankName", text)}
        placeholder="Bank Name"
        placeholderTextColor={mode === 'dark' ? 'gray' : '#999'}
      />
      <TextInput
        style={styles.input}
        value={paymentMethodDetails.number}
        onChangeText={(text) => handleInputChange("number", text)}
        placeholder="Card Number"
        placeholderTextColor={mode === 'dark' ? 'gray' : '#999'}
      />
      <TextInput
        style={styles.input}
        value={`${paymentMethodDetails.monthExpiration}`}
        onChangeText={(text) => handleInputChange("monthExpiration", text)}
        placeholder="Month Expiration"
        placeholderTextColor={mode === 'dark' ? 'gray' : '#999'}
        keyboardType="number-pad"
      />
      <TextInput
        style={styles.input}
        value={`${paymentMethodDetails.yearExpiration}`}
        onChangeText={(text) => handleInputChange("yearExpiration", text)}
        placeholder="Year Expiration"
        placeholderTextColor={mode === 'dark' ? 'gray' : '#999'}
        keyboardType="number-pad"
      />
      <Button title="Continue" onPress={submitHandler} />
    </View>
  );
}
