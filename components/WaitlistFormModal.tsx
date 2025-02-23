import { formatPhoneNumber } from 'lib/utils';
import { Dispatch, SetStateAction, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  GestureResponderEvent,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { WaitlistEntry } from 'types';

import { supabase } from '../lib/supabase';

type FormData = {
  name: string;
  phone: string;
  email: string;
  partySize: string;
};

export default function WaitlistFormModal({
  storeId,
  isActive,
  type,
  entry,
  open,
  setOpen,
}: {
  storeId: string;
  isActive: boolean;
  type: 'create' | 'edit';
  entry?: WaitlistEntry;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      // Add default values
      name: '',
      phone: '',
      email: '',
      partySize: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('waitlist').insert([
        {
          store_id: storeId,
          name: data.name,
          phone: data.phone,
          email: data.email,
          party_size: Number(data.partySize),
        },
      ]);

      if (error) throw error;
      reset();
      Alert.alert('Success!', 'You have been added to the waitlist');
    } catch (error: unknown) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setIsSubmitting(false);
      setOpen(false);
    }
  };

  const handleClose = (event: GestureResponderEvent): void => {
    reset();
    setOpen(false);
  };

  return (
    <Modal transparent visible={open} animationType="slide">
      <Pressable
        className="flex-1 items-center justify-center bg-black/60 p-6"
        onPress={handleClose}>
        <View className="mx-auto mb-8 w-full max-w-screen-sm rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-4 text-xl font-bold">Join the Waitlist</Text>
          <Text>Name</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: 'Name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`mb-4 rounded border p-2 ${!isActive ? 'bg-gray-200' : ''}`}
                placeholder="Harry Potter"
                editable={isActive}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange} // Properly wire onChangeText
              />
            )}
          />
          {errors.name && <Text className="mb-2 text-red-500">{errors.name.message}</Text>}

          <Text>Phone</Text>
          <Controller
            control={control}
            name="phone"
            rules={{
              required: 'Phone is required',
              pattern: {
                value: /^(1-)?\d{3}-\d{3}-\d{4}$/,
                message: 'Invalid phone number (10 digits)',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`mb-4 rounded border p-2 ${!isActive ? 'bg-gray-200' : ''}`}
                placeholder="386-253-3673"
                editable={isActive}
                keyboardType="phone-pad"
                value={value}
                onBlur={onBlur}
                onChangeText={(e) => onChange(formatPhoneNumber(e))}
              />
            )}
          />
          {errors.phone && <Text className="mb-2 text-red-500">{errors.phone.message}</Text>}

          <Text>Email</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`mb-4 rounded border p-2 ${!isActive ? 'bg-gray-200' : ''}`}
                placeholder="Email"
                editable={isActive}
                keyboardType="email-address"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
          {errors.email && <Text className="mb-2 text-red-500">{errors.email.message}</Text>}

          {/* Number of People Input */}
          <Text>Party Size</Text>
          <Controller
            control={control}
            name="partySize"
            rules={{
              required: 'Number of people is required',
              min: { value: 1, message: 'At least 1 person required' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`mb-4 rounded border p-2 ${!isActive ? 'bg-gray-200' : ''}`}
                placeholder="Party Size"
                editable={isActive}
                keyboardType="numeric"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
          {errors.partySize && (
            <Text className="mb-2 text-red-500">{errors.partySize.message}</Text>
          )}

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={!isActive || isSubmitting}
            className="rounded bg-red-500 py-2">
            <Text className="text-center font-medium text-white">Submit</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}
