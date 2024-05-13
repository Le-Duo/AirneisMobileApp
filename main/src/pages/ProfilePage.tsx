import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator,ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getError } from '../utils';
import { ApiError } from '../types/APIError';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../hooks/userHook';

export default function ProfilePage() {
    const [userInfo, setUserInfo] = useState(null);
    const [userConnectedID, setUserConnectedID] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            const userInfo = await AsyncStorage.getItem('userInfo');
            if (userInfo) {
                const parsedUserInfo = JSON.parse(userInfo);
                setUserConnectedID(parsedUserInfo._id);
                setUserInfo(parsedUserInfo);
            }
        };
        fetchUserInfo();
    }, []);

    const { data: user, error, isLoading } = useGetUserByIdQuery(userConnectedID);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const formRef = useRef(null);
    const { mutateAsync: updateProfile } = useUpdateUserMutation(userConnectedID);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPhoneNumber(user.phoneNumber || '');
        }
    }, [user]);

    if (isLoading) return <ActivityIndicator size="large" />;
    if (error) return <Text>Error fetching one user</Text>;

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

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Profile</Text>
            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    marginBottom: 20,
                    padding: 10,
                }}
                placeholder='Name'
                onChangeText={setName}
                value={name}
            />
            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    marginBottom: 20,
                    padding: 10,
                }}
                placeholder='Email'
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    marginBottom: 20,
                    padding: 10,
                }}
                placeholder='Phone Number'
                onChangeText={setPhoneNumber}
                value={phoneNumber}
            />
            <Button
                onPress={submitHandler}
                title='Update'
                color="#841584"
            />
        </View>
    );
}

