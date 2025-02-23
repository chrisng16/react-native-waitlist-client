export type Store = {
  id: string;
  store_name: string;
  store_desc: string;
  is_waitlist_active: boolean;
};

export type WaitlistEntry = {
  id: string;
  store_id: string;
  name: string;
  phone: string;
  email: string;
  party_size: number;
  status: 'waiting' | 'seated' | 'pending' | 'cancelled';
  created_at: string;
  updated_at: string;
};
