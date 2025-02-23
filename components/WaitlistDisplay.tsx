import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Store, WaitlistEntry } from 'types';

import { supabase } from '../lib/supabase';

export default function WaitlistDisplay({ store }: { store: Store }) {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [actionType, setActionType] = useState<'seat' | 'pending' | 'cancel' | null>(null);

  useEffect(() => {
    const fetchWaitlist = async () => {
      const { data } = await supabase
        .from('waitlist')
        .select('*')
        .eq('store_id', store.id)
        .order('created_at', { ascending: true });

      if (data) setWaitlist(data);
    };

    fetchWaitlist();

    const subscription = supabase
      .channel('waitlist-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'waitlist',
        },
        () => fetchWaitlist()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAction = async (status: 'seated' | 'pending' | 'cancelled') => {
    if (!selectedEntry) return;

    // Only require phone verification for cancellations
    if (status === 'cancelled') {
      const lastFour = selectedEntry.phone.slice(-4);
      if (phoneInput !== lastFour) {
        Alert.alert('Error', 'Invalid phone number');
        return;
      }
    }

    const { error } = await supabase.from('waitlist').update({ status }).eq('id', selectedEntry.id);

    if (!error) {
      setSelectedEntry(null);
      setPhoneInput('');
      setActionType(null);
    }
  };

  return (
    <View className="mx-auto w-full max-w-screen-sm">
      <View className="mx-auto w-full rounded-lg border-gray-300/80 bg-white drop-shadow-lg">
        <Text className="p-6 text-center text-3xl font-bold">{store.store_name}</Text>
        {/* Table Header */}
        <View className="flex-row items-center rounded-lg bg-[#ececec] p-3">
          <Text className="w-16 text-center text-sm font-semibold text-gray-600">Place</Text>
          <Text className="flex-1 text-center text-sm font-semibold text-gray-600">Name</Text>
          <Text className="w-24 text-center text-sm font-semibold text-gray-600">Party of</Text>
          {/* <Text className="w-40 text-center text-sm font-semibold text-gray-600">Status</Text> */}
          <Text className="w-16 text-center text-sm font-semibold text-gray-600">Actions</Text>
        </View>

        {/* Table Body */}
        <FlatList
          data={waitlist.filter((item) => !['cancelled', 'seated'].includes(item.status))}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View className="flex-row items-center border-b border-gray-100 p-3">
              <Text className="w-16 text-center text-gray-600">{index + 1}</Text>
              <Text className="flex-1 text-center font-medium">{item.name}</Text>
              <Text className="w-24 text-center text-gray-600">{item.party_size}</Text>
              <View className="w-16 flex-row justify-center space-x-2">
                <TouchableOpacity
                  className="size-8 items-center justify-center rounded bg-[#ececec]"
                  onPress={() => setSelectedEntry(item)}>
                  <MaterialCommunityIcons name="dots-vertical" size={16} color="gray" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* Action Modal */}
      <Modal transparent visible={!!selectedEntry} animationType="slide">
        <Pressable
          className="flex-1 items-center justify-center bg-black/60"
          onPress={() => setSelectedEntry(null)}>
          <View className="w-96 rounded-lg bg-white p-6 shadow-md">
            <Text className="mb-4 text-center text-lg font-semibold">
              Manage Entry - {selectedEntry?.name}
            </Text>
            <Modal transparent visible={actionType === 'cancel'} animationType="slide">
              <Pressable
                className="flex-1 items-center justify-center bg-black/60"
                onPress={() => setActionType(null)}>
                <View className="w-96 rounded-lg bg-white p-6 shadow-md">
                  <Text className="mb-2 text-center text-gray-600">
                    Verify last 4 digits of phone:
                  </Text>
                  <TextInput
                    className="mb-4 rounded border p-2 text-center"
                    keyboardType="phone-pad"
                    value={phoneInput}
                    onChangeText={setPhoneInput}
                    placeholder="####"
                    maxLength={4}
                  />
                  <TouchableOpacity
                    className="rounded-lg bg-black p-3"
                    onPress={() => handleAction('cancelled')}>
                    <Text className="text-center font-medium text-white">Verify</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="mt-2 rounded-lg border p-3"
                    onPress={() => setActionType(null)}>
                    <Text className="text-center font-medium">Close</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </Modal>

            <View className="gap-2">
              <TouchableOpacity
                className="rounded-lg bg-black p-3"
                onPress={() => setActionType('cancel')}>
                <Text className="text-center font-medium text-white">Edit Reservation</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-lg bg-red-500 p-3"
                onPress={() => setActionType('cancel')}>
                <Text className="text-center font-medium text-white">Cancel Reservation</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="mt-4 rounded-lg bg-[#ececec] p-3"
                onPress={() => {
                  setSelectedEntry(null);
                  setActionType(null);
                  setPhoneInput('');
                }}>
                <Text className="text-center font-medium">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
