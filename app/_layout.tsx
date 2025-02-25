// app/_layout.tsx
import { Stack } from 'expo-router';
import { Image, View } from 'react-native';

function LogoTitle() {
    return (
        <View className="flex w-full items-center justify-center">
            <Image
                source={require('../assets/splash.png')}
                resizeMode="center"
                resizeMethod="resize"
            />
        </View>
    );
}

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="waitlist" options={{ headerShown: false }} />
        </Stack>
    );
}
