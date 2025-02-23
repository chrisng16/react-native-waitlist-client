import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ibkgmogjswhukhaqycoo.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlia2dtb2dqc3dodWtoYXF5Y29vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMjMxOTUsImV4cCI6MjA1Mzc5OTE5NX0.ipZ1mF8H5nbCs03VSBDvdhi97LKMHrx8bTvP7TFUEbI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
