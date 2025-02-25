import { Container } from 'components/Container';
import WaitlistDisplay from 'components/WaitlistDisplay';
import WaitlistFormModal from 'components/WaitlistFormModal';
import { supabase } from 'lib/supabase';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Store } from 'types';
import './global.css';

export default function App() {
  const [store, setStore] = useState<Store>();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isWaitlistFormOpen, setIsWaitlistFormOpen] = useState<boolean>(false);
  const STORE_ID = '5920d35d-0668-4f0e-97a7-bf0581ab9130';

  useEffect(() => {
    const fetchStore = async () => {
      const { data, error } = await supabase.from('stores').select('*').eq('id', STORE_ID).single();
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
      <View className="flex h-full max-h-screen w-full max-w-screen-sm justify-between gap-4 rounded-lg bg-white p-6">
        <WaitlistDisplay store={store} />
        <TouchableOpacity
          className="mx-auto w-full max-w-screen-sm rounded bg-red-500 px-4 py-3"
          onPress={() => setIsWaitlistFormOpen((prev) => !prev)}>
          <Text className="text-center text-xl font-semibold text-[#ececec]">
            Join the Waitlist
          </Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}
