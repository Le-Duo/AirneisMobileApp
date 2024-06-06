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
import {useGetStyles} from '../styles';

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
  const {styles} = useGetStyles();

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
    <View style={styles.container}>
      <Text style={styles.title}>Email Address</Text>
      <TextInput
        style={styles.input}
        onChangeText={handleEmailChange}
        value={email}
        placeholder="Enter your email"
        keyboardType="email-address"
        editable={!loading}
        placeholderTextColor={styles.text.color}
      />
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      <Button
        onPress={handleSubmit}
        title={loading ? 'Loading...' : 'Send Reset Link'}
        disabled={loading}
        color={styles.button.backgroundColor}
      />
      {loading && <ActivityIndicator size="small" color={styles.text.color} />}
    </View>
  );
};

export default PasswordResetRequest;
