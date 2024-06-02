import React, {useState, useEffect} from 'react';
import {usePasswordResetRequestMutation} from '../hooks/userHook';
import {
  Button,
  TextInput,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';

type RootStackParamList = {
  HomePage: undefined;
  Product: {slug: string};
  SignIn: {redirect: string};
};

const PasswordResetRequest = () => {
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const {mutate, isError, isSuccess, error} = usePasswordResetRequestMutation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const validateEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleEmailChange = (email: string): void => {
    setEmail(email);
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (): void => {
    setLoading(true);
    mutate(email, {
      onSuccess: () => {
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    if (isError && error) {
      Alert.alert(
        'Error',
        `Failed to send reset link: ${error.message}. Please try again.`,
      );
    }
    if (isSuccess) {
      Alert.alert(
        'Success',
        'Check your email for the reset link. You will be redirected to the sign-in page shortly.',
      );
      setTimeout(() => {
        navigation.navigate('SignIn', {redirect: 'HomePage'});
      }, 5000);
    }
  }, [isError, isSuccess, error, navigation]);

  return (
    <View>
      <Text>Email Address</Text>
      <TextInput
        style={{height: 40, borderColor: '#005eb8', borderWidth: 1}}
        onChangeText={handleEmailChange}
        value={email}
        placeholder="Enter your email"
        keyboardType="email-address"
        editable={!loading}
      />
      {emailError ? <Text style={{color: 'red'}}>{emailError}</Text> : null}
      <Button
        onPress={handleSubmit}
        title={loading ? 'Loading...' : 'Send Reset Link'}
        disabled={loading}
      />
      {loading && <ActivityIndicator size="small" color="#2125290ff" />}
    </View>
  );
};

export default PasswordResetRequest;
