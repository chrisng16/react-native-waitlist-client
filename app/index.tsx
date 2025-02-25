// app/index.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const [storeLoginId, setStoreLoginId] = useState('');
    const [passcode, setPasscode] = useState('');

    const verifyPasscode = async (storeLoginId: string, passcode: string) => {
        try {
            const response = await fetch('http://10.0.2.2:3000/api/v1/verify-passcode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ store_login_id: storeLoginId, passcode }),
            });

            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('Verification error:', error);
            return false;
        }
    };

    const handleLogin = async () => {
        const isCredentialsValid = await verifyPasscode(storeLoginId, passcode);

        if (isCredentialsValid) {
            router.push(`/waitlist?storeLoginId=${storeLoginId}`);
        } else {
            Alert.alert('Invalid credentials', 'Please try again.');
        }
        setStoreLoginId('');
        setPasscode('');
    };

    return (
        <View className="flex-1 bg-white">
            <View className="flex w-full flex-1 justify-center p-6">
                <Image
                    source={require('../assets/splash.png')}
                    resizeMode="contain"
                    resizeMethod="resize"
                    className="h-auto w-full"
                />
                {/* <Text className="mb-4 text-center text-3xl">Login</Text> */}
                <Text>Store ID</Text>
                <TextInput
                    placeholder="Username"
                    value={storeLoginId}
                    onChangeText={setStoreLoginId}
                    className="mb-4 mt-2 rounded border border-gray-500 p-2"
                />
                <Text>Password</Text>
                <TextInput
                    placeholder="Password"
                    value={passcode}
                    onChangeText={setPasscode}
                    secureTextEntry
                    className="mb-4 mt-2 rounded border border-gray-500 p-2"
                />
                <TouchableOpacity onPress={handleLogin} className="rounded bg-red-500 py-3">
                    <Text className="text-center font-semibold text-[#ececec]">Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
