import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet, Switch, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import useStore from '../Store';
import { ShippingAddress } from '../types/Cart';
import { UserAddress } from '../types/UserInfo';
import { RootStackParamList } from '../../App';
import { countries } from '../data/countries';
import { useAddAddressMutation, useGetUserByIdQuery } from '../hooks/userHook'; 

export default function ShippingAddressPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'ShippingAddress'>>();
  const { userInfo, saveShippingAddress } = useStore(state => ({
    userInfo: state.userInfo,
    saveShippingAddress: state.saveShippingAddress
  }));
  const addAddressMutation = useAddAddressMutation(userInfo?._id || ''); 

  const [saveAddress, setSaveAddress] = useState(false); 

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | undefined>();

  const [fullName, setFullName] = useState(userInfo?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phoneNumber || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const userConnectedID = userInfo ? userInfo._id : null;
  const { data: user, error, isLoading } = useGetUserByIdQuery(userConnectedID ?? '');

  useEffect(() => {
    if (!userInfo) {
      navigation.navigate('SignIn', { redirect: 'Shipping' });
    }
  }, [userInfo, navigation]);

  useEffect(() => {
    if (user && user.addresses) {
      setAddresses(user.addresses);
    }
  }, [user]);

  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddr = addresses.find((address: UserAddress) => address.isDefault === true);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
        setStreet(defaultAddr.street);
        setCity(defaultAddr.city);
        setPostalCode(defaultAddr.postalCode);
        setCountry(defaultAddr.country);
      }
    }
  }, [addresses]);

  const submitHandler = async () => {
    const newAddress: ShippingAddress = {
      fullName: fullName,
      phoneNumber: phoneNumber,
      street: street,
      city: city,
      postalCode: postalCode,
      country: country,
    };

    if (saveAddress) {
      addAddressMutation.mutate({ 
        street: street,
        city: city,
        postalCode: postalCode,
        country: country
      });
    }

    saveShippingAddress(newAddress);
    await AsyncStorage.setItem('shippingAddress', JSON.stringify(newAddress));
    navigation.navigate('Payment');
  };

  const handleAddressClick = (address: UserAddress) => {
    setSelectedAddress(address);
    setStreet(address.street);
    setCity(address.city);
    setPostalCode(address.postalCode);
    setCountry(address.country);
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    Alert.alert("Error", "Unable to load user data");
    return;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Shipping Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={street}
        onChangeText={setStreet}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="Postal Code"
        value={postalCode}
        onChangeText={setPostalCode}
      />
      <Picker
        style={styles.picker}
        selectedValue={country}
        onValueChange={(itemValue, itemIndex) => setCountry(itemValue)}
      >
        {countries.map((country, index) => (
          <Picker.Item key={index} label={country} value={country} />
        ))}
      </Picker>
      <View style={styles.switchContainer}>
        <Text style={styles.text}>Save this address:</Text>
        <Switch
          style={styles.switch}
          value={saveAddress}
          onValueChange={setSaveAddress}
        />
      </View>
      <Button title="Continue" onPress={submitHandler} color="#5C67F2" />
      {addresses.map((address) => (
        <TouchableOpacity key={address._id} onPress={() => handleAddressClick(address)} style={styles.addressContainer}>
          <Text>{address.street}, {address.city}, {address.postalCode}, {address.country}</Text>
          {address.isDefault && <Text>Default</Text>}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 20,
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  text: {
    flex: 1,
    marginRight: 10,
  },
  addressContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
});

