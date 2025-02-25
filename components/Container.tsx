import * as NavigationBar from 'expo-navigation-bar';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export const Container = ({ children }: { children: React.ReactNode }) => {
    if (Platform.OS === 'android') {
        NavigationBar.setBehaviorAsync('overlay-swipe');
        NavigationBar.setPositionAsync('absolute');
        NavigationBar.setBackgroundColorAsync('#e1e1e1');
    }

    return (
        <SafeAreaProvider>
            <StatusBar hidden />
            <SafeAreaView className={styles.container}>{children}</SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = {
    container: 'flex flex-1 justify-between items-center bg-[#e1e1e1]',
};
