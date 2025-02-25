import { useRouter } from 'expo-router';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Easing,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';

const HEADER_HEIGHT = 80;

const HeaderAutoHide = ({
    children,
    storeLoginId,
}: {
    children: ReactNode;
    storeLoginId: string;
}) => {
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState<boolean>(false);
    const [storePasscode, setStorePasscode] = useState<string>('');
    const router = useRouter();

    const headerHeight = useRef(new Animated.Value(HEADER_HEIGHT)).current;
    let hideTimeout: NodeJS.Timeout;

    const hideHeader = () => {
        hideTimeout = setTimeout(() => {
            Animated.timing(headerHeight, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }).start();
        }, 5000);
    };

    useEffect(() => {
        hideHeader();
        return () => clearTimeout(hideTimeout);
    }, []);

    const onSwipeDown = ({ nativeEvent }: any) => {
        if (nativeEvent.state === State.END) {
            Animated.timing(headerHeight, {
                toValue: HEADER_HEIGHT,
                duration: 600,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }).start();

            clearTimeout(hideTimeout);
            hideHeader();
        }
    };

    // Interpolate image opacity and scale
    const imageOpacity = headerHeight.interpolate({
        inputRange: [0, HEADER_HEIGHT],
        outputRange: [0, 1],
    });

    const imageScale = headerHeight.interpolate({
        inputRange: [0, HEADER_HEIGHT],
        outputRange: [0.5, 1],
    });
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

    const handleSignOut = async () => {
        const isCredentialsValid = await verifyPasscode(storeLoginId, storePasscode);

        if (isCredentialsValid) {
            router.dismissTo('/');
        } else {
            Alert.alert('Incorrect Store Passcode', 'Please try again.');
        }
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <PanGestureHandler onHandlerStateChange={onSwipeDown}>
                <View style={styles.swipeArea}>
                    <Text style={styles.swipeText} />
                </View>
            </PanGestureHandler>

            <Modal transparent visible={isSignOutModalOpen} animationType="slide">
                <Pressable
                    className="flex-1 items-center justify-center bg-black/60"
                    onPress={() => setIsSignOutModalOpen(false)}>
                    <TouchableWithoutFeedback>
                        <View className="w-96 rounded-lg bg-white p-6 shadow-md">
                            <Text className="mb-2 text-center text-gray-600">
                                Verify store passcode
                            </Text>
                            <TextInput
                                className="mb-4 rounded border p-2 text-center"
                                keyboardType="phone-pad"
                                value={storePasscode}
                                onChangeText={setStorePasscode}
                                placeholder="####"
                                maxLength={4}
                            />
                            <TouchableOpacity
                                className="rounded-lg bg-black p-3"
                                onPress={() => handleSignOut()}>
                                <Text className="text-center font-medium text-white">Verify</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="mt-2 rounded-lg border p-3"
                                onPress={() => setIsSignOutModalOpen(false)}>
                                <Text className="text-center font-medium">Close</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </Pressable>
            </Modal>

            {/* Animated Header */}
            <Animated.View style={[styles.header, { height: headerHeight }]} className="shadow-lg">
                {/* Animated Image */}
                <Animated.Image
                    source={require('../assets/splash.png')}
                    resizeMode="center"
                    resizeMethod="resize"
                    style={{
                        opacity: imageOpacity,
                        transform: [{ scale: imageScale }],
                    }}
                />

                {/* Sign Out Button */}
                <Animated.View
                    style={[
                        styles.signOutButton,
                        {
                            opacity: imageOpacity,
                            transform: [{ scale: imageScale }],
                        },
                    ]}>
                    <TouchableOpacity
                        className="rounded bg-red-500 p-3"
                        onPress={() => setIsSignOutModalOpen(true)}>
                        <Text className="font-semibold text-white">Sign Out</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>

            {/* Adjust content marginTop dynamically */}
            <Animated.View style={[styles.content, { marginTop: headerHeight }]}>
                {children}
            </Animated.View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', width: '100%' },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
        flexDirection: 'row', // Allow items to align in a row
        height: HEADER_HEIGHT, // Ensure proper height allocation
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    swipeArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    swipeText: { color: 'gray', fontSize: 14 },
    signOutButton: {
        position: 'absolute',
        right: 10,
        alignSelf: 'center', // Ensures it remains vertically centered
    },
});

export default HeaderAutoHide;
