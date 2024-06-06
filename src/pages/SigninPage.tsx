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
import {useGetStyles} from '../styles';

type RootStackParamList = {
  HomePage: undefined;
  Product: {slug: string};
  SignIn: {redirect: string};
  SignUp: undefined;
  PasswordResetRequest: undefined;
};

type BottomTabParamList = {
  Home: undefined;
  Cart: undefined;
  Profile: undefined;
  Settings: undefined;
};

export default function SigninPage() {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList & BottomTabParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {userInfo, userSignIn} = useStore(store, state => ({
    userInfo: state.userInfo,
    userSignIn: state.userSignIn,
  }));

  const {mutateAsync: signin} = useUserSigninMutation();
  const {styles} = useGetStyles();

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  useEffect(() => {
    if (userInfo) {
      navigateToHome();
    }
  }, [userInfo, navigateToHome]);

  const submitHandler = async () => {
    try {
      setIsLoading(true);
      const data = await signin({email, password});
      userSignIn(data);
      navigateToHome();
    } catch (err) {
      ToastAndroid.show(getError(err as ApiError), ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
        secureTextEntry={!showPassword}
        placeholderTextColor={styles.text.color}
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={styles.text}>Show Password</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={submitHandler}
        style={[styles.button, isLoading && styles.buttonDisabled]}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('PasswordResetRequest')}>
        <Text style={styles.text}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.text}>New customer? Create your account</Text>
      </TouchableOpacity>
    </View>
  );
}
