import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {Store} from '../Store';
import {useUserSigninMutation} from '../hooks/userHook';
import {ApiError} from '../types/APIError';
import {getError} from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  HomePage: undefined;
  Product: {slug: string};
  SignIn: {redirect: string};
  SignUp: undefined;
  PasswordResetRequest: undefined;
};

export default function SigninPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {state, dispatch} = useContext(Store);
  const {userInfo} = state;

  const {mutateAsync: signin} = useUserSigninMutation();

  useEffect(() => {
    console.log('Checking user info on sign-in page:', userInfo);
    if (userInfo) {
      console.log('User is signed in, navigating to HomePage');
      navigation.navigate('HomePage');
    }
  }, [userInfo, navigation]);

  const submitHandler = async () => {
    try {
      setIsLoading(true);
      const data = await signin({email, password});
      console.log('User info received from server:', data);
      dispatch({type: 'USER_SIGNIN', payload: data});
      await AsyncStorage.setItem('userInfo', JSON.stringify(data));
      console.log('User info stored in AsyncStorage:', data);
      console.log('User signed in and state updated');
      console.log('Navigating to HomePage after successful sign-in');
      navigation.navigate('HomePage');
    } catch (err) {
      console.error(err);
      ToastAndroid.show(getError(err as ApiError), ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      ToastAndroid.show('AsyncStorage Cleared', ToastAndroid.SHORT);
      dispatch({type: 'USER_SIGNOUT'});
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      ToastAndroid.show('Failed to clear AsyncStorage', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 20}}>
        Sign In
      </Text>
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
        secureTextEntry={!showPassword}
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text>Show Password</Text>
      </TouchableOpacity>
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
          <Text style={{color: '#fff'}}>Sign In</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('PasswordResetRequest')}>
        <Text style={{marginTop: 20}}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={{marginTop: 20}}>New customer? Create your account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={clearAsyncStorage}
        style={{
          backgroundColor: 'red',
          padding: 10,
          alignItems: 'center',
          borderRadius: 5,
          marginTop: 20,
        }}>
        <Text style={{color: '#fff'}}>Clear AsyncStorage</Text>
      </TouchableOpacity>
    </View>
  );
}
