import {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getError} from '../utils';
import {ApiError} from '../types/APIError';
import {useGetUserByIdQuery, useUpdateUserMutation} from '../hooks/userHook';
import useStore from '../Store';
import {useGetStyles} from '../styles';

export default function ProfilePage() {
  const [userConnectedID, setUserConnectedID] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        setUserConnectedID(parsedUserInfo._id);
      }
    };
    fetchUserInfo();
  }, []);

  const {data: user, error, isLoading} = useGetUserByIdQuery(userConnectedID);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const {mutateAsync: updateProfile} = useUpdateUserMutation(userConnectedID);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phoneNumber || '');
    }
  }, [user]);

  const userSignOut = useStore(state => state.userSignOut);
  const {styles} = useGetStyles();

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }
  if (error) {
    return <Text style={styles.error}>Error fetching one user</Text>;
  }

  const submitHandler = async () => {
    try {
      await updateProfile({
        name: name,
        email: email,
        phoneNumber: phoneNumber,
      });

      ToastAndroid.show('Profile updated', ToastAndroid.SHORT);
    } catch (err) {
      console.log(err);
      ToastAndroid.show(getError(err as ApiError), ToastAndroid.SHORT);
    }
  };

  const signOutHandler = () => {
    userSignOut();
    ToastAndroid.show('Signed out successfully', ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        onChangeText={setPhoneNumber}
        value={phoneNumber}
      />
      <Button onPress={submitHandler} title="Update" color="#005eb8" />
      <Button onPress={signOutHandler} title="Sign Out" color="#D9534F" />
    </View>
  );
}
