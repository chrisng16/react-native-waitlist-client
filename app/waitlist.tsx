import { Container } from 'components/Container';
import HeaderAutoHide from 'components/HeaderAutoHide';
import WaitlistDisplay from 'components/WaitlistDisplay';
import WaitlistFormModal from 'components/WaitlistFormModal';
// import { useLocalSearchParams } from 'expo-router';
import { supabase } from 'lib/supabase';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Store } from 'types';
import '../global.css';

export default function App() {
    const [store, setStore] = useState<Store>();
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isWaitlistFormOpen, setIsWaitlistFormOpen] = useState<boolean>(false);
    // const { storeLoginId } = useLocalSearchParams();
    const storeLoginId = 'store-2';

    useEffect(() => {
        const fetchStore = async () => {
            const { data, error } = await supabase
                .from('stores')
                .select('*')
                .eq('store_login_id', storeLoginId)
                .single();
            if (data) {
                setStore(data);
                setIsActive(data.is_waitlist_active);
            }
        };

        // Initial fetch
        fetchStore();

        // Poll every 30 seconds for store status changes
        const interval = setInterval(fetchStore, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!store) return null;
    return (
        <Container>
            <WaitlistFormModal
                open={isWaitlistFormOpen}
                setOpen={setIsWaitlistFormOpen}
                storeId={store.id}
                isActive={isActive}
                type="create"
            />
            <HeaderAutoHide storeLoginId={storeLoginId}>
                <View className="flex h-full max-h-[calc(100svh-80px)] w-full justify-between gap-4 rounded-lg bg-white p-6">
                    <WaitlistDisplay store={store} />
                    <TouchableOpacity
                        className="mx-auto w-full max-w-screen-sm rounded bg-red-500 px-4 py-3"
                        onPress={() => setIsWaitlistFormOpen((prev) => !prev)}>
                        <Text className="text-center text-xl font-semibold text-[#ececec]">
                            Join the Waitlist
                        </Text>
                    </TouchableOpacity>
                </View>
            </HeaderAutoHide>
        </Container>
    );
}
