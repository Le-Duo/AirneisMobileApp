import React, {useState, useEffect} from 'react';
import {usePasswordResetMutation} from '../hooks/userHook';
import {Button, TextInput, View, Text, StyleSheet, Alert} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';

interface RouteParams {
  token: string;
}

const PasswordReset: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const token = route.params?.token;
  const [newPassword, setNewPassword] = useState<string>('');
  const {mutate, status, isError, isSuccess} = usePasswordResetMutation();

  const isLoading = status === 'pending';

  useEffect(() => {
    if (isError) {
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    }
    if (isSuccess) {
      Alert.alert('Success', 'Password reset successful.');
    }
  }, [isError, isSuccess]);

  const handleSubmit = () => {
    console.log('Token: ', token);
    console.log('New Password: ', newPassword);
    if (token) {
      mutate({token, newPassword});
    } else {
      console.error('Token is undefined.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Enter new password"
      />
      <Button
        title="Reset Password"
        onPress={handleSubmit}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
  },
});

export default PasswordReset;
