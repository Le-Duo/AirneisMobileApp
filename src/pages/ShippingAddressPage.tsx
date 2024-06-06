import {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import useStore from '../Store';
import {ShippingAddress} from '../types/Cart';
import {UserAddress} from '../types/UserInfo';
import {RootStackParamList} from '../../App';
import {countries} from '../data/countries';
import {useAddAddressMutation, useGetUserByIdQuery} from '../hooks/userHook';
import {useGetStyles} from '../styles';

export default function ShippingAddressPage() {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, 'ShippingAddress'>>();
  const {userInfo, saveShippingAddress} = useStore(state => ({
    userInfo: state.userInfo,
    saveShippingAddress: state.saveShippingAddress,
  }));
  const addAddressMutation = useAddAddressMutation(userInfo?._id || '');

  const [saveAddress, setSaveAddress] = useState(false);

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [fullName, setFullName] = useState(userInfo?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phoneNumber || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const userConnectedID = userInfo ? userInfo._id : null;
  const {
    data: user,
    error,
    isLoading,
  } = useGetUserByIdQuery(userConnectedID ?? '');

  const {styles, mode} = useGetStyles();

  useEffect(() => {
    if (!userInfo) {
      navigation.navigate('SignIn', {redirect: 'Shipping'});
    }
  }, [userInfo, navigation]);

  useEffect(() => {
    if (user && user.addresses) {
      setAddresses(user.addresses);
    }
  }, [user]);

  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddr = addresses.find(
        (address: UserAddress) => address.isDefault === true,
      );
      if (defaultAddr) {
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
        country: country,
      });
    }

    saveShippingAddress(newAddress);
    await AsyncStorage.setItem('shippingAddress', JSON.stringify(newAddress));
    navigation.navigate('Payment');
  };

  const handleAddressClick = (address: UserAddress) => {
    setStreet(address.street);
    setCity(address.city);
    setPostalCode(address.postalCode);
    setCountry(address.country);
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color={mode === 'dark' ? '#fff' : '#212529'} />;
  }

  if (error) {
    Alert.alert('Error', 'Unable to load user data');
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        placeholderTextColor={styles.text.color}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholderTextColor={styles.text.color}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={street}
        onChangeText={setStreet}
        placeholderTextColor={styles.text.color}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
        placeholderTextColor={styles.text.color}
      />
      <TextInput
        style={styles.input}
        placeholder="Postal Code"
        value={postalCode}
        onChangeText={setPostalCode}
        placeholderTextColor={styles.text.color}
      />
      <Picker
        style={styles.picker}
        selectedValue={country}
        onValueChange={(itemValue, _itemIndex) => setCountry(itemValue)}>
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
      <Button title="Continue" onPress={submitHandler} color={styles.button.backgroundColor} />
      {addresses.map(address => (
        <TouchableOpacity
          key={address._id}
          onPress={() => handleAddressClick(address)}
          style={styles.addressContainer}>
          <Text style={styles.text}>
            {address.street}, {address.city}, {address.postalCode}, {address.country}
          </Text>
          {address.isDefault && <Text style={styles.text}>Default</Text>}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
