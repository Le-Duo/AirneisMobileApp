import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {Store} from '../Store';
import {useUserSignupMutation} from '../hooks/userHook';
import {ApiError} from '../types/APIError';
import {getError} from '../utils';
import {toast} from 'react-toastify';

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

  const {state, dispatch} = useContext(Store);
  const {userInfo} = state;

  useEffect(() => {
    if (userInfo) {
      navigation.navigate('HomePage');
    }
  }, [userInfo, navigation]);

  const {mutateAsync: signup} = useUserSignupMutation();

  const submitHandler = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setIsLoading(true);
      const data = await signup({name, email, password});
      dispatch({type: 'USER_SIGNIN', payload: data});
      navigation.navigate('HomePage');
    } catch (err) {
      toast.error(getError(err as ApiError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 20}}>
        Sign Up
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          marginBottom: 20,
          padding: 10,
        }}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          marginBottom: 20,
          padding: 10,
        }}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          marginBottom: 20,
          padding: 10,
        }}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          marginBottom: 20,
          padding: 10,
        }}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
      />
      <TouchableOpacity
        onPress={submitHandler}
        style={{
          backgroundColor: 'blue',
          padding: 10,
          alignItems: 'center',
          borderRadius: 5,
        }}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{color: '#fff'}}>Sign Up</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
