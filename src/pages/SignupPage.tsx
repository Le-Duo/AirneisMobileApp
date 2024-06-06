import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useStore} from 'zustand';
import store from '../Store';
import {useUserSignupMutation} from '../hooks/userHook';
import {ApiError} from '../types/APIError';
import {getError} from '../utils';
import {toast} from 'react-toastify';
import {useGetStyles} from '../styles';

type RootStackParamList = {
  HomePage: undefined;
  Product: {slug: string};
  SignIn: {redirect: string};
};

export default function SignupPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {userInfo, userSignIn} = useStore(store, state => ({
    userInfo: state.userInfo,
    userSignIn: state.userSignIn,
  }));

  useEffect(() => {
    if (userInfo) {
      navigation.navigate('HomePage');
    }
  }, [userInfo, navigation]);

  const {mutateAsync: signup} = useUserSignupMutation();
  const {styles} = useGetStyles();

  const submitHandler = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setIsLoading(true);
      const data = await signup({name, email, password});
      userSignIn(data);
      navigation.navigate('HomePage');
    } catch (err) {
      const errorMessage = (err as ApiError).response?.data?.message || getError(err as ApiError);
      toast.error(errorMessage || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={styles.text.color}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={styles.text.color}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholderTextColor={styles.text.color}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          placeholderTextColor={styles.text.color}
        />
        <TouchableOpacity
          onPress={submitHandler}
          style={[styles.button, isLoading && styles.buttonDisabled]}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
