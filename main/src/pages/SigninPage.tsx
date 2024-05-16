import {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useStore} from 'zustand';
import store from '../Store';
import {useUserSigninMutation} from '../hooks/userHook';
import {ApiError} from '../types/APIError';
import {getError} from '../utils';

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

  const {userInfo, userSignIn} = useStore(store, state => ({
    userInfo: state.userInfo,
    userSignIn: state.userSignIn,
  }));

  const {mutateAsync: signin} = useUserSigninMutation();

  useEffect(() => {
    if (userInfo) {
      navigation.navigate('HomePage');
    }
  }, [userInfo, navigation]);

  const submitHandler = async () => {
    try {
      setIsLoading(true);
      const data = await signin({email, password});
      userSignIn(data);
      navigation.navigate('HomePage');
    } catch (err) {
      ToastAndroid.show(getError(err as ApiError), ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
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
    </View>
  );
}
