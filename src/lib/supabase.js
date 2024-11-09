import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aklbkuciynjogpjluwnr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrbGJrdWNpeW5qb2dwamx1d25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5ODAzNDMsImV4cCI6MjA0NjU1NjM0M30.HBefRcyxBN8C5WpW9JvpFMDlsWZvmJ3eZY_oNgoB69k';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);