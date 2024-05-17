import { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { CreditCard } from "../types/CreditCard";
import { useGetUserByIdQuery, useAddPaymentCardMutation } from "../hooks/userHook";
import { RootStackParamList } from "../../App";
import useStore from "../Store";

type PaymentMethodState = Pick<CreditCard, 'bankName' | 'number' | 'fullName' | 'monthExpiration' | 'yearExpiration'>;

export default function PaymentMethodPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { cart, userInfo, savePaymentMethod } = useStore(state => ({
    cart: state.cart,
    userInfo: state.userInfo,
    savePaymentMethod: state.savePaymentMethod
  }));
  const { shippingAddress, paymentMethod } = cart;
  const [paymentMethodName, setPaymentMethodName] = useState<PaymentMethodState | string>(paymentMethod || "Card");

  useEffect(() => {
    if (!shippingAddress.street) {
      navigation.navigate('ShippingAddress');
    }
  }, [shippingAddress, navigation]);

  const userConnectedID = userInfo ? userInfo._id : null;

  const { data: user, error, isLoading } = useGetUserByIdQuery(userConnectedID ?? '');
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [defaultUserCard, setDefaultUserCard] = useState<CreditCard | undefined>();

  useEffect(() => {
    if (user && user.paymentCards) {
      setCards(user.paymentCards);
    }
  }, [user]);

  useEffect(() => {
    if (cards.length > 0) {
      const defaultCard = cards.find((card) => card.isDefault === true);
      if (defaultCard) {
        setDefaultUserCard(defaultCard);
      }
    }
  }, [cards]);

  useEffect(() => {
    if (defaultUserCard) {
      setPaymentMethodName({
        bankName: defaultUserCard.bankName,
        number: defaultUserCard.number,
        fullName: defaultUserCard.fullName,
        monthExpiration: defaultUserCard.monthExpiration,
        yearExpiration: defaultUserCard.yearExpiration,
      });
    }
  }, [defaultUserCard]);

  const submitHandler = () => {
    if (typeof paymentMethodName === 'string') {
      savePaymentMethod(paymentMethodName);
    } else {
      savePaymentMethod(JSON.stringify(paymentMethodName));
    }
    navigation.navigate("PlaceOrder");
  };

  const handleCardClick = (card: CreditCard) => {
    setPaymentMethodName({
      bankName: card.bankName,
      number: card.number,
      fullName: card.fullName,
      monthExpiration: card.monthExpiration,
      yearExpiration: card.yearExpiration,
    });
  };

  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [newCardExpirationMonth, setNewCardExpirationMonth] = useState('');
  const [newCardExpirationYear, setNewCardExpirationYear] = useState('');

  const addPaymentCardMutation = useAddPaymentCardMutation(userConnectedID?? '');

  const handleAddCard = () => {
    const newCardDetails = {
      bankName: newCardName,
      number: newCardNumber,
      fullName: newCardName,
      monthExpiration: parseInt(newCardExpirationMonth),
      yearExpiration: parseInt(newCardExpirationYear)
    };
    addPaymentCardMutation.mutate(newCardDetails);
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error fetching user data</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>
      <ScrollView>
        {cards.map((card) => (
          <TouchableOpacity 
            key={card._id} 
            style={[styles.card, defaultUserCard && defaultUserCard._id === card._id ? styles.activeCard : null]}
            onPress={() => handleCardClick(card)}
          >
            <Text style={styles.cardDetails}>{card.bankName} - {card.number}</Text>
            <Text style={styles.cardDetails}>{card.fullName}</Text>
            <Text style={styles.cardDetails}>{card.monthExpiration}/{card.yearExpiration}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Card Number"
          value={newCardNumber}
          onChangeText={(text) => setNewCardNumber(text.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Card Name"
          value={newCardName}
          onChangeText={setNewCardName}
        />
        <TextInput
          style={styles.input}
          placeholder="Expiration Month"
          value={newCardExpirationMonth}
          onChangeText={setNewCardExpirationMonth}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Expiration Year"
          value={newCardExpirationYear}
          onChangeText={setNewCardExpirationYear}
          keyboardType="numeric"
        />
        <Button title="Add Card" onPress={handleAddCard} />
      </View>
      <Button title="Continue" onPress={submitHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  activeCard: {
    borderColor: '#5C67F2',
    borderWidth: 2,
  },
  cardDetails: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
